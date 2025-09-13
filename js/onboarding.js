// Onboarding wizard: stores preferences in users[] and flags completion
(function () {
  const store = window.StorageUtil;
  const form = document.getElementById('onboardingForm');
  const steps = Array.from(document.querySelectorAll('.ob-step'));
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  const finishBtn = document.getElementById('finishBtn');
  let idx = 0;

  function ensureLoggedIn() {
    try {
      const cu = store.getJSON('currentUser', null);
      if (!cu || !cu.id) {
        window.location.replace('login.html');
        return false;
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  function showStep(i) {
    steps.forEach((s, k) => {
      s.style.display = k === i ? 'block' : 'none';
    });
    backBtn.disabled = i === 0;
    nextBtn.style.display = i < steps.length - 1 ? 'inline-flex' : 'none';
    finishBtn.style.display = i === steps.length - 1 ? 'inline-flex' : 'none';
  }

  function collectData() {
    const goals = Array.from(form.querySelectorAll('input[name="goals"]:checked')).map(i => i.value);
    const goalText = (document.getElementById('goalText')?.value || '').trim();
    const levelEl = form.querySelector('input[name="level"]:checked');
    const level = levelEl ? levelEl.value : '';
    const style = Array.from(form.querySelectorAll('input[name="style"]:checked')).map(i => i.value);
    return { goals, goalText, level, style };
  }

  function validateStep(i) {
    if (i === 0) {
      const any = form.querySelector('input[name="goals"]:checked');
      if (!any) { Swal.fire({ icon: 'warning', title: 'Pick a goal', text: 'Select at least one goal.' }); return false; }
    }
    if (i === 1) {
      const any = form.querySelector('input[name="level"]:checked');
      if (!any) { Swal.fire({ icon: 'warning', title: 'Select level', text: 'Choose your current level.' }); return false; }
    }
    return true;
  }

  backBtn?.addEventListener('click', function(){ if (idx>0){ idx--; showStep(idx);} });
  nextBtn?.addEventListener('click', function(){ if (!validateStep(idx)) return; if (idx<steps.length-1){ idx++; showStep(idx);} });

  form?.addEventListener('submit', function(e){
    e.preventDefault();
    if (!validateStep(idx)) return;
    const data = collectData();
    try {
      const cu = store.getJSON('currentUser', null);
      const users = store.getJSON('users', []);
      const i = users.findIndex(u => u.id === cu.id);
      if (i === -1) throw new Error('User not found');
      users[i].onboarding = {
        ...data,
        completed: true,
        completedAt: new Date().toISOString(),
      };
      store.setJSON('users', users);
      // Also record lightweight per-user flags for file:// contexts
      try {
        const scope = String(cu.id || cu.email || cu.username || 'guest');
        const K = (base) => base + '::' + scope;
        store.set(K('onboarding_completed_v1'), 'true');
        store.setJSON(K('onboarding_level'), data.level || 'beginner');
        store.setJSON(K('onboarding_goals'), Array.isArray(data.goals) ? data.goals : []);
        store.setJSON(K('onboarding_style'), Array.isArray(data.style) ? data.style : []);
      } catch {}
      // light success and go to dashboard
      Swal.fire({ icon: 'success', title: 'All set!', text: 'Your dashboard will be tailored to your goals.' });
      setTimeout(function(){ window.location.replace('home.html'); }, 800);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Save failed', text: 'Could not save your preferences. Please try again.' });
    }
  });

  // Guard: redirect if not logged in, or already completed
  if (!ensureLoggedIn()) return;
  try {
    const cu = store.getJSON('currentUser', null);
    const users = store.getJSON('users', []);
    const me = users.find(u => u.id === cu.id);
    if (me?.onboarding?.completed) {
      // Already onboarded; go to dashboard
      window.location.replace('home.html');
      return;
    }
  } catch {}

  showStep(idx);
})();
