(function () {
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;
  var accepted = false;
  try { accepted = localStorage.getItem('cookies_accepted') === 'true'; } catch (e) {}
  if (accepted) return;

  // Pokaż z lekkim opóźnieniem, żeby nie konkurował z ładowaniem strony
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
