/* ごみ出しカレンダー（非公式）  画面まわり */
(function (root) {
  'use strict';

  var L = (typeof module !== 'undefined' && module.exports) ? require('./logic.js') : root.GomiLogic;

  /* ---------- ごみの種類（色・名前・出し方） ---------- */
  var TYPES = {
    burn: {
      name: '可燃ごみ', short: '可燃', icon: '🔥', bg: '#D93F3F', fg: '#FFFFFF',
      freq: '週に2回（毎週 月・木）',
      items: [
        '生ごみ類（料理くず・残飯）',
        '生活用品（食用油、割りばし、紙コップ など）',
        '皮革・布製品（バッグ、革靴、ぬいぐるみ、ランドセル）',
        'ゴム・ビニール類（レジ袋、ゴム手袋、長靴）',
        'プラスチック類（マヨネーズ容器、卵パック、カップめん容器、CD、ビデオ・カセットテープ（1回10本まで）、発泡スチロール（白色トレイを除く）など）',
        'おむつ（中身が見えない袋に「おむつ」と書く）',
        '木の枝（長さ50cm・太さ5cm・1束の直径30cm以下。ひもでしばる。1回5束まで）'
      ],
      tips: [
        '家庭可燃ごみ専用袋（町指定の有料袋）に入れて出す（おむつ・木の枝は除く）',
        '生ごみは水分をよく切る',
        '発泡スチロールも必ず袋に入れる（食品用の白色トレイは資源です）',
        '食用油は紙や布にしみ込ませるか、処理剤で固めて出す',
        '資源になる紙類は、可燃ごみではなく資源Aの日に'
      ]
    },
    nonburn: {
      name: '不燃ごみ', short: '不燃', icon: '🍽️', bg: '#2F6BD6', fg: '#FFFFFF',
      freq: '月に1回',
      items: [
        '陶磁器類（茶碗・皿、急須、植木鉢）',
        'ガラス類（ガラスコップ、板ガラス、電球、鏡）',
        '鋭利なもの（カッター、はさみ、包丁・ナイフ、針）',
        '小型家電（電気ポット、オーブントースター、電気スタンド など。使用済小型電子機器は除く）',
        '傘（1回4本まで。袋から半分以上はみ出す場合や5本以上は粗大ごみ）'
      ],
      tips: [
        '家庭不燃ごみ専用袋に入れて出す',
        '割れたガラスや鋭利なものは、布や紙に包んで、袋に品名を書く',
        '口をしばり、中身が出ないようにする',
        '袋に入らないものは粗大ごみ'
      ]
    },
    smallelec: {
      name: '使用済小型電子機器', short: '電子', icon: '📱', bg: '#0A7A7A', fg: '#FFFFFF',
      freq: '月に1回（不燃ごみと同じ日）',
      items: [
        '携帯電話端末、パソコンのモニター（本体は除く）',
        '電話機、ファクシミリ、ラジオ',
        'デジタルカメラ、ビデオカメラ、フィルムカメラ',
        '映像用機器（DVD・BD・ビデオテープレコーダ等）、音響機器（MDプレーヤ、CDプレーヤ、ラジカセ等）',
        '電子書籍端末、電子辞書、電卓、電子血圧計、電子体温計',
        '理容用機器（ヘアードライヤー、電気かみそり、電動歯ブラシ等）',
        '懐中電灯、時計（電子式・電池式・電気式）',
        'ゲーム機（据置型、携帯型）、カー用品（カーナビ、ETC車載ユニット等）',
        '電子レンジ、掃除機',
        '上記の付属品（リモコン、ACアダプタ、ケーブル、充電器等）'
      ],
      tips: [
        'かご等の容器に入れて出す',
        '出すときは必ず「日の出町」と書く',
        '充電できるもの、リチウムイオン電池が取り出せないものは、すべて有害ごみ'
      ]
    },
    paperA: {
      name: '資源A（紙類・布類）', lname: '資源A（紙・布）', short: '資源A', icon: '📰', bg: '#23773F', fg: '#FFFFFF',
      freq: '月に2回',
      items: [
        '新聞紙',
        '紙パック',
        'ダンボール',
        '布類（レースを除くカーテン、衣類、タオル類）',
        '雑誌類（週刊誌、カタログ誌、雑紙＝名刺サイズ以上の小さな紙・お菓子の紙箱・ティッシュの箱・封筒・包装紙・トイレットペーパーの芯・カレンダー など）'
      ],
      tips: [
        '種類別にひもで十字にしばって出す',
        '雑紙は紙袋などに入れ、他の雑誌類と一緒にひもで十字にしばって「雑誌類」として出す',
        '衣類のボタンやファスナーは取らなくてOK',
        '紙も衣類も濡れると資源になりません。雨の日は次の収集日に（どうしても出す場合は透明のビニール袋などに入れる）'
      ]
    },
    resB: {
      name: '資源B（缶・金属類、びん類）', lname: '資源B（缶・びん）', short: '資源B', icon: '🥫', bg: '#F2B01E', fg: '#3A2A00',
      freq: '月に2回',
      items: [
        '缶・金属類（缶、やかん、フライパン など）',
        'びん類'
      ],
      tips: [
        'かご等の容器に入れて出す（缶・金属類とびん類は別々の容器に）',
        '缶・金属類は重さ5kg未満、長さ50cm以下まで（超える場合は粗大ごみ）',
        '飲料水の缶・びんは、中身を出して洗ってから出す'
      ]
    },
    pet: {
      name: 'ペットボトル', short: 'ペット', icon: '🧴', bg: '#1A74B3', fg: '#FFFFFF',
      freq: '月に2回（白色トレイと同じ日）',
      items: [
        'PETマークが目印のボトル（ソースや油類の容器は除く）'
      ],
      tips: [
        '① キャップとラベルをはずして、可燃ごみへ',
        '② 水で中をすすぎ、水を切る',
        '③ つぶす',
        'かご等の容器に入れて出す（袋に入れると、その袋がごみになってしまいます）',
        'ソースや油類、汚れの取れない容器は可燃ごみ'
      ]
    },
    tray: {
      name: '白色トレイ', short: 'トレイ', icon: '⬜', bg: '#EAF0F6', fg: '#26333F',
      freq: '月に2回（ペットボトルと同じ日）',
      items: [
        '食品用の白色トレイ（発泡スチロール製。鮮魚・精肉・青果などに使われる白い皿）'
      ],
      tips: [
        'きれいに洗って、よく乾かす',
        'かご等の容器に入れて出す',
        '軽くて飛びやすいので、ネットをかける・ひもでしばる・おもしをする',
        '色物・絵柄物、納豆の容器、インスタントめんの容器はリサイクルできないので可燃ごみ'
      ]
    },
    harmful: {
      name: '有害ごみ', short: '有害', icon: '🔋', bg: '#6B3FA0', fg: '#FFFFFF',
      freq: '月に1回',
      items: [
        '蛍光管',
        '乾電池、電子タバコ、水銀式体温計、モバイルバッテリー',
        'カセット式ガスボンベ、スプレー缶、ライター'
      ],
      tips: [
        'かご等の容器に入れて出す',
        'スプレー缶・カセット式ガスボンベは、必ず中身を使い切り、穴をあけずに出す',
        'ライターは、使い切るか、中身を抜いてから出す',
        'リチウムイオン電池が取り出せるものは、電池のみ有害ごみ。取り出せないものは、本体ごと有害ごみ'
      ]
    }
  };

  var PDF_URL = 'https://www.town.hinode.tokyo.jp/cmsfiles/contents/0000004/4241/R8kateiyou.pdf';

  /* ---------- 小さな部品 ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function badge(t, size, useShortName) {
    var ty = TYPES[t];
    var border = t === 'tray' ? 'border:2px solid #9FB1C2;' : '';
    var name = useShortName && ty.lname ? ty.lname : ty.name;
    return '<span class="badge ' + (size || '') + '" style="background:' + ty.bg + ';color:' + ty.fg + ';' + border + '">' +
      '<span class="bi" aria-hidden="true">' + ty.icon + '</span>' + esc(name) + '</span>';
  }

  function chip(t) {
    var ty = TYPES[t];
    var border = t === 'tray' ? 'box-shadow:inset 0 0 0 1px #9FB1C2;' : '';
    return '<i class="chip" style="background:' + ty.bg + ';color:' + ty.fg + ';' + border + '">' + esc(ty.short) + '</i>';
  }

  function dayCard(label, d, data) {
    var k = L.keyOf(d);
    var ts = data.days[k] || [];
    var h = '<section class="day' + (label === '今日' ? ' day-today' : '') + '">' +
      '<div class="day-head"><span class="day-label">' + label + '</span><span class="day-date">' + L.fmtMD(d) + '</span></div>';
    if (!L.inRange(data.meta, k)) {
      h += '<div class="day-none">カレンダー未登録</div>';
    } else if (!ts.length) {
      h += '<div class="day-none">収集はありません</div>';
    } else {
      h += '<div class="day-items">' + ts.map(function (t) { return badge(t, 'lg'); }).join('') + '</div>';
      h += '<div class="day-foot">' + (label === '今日' ? '今日は収集日です。朝8時までに出します' : '明日の朝8時までに出します') + '</div>';
    }
    if (data.notes[k]) h += '<div class="day-note">' + esc(data.notes[k]) + '</div>';
    return h + '</section>';
  }

  /* ---------- ホーム ---------- */
  function renderHome(data, now, banner) {
    var today = L.startOfDay(now);
    var tomorrow = L.addDays(today, 1);
    var h = '';
    if (banner) h += '<div class="banner">' + esc(banner) + '</div>';

    L.activeNotices(data, now).forEach(function (n) {
      h += '<div class="notice">' + esc(n.text) + '</div>';
    });

    var tk = L.keyOf(today);
    if (tk > data.meta.validTo) {
      h += '<div class="notice">このカレンダーは ' + L.fmtJP(L.parseKey(data.meta.validTo)) +
        ' までです。次の年度のカレンダーが登録されるまでお待ちください。</div>';
    } else if (tk < data.meta.validFrom) {
      h += '<div class="notice">このカレンダーは ' + L.fmtJP(L.parseKey(data.meta.validFrom)) + ' からです。</div>';
    }

    h += dayCard('今日', today, data) + dayCard('明日', tomorrow, data);

    var next = L.nextCollections(data, today);
    if (next.length) {
      h += '<section class="card"><h2>次の収集日</h2><ul class="next">';
      next.forEach(function (n) {
        var d = L.parseKey(n.key);
        h += '<li><span class="next-when"><b>' + L.fmtMD(d) + '</b>' +
          '<span class="next-in' + (n.inDays <= 1 ? ' soon' : '') + '">' + L.relLabel(n.inDays) + '</span></span>' +
          badge(n.type, 'sm', true) + '</li>';
      });
      h += '</ul></section>';
    }
    return h + footer(data);
  }

  /* ---------- カレンダー ---------- */
  function renderCalendar(data, now, st) {
    var today = L.startOfDay(now);
    var tk = L.keyOf(today);
    var vf = L.parseKey(data.meta.validFrom), vt = L.parseKey(data.meta.validTo);
    var minM = vf.getFullYear() * 12 + vf.getMonth();
    var maxM = vt.getFullYear() * 12 + vt.getMonth();
    var mi = (st && st.mi != null) ? st.mi : today.getFullYear() * 12 + today.getMonth();
    mi = Math.max(minM, Math.min(maxM, mi));
    var y = Math.floor(mi / 12), m = mi % 12;
    var first = new Date(y, m, 1);
    var count = new Date(y, m + 1, 0).getDate();
    var prefix = y + '-' + (m + 1 < 10 ? '0' : '') + (m + 1) + '-';

    var sel = st && st.sel && st.sel.indexOf(prefix) === 0 ? st.sel : (tk.indexOf(prefix) === 0 ? tk : prefix + '01');

    var h = '<div class="cal-nav">' +
      '<button type="button" class="nav-btn" data-nav="-1" aria-label="前の月"' + (mi <= minM ? ' disabled' : '') + '>◀</button>' +
      '<div class="cal-title">' + y + '年' + (m + 1) + '月</div>' +
      '<button type="button" class="nav-btn" data-nav="1" aria-label="次の月"' + (mi >= maxM ? ' disabled' : '') + '>▶</button></div>';

    h += '<div class="cal-grid">';
    L.WD.forEach(function (w, i) {
      h += '<div class="wd' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '') + '">' + w + '</div>';
    });
    for (var i = 0; i < first.getDay(); i++) h += '<div class="cell blank"></div>';
    for (var d = 1; d <= count; d++) {
      var k = prefix + (d < 10 ? '0' : '') + d;
      var dow = (first.getDay() + d - 1) % 7;
      var ts = data.days[k] || [];
      var cls = 'cell' + (dow === 0 ? ' sun' : dow === 6 ? ' sat' : '') + (k === tk ? ' today' : '') + (k === sel ? ' sel' : '');
      var label = (m + 1) + '月' + d + '日 ' + (ts.length ? ts.map(function (t) { return TYPES[t].name; }).join('、') : '収集なし');
      h += '<button type="button" class="' + cls + '" data-k="' + k + '" aria-label="' + esc(label) + '">' +
        '<span class="dn">' + d + '</span>' + ts.map(chip).join('') + '</button>';
    }
    h += '</div>';

    var sd = L.parseKey(sel), sts = data.days[sel] || [];
    h += '<section class="card detail"><h2>' + L.fmtMD(sd) + (sel === tk ? '（今日）' : '') + '</h2>';
    if (sts.length) h += '<div class="day-items">' + sts.map(function (t) { return badge(t, 'lg'); }).join('') + '</div>';
    else h += '<div class="day-none">収集はありません</div>';
    if (data.notes[sel]) h += '<div class="day-note">' + esc(data.notes[sel]) + '</div>';
    h += '</section>';
    return h + footer(data);
  }

  /* ---------- 出し方ガイド ---------- */
  function ul(arr) {
    return '<ul>' + arr.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
  }

  function renderGuide(data) {
    var h = '<section class="card"><h2>みんなに共通のルール</h2>' + ul([
      'ごみはきちんと分別し、収集日当日の朝8時までに出しましょう',
      '交通事情や天候により、収集コース・収集時間が変わることがあります',
      '家庭ごみは1回あたり3袋までを目安に（4袋以上でも回収はされます）',
      '缶・びん・ペットボトル・白色トレイ・小型電子機器・有害ごみは、かご等の容器に入れて出します'
    ]) + '</section>';

    h += '<h2 class="sec">種類ごとの出し方</h2>';
    L.TYPE_ORDER.forEach(function (t) {
      var ty = TYPES[t];
      h += '<details class="g"><summary>' + badge(t, 'sm') + '<span class="g-freq">' + esc(ty.freq) + '</span></summary>' +
        '<div class="g-body"><h3>出せるもの</h3>' + ul(ty.items) + '<h3>出し方のポイント</h3>' + ul(ty.tips) + '</div></details>';
    });

    h += '<details class="g"><summary><span class="badge sm" style="background:#7A5A3A;color:#fff"><span class="bi" aria-hidden="true">🪑</span>粗大ごみ</span>' +
      '<span class="g-freq">電話で申し込み</span></summary><div class="g-body">' +
      '<h3>申し込みの流れ</h3><ol>' +
      '<li>収集業者に電話で申し込む（品物と数を伝え、金額と収集日を確認）</li>' +
      '<li>処理券（シール）を取扱店で買う（200円・400円・1,000円）</li>' +
      '<li>処理券に名前と収集日を書き、見やすいところに貼る（一度貼ると使えません）</li>' +
      '<li>収集日当日に、玄関先や庭先に出す（家の中からは収集しません）</li></ol>' +
      '<h3>申し込み先（お住まいの地番で決まります）</h3><ul>' +
      '<li><b>A地区</b>：平井 1937〜2943／大久野 1〜480・869〜4864<br>㈱クリーンエコロジー</li>' +
      '<li><b>B地区</b>：平井 1〜1936・2944〜4054／大久野 481〜868・4865〜8820<br>藤谷産業㈱</li></ul>' +
      '<p class="small">電話番号は、町の公式PDFの収集カレンダーでご確認ください。受付：月〜金（祝日・年末年始を除く）8:30〜17:00</p></div></details>';

    return h + footer(data);
  }

  function footer(data) {
    var h = '<footer class="foot">' +
      '<p>※ 交通事情や天候により、収集時間が変わることがあります。</p>' +
      '<p>このページは、町の「' + esc(data.meta.title || '収集カレンダー') + '」をもとに作った<b>非公式</b>のものです。' +
      '正しい情報は<a href="' + PDF_URL + '" target="_blank" rel="noopener">町の公式PDF</a>でご確認ください。</p>' +
      '<p>問い合わせ：町の協働推進課 環境政策係</p>' +
      '<p class="small">データ更新日：' + esc(data.meta.updated || '') +
      (data.warnings && data.warnings.length ? '<br>※データに確認が必要な箇所があります（' + data.warnings.length + '件）' : '') + '</p></footer>';
    return h;
  }

  /* ---------- ブラウザでの起動 ---------- */
  function boot() {
    var view = document.getElementById('view');
    var sub = document.getElementById('sub');
    var tabs = document.querySelectorAll('.tab');
    var state = { tab: 'home', mi: null, sel: null, data: null, banner: '', todayKey: L.keyOf(new Date()) };

    function load() {
      return fetch('schedule.json', { cache: 'no-cache' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
        .then(function (text) {
          var data = L.normalize(JSON.parse(text));
          try { localStorage.setItem('gomi:data', text); } catch (e) { /* 保存できなくても続行 */ }
          return { data: data, banner: '' };
        })
        .catch(function (err) {
          var saved = null;
          try { saved = localStorage.getItem('gomi:data'); } catch (e) { /* noop */ }
          if (saved) {
            try {
              var offline = err instanceof TypeError;
              return {
                data: L.normalize(JSON.parse(saved)),
                banner: offline ? '通信できないため、保存してあるデータを表示しています。'
                                : '最新のデータに誤りがあるため、前回のデータを表示しています。'
              };
            } catch (e2) { /* 保存データも読めない */ }
          }
          throw err;
        });
    }

    function render() {
      var now = new Date();
      state.todayKey = L.keyOf(now);
      if (!state.data) return;
      sub.textContent = state.data.meta.title || '';
      var html;
      if (state.tab === 'home') html = renderHome(state.data, now, state.banner);
      else if (state.tab === 'cal') html = renderCalendar(state.data, now, state);
      else html = renderGuide(state.data);
      view.innerHTML = html;
      Array.prototype.forEach.call(tabs, function (b) {
        var on = b.getAttribute('data-tab') === state.tab;
        b.classList.toggle('on', on);
        b.setAttribute('aria-current', on ? 'page' : 'false');
      });
    }

    function showError(err) {
      view.innerHTML = '<div class="notice">データを読み込めませんでした。通信できる場所で、もう一度開いてください。' +
        '<br><span class="small">' + esc(err && err.message ? err.message : err) + '</span></div>' +
        '<p><button type="button" class="retry" data-act="retry">もう一度読み込む</button></p>';
    }

    function start() {
      load().then(function (r) { state.data = r.data; state.banner = r.banner; render(); }).catch(showError);
    }

    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-tab],[data-k],[data-nav],[data-act]') : null;
      if (!t) return;
      if (t.hasAttribute('data-tab')) {
        state.tab = t.getAttribute('data-tab');
        render();
        window.scrollTo(0, 0);
      } else if (t.hasAttribute('data-k')) {
        state.sel = t.getAttribute('data-k');
        render();
      } else if (t.hasAttribute('data-nav')) {
        var cur = state.mi;
        if (cur == null) { var n = new Date(); cur = n.getFullYear() * 12 + n.getMonth(); }
        state.mi = cur + Number(t.getAttribute('data-nav'));
        state.sel = null;
        render();
      } else if (t.getAttribute('data-act') === 'retry') {
        start();
      }
    });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      load().then(function (r) {
        state.data = r.data; state.banner = r.banner;
        if (state.tab !== 'guide') render();
      }).catch(function () { if (state.tab !== 'guide') render(); });
    });

    /* 画面を開いたまま日付が変わったら表示を更新 */
    setInterval(function () {
      if (state.data && L.keyOf(new Date()) !== state.todayKey && state.tab !== 'guide') render();
    }, 60000);

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { /* 登録できなくても動く */ });
      });
    }

    start();
  }

  if (typeof document !== 'undefined') boot();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TYPES: TYPES, renderHome: renderHome, renderCalendar: renderCalendar, renderGuide: renderGuide, esc: esc };
  }
})(typeof self !== 'undefined' ? self : this);
