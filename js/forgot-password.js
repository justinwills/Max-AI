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

  function setBusy(state) {
    if (!btn) return;
    btn.disabled = !!state;
    btn.innerHTML = state ? '<i class="fas fa-spinner fa-spin"></i> Resetting...' : '<i class="fas fa-unlock"></i> Reset Password';
  }

  // Submit handling without password strength restrictions
  form?.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = (emailEl?.value || '').trim().toLowerCase();
    const current = currentEl?.value || '';
    const password = passEl?.value || '';
    const confirm = confirmEl?.value || '';
    if (!email || !current || !password || !confirm) { Swal.fire({ title: 'Missing info', text: 'Please fill in all fields.', icon: 'warning' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { Swal.fire({ title: 'Invalid email', text: 'Please enter a valid email address.', icon: 'error' }); return; }
    if (password !== confirm) { Swal.fire({ title: 'Password mismatch', text: 'Passwords do not match.', icon: 'error' }); return; }

    setBusy(true);
    try {
      const store = window.StorageUtil; const users = store.getJSON('users', []);
      const idx = users.findIndex((u) => (u.email || '').toLowerCase() === email);
      if (idx === -1) { setBusy(false); Swal.fire({ title: 'Account not found', text: 'No user with that email.', icon: 'error' }); return; }
      if ((users[idx].password || '') !== current) { setBusy(false); Swal.fire({ title: 'Incorrect password', text: 'Current password is incorrect.', icon: 'error' }); return; }
      users[idx].password = password; store.setJSON('users', users);
      try { window.sessionStorage.setItem('users', JSON.stringify(users)); } catch {}
      try { window.localStorage.removeItem('currentUser'); } catch {}
      try { window.sessionStorage.removeItem('currentUser'); } catch {}
      Swal.fire({ title: 'Password Updated', text: 'Your password has been reset. Please log in.', icon: 'success' });
      setTimeout(function () { window.location.href = 'login.html'; }, 1200);
    } catch (e) { console.error(e); setBusy(false); Swal.fire({ title: 'Error', text: 'Could not reset password. Please try again.', icon: 'error' }); }
  });
})();
