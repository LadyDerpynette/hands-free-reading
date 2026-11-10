// ==UserScript==
// @name         Hands-free reading for FanFiction.net
// @namespace    https://github.com/LadyDerpynette
// @version      1.2.7
// @description  Nod to scroll (front camera, face tracking runs on your phone) or Auto-scroll, on any site (FanFiction.net chapters know their next/previous chapter). Personal use only, no commercial use.
// @author       LadyDerpynette
// @license      PolyForm-Noncommercial-1.0.0; https://polyformproject.org/licenses/noncommercial/1.0.0
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @noframes
// @homepageURL  https://github.com/LadyDerpynette/hands-free-reading
// @downloadURL  https://raw.githubusercontent.com/LadyDerpynette/hands-free-reading/main/ffn-hands-free.user.js
// @updateURL    https://raw.githubusercontent.com/LadyDerpynette/hands-free-reading/main/ffn-hands-free.user.js
// ==/UserScript==

/*
 * Copyright LadyDerpynette. Free for personal use; no commercial use (PolyForm Noncommercial 1.0.0, see LICENSE.md in
 * https://github.com/LadyDerpynette/hands-free-reading). This is a built file: edits here are overwritten.
 * Tap the round head button (bottom right) to choose Nod to scroll or Auto-scroll. The camera picture never leaves the
 * phone; the face tracker (Google MediaPipe 1.2.2) is loaded from jsDelivr and Google's model storage.
 */
(function () {
  'use strict';
  var CSS = "\n.hf-sheet,.hf-pill,.oi-fab,.oi-toast{--paper:#FAF9FC;--surface:#FFFFFF;--ink:#17161C;--body:#3A3644;--muted:#6E6879;--line:#E3E0EA;--garnet:#9E1F45;--garnet-soft:#F6E7EC;\n--display:Georgia,serif;--sans:ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,system-ui,sans-serif;box-sizing:border-box;text-align:left}\n@media (prefers-color-scheme:dark){.hf-sheet,.hf-pill,.oi-fab,.oi-toast{--paper:#131118;--surface:#1C1A24;--ink:#EFECF4;--body:#C6C1D0;--muted:#948EA2;--line:#2C2937;--garnet:#E9678A;--garnet-soft:#31161F}}\n.hf-sheet *,.hf-pill *{box-sizing:border-box}\n.hf-sheet button{font:600 14px/1 var(--sans);color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:9px 10px;min-height:38px;cursor:pointer;white-space:nowrap}\n.oi-fab{position:fixed;right:12px;bottom:74px;z-index:2147483000;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;\n  background:var(--surface);color:var(--ink);border:1px solid var(--line);box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer;padding:0}\n.oi-fab.on{border-color:var(--garnet);color:var(--garnet);background:var(--garnet-soft)}\n.hf-sheet{z-index:2147483001!important;font-family:var(--sans)}.hf-pill{z-index:2147483000!important}\n.oi-toast{z-index:2147483002}\n.oi-toast{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:5;background:var(--ink);color:var(--paper);font:600 14px/1.3 var(--sans);padding:10px 14px;border-radius:10px;max-width:calc(100vw - 32px);opacity:0;transition:opacity .2s;pointer-events:none}\n.oi-toast.on{opacity:1}\n.hf-sheet{position:fixed;left:0;right:0;bottom:0;z-index:4;max-height:70vh;overflow:auto;background:var(--surface);border-top:1px solid var(--line);box-shadow:0 -8px 24px rgba(0,0,0,.25);padding:12px 14px 18px}\n.hf-sheet[hidden]{display:none}\n.hf-sheet header{display:flex;align-items:center;gap:8px;margin-bottom:8px}.hf-sheet header strong{flex:1;font:600 1.05rem/1.2 var(--display);color:var(--ink)}\n.hf-sheet ul{list-style:none;margin:0;padding:0}.hf-sheet li{display:flex;gap:8px;align-items:center;padding:8px 0;border-top:1px solid var(--line)}\n.hf-sheet li a{flex:1;min-width:0;color:var(--body);text-decoration:none;font:15px/1.35 var(--display)}.hf-sheet li a b{color:var(--garnet);font:600 13px/1 var(--sans);margin-right:6px}\n.hf-sheet .empty{color:var(--muted);margin:6px 0}\n.hf-modes{display:grid;gap:8px;margin:4px 0 12px}\n.hf-sheet .hf-modes button{display:block;width:100%;text-align:left;white-space:normal;padding:11px 12px;line-height:1.35;background:var(--paper)}\n.hf-modes b{display:block;font:600 15px/1.3 var(--sans);color:var(--ink)}.hf-modes span{display:block;font:400 13px/1.4 var(--sans);color:var(--muted);margin-top:2px}\n.hf-sheet .hf-modes button[aria-checked=\"true\"]{border-color:var(--garnet);background:var(--garnet-soft)}.hf-modes button[aria-checked=\"true\"] b{color:var(--garnet)}\n.hf-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;justify-content:space-between;padding:8px 0;border-top:1px solid var(--line);font:500 14px/1.3 var(--sans);color:var(--ink)}\n.hf-sheet .seg{display:flex;flex-wrap:wrap;gap:4px}.hf-sheet .seg button{padding:8px 10px;min-height:36px;font-size:13px}.hf-sheet .seg button[aria-pressed=\"true\"]{border-color:var(--garnet);color:var(--garnet);background:var(--garnet-soft)}\n.hf-chk input{width:22px;height:22px;accent-color:var(--garnet)}\n.hf-sheet .spd{display:flex;align-items:center;gap:8px}.hf-sheet .spd output{min-width:4.5em;text-align:center;font:600 14px/1 var(--sans)}.hf-sheet .spd button{min-width:44px;font-size:18px}\n.hf-note{margin:8px 0 0;font:13px/1.4 var(--sans);color:var(--muted)}\n.hf-help{margin-top:10px;padding:10px 12px;border:1px solid var(--garnet);border-radius:10px;background:var(--garnet-soft);font:14px/1.45 var(--sans);color:var(--ink)}\n.hf-help[hidden],.hf-set[hidden],.hf-pill[hidden]{display:none}.hf-help p{margin:6px 0}.hf-help ul{margin:6px 0;padding-left:18px}.hf-help li{display:list-item;border:0;padding:3px 0}\n.hf-pill{position:fixed;right:12px;bottom:14px;z-index:4;display:flex;align-items:center;gap:8px;max-width:calc(100vw - 24px);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:6px 6px 6px 12px;box-shadow:0 6px 18px rgba(0,0,0,.22);font:600 13px/1.2 var(--sans);color:var(--ink)}\n.hf-cam{display:flex;align-items:center;gap:5px;margin-left:-6px}.hf-cam[hidden]{display:none}\n.hf-vid video{display:block;width:36px;height:46px;object-fit:cover;border-radius:10px;transform:scaleX(-1);background:#000}\n.hf-meter{position:relative;width:4px;height:30px;border-radius:2px;background:var(--line)}\n.hf-meter::before,.hf-meter::after{content:\"\";position:absolute;left:-3px;width:10px;height:1px;background:var(--muted)}.hf-meter::before{top:2px}.hf-meter::after{top:28px}\n.hf-meter b{position:absolute;left:-2px;top:13px;width:8px;height:4px;border-radius:2px;background:var(--garnet);transition:transform .08s linear}\n.hf-pill.hit{border-color:#2E9E5B;box-shadow:0 0 0 3px rgba(46,158,91,.35)}\nbody.hf-on .oi-toast{bottom:76px}.hf-help{margin:0 0 12px}\n.hf-pill .dot{width:9px;height:9px;border-radius:50%;background:var(--muted);flex:none}.hf-pill .dot.ok{background:#2E9E5B}.hf-pill .dot.bad{background:var(--garnet)}\n.hf-msg{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.hf-pill button{font:600 13px/1 var(--sans);color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:999px;padding:8px 11px;min-height:34px;cursor:pointer;flex:none}\n.hf-pill button[hidden]{display:none}\n";

  if (!document.body) return;
  if (document.querySelector('meta[name="hands-free"]')) return;   // the page has hands-free reading built in
  var VER = '1.2.7';
  // a plain notice on the page (never a browser popup): two copies on, or this copy stopped with an error
  function note(msg) {
    var n = document.createElement('div'); n.className = 'oi-note'; n.setAttribute('role', 'alert');
    n.style.cssText = 'position:fixed;left:12px;right:12px;bottom:130px;z-index:2147483003;background:#9E1F45;color:#fff;font:600 14px/1.4 ui-sans-serif,system-ui,sans-serif;padding:12px 40px 12px 14px;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,.3)';
    n.textContent = msg;
    var x = document.createElement('button'); x.type = 'button'; x.textContent = '\u00d7'; x.setAttribute('aria-label', 'Close');
    x.style.cssText = 'position:absolute;right:6px;top:6px;width:30px;height:30px;border:0;background:none;color:#fff;font:700 20px/1 sans-serif;cursor:pointer';
    x.onclick = function () { n.remove(); }; n.appendChild(x); document.body.appendChild(n);
  }
  // 1.2.1: another hands-free copy already runs on this page (an older Tampermonkey install). Before, this copy stood
  // aside silently, so on FanFiction.net only the old one ever showed. Now it says so.
  if (window.__HF || document.querySelector('.oi-fab')) {
    var old = document.querySelector('.oi-fab'); if (old && old.getAttribute('data-ver') === VER) return;   // ran twice: fine
    note('Two copies of Hands-free reading are on. This one is v' + VER + '. Open Tampermonkey and turn off (or delete) the older one, then reload.');
    return;
  }
  var m = /(^|\.)fanfiction\.net$/.test(location.hostname) && location.pathname.match(/^\/s\/(\d+)\/(\d+)/);
  var SID = m && m[1], CH = m && +m[2];
  function total() {
    var s = document.querySelector('select#chap_select, select[name="chapter"]'); if (s && s.options.length) return s.options.length;
    var n = 0; [].forEach.call(document.querySelectorAll('a[href*="/s/' + SID + '/"]'), function (a) { var x = (a.getAttribute('href').match(/\/s\/\d+\/(\d+)/) || [])[1]; if (x) n = Math.max(n, +x); });
    return Math.max(n, CH);
  }
  var WORDS = { next: /^(next( chapter| page)?|suivant(e)?|chapitre suivant|page suivante|older posts?|›|»|→|>)$/i, prev: /^(prev(ious)?( chapter| page)?|précédent(e)?|chapitre précédent|page précédente|newer posts?|‹|«|←|<)$/i };
  function anyLink(cls) {
    var r = document.querySelector('link[rel~="' + cls + '"][href], a[rel~="' + cls + '"][href]') || (cls === 'prev' && document.querySelector('link[rel~="previous"][href], a[rel~="previous"][href]'));
    if (r) return r.href;
    var as = document.querySelectorAll('a[href]');
    for (var i = 0; i < as.length; i++) {
      var a = as[i], t = (a.textContent || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
      if (t.length <= 30 && WORDS[cls].test(t.replace(/^[\s«‹←<]+|[\s»›→>]+$/g, '') || t) && a.href.indexOf('javascript:') !== 0 && a.href.split('#')[0] !== location.href.split('#')[0]) return a.href;
    }
    return null;
  }
  function article() {
    var c = ['#storytext', '#storycontent', 'article', '[role="main"]', 'main', '#content', '.content'];
    for (var i = 0; i < c.length; i++) { var e = document.querySelector(c[i]); if (e && e.textContent.trim().length > 200) return c[i]; }
    return 'body';
  }
  window.__HF_CFG = {
    mp: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.2/',
    wasm: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.2/wasm/',
    model: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
    article: article(), btn: '.oi-fab', bar: null, toast: '.oi-toast', ver: VER,
    link: m ? function (cls) { var n = cls === 'next' ? CH + 1 : CH - 1; return n >= 1 && n <= total() ? location.origin + '/s/' + SID + '/' + n + '/' : null; } : anyLink
  };
  if (document.querySelector('.oi-fab')) return;   // mounted once
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  var fab = document.createElement('button'); fab.type = 'button'; fab.className = 'hf oi-fab'; fab.setAttribute('data-ver', VER); fab.setAttribute('aria-label', 'Hands-free reading v' + VER);
  fab.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5"/><path d="M9.5 15.5 9 21M14.5 15.5 15 21"/><path d="M3.5 6.5v5M20.5 6.5v5M2 8l1.5-1.5L5 8M19 10l1.5 1.5L22 10"/></svg>';
  document.body.appendChild(fab);
  var t = document.createElement('div'); t.className = 'oi-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t);

  // ---- the app's hands-free code, unchanged ----
  try {
(function () {
  'use strict';
  var CFG = window.__HF_CFG || {};
  var MP = CFG.mp || '/vendor/mediapipe-1.2.2/', WASM = CFG.wasm || MP, MODEL = CFG.model || MP + 'face_landmarker.task';
  var SK = 'oi-hf', RK = 'oi-hf-run';
  var SENS = { gentle: { p: 6, y: 15, deg: true }, normal: { p: 9, y: 21, deg: true }, strong: { p: 13, y: 29, deg: true } };
  function perDeg(size) { return { p: 0.0025 + 0.0039 * size, y: 0.0025 + 0.00138 * size }; }
  var SPEEDS = [12, 18, 26, 36, 50, 68, 90, 120, 160, 220, 300];

  function makeDetector(o) {
    o = o || {};
    var pT = o.p || 0.05, yT = o.y || 0.12, cool = o.cool || 650, CAL = o.cal || 12, MAXOUT = o.maxOut || 1200, RETAKE = o.retake || 2000, retakes = 0;
    var base = null, cal = [], last = -1e9, sp = null, sy = null, lvl = 0, out = null, rest = null, sg = 1, corr = 0, checked = false;
    function feed(f) {
      if (!f) { out = null; return null; }
      var fp = f.p * sg, fy = f.y * sg;
      sp = sp == null ? fp : sp * 0.55 + fp * 0.45; sy = sy == null ? fy : sy * 0.55 + fy * 0.45;
      if (!base) {
        cal.push([sp, sy, f.size || 0.6, f.y, f.ly || 0]);
        if (cal.length >= CAL) {
          base = { p: med(cal, 0), y: med(cal, 1), deg: !!f.deg, ry: med(cal, 3), ly: med(cal, 4) };
          if (o.deg && f.deg) { pT = o.p; yT = o.y; }
          else if (o.deg) {
            var k = perDeg(med(cal, 2)), turned = Math.min(60, Math.abs(base.y / k.y)) * Math.PI / 180, c = Math.max(0.55, Math.cos(turned));
            pT = o.p * k.p * c; yT = o.y * k.y * c;
          }
        }
        return base ? 'ready' : null;
      }
      var dp = sp - base.p, dy = sy - base.y, np = Math.abs(dp) / pT, ny = Math.abs(dy) / yT; lvl = dp / pT;
      if (out) {
        var cur = out.axis === 'p' ? Math.abs(sp - out.r) / pT : Math.abs(sy - out.r) / yT;
        if (cur > out.pk) out.pk = cur;
        if ((out.axis === 'p' ? np : ny) >= 1) out.n++;
        if (f.t - out.t0 > MAXOUT) out.held = true;
        if (out.held) {
          if (out.st == null || Math.abs(sp - out.ap) > 0.5 * pT || Math.abs(sy - out.ay) > 0.5 * yT) { out.st = f.t; out.ap = sp; out.ay = sy; }
          else if (f.t - out.st > RETAKE) { base.p = sp; base.y = sy; out = null; rest = null; retakes++; return null; }
        }
        if (cur < 0.4 && (out.held || out.pk < 0.5 || out.n < 2)) { out = null; return null; }
        if (cur < 0.4) {
          var g = out.axis === 'p' ? (out.dir > 0 ? 'down' : 'up') : (out.dir < 0 ? 'right' : 'left');
          out = null; last = f.t; return g;
        }
        return null;
      }
      if (np < 1 && ny < 1) { rest = rest ? [rest[0] * 0.9 + sp * 0.1, rest[1] * 0.9 + sy * 0.1] : [sp, sy]; return null; }
      if (f.t - last < cool) return null;
      var r = rest || [base.p, base.y];
      out = ny > np ? { axis: 'y', dir: dy < 0 ? -1 : 1, t0: f.t, r: r[1], pk: 0, n: 1 } : { axis: 'p', dir: dp > 0 ? 1 : -1, t0: f.t, r: r[0], pk: 0, n: 1 };
      return null;
    }
    function med(a, k) { var v = a.map(function (x) { return x[k]; }).sort(function (x, y) { return x - y; }); return v[v.length >> 1]; }
    function recal() { base = null; cal = []; out = null; rest = null; sp = sy = null; }
    return { feed: feed, recal: recal, get flipped() { return sg < 0; }, get ready() { return !!base; }, get level() { return lvl; }, get held() { return !!(out && out.held); }, get retakes() { return retakes; } };
  }
  function avg(lm, ids) { var x = 0, y = 0; for (var i = 0; i < ids.length; i++) { var q = lm[ids[i]]; if (!q) return null; x += q.x; y += q.y; } return { x: x / ids.length, y: y / ids.length }; }
  function anglesOf(M) {
    var d = M && (M.data || M); if (!d || d.length < 16) return null;
    var fx = d[8], fy = d[9], fz = d[10], L = Math.hypot(fx, fy, fz); if (!(L > 0.5)) return null;
    fx /= L; fy /= L; fz /= L;
    return { p: -Math.asin(Math.max(-1, Math.min(1, fy))) * 180 / Math.PI, y: Math.atan2(fx, fz) * 180 / Math.PI };
  }
  function poseOf(lm, w, h, M) {
    w = w || 1; h = h || 1;
    var n = avg(lm, [1, 4, 5]), e = avg(lm, [168, 10]), top = lm[10], chin = lm[152]; if (!n || !e || !top || !chin) return null;
    var H = Math.hypot((chin.x - top.x) * w, (chin.y - top.y) * h); if (H < 0.06 * Math.min(w, h)) return null;
    var f = { p: (n.y - e.y) * h / H, y: (n.x - e.x) * w / H, size: H / h }, a = anglesOf(M);
    if (a) { f.ly = f.y; f.p = a.p; f.y = a.y; f.deg = true; }
    return f;
  }
  window.__HF = { makeDetector: makeDetector, poseOf: poseOf, anglesOf: anglesOf, perDeg: perDeg, SENS: SENS };

  var art = document.querySelector(CFG.article || 'article'); if (!art) return;
  var btn = document.querySelector(CFG.btn || '.hf'), bar = CFG.bar === null ? null : document.querySelector(CFG.bar || '.bar'), toastEl = document.querySelector(CFG.toast || '.toast');
  var S = { mode: 'nod', sens: 'normal', step: 0.7, turns: true, speed: 2, nextCh: true, tstep: 0.5, tzone: 'top', fpos: 'br', fop: '1', ndir: 'down', tmode: 'chapter' };
  try { var saved = JSON.parse(localStorage.getItem(SK) || 'null'); if (saved) { for (var k in saved) if (k in S) S[k] = saved[k]; if (saved.turns === false && !saved.tmode) S.tmode = 'off'; } } catch (e) {}
  function save() { try { localStorage.setItem(SK, JSON.stringify(S)); } catch (e) {} }
  function quiet() { return run === 'auto' || run === 'tap'; }
  var tt; function toast(m) { if (!toastEl || quiet()) return; toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove('on'); }, 2200); }
  function link(cls) { if (CFG.link) return CFG.link(cls); var a = document.querySelector('a.' + cls); return a && a.getAttribute('aria-disabled') !== 'true' ? a.href : null; }
  function offTop() { return (bar ? bar.offsetHeight : 0); }

  var sheet = document.createElement('section'); sheet.className = 'sheet hf-sheet'; sheet.hidden = true; sheet.setAttribute('aria-label', 'Hands-free reading');
  sheet.innerHTML =
    '<header><strong>Hands-free reading' + (CFG.ver ? ' <small style="font:500 12px/1 var(--sans);color:var(--muted)">v' + CFG.ver + '</small>' : '') + '</strong><button type="button" class="hf-close">Close</button></header><div class="hf-help" hidden></div>' +
    '<div class="hf-modes" role="radiogroup" aria-label="Mode">' +
    '<button type="button" role="radio" data-m="off"><b>Off</b><span>Scroll with your finger as usual</span></button>' +
    '<button type="button" role="radio" data-m="nod"><b>Nod to scroll</b><span>Uses the front camera. Nod or turn your head to move through the story. You choose which way does what</span></button>' +
    '<button type="button" role="radio" data-m="auto"><b>Auto-scroll</b><span>The page moves by itself. Tap the text to pause</span></button>' +
    '<button type="button" role="radio" data-m="tap"><b>Tap to scroll</b><span>Tap the text to move down, or back up. You choose where to tap</span></button></div>' +
    '<div class="hf-set" data-for="tap">' +
    '<div class="hf-row"><span>Each tap moves</span><div class="seg" data-k="tstep"><button type="button" data-v="0.25">A quarter page</button><button type="button" data-v="0.5">Half a page</button><button type="button" data-v="1">A full page</button></div></div>' +
    '<div class="hf-row"><span>Where to tap</span><div class="seg" data-k="tzone"><button type="button" data-v="top">Anywhere moves down</button><button type="button" data-v="sides">Left back, right down</button></div></div></div>' +
    '<div class="hf-set" data-for="nod">' +
    '<div class="hf-row"><span>Nod size</span><div class="seg" data-k="sens"><button type="button" data-v="gentle">Small</button><button type="button" data-v="normal">Medium</button><button type="button" data-v="strong">Big</button></div></div>' +
    '<div class="hf-row"><span>Each nod moves</span><div class="seg" data-k="step"><button type="button" data-v="0.45">Half a screen</button><button type="button" data-v="0.7">Most of it</button><button type="button" data-v="0.9">A full screen</button></div></div>' +
    '<div class="hf-row"><span>Nodding</span><div class="seg" data-k="ndir"><button type="button" data-v="down">Down reads on, up goes back</button><button type="button" data-v="up">Up reads on, down goes back</button><button type="button" data-v="chapter">Changes chapter</button><button type="button" data-v="off">Does nothing</button></div></div>' +
    '<div class="hf-row"><span>Turning your head</span><div class="seg" data-k="tmode"><button type="button" data-v="scroll">Right reads on, left goes back</button><button type="button" data-v="scrollr">Left reads on, right goes back</button><button type="button" data-v="chapter">Changes chapter</button><button type="button" data-v="off">Does nothing</button></div></div>' +
    '<p class="hf-note">The camera picture stays on this phone. Nothing is recorded or sent.</p></div>' +
    '<div class="hf-set" data-for="auto">' +
    '<div class="hf-row"><span>Speed</span><div class="spd"><button type="button" data-sp="-1" aria-label="Slower">−</button><output class="spd-v"></output><button type="button" data-sp="1" aria-label="Faster">+</button></div></div>' +
    '<label class="hf-row hf-chk"><span>Go on to the next chapter at the end</span><input type="checkbox" data-k="nextCh"></label></div>' +
    (CFG.btn ? '<div class="hf-btnset">' +
    '<div class="hf-row"><span>Button place</span><div class="seg" data-k="fpos"><button type="button" data-v="tl">Top left</button><button type="button" data-v="tr">Top right</button><button type="button" data-v="ml">Middle left</button><button type="button" data-v="mr">Middle right</button><button type="button" data-v="bl">Bottom left</button><button type="button" data-v="br">Bottom right</button></div></div>' +
    '<div class="hf-row"><span>Button look</span><div class="seg" data-k="fop"><button type="button" data-v="1">Solid</button><button type="button" data-v="0.5">See-through</button><button type="button" data-v="0.2">Faint</button></div></div></div>' : '');
  document.body.appendChild(sheet);
  function placeBtn() {
    if (!CFG.btn || !btn) return;
    var p = S.fpos || 'br', s = btn.style, mid = p.charAt(0) === 'm';
    s.top = p.charAt(0) === 't' ? '12px' : mid ? '50%' : 'auto';
    s.bottom = p.charAt(0) === 'b' ? '74px' : 'auto';
    s.left = p.charAt(1) === 'l' ? '12px' : 'auto'; s.right = p.charAt(1) === 'r' ? '12px' : 'auto';
    s.transform = mid ? 'translateY(-50%)' : '';
    s.opacity = String(+S.fop || 1);
  }
  var pill = document.createElement('div'); pill.className = 'hf-pill'; pill.hidden = true; pill.setAttribute('role', 'status');
  pill.innerHTML = '<span class="hf-cam" hidden><span class="hf-vid"></span><i class="hf-meter" aria-hidden="true"><b></b></i></span><i class="dot"></i><span class="hf-msg"></span><button type="button" class="hf-reset" aria-label="Take my starting position again">Reset</button><button type="button" class="hf-pause">Pause</button><button type="button" class="hf-stop" aria-label="Turn hands-free off">Off</button>';
  document.body.appendChild(pill);
  var msg = pill.querySelector('.hf-msg'), dot = pill.querySelector('.dot'), pauseB = pill.querySelector('.hf-pause'), help = sheet.querySelector('.hf-help');

  var run = null, paused = false;
  function paint() {
    var cur = run || 'off';
    [].forEach.call(sheet.querySelectorAll('[data-m]'), function (b) { b.setAttribute('aria-checked', String(b.dataset.m === cur)); });
    [].forEach.call(sheet.querySelectorAll('.hf-set'), function (d) { d.hidden = d.dataset.for !== (run || S.mode); });
    [].forEach.call(sheet.querySelectorAll('.seg'), function (g) { [].forEach.call(g.children, function (b) { b.setAttribute('aria-pressed', String(String(S[g.dataset.k]) === b.dataset.v)); }); });
    [].forEach.call(sheet.querySelectorAll('input[data-k]'), function (c) { c.checked = !!S[c.dataset.k]; });
    sheet.querySelector('.spd-v').textContent = (S.speed + 1) + ' of ' + SPEEDS.length;
    if (btn) { btn.classList.toggle('on', !!run); btn.setAttribute('aria-pressed', String(!!run)); placeBtn(); }
    pill.hidden = !run || quiet(); document.body.classList.toggle('hf-on', !!run && !quiet()); pauseB.textContent = paused ? 'Resume' : 'Pause';
    pill.classList.toggle('auto', run === 'auto'); pill.querySelector('.hf-reset').hidden = run !== 'nod' || paused; pauseB.hidden = run === 'tap';
  }
  function status(t, ok) { msg.textContent = t; dot.className = 'dot' + (ok === true ? ' ok' : ok === false ? ' bad' : ''); }

  var lock = null;
  function wake(on) {
    if (on && !lock && navigator.wakeLock && !document.hidden) navigator.wakeLock.request('screen').then(function (l) { lock = l; l.addEventListener('release', function () { lock = null; }); }).catch(function () {});
    if (!on && lock) { lock.release().catch(function () {}); lock = null; }
  }

  var raf = 0, lt = 0, carry = 0, hold = 0, endT = 0, pos = null, set = -1;
  function autoTick(t) {
    raf = requestAnimationFrame(autoTick);
    var dt = lt ? Math.min(100, t - lt) : 0; lt = t;
    if (paused || Date.now() < hold) return;
    if (pos == null || Math.abs(scrollY - set) > 3) pos = scrollY;
    pos += SPEEDS[Math.min(S.speed, SPEEDS.length - 1)] * dt / 1000;
    var max = document.documentElement.scrollHeight - innerHeight;
    if (scrollY >= max - 2) { atEnd(); return; }
    var dpr = window.devicePixelRatio || 1, to = Math.min(max, Math.floor(pos * dpr) / dpr); if (to === set) return;
    var root = document.scrollingElement || document.documentElement, was = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto'; window.scrollTo(0, to); root.style.scrollBehavior = was; set = to;
  }
  function atEnd() {
    var nx = link('next');
    if (S.nextCh && nx) { if (!endT) { status('Next chapter in 3 s', true); endT = setTimeout(function () { location.href = nx; }, 3000); } return; }
    status('End of chapter', true); paused = true; paint();
  }
  function startAuto() { stopAll(true); run = 'auto'; paused = false; lt = 0; carry = 0; pos = null; set = -1; raf = requestAnimationFrame(autoTick); status('Auto-scroll', true); wake(true); }

  function tapMsg() { return S.tzone === 'sides' ? 'Tap to scroll · left goes back, right goes down' : 'Tap to scroll · top of the screen goes back'; }
  function startTap() { stopAll(true); run = 'tap'; paused = false; status(tapMsg(), true); wake(true); }

  var video = null, stream = null, lm = null, det = null, loopT = 0, lastFace = 0, loading = false, errs = 0, lastFit = '', wasHeld = false;
  function startNod() {
    stopAll(true); run = 'nod'; paused = false; paint(); status('Starting camera…'); wake(true);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { fail('nocam'); return; }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 15, max: 30 } }, audio: false })
      .then(function (s) {
        if (run !== 'nod') { s.getTracks().forEach(function (x) { x.stop(); }); return; }
        stream = s; if (!video) { video = document.createElement('video'); video.muted = true; video.playsInline = true; video.autoplay = true; video.setAttribute('playsinline', ''); video.setAttribute('muted', ''); pill.querySelector('.hf-vid').appendChild(video); }
        pill.querySelector('.hf-cam').hidden = false;
        video.srcObject = s; return video.play().then(loadModel);
      })
      .catch(function (e) { fail(e && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'blocked' : e && e.name === 'NotFoundError' ? 'nocam' : 'error', e); });
  }
  function loadModel() {
    if (lm) return go();
    if (loading) return; loading = true; status('Loading face tracking…');
    return import(MP + 'vision_bundle.mjs').then(function (V) {
      var files = { wasmLoaderPath: WASM + 'vision_wasm_internal.js', wasmBinaryPath: WASM + 'vision_wasm_internal.wasm' };
      var mk = function (dg) { return V.FaceLandmarker.createFromOptions(files, { baseOptions: { modelAssetPath: MODEL, delegate: dg }, runningMode: 'VIDEO', numFaces: 1, outputFacialTransformationMatrixes: true, minFaceDetectionConfidence: 0.25, minFacePresenceConfidence: 0.2, minTrackingConfidence: 0.2 }); };
      return mk('CPU').catch(function () { return mk('GPU'); });
    }).then(function (x) { lm = x; loading = false; if (run === 'nod') go(); })
      .catch(function (e) { loading = false; fail('error', e); });
  }
  function go() {
    det = makeDetector(SENS[S.sens] || SENS.normal); lastFace = performance.now();
    status('Hold your reading position…'); clearTimeout(loopT); tick();
  }
  function tick() {
    if (run !== 'nod' || !lm || !video) return;
    loopT = setTimeout(tick, 66);
    if (paused || video.readyState < 2) return;
    var now = performance.now(), r;
    try { r = lm.detectForVideo(video, now); errs = 0; } catch (e) { if (++errs === 15) status('Face tracking error: ' + String(e && e.message || e).slice(0, 60), false); return; }
    var f = r && r.faceLandmarks && r.faceLandmarks[0] ? poseOf(r.faceLandmarks[0], video.videoWidth, video.videoHeight, r.facialTransformationMatrixes && r.facialTransformationMatrixes[0]) : null;
    if (!f) { if (now - lastFace > 1500) status('Can’t see your face · fit it all in the preview', false); return; }
    var was = now - lastFace > 1500; lastFace = now; f.t = now;
    var g = det.feed(f); meter(det.ready ? det.level : 0);
    var fit = f.size > 0.92 ? 'close' : f.size < 0.16 ? 'far' : '';
    if (det.held !== wasHeld) { wasHeld = det.held; status(wasHeld ? 'Back to your start · or tap Reset' : 'Nod to scroll', !wasHeld); }
    else if (fit !== lastFit && det.ready) { lastFit = fit; status(fit === 'close' ? 'Too close · hold the phone a bit farther' : fit === 'far' ? 'Far away · bring the phone a bit closer' : 'Nod to scroll', !fit); }
    else if (g === 'ready' || (was && det.ready)) status('Nod to scroll', true);
    if (g && g !== 'ready') { pill.classList.add('hit'); setTimeout(function () { pill.classList.remove('hit'); }, 350); }
    act(g);
  }
  function act(g) {
    var fwd = g === 'down' || g === 'right', m = g === 'down' || g === 'up' ? S.ndir : g === 'left' || g === 'right' ? S.tmode : null;
    if (m === 'down' || m === 'scroll') page(fwd ? 1 : -1);
    else if (m === 'up' || m === 'scrollr') page(fwd ? -1 : 1);
    else if (m === 'chapter') chapter(fwd ? 'next' : 'prev');
  }
  window.__HF.act = act;
  function meter(v) { var b = pill.querySelector('.hf-meter b'); if (b) b.style.transform = 'translateY(' + (Math.max(-1.3, Math.min(1.3, v)) * 13) + 'px)'; }
  function page(dir, step) {
    var h = innerHeight - offTop(), k = step || +S.step || 0.7;
    window.scrollBy({ top: dir * Math.max(40, Math.round(k >= 1 ? h - 48 : h * k)), behavior: 'smooth' });
    status(dir > 0 ? 'Down' : 'Up', true);
    setTimeout(function () { if (run === 'nod' && !paused) status('Nod to scroll', true); else if (run === 'tap') status(tapMsg(), true); }, 900);
  }
  function chapter(which) {
    var u = link(which); if (!u) { toast(which === 'next' ? 'This is the last chapter' : 'This is the first chapter'); return; }
    status(which === 'next' ? 'Next chapter…' : 'Previous chapter…', true); location.href = u;
  }
  function fail(kind, e) {
    stopAll(false); paint(); sheet.hidden = false; sheet.scrollTop = 0;
    help.hidden = false;
    help.innerHTML = kind === 'blocked'
      ? '<strong>The camera is blocked for this app</strong><p>Nod to scroll needs the front camera. To allow it again:</p><ul>' +
        '<li><b>iPhone (Safari):</b> tap <b>aA</b> in the address bar → Website Settings → Camera → Allow. Or Settings → Apps → Safari → Camera → Allow.</li>' +
        '<li><b>Android (Chrome):</b> tap the icon left of the address → Permissions → Camera → Allow.</li>' +
        '<li><b>Computer (Chrome or Edge):</b> click the icon left of the address → Camera → Allow, then reload.</li></ul>' +
        '<p>Then choose Nod to scroll again. Auto-scroll works without the camera.</p>'
      : kind === 'nocam' ? '<strong>No front camera found</strong><p>This device has no camera the app can use. Auto-scroll works without one.</p>'
      : '<strong>Face tracking could not start</strong><p>Try again, or use Auto-scroll.' + (e && e.message ? ' (' + String(e.message).replace(/[<>&]/g, '').slice(0, 120) + ')' : '') + '</p>';
    try { sessionStorage.removeItem(RK); } catch (x) {}
  }

  function stopAll(keep) {
    cancelAnimationFrame(raf); raf = 0; clearTimeout(endT); endT = 0; clearTimeout(loopT); loopT = 0;
    if (stream) { stream.getTracks().forEach(function (x) { x.stop(); }); stream = null; }
    if (video) { video.srcObject = null; pill.querySelector('.hf-cam').hidden = true; }
    if (!keep) { run = null; paused = false; wake(false); }
  }
  function choose(m) {
    help.hidden = true;
    if (m === 'off') { stopAll(false); try { sessionStorage.removeItem(RK); } catch (x) {} paint(); return; }
    S.mode = m; save(); try { sessionStorage.setItem(RK, m); } catch (x) {}
    if (m === 'nod') startNod(); else if (m === 'tap') startTap(); else startAuto();
    paint(); sheet.hidden = true;
  }
  function setPaused(p) {
    if (!run) return; paused = p; lt = 0; paint();
    if (run === 'nod') { if (p) { stopAll(true); status('Paused'); } else startNod(); }
    else status(p ? 'Paused · tap the text to go on' : 'Auto-scroll', !p ? true : undefined);
  }

  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (t.closest(CFG.btn || '.hf')) { sheet.hidden = !sheet.hidden; if (!sheet.hidden && !CFG.btn) { var bm = document.querySelector('.sheet:not(.hf-sheet)'); if (bm) bm.hidden = true; } paint(); return; }
    if (t.closest('.hf-close')) { sheet.hidden = true; return; }
    var m = t.closest('.hf-sheet [data-m]'); if (m) { choose(m.dataset.m); return; }
    var sb = t.closest('.hf-sheet .seg button'); if (sb) { var k = sb.parentNode.dataset.k; S[k] = k === 'step' || k === 'tstep' ? +sb.dataset.v : sb.dataset.v; save(); if (k === 'sens' && run === 'nod' && lm) det = makeDetector(SENS[S.sens]); if (k === 'tzone' && run === 'tap') status(tapMsg(), true); paint(); return; }
    var sp = t.closest('[data-sp]'); if (sp) { S.speed = Math.max(0, Math.min(SPEEDS.length - 1, S.speed + (+sp.dataset.sp))); save(); paint(); return; }
    if (t.closest('.hf-reset')) { if (det) { det.recal(); wasHeld = false; lastFit = ''; status('Hold your reading position…'); toast('Taking your starting position'); } return; }
    if (t.closest('.hf-pause')) { setPaused(!paused); return; }
    if (t.closest('.hf-stop')) { choose('off'); toast('Hands-free off'); return; }
    if (run === 'auto' && art.contains(t)) { setPaused(!paused); }
    if (run === 'tap' && art.contains(t) && !t.closest('a, button, input, select, textarea, label, summary, [contenteditable], .hf-pill, .hf-sheet') && !(getSelection && String(getSelection()).length)) {
      page((S.tzone === 'sides' ? ev.clientX < innerWidth / 2 : ev.clientY < innerHeight * 0.25) ? -1 : 1, +S.tstep || 0.5);
    }
  });
  document.addEventListener('change', function (ev) { var c = ev.target; if (c.matches && c.matches('.hf-sheet input[data-k]')) { S[c.dataset.k] = c.checked; save(); } });
  ['touchstart', 'wheel'].forEach(function (n) { window.addEventListener(n, function () { if (run === 'auto') hold = Date.now() + 1500; }, { passive: true }); });
  window.addEventListener('touchend', function () { if (run === 'auto') hold = Date.now() + 1200; }, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (!run) return;
    if (document.hidden) { if (run === 'nod') stopAll(true); wake(false); }
    else { wake(true); if (run === 'nod' && !paused) startNod(); }
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') sheet.hidden = true; });
  paint();
  var again = null; try { again = sessionStorage.getItem(RK); } catch (x) {}
  if (again === 'auto') startAuto();
  else if (again === 'tap') startTap();
  else if (again === 'nod') {
    if (navigator.permissions && navigator.permissions.query) navigator.permissions.query({ name: 'camera' }).then(function (p) { if (p.state === 'granted') startNod(); else { try { sessionStorage.removeItem(RK); } catch (x) {} } }, function () { startNod(); });
    else startNod();
  }
  paint();
})();

  } catch (e) {   // 1.2.1: the button is already on the page; tapping it says what broke instead of doing nothing
    fab.style.borderColor = '#9E1F45';
    fab.addEventListener('click', function () { note('Hands-free v' + VER + ' stopped: ' + (e && e.message || e)); });
  }
})();
