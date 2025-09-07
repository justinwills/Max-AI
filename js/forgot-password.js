// Password toggles
(function () {
  function setupToggle(btn) {
    const id = btn.getAttribute('data-target');
    const input = id ? document.getElementById(id) : btn?.previousElementSibling;
    if (!input) return;
    btn.addEventListener('click', function () {
      const showing = input.getAttribute('type') === 'text';
      input.setAttribute('type', showing ? 'password' : 'text');
      btn.setAttribute('aria-pressed', String(!showing));
      const icon = btn.querySelector('i');
      if (icon) { icon.classList.toggle('fa-eye', showing); icon.classList.toggle('fa-eye-slash', !showing); }
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  }
  document.querySelectorAll('.toggle-password').forEach(setupToggle);
})();

// Hint live update and submit handling
(function () {
  const form = document.getElementById('forgotForm');
  const btn = document.getElementById('forgotBtn');
  const emailEl = document.getElementById('fp-email');
  const currentEl = document.getElementById('fp-current');
  const passEl = document.getElementById('fp-password');
  const confirmEl = document.getElementById('fp-confirm');
  const hint = document.getElementById('fp-password-hint');

  function setBusy(state) {
    if (!btn) return;
    btn.disabled = !!state;
    btn.innerHTML = state ? '<i class="fas fa-spinner fa-spin"></i> Resetting...' : '<i class="fas fa-unlock"></i> Reset Password';
  }
  function checkStrength(pw) {
    const r = { len: pw.length >= 8, upper: /[A-Z]/.test(pw), lower: /[a-z]/.test(pw), number: /[0-9]/.test(pw), symbol: /[^A-Za-z0-9]/.test(pw) };
    r.all = r.len && r.upper && r.lower && r.number && r.symbol; return r;
  }
  function updateHint(pw) {
    if (!hint) return; const res = checkStrength(pw);
    hint.querySelectorAll('li').forEach((li) => {
      const key = li.getAttribute('data-req'); const ok = !!res[key];
      li.classList.toggle('ok', ok);
      const icon = li.querySelector('i'); if (icon) icon.className = ok ? 'fas fa-check-circle' : 'fas fa-circle';
    });
  }
  passEl?.addEventListener('input', function(){ updateHint(passEl.value || ''); });

  form?.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = (emailEl?.value || '').trim().toLowerCase();
    const current = currentEl?.value || '';
    const password = passEl?.value || '';
    const confirm = confirmEl?.value || '';
    if (!email || !current || !password || !confirm) { swal('Missing info', 'Please fill in all fields.', 'warning'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { swal('Invalid email', 'Please enter a valid email address.', 'error'); return; }
    const strong = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
    if (!strong) { swal('Weak password', 'Use at least 8 characters with uppercase, lowercase, number, and symbol.', 'error'); updateHint(password); return; }
    if (password !== confirm) { swal('Password mismatch', 'Passwords do not match.', 'error'); return; }

    setBusy(true);
    try {
      const store = window.StorageUtil; const users = store.getJSON('users', []);
      const idx = users.findIndex((u) => (u.email || '').toLowerCase() === email);
      if (idx === -1) { setBusy(false); swal('Account not found', 'No user with that email.', 'error'); return; }
      if ((users[idx].password || '') !== current) { setBusy(false); swal('Incorrect password', 'Current password is incorrect.', 'error'); return; }
      users[idx].password = password; store.setJSON('users', users);
      try { window.sessionStorage.setItem('users', JSON.stringify(users)); } catch {}
      try { window.localStorage.removeItem('currentUser'); } catch {}
      try { window.sessionStorage.removeItem('currentUser'); } catch {}
      swal('Password Updated', 'Your password has been reset. Please log in.', 'success');
      setTimeout(function () { window.location.href = 'login.html'; }, 1200);
    } catch (e) { console.error(e); setBusy(false); swal('Error', 'Could not reset password. Please try again.', 'error'); }
  });
})();
