// Normalize lesson icons on inner module pages to avoid unintended locks
// If a lesson isn't explicitly marked completed (fa-circle-check), show it as unlocked.
(function () {
  function normalize() {
    document.querySelectorAll('.lesson-item').forEach((item) => {
      item.classList.remove('locked');
      const icon = item.querySelector('.lesson-status i');
      if (!icon) return;
      // Keep completed state if already checked
      if (icon.classList.contains('fa-circle-check')) return;
      icon.classList.remove('fa-lock', 'fa-circle');
      icon.classList.add('fa-lock-open');
      icon.style.color = '';
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normalize);
  } else {
    normalize();
  }
})();

