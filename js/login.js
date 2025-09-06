// Password visibility toggles
(function () {
  function setupToggle(btn) {
    const targetId = btn.getAttribute('data-target');
    const input = targetId ? document.getElementById(targetId) : btn?.previousElementSibling;
    if (!input) return;
    btn.addEventListener('click', function () {
      const showing = input.getAttribute('type') === 'text';
      input.setAttribute('type', showing ? 'password' : 'text');
      btn.setAttribute('aria-pressed', String(!showing));
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye', showing);
        icon.classList.toggle('fa-eye-slash', !showing);
      }
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  }
  document.querySelectorAll('.toggle-password').forEach(setupToggle);
})();

// Login form handling using localStorage
(function () {
  const form = document.getElementById('loginForm');
  const btn = document.getElementById('loginBtn');
  const idEl = document.getElementById('login-id');
  const passEl = document.getElementById('login-password');

  function setBusy(state) {
    if (!btn) return;
    btn.disabled = !!state;
    btn.innerHTML = state
      ? '<i class="fas fa-spinner fa-spin"></i> Logging In...'
      : '<i class="fas fa-sign-in-alt"></i> Login';
  }

  // Treat visiting this page as logout by default
  try {
    const url = new URL(window.location.href);
    const shouldLogout = url.searchParams.has('logout') || window.location.hash === '#logout' || true;
    if (shouldLogout) {
      try { window.localStorage.removeItem('currentUser'); } catch {}
    }
  } catch {}

  form?.addEventListener('submit', function (event) {
    event.preventDefault();
    const identifier = idEl?.value.trim() || '';
    const password = passEl?.value || '';
    if (!identifier || !password) {
      swal('Missing info', 'Please enter email/username and password.', 'warning');
      return;
    }
    setBusy(true);
    try {
      const store = window.StorageUtil;
      const users = store.getJSON('users', []);
      let user = null;
      if (identifier.includes('@')) {
        const email = identifier.toLowerCase();
        user = users.find((u) => (u.email || '').toLowerCase() === email);
      } else {
        const uname = identifier.toLowerCase();
        user = users.find((u) => (u.username || '').toLowerCase() === uname);
      }
      if (!user || user.password !== password) {
        setBusy(false);
        swal('Invalid credentials', 'Email/username or password is incorrect.', 'error');
        return;
      }
      store.setJSON('currentUser', { id: user.id, username: user.username, email: user.email });
      swal('Login Successful!', 'Welcome back to MaxAI!', 'success');
      setTimeout(function () { window.location.href = 'home.html'; }, 1000);
    } catch (e) {
      console.error(e);
      setBusy(false);
      swal('Error', 'Could not log in. Please try again.', 'error');
    }
  });
})();

