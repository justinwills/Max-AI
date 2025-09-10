// Common toggles for password fields
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

// Registration form handling using localStorage
(function () {
  const form = document.getElementById('registerForm');
  const btn = document.getElementById('registerBtn');
  const usernameEl = document.getElementById('reg-username');
  const emailEl = document.getElementById('reg-email');
  const passEl = document.getElementById('reg-password');
  const confirmEl = document.getElementById('reg-confirm');
  // password hint removed from UI

  function setBusy(state, textBusy, textIdle) {
    if (!btn) return;
    btn.disabled = !!state;
    btn.innerHTML = state ? `<i class="fas fa-spinner fa-spin"></i> ${textBusy}` : `<i class="fas fa-rocket"></i> ${textIdle}`;
  }

  // remove password strength checker and hint updates

  // Redirect if already logged in
  try {
    const current = (window.StorageUtil || {}).getJSON?.('currentUser', null);
    if (current && current.email) { window.location.href = 'home.html'; }
  } catch {}

  form?.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = usernameEl?.value.trim() || '';
    const email = emailEl?.value.trim().toLowerCase() || '';
    const password = passEl?.value || '';
    const confirm = confirmEl?.value || '';
    if (!username || !email || !password || !confirm) { Swal.fire({ title: 'Missing info', text: 'Please fill in all fields.', icon: 'warning' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { Swal.fire({ title: 'Invalid email', text: 'Please enter a valid email address.', icon: 'error' }); return; }
    // Password strength restriction removed; allow any password
    if (password !== confirm) { Swal.fire({ title: 'Password mismatch', text: 'Passwords do not match.', icon: 'error' }); return; }

    setBusy(true, 'Creating Account...', 'Get Started');
    try {
      const store = window.StorageUtil; const users = store.getJSON('users', []);
      const existsEmail = users.some((u) => (u.email || '').toLowerCase() === email);
      const existsUsername = users.some((u) => (u.username || '').toLowerCase() === (username || '').toLowerCase());
      if (existsEmail || existsUsername) {
        setBusy(false, '', 'Get Started');
        if (existsEmail && existsUsername) Swal.fire({ title: 'Already in use', text: 'Both the email and username are already registered.', icon: 'error' });
        else if (existsEmail) Swal.fire({ title: 'Email in use', text: 'An account with this email already exists.', icon: 'error' });
        else Swal.fire({ title: 'Username in use', text: 'Please choose a different username.', icon: 'error' });
        return;
      }
      const user = { id: Date.now(), username, email, password, createdAt: new Date().toISOString() };
      users.push(user);
      store.setJSON('users', users);
      try { window.sessionStorage.setItem('users', JSON.stringify(users)); } catch {}
      const cu = { id: user.id, username, email };
      store.setJSON('currentUser', cu);
      try { window.sessionStorage.setItem('currentUser', JSON.stringify(cu)); } catch {}
      Swal.fire({ title: 'Registration Successful!', text: 'Welcome to MaxAI! Let’s personalize your learning.', icon: 'success' });
      setTimeout(function () { window.location.href = 'onboarding.html'; }, 800);
    } catch (e) {
      console.error(e); setBusy(false, '', 'Get Started');
      Swal.fire({ title: 'Error', text: 'Could not create account. Please try again.', icon: 'error' });
    }
  });
})();
