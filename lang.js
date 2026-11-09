(function () {
  var root = document.documentElement;
  var lang = 'en';
  try {
    var saved = localStorage.getItem('lang');
    if (saved === 'de' || saved === 'en') lang = saved;
  } catch (e) {}
  root.lang = lang;

  // Every page opens at the top, also when the browser tries to restore an old scroll position
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  function toTop() { window.scrollTo(0, 0); }
  window.addEventListener('load', toTop);
  window.addEventListener('pageshow', toTop);

  function applyTitle() {
    var t = document.querySelector('title');
    if (t && t.getAttribute('data-' + lang)) t.textContent = t.getAttribute('data-' + lang);
  }

  function tick() {
    var el = document.getElementById('now');
    if (!el) return;
    el.textContent = new Date().toLocaleString(lang === 'de' ? 'de-CH' : 'en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }

  function updateButtons(box) {
    box.setAttribute('aria-label', lang === 'de' ? 'Sprache wechseln' : 'Switch language');
    var opts = box.querySelectorAll('.lang-opt');
    for (var i = 0; i < opts.length; i++) {
      var on = opts[i].getAttribute('data-l') === lang;
      opts[i].classList.toggle('active', on);
      opts[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function setLang(l, box) {
    lang = l;
    root.lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    applyTitle();
    updateButtons(box);
    tick();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var box = document.createElement('div');
    box.className = 'lang-toggle';
    box.setAttribute('role', 'group');
    box.innerHTML =
      '<button type="button" class="lang-opt" data-l="en">EN</button>' +
      '<span class="sep">|</span>' +
      '<button type="button" class="lang-opt" data-l="de">DE</button>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.lang-opt') : null;
      if (b) setLang(b.getAttribute('data-l'), box);
    });
    var header = document.querySelector('.page-buttons');
    if (header) {
      box.classList.add('in-header');
      header.insertBefore(box, header.firstChild);
    } else {
      document.body.appendChild(box);
    }
    updateButtons(box);
    applyTitle();
    tick();
    setInterval(tick, 1000);
  });
})();
