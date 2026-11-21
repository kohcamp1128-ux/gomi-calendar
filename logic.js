/* 日付まわりの計算（画面に依存しない部分）。ブラウザでも Node でも動きます。 */
(function (root) {
  'use strict';

  var TYPE_ORDER = ['burn', 'nonburn', 'smallelec', 'paperA', 'resB', 'pet', 'tray', 'harmful'];
  var WD = ['日', '月', '火', '水', '木', '金', '土'];

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function keyOf(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function parseKey(k) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(k));
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
    return dt;
  }

  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function daysBetween(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }

  function fmtMD(d) { return (d.getMonth() + 1) + '/' + d.getDate() + '(' + WD[d.getDay()] + ')'; }
  function fmtJP(d) { return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'; }

  function relLabel(n) {
    if (n === 0) return '今日';
    if (n === 1) return '明日';
    if (n === 2) return '明後日';
    return 'あと' + n + '日';
  }

  /* schedule.json を検証して使いやすい形にする。致命的な誤りは例外、軽微な誤りは warnings に入れる。 */
  function normalize(raw) {
    if (!raw || typeof raw !== 'object' || !raw.meta || !raw.days || typeof raw.days !== 'object' || Array.isArray(raw.days)) {
      throw new Error('データの形式が正しくありません');
    }
    if (!parseKey(raw.meta.validFrom) || !parseKey(raw.meta.validTo)) {
      throw new Error('meta の validFrom / validTo が正しくありません');
    }
    var warnings = [];
    var days = {};
    Object.keys(raw.days).forEach(function (k) {
      if (!parseKey(k)) { warnings.push('日付の形式が正しくありません: ' + k); return; }
      var v = raw.days[k];
      if (!Array.isArray(v)) { warnings.push(k + ' の値が [ ] の形式ではありません'); return; }
      var ids = [];
      v.forEach(function (t) {
        if (TYPE_ORDER.indexOf(t) < 0) { warnings.push(k + ' に未知のごみの種類があります: ' + t); return; }
        if (ids.indexOf(t) < 0) ids.push(t);
      });
      ids.sort(function (a, b) { return TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b); });
      days[k] = ids;
    });
    return {
      meta: raw.meta,
      days: days,
      notices: Array.isArray(raw.notices) ? raw.notices : [],
      notes: raw.notes && typeof raw.notes === 'object' ? raw.notes : {},
      warnings: warnings
    };
  }

  function inRange(meta, k) { return k >= meta.validFrom && k <= meta.validTo; }

  /* from（今日）以降で、種類ごとに最初の収集日を返す。日付順。 */
  function nextCollections(data, from) {
    var fk = keyOf(from);
    var keys = Object.keys(data.days).filter(function (k) { return k >= fk; }).sort();
    var seen = {}, out = [];
    keys.forEach(function (k) {
      data.days[k].forEach(function (t) {
        if (seen[t]) return;
        seen[t] = true;
        out.push({ type: t, key: k, inDays: daysBetween(from, parseKey(k)) });
      });
    });
    out.sort(function (a, b) {
      if (a.key !== b.key) return a.key < b.key ? -1 : 1;
      return TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
    });
    return out;
  }

  /* 表示してよいお知らせ（開始の14日前から終了日まで） */
  function activeNotices(data, now) {
    var today = startOfDay(now);
    return data.notices.filter(function (n) {
      if (!n || !n.text) return false;
      var f = parseKey(n.from), t = parseKey(n.to);
      if (!f || !t) return true;
      return today >= addDays(f, -14) && today <= t;
    });
  }

  var api = {
    TYPE_ORDER: TYPE_ORDER, WD: WD,
    keyOf: keyOf, parseKey: parseKey, startOfDay: startOfDay, addDays: addDays, daysBetween: daysBetween,
    fmtMD: fmtMD, fmtJP: fmtJP, relLabel: relLabel,
    normalize: normalize, inRange: inRange, nextCollections: nextCollections, activeNotices: activeNotices
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GomiLogic = api;
})(typeof self !== 'undefined' ? self : this);
