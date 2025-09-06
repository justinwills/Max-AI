// Common navigation helpers: profile dropdown + mobile menu toggle
(function () {
  // Profile dropdown toggle (click + outside close)
  (function () {
    const menu = document.querySelector('.profile-menu');
    if (!menu) return;
    const btn = menu.querySelector('.profile-btn');
    btn?.setAttribute('aria-expanded', 'false');
    btn?.addEventListener('click', function (e) {
      e.preventDefault();
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target)) {
        menu.classList.remove('open');
        btn?.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  // Mobile nav toggle
  (function () {
    const btn = document.querySelector('.mobile-menu-btn');
    if (!btn) return;
    // Primary layout (most pages)
    const links = document.querySelector('.nav-links');
    // Inner module layout alternate (nav .navigation ul)
    const alt = document.querySelector('nav .navigation ul');
    btn.addEventListener('click', function () {
      if (links) links.classList.toggle('active');
      if (alt) alt.classList.toggle('active');
    });
  })();
})();
