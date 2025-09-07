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

  // Only log out when explicitly requested via ?logout or #logout
  try {
    const url = new URL(window.location.href);
    const hasReset = url.searchParams.has('reset') || window.location.hash === '#reset';
    const shouldLogout = url.searchParams.has('logout') || window.location.hash === '#logout';
    if (hasReset) {
      try { window.localStorage.clear(); } catch {}
      try { window.sessionStorage.clear(); } catch {}
      try { swal('Storage Cleared', 'Local and session data removed for this origin.', 'success'); } catch {}
      setTimeout(function(){ window.location.replace('login.html'); }, 500);
      return;
    }
    if (shouldLogout) {
      try { window.localStorage.removeItem('currentUser'); } catch {}
      try { window.sessionStorage.removeItem('currentUser'); } catch {}
    } else {
      // If already logged in and not explicitly logging out, go to home
      const store = window.StorageUtil;
      const current = store?.getJSON?.('currentUser', null);
      if (current && (current.email || current.username || current.id)) {
        window.location.replace('home.html');
        return;
      }
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
      // Be resilient if StorageUtil is unavailable or data is malformed
      let users = store?.getJSON?.('users', null);
      if (!Array.isArray(users)) {
        try {
          const raw = window.localStorage.getItem('users') || window.sessionStorage.getItem('users') || '[]';
          users = JSON.parse(raw);
        } catch { users = []; }
      }
      users = Array.isArray(users) ? users : [];

      // Flexible identifier matching: try both email and username regardless of '@'
      const ident = identifier.toLowerCase();
      let user = null;
      if (identifier.includes('@')) {
        user = users.find((u) => (u.email || '').toLowerCase() === ident) ||
               users.find((u) => (u.username || '').toLowerCase() === ident);
      } else {
        user = users.find((u) => (u.username || '').toLowerCase() === ident) ||
               users.find((u) => (u.email || '').toLowerCase() === ident);
      }
      // Password comparison with gentle whitespace tolerance
      const storedPw = String(user?.password ?? '');
      const ok = !!user && (storedPw === password || storedPw.trim() === password.trim());
      if (!ok) {
        setBusy(false);
        swal('Invalid credentials', 'Email/username or password is incorrect.', 'error');
        return;
      }
      const cu = { id: user.id, username: user.username, email: user.email };
      store?.setJSON?.('currentUser', cu);
      try { window.sessionStorage.setItem('currentUser', JSON.stringify(cu)); } catch {}
      swal('Login Successful!', 'Welcome back to MaxAI!', 'success');
      setTimeout(function () { window.location.href = 'home.html'; }, 1000);
    } catch (e) {
      console.error(e);
      setBusy(false);
      swal('Error', 'Could not log in. Please try again.', 'error');
    }
  });
})();
