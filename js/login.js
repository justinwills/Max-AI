// Password visibility toggles
// SweetAlert compatibility (supports SweetAlert2 or falls back to alert)
try {
  if (typeof window !== 'undefined' && !window.swal && window.Swal && window.Swal.fire) {
    window.swal = function (title, text, icon) { return window.Swal.fire({ title, text, icon }); };
  }
} catch {}

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
      try { Swal.fire({ title: 'Storage Cleared', text: 'Local and session data removed for this origin.', icon: 'success' }); } catch {}
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
      Swal.fire({ title: 'Missing info', text: 'Please enter email/username and password.', icon: 'warning' });
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
        Swal.fire({ title: 'Invalid credentials', text: 'Email/username or password is incorrect.', icon: 'error' });
        return;
      }
      const cu = { id: user.id, username: user.username, email: user.email };
      store?.setJSON?.('currentUser', cu);
      try { window.sessionStorage.setItem('currentUser', JSON.stringify(cu)); } catch {}
      Swal.fire({ title: 'Login Successful!', text: 'Welcome back to MaxAI!', icon: 'success' });
      setTimeout(function () { window.location.href = 'home.html'; }, 1000);
    } catch (e) {
      console.error(e);
      setBusy(false);
      Swal.fire({ title: 'Error', text: 'Could not log in. Please try again.', icon: 'error' });
    }
  });
})();
