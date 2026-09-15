/* Pixel Farm — Yandex Games tycoon (Phaser 3) */
(function () {
  'use strict';

  var W = 480, H = 270;
  var S_PLOT = 3, S_ITEM = 2, S_BUILD = 1.5;
  var FONT = '"Press Start 2P", monospace';
  var BOOST_TIME = 30;

  /* ============================ i18n ============================ */
  var I18N = {
    ru: {
      title: 'ПИКСЕЛЬ ФЕРМА', subtitle: 'Тайкон на ферме', play: 'ИГРАТЬ',
      shop: 'МАГАЗИН', boost: 'БУСТ', pause: 'ПАУЗА', resume: 'ПРОДОЛЖИТЬ',
      settings: 'НАСТРОЙКИ', sound: 'Звук', language: 'Язык', reset: 'Сбросить прогресс',
      needMore: 'НЕ ХВАТАЕТ МОНЕТ!', planted: 'Посажено!', harvested: '+{v}',
      ready: 'Готово!', newCrop: 'Открыта культура: {c}', boostOn: 'Буст x2 включён!',
      noAds: 'Реклама недоступна', adDone: 'Бонус получен!', cropUnlock: 'Откроется при {v}',
      perSec: '+{v}/с', maxLvl: 'МАКС', sec: 'сек',
      crop: { wheat: 'ПШЕНИЦА', carrot: 'МОРКОВЬ', tomato: 'ТОМАТ', corn: 'КУКУРУЗА', pumpkin: 'ТЫКВА' },
      up: {
        plot: { n: 'Новая грядка', d: 'Посадочное место +1' },
        hoe: { n: 'Тяпка', d: 'Рост быстрее на 10%' },
        well: { n: 'Колодец', d: 'Ускоряет рост на 25%' },
        scarecrow: { n: 'Пугало', d: 'Цены продажи +10%' },
        stall: { n: 'Ларёк', d: 'Доход +1,5/сек' },
        tractor: { n: 'Трактор', d: 'Автосбор готового' }
      },
      tips: [
        'Жми на грядку, чтобы посадить культуру',
        'Поливай растения — они быстрее растут',
        'Собирай урожай, когда он зелёный',
        'Открывай культуры, зарабатывая монеты',
        'Покупай улучшения в магазине',
        'Смотри рекламу и получай буст x2'
      ]
    },
    en: {
      title: 'PIXEL FARM', subtitle: 'Farm tycoon', play: 'PLAY',
      shop: 'SHOP', boost: 'BOOST', pause: 'PAUSE', resume: 'RESUME',
      settings: 'SETTINGS', sound: 'Sound', language: 'Language', reset: 'Reset progress',
      needMore: 'NOT ENOUGH COINS!', planted: 'Planted!', harvested: '+{v}',
      ready: 'Ready!', newCrop: 'New crop: {c}', boostOn: 'Boost x2 on!',
      noAds: 'No ads available', adDone: 'Bonus received!', cropUnlock: 'Unlocks at {v}',
      perSec: '+{v}/s', maxLvl: 'MAX', sec: 's',
      crop: { wheat: 'WHEAT', carrot: 'CARROT', tomato: 'TOMATO', corn: 'CORN', pumpkin: 'PUMPKIN' },
      up: {
        plot: { n: 'New plot', d: '+1 plant slot' },
        hoe: { n: 'Hoe', d: 'Growth +10% faster' },
        well: { n: 'Well', d: 'Growth +25% faster' },
        scarecrow: { n: 'Scarecrow', d: 'Sell prices +10%' },
        stall: { n: 'Stall', d: 'Income +1.5/s' },
        tractor: { n: 'Tractor', d: 'Auto harvest' }
      },
      tips: [
        'Tap a plot to plant a crop',
        'Water your plants to grow faster',
        'Harvest crops when they turn green',
        'Earn coins to unlock new crops',
        'Buy upgrades in the shop',
        'Watch an ad to get x2 boost'
      ]
    },
    tr: {
      title: 'PİKSEL ÇİFTLİĞİ', subtitle: 'Çiftlik işletmesi', play: 'OYNA',
      shop: 'MAĞAZA', boost: 'BOOST', pause: 'DURAKLAT', resume: 'DEVAM',
      settings: 'AYARLAR', sound: 'Ses', language: 'Dil', reset: 'İlerleme sıfırla',
      needMore: 'YETERSİZ PARA!', planted: 'Ekildi!', harvested: '+{v}',
      ready: 'Hazır!', newCrop: 'Yeni ürün: {c}', boostOn: 'Boost x2 açık!',
      noAds: 'Reklam yok', adDone: 'Bonus alındı!', cropUnlock: '{v} değerinde açılır',
      perSec: '+{v}/sn', maxLvl: 'MAKS.', sec: 'sn',
      crop: { wheat: 'BUĞDAY', carrot: 'HAVUÇ', tomato: 'DOMATES', corn: 'MISIR', pumpkin: 'BALKABAĞI' },
      up: {
        plot: { n: 'Yeni tarla', d: '+1 ekme alanı' },
        hoe: { n: 'Çapa', d: 'Büyüme %10 hızlı' },
        well: { n: 'Kuyu', d: 'Büyüme %25 hızlı' },
        scarecrow: { n: 'Korkuluk', d: 'Satış +10%' },
        stall: { n: 'Tezgah', d: 'Gelir +1,5/sn' },
        tractor: { n: 'Traktör', d: 'Otomatik hasat' }
      },
      tips: [
        'Ekmek için tarlaya dokun',
        'Bitkileri sula, hızlı büyüsün',
        'Yeşil olunca ürünü topla',
        'Para kazanarak yeni ürün aç',
        'Mağazadan yükseltmeler al',
        'Reklam izle, x2 boost kazan'
      ]
    }
  };
  var LANGS = ['ru', 'en', 'tr'];
  var lang = 'en', dict = I18N.en;

  function t(key, p) {
    var parts = key.split('.'), node = dict;
    for (var i = 0; i < parts.length; i++) { node = node ? node[parts[i]] : undefined; }
    if (typeof node !== 'string') return key;
    if (p) { for (var k in p) { node = node.split('{' + k + '}').join(String(p[k])); } }
    return node;
  }
  function setLang(l) { if (LANGS.indexOf(l) === -1) l = 'en'; lang = l; dict = I18N[l]; }
  function navigatorLang() { var n = (navigator.language || '').toLowerCase(); if (n.indexOf('ru') === 0) return 'ru'; if (n.indexOf('tr') === 0) return 'tr'; return 'en'; }
  function formatNum(n) {
    n = Math.floor(n);
    if (n >= 10000) return (n / 1000).toFixed(1).replace('.0', '') + 'K';
    return String(n);
  }

  /* ============================ data ============================ */
  var CROPS = {
    wheat:   { cost: 5,   sell: 15,   time: 8,   unlock: 0 },
    carrot:  { cost: 20,  sell: 55,   time: 18,  unlock: 60 },
    tomato:  { cost: 70,  sell: 180,  time: 32,  unlock: 250 },
    corn:    { cost: 200, sell: 500,  time: 50,  unlock: 700 },
    pumpkin: { cost: 600, sell: 1400, time: 75,  unlock: 2000 }
  };
  var CROP_ORDER = ['wheat', 'carrot', 'tomato', 'corn', 'pumpkin'];
  var UPGRADES = {
    plot:      { icon: 'plot_icon',  base: 60,  step: 1.7, max: 7 },
    hoe:       { icon: 'hoe',        base: 50,  step: 1.6, max: 6 },
    well:      { icon: 'well',       base: 120, step: 1.8, max: 6 },
    scarecrow: { icon: 'scarecrow',  base: 140, step: 1.7, max: 8 },
    stall:     { icon: 'stall',      base: 200, step: 1.9, max: 8 },
    tractor:   { icon: 'tractor',    base: 450, step: 2.4, max: 4 }
  };
  var UPGRADE_ORDER = ['plot', 'hoe', 'well', 'scarecrow', 'stall', 'tractor'];
  var MAX_PLOTS = 10;

  function defaultState() {
    var plots = [];
    for (var i = 0; i < 3; i++) { plots.push({ crop: null, stage: 0, progress: 0, water: 0 }); }
    var up = {};
    for (var k in UPGRADES) { up[k] = 0; }
    return { version: 1, money: 50, totalEarned: 0, selected: 'wheat', sound: true, savedLang: null, unlocked: {}, plots: plots, upgrades: up };
  }

  /* ============================ save ============================ */
  var SAVE_KEY = 'pixelfarm_save_v1';
  var state = defaultState();

  function loadState() {
    var s = defaultState();
    try {
      var raw = null;
      try { raw = localStorage.getItem(SAVE_KEY); } catch (e) {}
      var o = raw ? JSON.parse(raw) : null;
      if (o) {
        if (typeof o.money === 'number') s.money = o.money;
        if (typeof o.totalEarned === 'number') s.totalEarned = o.totalEarned;
        if (typeof o.sound === 'boolean') s.sound = o.sound;
        if (typeof o.selected === 'string') s.selected = o.selected;
        if (typeof o.savedLang === 'string') s.savedLang = o.savedLang;
        if (o.unlocked) for (var u in o.unlocked) s.unlocked[u] = o.unlocked[u];
        if (Array.isArray(o.plots)) {
          s.plots = [];
          for (var i = 0; i < o.plots.length; i++) s.plots.push(Object.assign({ crop: null, stage: 0, progress: 0, water: 0 }, o.plots[i]));
        }
        if (o.upgrades) for (var uid in UPGRADES) { if (typeof o.upgrades[uid] === 'number') s.upgrades[uid] = o.upgrades[uid]; }
      }
    } catch (e) {}
    return s;
  }
  var saveTimer = null;
  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
      if (sdk.saveData) { try { sdk.saveData({ data: JSON.stringify(state) }); } catch (e2) {} }
    }, 350);
  }
  function resetProgress() { state = defaultState(); scheduleSave(); }

  /* ============================ audio ============================ */
  var AudioSys = {
    ctx: null, master: null, muted: false,
    unlock: function () {
      if (this.ctx) { if (this.ctx.state === 'suspended') { try { this.ctx.resume(); } catch (e) {} } return; }
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.master = this.ctx.createGain(); this.master.gain.value = 0.4;
        this.master.connect(this.ctx.destination);
      } catch (e) {}
    },
    tone: function (f0, f1, dur, type, vol) {
      if (!this.ctx || this.muted) return;
      try {
        var t0 = this.ctx.currentTime, osc = this.ctx.createOscillator(), g = this.ctx.createGain();
        osc.type = type || 'square';
        osc.frequency.setValueAtTime(f0, t0);
        if (f1) osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
        g.gain.setValueAtTime(vol || 0.2, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
        osc.connect(g); g.connect(this.master);
        osc.start(t0); osc.stop(t0 + dur + 0.02);
      } catch (e) {}
    },
    click: function () { this.tone(700, 500, 0.06, 'square', 0.1); },
    plant: function () { this.tone(260, 320, 0.12, 'triangle', 0.2); },
    water: function () { this.tone(500, 950, 0.1, 'sine', 0.15); },
    grow: function () { this.tone(660, 880, 0.05, 'square', 0.06); },
    harvest: function () { this.tone(880, 880, 0.07, 'square', 0.12); setTimeout(function () { AudioSys.tone(1320, 1320, 0.1, 'square', 0.12); }, 70); },
    buy: function () { this.tone(523, 523, 0.07, 'square', 0.1); setTimeout(function () { AudioSys.tone(784, 784, 0.09, 'square', 0.1); }, 80); },
    error: function () { this.tone(150, 110, 0.18, 'sawtooth', 0.15); },
    boost: function () { this.tone(523, 523, 0.08, 'square', 0.12); setTimeout(function () { AudioSys.tone(659, 659, 0.08, 'square', 0.12); }, 90); setTimeout(function () { AudioSys.tone(784, 784, 0.12, 'square', 0.12); }, 180); },
    open: function () { this.tone(440, 440, 0.06, 'square', 0.08); }
  };

  /* ============================ SDK ============================ */
  var sdk = { ok: false, ysdk: null, player: null, lang: null, readyCalled: false, _onPause: [], _onResume: [] };

  function loadJS(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.async = true; s.src = src;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('load fail ' + src)); };
      document.head.appendChild(s);
    });
  }
  function mockLang() { var n = (navigator.language || 'en').toLowerCase(); if (n.indexOf('ru') === 0) return 'ru'; if (n.indexOf('tr') === 0) return 'tr'; return 'en'; }

  var Mock = {
    environment: { i18n: { lang: mockLang() } },
    features: { LoadingAPI: { ready: function () {} }, GameplayAPI: { start: function () {}, stop: function () {} } },
    adv: {
      showBannerAdv: function () { return Promise.resolve(true); },
      hideBannerAdv: function () {},
      getBannerAdv: function () { return { show: function () { return false; }, hide: function () {}, on: function () {}, off: function () {} }; },
      showRewardedVideo: function () { return { then: function (cb) { cb(true); }, onClose: function (cb) { cb('rewarded'); }, onError: function (cb) {} }; }
    },
    on: function () {}, off: function () {},
    getPlayer: function () { return Promise.reject(new Error('no auth')); },
    screen: { fullscreen: { request: function () { return false; } } }
  };

  function inIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
  }

  function initSDK() {
    var loader;
    if (!inIframe()) {
      loader = Promise.resolve();
    } else {
      loader = Promise.resolve()
        .then(function () { return loadJS('/sdk.js'); })
        .catch(function () { return loadJS('https://yandex.ru/games/sdk/v2'); })
        .catch(function () { return null; })
        .then(function () {
          if (typeof window.YaGames === 'undefined') { sdk.ysdk = null; return; }
          return window.YaGames.init().then(function (ys) { sdk.ysdk = ys; sdk.ok = !!ys; })
            .catch(function () { sdk.ysdk = null; sdk.ok = false; });
        });
    }
    return loader.then(function () {
        var y = sdk.ysdk || Mock;
        sdk.lang = (y.environment && y.environment.i18n && y.environment.i18n.lang) || null;
        try { y.on && y.on('game_api_pause', function () { sdk._onPause.forEach(function (cb) { cb(); }); }); } catch (e) {}
        try { y.on && y.on('game_api_resume', function () { sdk._onResume.forEach(function (cb) { cb(); }); }); } catch (e) {}
        sdk.ready = function () {
          if (sdk.readyCalled) return;
          sdk.readyCalled = true;
          try { var f = (sdk.ysdk || Mock).features; if (f && f.LoadingAPI) f.LoadingAPI.ready(); } catch (e) {}
        };
        sdk.showBanner = function () {
          try {
            if (sdk.ysdk) {
              if (sdk.ysdk.adv.showBannerAdv) { var p = sdk.ysdk.adv.showBannerAdv(); if (p && p.catch) p.catch(function () {}); }
              else if (sdk.ysdk.adv.getBannerAdv) { var b = sdk.ysdk.adv.getBannerAdv(); if (b.show) b.show(); }
            }
          } catch (e) {}
        };
        sdk.hideBanner = function () {
          try { if (sdk.ysdk && sdk.ysdk.adv.hideBannerAdv) sdk.ysdk.adv.hideBannerAdv(); } catch (e) {}
        };
        sdk.rewarded = function () {
          return new Promise(function (resolve) {
            var give = false, settled = false;
            function settle(v) { if (!settled) { settled = true; resolve(!!v); } }
            try {
              var r = (sdk.ysdk || Mock).adv.showRewardedVideo();
              try { r.then(function (res) { give = !!res; }); } catch (e) {}
              try { if (r.onClose) r.onClose(function () { settle(give); }); } catch (e) {}
              try { if (r.onError) r.onError(function () { settle(false); }); } catch (e) {}
              setTimeout(function () { settle(give); }, 5000);
            } catch (e) { settle(false); }
          });
        };
        sdk.fullscreen = function () {
          try { var sc = (sdk.ysdk || Mock).screen; if (sc && sc.fullscreen && sc.fullscreen.request) sc.fullscreen.request(); } catch (e) {}
        };
        sdk.authPlayer = function () {
          if (!sdk.ysdk) return Promise.resolve(null);
          return sdk.ysdk.getPlayer().then(function (p) { sdk.player = p; return p; }).catch(function () { sdk.player = null; return null; });
        };
        sdk.saveData = function (d) {
          if (sdk.player) { try { return sdk.player.setData(d); } catch (e) {} }
          return Promise.resolve();
        };
        sdk.onPause = function (cb) { sdk._onPause.push(cb); };
        sdk.onResume = function (cb) { sdk._onResume.push(cb); };
        sdk.gameplayStart = function () { try { (sdk.ysdk || Mock).features.GameplayAPI.start(); } catch (e) {} };
        sdk.gameplayStop = function () { try { (sdk.ysdk || Mock).features.GameplayAPI.stop(); } catch (e) {} };
      });
  }

  /* ============================ ui helpers ============================ */
  function nslice(scene, x, y, w, h, key) { return scene.add.nineslice(x, y, w, h, key, undefined, 8, 8, 8, 8).setOrigin(0.5); }
  var MIN_FONT = 8; // "Press Start 2P" becomes illegible below this size
  function mkText(scene, x, y, str, size, color, align) {
    size = Math.max(size, MIN_FONT);
    var th = size >= 10 ? 3 : 2;
    return scene.add.text(x, y, str, {
      fontFamily: FONT, fontSize: size + 'px', color: color || '#ffffff',
      align: align || 'left', resolution: 2
    }).setOrigin(align === 'center' ? 0.5 : 0).setStroke('#000000', th);
  }
  function makeBtn(scene, x, y, w, h, label, cb, size) {
    var bg = nslice(scene, x, y, w, h, 'ui_btn');
    var tx = mkText(scene, x, y, label, size || 8, '#ffffff', 'center');
    var zone = scene.add.zone(x, y, w, h).setOrigin(0.5);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerup', function () { AudioSys.click(); cb && cb(); });
    return { bg: bg, tx: tx, zone: zone };
  }
  function iconBtn(scene, x, y, tex, size, cb) {
    var im = scene.add.image(x, y, tex).setScale(size);
    var zone = scene.add.zone(x, y, size, size).setOrigin(0.5);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerup', function () { AudioSys.click(); cb && cb(); });
    return { img: im, zone: zone };
  }
  function makeIconBtn(scene, x, y, tex, cb) {
    var im = scene.add.image(x, y, tex);
    var zone = scene.add.zone(x, y, 18, 18).setOrigin(0.5);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerup', function () { AudioSys.click(); cb && cb(); });
    return { img: im, zone: zone };
  }

  /* ============================ Boot ============================ */
  var Boot = new Phaser.Scene('Boot');
  Boot.create = function () {
    var self = this;
    document.fonts && document.fonts.ready && document.fonts.ready.then(function () {
      initSDK().then(function () {
        if (state.savedLang && LANGS.indexOf(state.savedLang) !== -1) setLang(state.savedLang);
        else if (sdk.lang) setLang(sdk.lang);
        else setLang(navigatorLang());
        self.scene.start('Preload');
      });
    });
  };

  /* ============================ Preload ============================ */
  var Preload = new Phaser.Scene('Preload');
  Preload.create = function () {
    var scene = this;
    scene.add.image(W / 2, H / 2, 'bg').setDisplaySize(W, H).setAlpha(0.55);
    mkText(scene, W / 2, 74, t('title'), 14, '#ffd94a', 'center');
    var pW = 260, pH = 10;
    nslice(scene, W / 2, H / 2 + 50, pW, pH, 'ui_btn');
    var barFill = scene.add.image((W - pW) / 2, H / 2 + 50, 'progress_fill').setOrigin(0, 0.5).setDisplaySize(1, 6);
    var loader = scene.load;
    bankTextures(loader);
    scene.load.on('progress', function (p) { barFill.setDisplaySize(Math.max(2, pW * p), 6); });
    scene.load.once('complete', function () { scene.scene.start('Menu'); });
    scene.load.start();
  };
  function bankTextures(f) {
    f.image('bg', 'assets/img/bg.png');
    f.image('coin', 'assets/img/coin.png');
    f.image('tile_grass', 'assets/img/tile_grass.png');
    f.image('tile_soil', 'assets/img/tile_soil.png');
    f.image('tile_soil_water', 'assets/img/tile_soil_water.png');
    f.image('progress_bg', 'assets/img/progress_bg.png');
    f.image('progress_fill', 'assets/img/progress_fill.png');
    f.image('ui_panel', 'assets/img/ui_panel.png');
    f.image('ui_btn', 'assets/img/ui_btn.png');
    f.image('plot_icon', 'assets/img/plot_icon.png');
    f.image('hoe', 'assets/img/hoe.png');
    f.image('well', 'assets/img/well.png');
    f.image('scarecrow', 'assets/img/scarecrow.png');
    f.image('stall', 'assets/img/stall.png');
    f.image('tractor', 'assets/img/tractor.png');
    f.image('buyer_wagon', 'assets/img/buyer_wagon.png');
    f.image('farmer_01', 'assets/img/farmer_01.png');
    f.image('farmer_02', 'assets/img/farmer_02.png');
    f.image('mascot_01', 'assets/img/mascot_01.png');
    f.image('mascot_02', 'assets/img/mascot_02.png');
    f.image('btn_adv', 'assets/img/btn_adv.png');
    f.image('btn_lang', 'assets/img/btn_lang.png');
    f.image('btn_play', 'assets/img/btn_play.png');
    f.image('btn_pause', 'assets/img/btn_pause.png');
    f.image('btn_sound_on', 'assets/img/btn_sound_on.png');
    f.image('btn_sound_off', 'assets/img/btn_sound_off.png');
    f.image('fx_coin', 'assets/img/fx_coin.png');
    f.image('fx_sparkle', 'assets/img/fx_sparkle.png');
    f.image('fx_heart', 'assets/img/fx_heart.png');
    f.image('fx_leaf', 'assets/img/fx_leaf.png');
    f.image('decor_tree', 'assets/img/decor_tree.png');
    f.image('decor_fence', 'assets/img/decor_fence.png');
    f.image('decor_flower', 'assets/img/decor_flower.png');
    f.image('decor_butterfly', 'assets/img/decor_butterfly.png');
    CROP_ORDER.forEach(function (c) {
      for (var s = 1; s <= 4; s++) f.image('crop_' + c + '_' + s, 'assets/img/crop_' + c + '_' + s + '.png');
      f.image('crop_' + c + '_icon', 'assets/img/crop_' + c + '_icon.png');
    });
  }

  /* ============================ Menu ============================ */
  var Menu = new Phaser.Scene('Menu');
  Menu.create = function () {
    var scene = this;
    AudioSys.unlock();
    scene.add.image(W / 2, H / 2, 'bg').setDisplaySize(W, H).setAlpha(0.55);
    scene.add.image(W / 2 - 160, 86, 'mascot_01').setScale(3);
    mkText(scene, W / 2, 26, t('title'), 16, '#ffd94a', 'center');
    mkText(scene, W / 2, 126, t('subtitle'), 8, '#d8f5c8', 'center');
    makeBtn(scene, W / 2, 172, 210, 42, t('play'), function () { scene.scene.start('Game'); }, 12);
    mkText(scene, W / 2, 238, 'v0.1', 6, '#9aa0ad', 'center');

    scene.input.once('pointerdown', function () { AudioSys.unlock(); sdk.fullscreen(); });
    scene.add.image(W / 2 + 210, 100, 'mascot_02').setScale(2).setAlpha(0.9);

    sdk.ready();
  };

  /* ============================ Game ============================ */
  var Game = new Phaser.Scene('Game');

  Game.create = function () {
    var scene = this;
    AudioSys.unlock();
    scene.input.on('pointerdown', function () { AudioSys.unlock(); });

    scene.add.image(W / 2, H / 2, 'bg').setDisplaySize(W, H);
    scene.add.image(40, 42, 'decor_tree').setScale(2);
    scene.add.image(442, 46, 'decor_butterfly').setScale(1.2);
    scene.add.image(452, 92, 'decor_flower').setScale(1).setAlpha(0.9);

    nslice(scene, W / 2, 14, W, 28, 'ui_panel');
    scene.add.image(22, 14, 'coin');
    scene.coinText = mkText(scene, 34, 7, '', 10, '#ffd94a');
    scene.incomeText = mkText(scene, 34, 20, '', 6, '#cfe7c0');

    scene.btnPause = makeIconBtn(scene, 424, 14, 'btn_pause', function () { scene.pauseGame(true); });
    scene.btnSound = makeIconBtn(scene, 446, 14, 'btn_sound_on', function () { state.sound = !state.sound; AudioSys.muted = !state.sound; refreshTop(); scheduleSave(); });
    scene.btnLang = makeIconBtn(scene, 468, 14, 'btn_lang', function () { cycleLang(); refreshTop(); refreshCropBar(); scheduleSave(); });

    nslice(scene, W / 2, 217, W, 98, 'ui_panel');
    scene.btnShop = makeBtn(scene, 430, 240, 88, 34, t('shop'), function () { scene.openShop(); }, 9);
    scene.btnBoost = makeBtn(scene, 336, 240, 76, 34, t('boost'), function () { scene.watchAd(); }, 9);
    scene.add.image(322, 240, 'btn_adv').setScale(1.2).setAlpha(0.95);

    scene.selName = mkText(scene, 10, 206, '', 8, '#ffffff');
    scene.selCost = mkText(scene, 10, 218, '', 7, '#ffd94a');
    scene.selTime = mkText(scene, 10, 230, '', 6, '#cfe7c0');
    scene.boostStatus = mkText(scene, 254, 252, '', 6, '#ff9d4a');

    scene.cropBtns = [];
    var rowY = 178, colX0 = 8, stepW = 94;
    CROP_ORDER.forEach(function (cid, idx) {
      var x = colX0 + idx * stepW + stepW / 2;
      var bg = nslice(scene, x, rowY + 8, 84, 36, 'ui_btn');
      var icon = scene.add.image(x - 28, rowY + 8, 'crop_' + cid + '_icon').setScale(1.5);
      var nm = mkText(scene, x - 16, rowY + 2, '', 8, '#ffffff');
      var lk = mkText(scene, x - 16, rowY + 18, '', 8, '#7ed957');
      var zone = scene.add.zone(x, rowY + 8, 84, 36).setOrigin(0.5);
      zone.setInteractive({ useHandCursor: true });
      zone.on('pointerup', function () {
        if (isCropUnlocked(cid)) { state.selected = cid; AudioSys.click(); refreshCropBar(); }
        else { AudioSys.error(); scene.toast(t('cropUnlock', { v: CROPS[cid].unlock })); }
      });
      scene.cropBtns.push({ id: cid, bg: bg, icon: icon, nm: nm, lk: lk, zone: zone });
    });

    scene.plotsUI = [];
    scene.mascot = scene.add.image(432, 150, 'mascot_01').setScale(2);
    scene.mascotBubble = nslice(scene, 358, 146, 154, 28, 'ui_panel');
    scene.mascotText = mkText(scene, 358, 138, '', 6, '#ffffff', 'center');
    scene.tipIdx = -1; scene.tipTimer = 1;

    scene.harvestFx = scene.add.particles(0, 0, 'fx_coin', { speed: { min: 30, max: 95 }, angle: { min: 210, max: 330 }, scale: { start: 1, end: 0.2 }, lifespan: 650, frequency: -1, quantity: 1 });
    scene.sparkleFx = scene.add.particles(0, 0, 'fx_sparkle', { speed: { min: 8, max: 22 }, scale: { start: 0.8, end: 0.1 }, lifespan: 500, frequency: -1, quantity: 1 });

    scene.toasts = [];
    scene.modal = null;
    scene.paused = false;
    scene.pauseTint = null;
    scene.autoTimer = 1;
    scene.boost = 0;
    scene._lastInc = -1;

    scene.events.on('shutdown', function () { sdk.gameplayStop(); sdk.hideBanner(); });

    rebuildPlots();
    sdk.gameplayStart();
    sdk.showBanner();
    sdk.authPlayer();
    refreshAll();

    sdk.onPause(function () { scene.pauseGame(true); });
    sdk.onResume(function () { scene.pauseGame(false); });
    window.addEventListener('blur', function () { scene.pauseGame(true); AudioSys.muted = true; });
    window.addEventListener('focus', function () { AudioSys.muted = !state.sound; scene.pauseGame(false); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { scene.pauseGame(true); AudioSys.muted = true; }
      else { AudioSys.muted = !state.sound; scene.pauseGame(false); }
    });
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  };

  var COL_STEP = 56, PLOT_X0 = 112, PLOT_Y1 = 62, PLOT_Y2 = 116;

  function rebuildPlots() {
    var scene = Game;
    scene.plotsUI.forEach(function (p) { p.container.destroy(true); });
    scene.plotsUI = [];
    for (var i = 0; i < state.plots.length; i++) {
      (function (idx) {
        var col = idx % 5, row = Math.floor(idx / 5);
        var x = PLOT_X0 + col * COL_STEP, y = row === 0 ? PLOT_Y1 : PLOT_Y2;
        var c = scene.add.container(x, y);
        var soil = scene.add.image(0, 0, 'tile_soil').setScale(S_PLOT);
        var crop = scene.add.image(0, -3, 'crop_wheat_1').setScale(2.6).setVisible(false);
        var barB = scene.add.image(0, 25, 'progress_bg').setDisplaySize(44, 4);
        var barF = scene.add.image(-22, 25, 'progress_fill').setOrigin(0, 0.5).setDisplaySize(0, 4);
        c.add([soil, crop, barB, barF]);
        scene.add.existing(c);
        var zone = scene.add.zone(x, y, 48, 48).setOrigin(0.5);
        zone.setInteractive({ useHandCursor: true });
        zone.on('pointerup', function () { onPlotTap(idx); });
        scene.plotsUI.push({ i: idx, x: x, y: y, soil: soil, cropImg: crop, barB: barB, barF: barF, zone: zone, container: c });
      })(i);
    }
  }

  function plotPos(i) { var col = i % 5, row = Math.floor(i / 5); return { x: PLOT_X0 + col * COL_STEP, y: (row === 0 ? PLOT_Y1 : PLOT_Y2) - 3 }; }

  function onPlotTap(i) {
    var pl = state.plots[i];
    if (pl.crop === null) {
      var cid = state.selected;
      var c = CROPS[cid];
      if (!isCropUnlocked(cid)) { Game.toast(t('cropUnlock', { v: c.unlock })); AudioSys.error(); return; }
      if (state.money < c.cost) { Game.toast(t('needMore')); AudioSys.error(); return; }
      state.money -= c.cost;
      pl.crop = cid; pl.stage = 0; pl.progress = 0; pl.water = 0;
      AudioSys.plant(); scheduleSave();
      var p = plotPos(i);
      Game.sparkleFx.setPosition(p.x, p.y); Game.sparkleFx.explode(4);
      Game.toast(t('planted'));
      refreshPlotVisual(i); refreshTop();
      return;
    }
    if (pl.stage >= 3) { harvestPlot(i); return; }
    pl.progress = Math.min(1, pl.progress + 0.15);
    pl.water = 1.4;
    AudioSys.water(); scheduleSave();
    refreshPlotVisual(i);
  }

  function harvestPlot(i) {
    var pl = state.plots[i];
    var c = CROPS[pl.crop];
    var gain = c.sell * (1 + 0.1 * state.upgrades.scarecrow) * (Game.boost > 0 ? 2 : 1);
    state.money += gain;
    state.totalEarned += gain;
    pl.crop = null; pl.stage = 0; pl.progress = 0; pl.water = 0;
    AudioSys.harvest();
    var p = plotPos(i);
    Game.harvestFx.setPosition(p.x, p.y); Game.harvestFx.explode(6);
    coinFly(p.x, p.y - 8, '+' + formatNum(gain));
    checkUnlocks();
    refreshPlotVisual(i); refreshTop();
    scheduleSave();
  }

  function coinFly(x, y, str) {
    var tx = Game.add.text(x, y, str, { fontFamily: FONT, fontSize: '8px', color: '#ffd94a', resolution: 1 }).setOrigin(0.5).setStroke('#000000', 2);
    var z = Game.add.zone(0, 0, 1, 1); Game.add.existing(tx);
    Game.tweens.add({ targets: tx, y: y - 30, alpha: 0, duration: 750, onComplete: function () { tx.destroy(); } });
    return tx;
  }

  function refreshPlotVisual(i) {
    var pl = state.plots[i], ui = Game.plotsUI[i];
    if (!ui) return;
    if (pl.crop === null) {
      ui.soil.setTexture('tile_soil'); ui.cropImg.setVisible(false);
      ui.barF.setDisplaySize(0, 4);
      return;
    }
    var st = Math.max(0, Math.min(3, Math.floor(pl.progress * 4)));
    pl.stage = st;
    ui.cropImg.setTexture('crop_' + pl.crop + '_' + (st + 1));
    ui.cropImg.setVisible(true);
    ui.soil.setTexture(pl.water > 0 ? 'tile_soil_water' : 'tile_soil');
    ui.cropImg.setTint(st >= 3 ? 0x9AffC4 : 0xffffff);
    ui.barF.setDisplaySize(Math.max(2, 44 * pl.progress), 4);
  }

  function doPlotTick(i, dt) {
    var pl = state.plots[i];
    if (pl.crop === null || pl.progress >= 1) return;
    var c = CROPS[pl.crop];
    var gTime = c.time * Math.pow(0.9, state.upgrades.hoe);
    var rate = (1 + 0.25 * state.upgrades.well) / gTime;
    if (Game.boost > 0) rate *= 2;
    var before = Math.min(3, Math.floor(pl.progress * 4));
    pl.progress = Math.min(1, pl.progress + rate * dt);
    var after = Math.min(3, Math.floor(pl.progress * 4));
    if (after > before && pl.progress < 1) AudioSys.grow();
  }

  function isCropUnlocked(cid) { return state.totalEarned >= CROPS[cid].unlock; }

  function checkUnlocks() {
    CROP_ORDER.forEach(function (cid) {
      if (cid === 'wheat') return;
      if (state.totalEarned >= CROPS[cid].unlock && !state.unlocked[cid]) {
        state.unlocked[cid] = 1;
        Game.toast(t('newCrop', { c: t('crop.' + cid) }));
        AudioSys.boost();
        refreshCropBar();
        scheduleSave();
      }
    });
  }

  function passiveIncome() {
    var inc = state.upgrades.stall * 1.5 * (1 + 0.1 * state.upgrades.scarecrow);
    if (Game.boost > 0) inc *= 2;
    return inc;
  }

  function refreshTop() {
    Game.coinText.setText(formatNum(state.money));
    Game.incomeText.setText(t('perSec', { v: formatNum(passiveIncome()) }));
    Game.btnSound.img.setTexture(state.sound ? 'btn_sound_on' : 'btn_sound_off');
  }
  function refreshCropBar() {
    Game.cropBtns.forEach(function (b) {
      var c = CROPS[b.id], un = isCropUnlocked(b.id);
      b.bg.setTint(state.selected === b.id ? 0x7ed957 : 0xffffff);
      b.bg.setAlpha(un ? 1 : 0.5);
      b.nm.setText(t('crop.' + b.id));
      b.lk.setText(un ? String(c.sell) : String(c.unlock));
      b.lk.setColor(un ? '#7ed957' : '#ffb54a');
    });
    var c = CROPS[state.selected];
    Game.selName.setText(t('crop.' + state.selected));
    Game.selCost.setText(formatNum(c.cost));
    Game.selTime.setText(c.time + ' ' + t('sec'));
  }
  function refreshAll() { refreshTop(); refreshCropBar(); }

  Game.toast = function (str) {
    var tx = mkText(this, W / 2, 42, str, 8, '#ffe66a', 'center');
    this.tweens.add({ targets: tx, y: 30, alpha: 0, delay: 800, duration: 700, onComplete: function () { tx.destroy(); } });
  };

  function cycleLang() {
    var i = LANGS.indexOf(lang);
    setLang(LANGS[(i + 1) % LANGS.length]);
    state.savedLang = lang;
    AudioSys.open();
  }

  /* ---------- shop ---------- */
  Game.openShop = function () {
    var scene = this;
    if (scene.modal) return;
    AudioSys.open();
    var m = scene.add.container(0, 0);
    scene.modal = m;
    var tint = scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.55).setOrigin(0.5);
    tint.setInteractive();
    var panel = nslice(scene, W / 2, H / 2, 462, 250, 'ui_panel');
    var title = mkText(scene, 20, 14, t('shop'), 11, '#ffd94a');
    m.add([tint, panel, title]);

    UPGRADE_ORDER.forEach(function (uid, idx) {
      (function (u) {
        var y = 48 + idx * 33;
        var cfg = UPGRADES[u], lvl = state.upgrades[u];
        var icon = scene.add.image(30, y + 5, cfg.icon).setScale(cfg.icon === 'plot_icon' ? 1.4 : 1.1);
        var nm = mkText(scene, 46, y - 2, t('up.' + u + '.n'), 7, '#ffffff');
        var ds = mkText(scene, 46, y + 8, t('up.' + u + '.d'), 6, '#cfe7c0');
        var lvlT = mkText(scene, 46, y + 19, lvl + '/' + cfg.max, 6, '#9aa0ad');
        var maxed = lvl >= cfg.max, cost = upgradeCost(u);
        var costT = mkText(scene, 392, y + 5, maxed ? t('maxLvl') : formatNum(cost), 7, maxed ? '#9aa0ad' : '#ffd94a', 'center');
        var zone = scene.add.zone(392, y + 5, 104, 30).setOrigin(0.5);
        if (!maxed) {
          zone.setInteractive({ useHandCursor: true });
          zone.on('pointerup', function () {
            if (state.money >= cost) {
              state.money -= cost; state.upgrades[u]++;
              if (u === 'plot' && state.plots.length < MAX_PLOTS) { state.plots.push({ crop: null, stage: 0, progress: 0, water: 0 }); rebuildPlots(); }
              AudioSys.buy(); scheduleSave();
              scene.closeModal(); scene.openShop();
            } else { AudioSys.error(); scene.toast(t('needMore')); }
          });
        }
        m.add([icon, nm, ds, lvlT, costT, zone]);
      })(uid);
    });
    var cl = makeBtn(scene, W / 2, 236, 70, 24, 'OK', function () { scene.closeModal(); }, 8);
    m.add([cl.bg, cl.tx]);
  };
  Game.closeModal = function () { if (this.modal) { this.modal.destroy(true); this.modal = null; } };
  function upgradeCost(uid) { var cfg = UPGRADES[uid], lvl = state.upgrades[uid]; return Math.round(cfg.base * Math.pow(cfg.step, lvl)); }

  /* ---------- pause ---------- */
  Game.pauseGame = function (on) {
    var scene = this;
    if (on) {
      if (scene.paused) return;
      scene.paused = true;
      scene.btnPause.img.setTexture('btn_play');
      if (!scene.pauseTint) {
        scene.pauseTint = scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.6).setOrigin(0.5);
        scene.pauseTint.setInteractive();
        scene.pausePanel = nslice(scene, W / 2, H / 2, 270, 132, 'ui_panel');
        scene.pauseTitle = mkText(scene, W / 2, 88, t('pause'), 13, '#ffd94a', 'center');
        scene.btnResume = makeBtn(scene, W / 2, 142, 200, 30, t('resume'), function () { scene.pauseGame(false); }, 9);
        scene.btnSettings = makeBtn(scene, W / 2, 180, 200, 28, t('settings'), function () { scene.openSettings(); }, 8);
      } else {
        scene.pauseTint.setVisible(true); scene.pausePanel.setVisible(true);
        scene.pauseTitle.setVisible(true);
        scene.btnResume.bg.setVisible(true); scene.btnResume.tx.setVisible(true);
        scene.btnSettings.bg.setVisible(true); scene.btnSettings.tx.setVisible(true);
      }
      sdk.gameplayStop();
    } else {
      if (!scene.paused) return;
      scene.paused = false;
      scene.btnPause.img.setTexture('btn_pause');
      if (scene.pauseTint) {
        scene.pauseTint.setVisible(false); scene.pausePanel.setVisible(false);
        scene.pauseTitle.setVisible(false);
        scene.btnResume.bg.setVisible(false); scene.btnResume.tx.setVisible(false);
        scene.btnSettings.bg.setVisible(false); scene.btnSettings.tx.setVisible(false);
      }
      sdk.gameplayStart();
    }
  };

  Game.openSettings = function () {
    var scene = this;
    if (scene.modal) return;
    AudioSys.open();
    var m = scene.add.container(0, 0);
    scene.modal = m;
    var tint = scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.55).setOrigin(0.5).setInteractive();
    var panel = nslice(scene, W / 2, H / 2, 320, 196, 'ui_panel');
    var title = mkText(scene, 91, 41, t('settings'), 11, '#ffd94a');
    m.add([tint, panel, title]);

    var sRow = makeBtn(scene, W / 2, 74, 250, 28, t('sound') + ': ' + (state.sound ? 'ON' : 'OFF'), function () {
      state.sound = !state.sound; AudioSys.muted = !state.sound; scheduleSave();
      scene.closeModal(); scene.openSettings();
    }, 8);
    m.add([sRow.bg, sRow.tx]);

    var lRow = makeBtn(scene, W / 2, 110, 250, 28, t('language') + ': ' + lang.toUpperCase(), function () {
      cycleLang(); scheduleSave();
      scene.closeModal(); scene.openSettings();
    }, 8);
    m.add([lRow.bg, lRow.tx]);

    var rRow = makeBtn(scene, W / 2, 146, 250, 28, t('reset'), function () {
      resetProgress(); AudioSys.buy();
      scene.closeModal(); scene.pauseGame(false); scene.scene.restart();
    }, 8);
    m.add([rRow.bg, rRow.tx]);

    var cl = makeBtn(scene, W / 2, 182, 70, 24, 'OK', function () { scene.closeModal(); }, 8);
    m.add([cl.bg, cl.tx]);
  };

  /* ---------- rewarded ---------- */
  Game.watchAd = function () {
    var scene = this;
    if (scene.boost > 0) return;
    scene.pauseGame(true);
    sdk.rewarded().then(function (ok) {
      scene.pauseGame(false);
      if (ok) {
        scene.boost = BOOST_TIME;
        AudioSys.boost();
        scene.boostStatus.setText(t('boostOn'));
        var bonus = Math.max(50, Math.round(state.totalEarned * 0.1));
        state.money += bonus; scheduleSave(); refreshTop();
        scene.toast(t('adDone') + ' +' + formatNum(bonus));
      } else {
        scene.toast(t('noAds'));
      }
    });
  };

  /* ---------- update ---------- */
  Game.update = function (_t, delta) {
    var scene = this;
    if (scene.paused) return;
    var dt = Math.min(0.1, delta / 1000);

    if (scene.boost > 0) { scene.boost -= delta / 1000; if (scene.boost <= 0) { scene.boost = 0; scene.boostStatus.setText(''); } }

    for (var i = 0; i < state.plots.length; i++) { doPlotTick(i, dt); refreshPlotVisual(i); }

    var inc = passiveIncome();
    if (inc > 0) { state.money += inc * dt; }
    if (Math.abs(inc - scene._lastInc) > 0.001) { scene._lastInc = inc; refreshTop(); }

    if (state.upgrades.tractor > 0) {
      scene.autoTimer -= delta / 1000;
      if (scene.autoTimer <= 0) {
        scene.autoTimer = Math.max(2, 6 - state.upgrades.tractor * 0.9);
        var any = false;
        for (var j = 0; j < state.plots.length; j++) { if (state.plots[j].crop !== null && state.plots[j].stage >= 3) { harvestPlot(j); any = true; } }
        if (!any) scene.autoTimer = 1.5;
      }
    }

    scene.tipTimer -= delta / 1000;
    if (scene.tipTimer <= 0 && !scene.modal && !scene.paused) {
      scene.tipTimer = 8;
      var tips = dict.tips;
      if (tips && tips.length) {
        scene.tipIdx = (scene.tipIdx + 1) % tips.length;
        scene.mascotText.setText(tips[scene.tipIdx]);
      }
    }
  };

  /* ============================ start ============================ */
  state = loadState();
  AudioSys.muted = !state.sound;

  var game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: W, height: H,
    backgroundColor: '#3c6ea5',
    pixelArt: true,
    roundPixels: true,
    scale: { 
      mode: Phaser.Scale.FIT, 
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: '100%',
      height: '100%'
    },
    scene: [Boot, Preload, Menu, Game],
    transparent: false,
    antialias: false
  });
  
  // Signal that the game is ready (hide loading screen)
  game.events.once('ready', function() {
    if (window.markGameReady) {
      window.markGameReady();
    }
  });

  window.FarmTest = {
    state: function () { return JSON.parse(JSON.stringify(state)); },
    scene: function (n) { return game.scene.getScene(n || 'Game'); },
    plots: function () { return Game.plotsUI.length; },
    tapPlot: function (i) { onPlotTap(i); },
    boost: function () { return Game.boost; },
    force: function (i, p) { if (state.plots[i]) { state.plots[i].progress = p; refreshPlotVisual(i); } }
  };
})();