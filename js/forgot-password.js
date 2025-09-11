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
  const codeEl = document.getElementById('fp-code');
  const passEl = document.getElementById('fp-password');
  const confirmEl = document.getElementById('fp-confirm');
  const sendBtn = document.getElementById('sendCodeBtn');

  function setBusy(state) {
    if (!btn) return;
    btn.disabled = !!state;
    btn.innerHTML = state ? '<i class="fas fa-spinner fa-spin"></i> Resetting...' : '<i class="fas fa-unlock"></i> Reset Password';
  }

  // Generate and store a short-lived verification code
  function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  }
  function K(email) { return 'reset_code::' + (email || '').toLowerCase(); }

  sendBtn?.addEventListener('click', function(){
    const email = (emailEl?.value || '').trim().toLowerCase();
    if (!email) { Swal.fire({ title: 'Enter your email', text: 'Please provide your account email first.', icon: 'info' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { Swal.fire({ title: 'Invalid email', text: 'Please enter a valid email address.', icon: 'error' }); return; }
    const store = window.StorageUtil; const users = store.getJSON('users', []);
    const exists = users.some((u)=> (u.email||'').toLowerCase() === email);
    if (!exists) { Swal.fire({ title: 'Account not found', text: 'No user with that email.', icon: 'error' }); return; }
    const code = generateCode();
    const payload = { code, ts: Date.now() };
    store.setJSON(K(email), payload);
    try { window.sessionStorage.setItem(K(email), JSON.stringify(payload)); } catch {}
    // In a real app, this would be emailed. For demo, show it.
    Swal.fire({ title: 'Verification Code', text: `Use this code to reset: ${code}\n(It expires in 10 minutes)`, icon: 'info' });
  });

  // Submit handling with verification code
  form?.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = (emailEl?.value || '').trim().toLowerCase();
    const code = (codeEl?.value || '').trim();
    const password = passEl?.value || '';
    const confirm = confirmEl?.value || '';
    if (!email || !code || !password || !confirm) { Swal.fire({ title: 'Missing info', text: 'Please fill in all fields.', icon: 'warning' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { Swal.fire({ title: 'Invalid email', text: 'Please enter a valid email address.', icon: 'error' }); return; }
    if (password !== confirm) { Swal.fire({ title: 'Password mismatch', text: 'Passwords do not match.', icon: 'error' }); return; }

    setBusy(true);
    try {
      const store = window.StorageUtil; const users = store.getJSON('users', []);
      const idx = users.findIndex((u) => (u.email || '').toLowerCase() === email);
      if (idx === -1) { setBusy(false); Swal.fire({ title: 'Account not found', text: 'No user with that email.', icon: 'error' }); return; }
      const meta = store.getJSON(K(email), null) || (function(){ try { return JSON.parse(localStorage.getItem(K(email))||'null'); } catch { return null; } })();
      const valid = meta && meta.code === code && (Date.now() - (meta.ts||0)) <= 10*60*1000; // 10 min expiry
      if (!valid) { setBusy(false); Swal.fire({ title: 'Invalid or expired code', text: 'Please request a new verification code.', icon: 'error' }); return; }
      // Rotate password and clear code
      users[idx].password = password; store.setJSON('users', users);
      try { window.sessionStorage.setItem('users', JSON.stringify(users)); } catch {}
      store.remove(K(email)); try { window.sessionStorage.removeItem(K(email)); } catch {}
      try { window.localStorage.removeItem('currentUser'); } catch {}
      try { window.sessionStorage.removeItem('currentUser'); } catch {}
      Swal.fire({ title: 'Password Updated', text: 'Your password has been reset. Please log in.', icon: 'success' });
      setTimeout(function () { window.location.href = 'login.html'; }, 1200);
    } catch (e) { console.error(e); setBusy(false); Swal.fire({ title: 'Error', text: 'Could not reset password. Please try again.', icon: 'error' }); }
  });
})();
