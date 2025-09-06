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
  const hint = document.getElementById('reg-password-hint');

  function setBusy(state, textBusy, textIdle) {
    if (!btn) return;
    btn.disabled = !!state;
    btn.innerHTML = state ? `<i class="fas fa-spinner fa-spin"></i> ${textBusy}` : `<i class="fas fa-rocket"></i> ${textIdle}`;
  }

  function checkStrength(pw) {
    const res = { len: pw.length >= 8, upper: /[A-Z]/.test(pw), lower: /[a-z]/.test(pw), number: /[0-9]/.test(pw), symbol: /[^A-Za-z0-9]/.test(pw) };
    res.all = res.len && res.upper && res.lower && res.number && res.symbol; return res;
  }

  function updateHint(pw) {
    if (!hint) return; const res = checkStrength(pw);
    hint.querySelectorAll('li').forEach(function (li) {
      const key = li.getAttribute('data-req'); const ok = !!res[key];
      li.classList.toggle('ok', ok);
      const icon = li.querySelector('i'); if (icon) { icon.className = ok ? 'fas fa-check-circle' : 'fas fa-circle'; }
    });
  }

  passEl?.addEventListener('input', function () { updateHint(passEl.value || ''); });

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
    if (!username || !email || !password || !confirm) { swal('Missing info', 'Please fill in all fields.', 'warning'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { swal('Invalid email', 'Please enter a valid email address.', 'error'); return; }
    const strength = checkStrength(password);
    if (!strength.all) { swal('Weak password', 'Use at least 8 characters with uppercase, lowercase, number, and symbol.', 'error'); updateHint(password); return; }
    if (password !== confirm) { swal('Password mismatch', 'Passwords do not match.', 'error'); return; }

    setBusy(true, 'Creating Account...', 'Get Started');
    try {
      const store = window.StorageUtil; const users = store.getJSON('users', []);
      const existsEmail = users.some((u) => (u.email || '').toLowerCase() === email);
      const existsUsername = users.some((u) => (u.username || '').toLowerCase() === (username || '').toLowerCase());
      if (existsEmail || existsUsername) {
        setBusy(false, '', 'Get Started');
        if (existsEmail && existsUsername) swal('Already in use', 'Both the email and username are already registered.', 'error');
        else if (existsEmail) swal('Email in use', 'An account with this email already exists.', 'error');
        else swal('Username in use', 'Please choose a different username.', 'error');
        return;
      }
      const user = { id: Date.now(), username, email, password, createdAt: new Date().toISOString() };
      users.push(user);
      store.setJSON('users', users);
      store.setJSON('currentUser', { id: user.id, username, email });
      swal('Registration Successful!', 'Welcome to MaxAI! Your account has been created.', 'success');
      setTimeout(function () { window.location.href = 'home.html'; }, 1200);
    } catch (e) {
      console.error(e); setBusy(false, '', 'Get Started');
      swal('Error', 'Could not create account. Please try again.', 'error');
    }
  });
})();

