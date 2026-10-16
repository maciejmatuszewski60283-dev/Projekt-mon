(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Wskaźnik postępu przewijania w nagłówku */
  var header = document.querySelector('.site-header');
  if (header) {
    var ticking = false;
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      header.style.setProperty('--p', p.toFixed(3));
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* Kafelki pojawiają się po kolei przy przewijaniu */
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll(
      '.section h2, .section .measure, .topic, .panel, .date, .cta-band, .page-body > .wrap > h2, .site-footer .wrap'
    );
    var first = true;
    var io = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) {
          var A = a.boundingClientRect, B = b.boundingClientRect;
          return A.top - B.top || A.left - B.left;
        });
      visible.forEach(function (e, i) {
        var el = e.target;
        el.style.setProperty('--d', ((first ? .15 : 0) + Math.min(i, 6) * .11).toFixed(2) + 's');
        el.classList.add('is-in');
        io.unobserve(el);
        el.addEventListener('transitionend', function done(ev) {
          if (ev.propertyName !== 'transform') return;
          el.classList.remove('reveal', 'is-in');
          el.style.removeProperty('--d');
          el.removeEventListener('transitionend', done);
        });
      });
      if (visible.length) first = false;
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  /* Wybór numeru telefonu: zamykanie po kliknięciu obok i klawiszem Esc */
  var calls = document.querySelectorAll('details.call');
  if (calls.length) {
    document.addEventListener('click', function (e) {
      calls.forEach(function (d) { if (d.open && !d.contains(e.target)) d.open = false; });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') calls.forEach(function (d) { d.open = false; });
    });
    calls.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) calls.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  /* Baner cookies */
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;
  var accepted = false;
  try { accepted = localStorage.getItem('cookies_accepted') === 'true'; } catch (e) {}
  if (accepted) return;
  setTimeout(function () {
    banner.hidden = false;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { banner.classList.add('is-visible'); });
    });
  }, 800);
  banner.querySelector('button').addEventListener('click', function () {
    try { localStorage.setItem('cookies_accepted', 'true'); } catch (e) {}
    banner.classList.remove('is-visible');
    setTimeout(function () { banner.hidden = true; }, 500);
  });
})();
