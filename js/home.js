// Common nav handled by nav.js

// Profile image upload (guarded)
(function () {
  const fileInput = document.getElementById('file-input');
  if (!fileInput) return;
  fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const el = document.getElementById('profile-pic');
      if (el && ev.target?.result) el.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
})();

// Simple form save toast (guarded)
(function () {
  const form = document.querySelector('.user-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    Swal.fire({ icon: 'success', title: 'Saved', text: 'Changes saved successfully!' });
  });
})();

// Dashboard bonuses (per-user)
(function () {
  function userScope() {
    try { const u = JSON.parse(localStorage.getItem('currentUser') || 'null'); const id = u?.id || u?.email || u?.username; return id ? String(id) : 'guest'; } catch(_) { return 'guest'; }
  }
  function K(base) { return base + '::' + userScope(); }
  try {
    const total = parseInt(localStorage.getItem(K('ai_foundations_quiz_total_v1')) || '0', 10) || 0;
    const done  = parseInt(localStorage.getItem(K('ai_foundations_quiz_done_v1'))  || '0', 10) || 0;
    if (total > 0 && done >= total && localStorage.getItem(K('ai_foundations_completed_v1')) !== 'true') {
      localStorage.setItem(K('ai_foundations_completed_v1'), 'true');
      const courseKey = K('home_courses_completed_bonus');
      const hoursKey  = K('home_hours_learned_bonus');
      const curCourses = parseInt(localStorage.getItem(courseKey) || '0', 10) || 0;
      const curHours   = parseInt(localStorage.getItem(hoursKey)  || '0', 10) || 0;
      localStorage.setItem(courseKey, String(curCourses + 1));
      localStorage.setItem(hoursKey, String(curHours + 2));
    }
    const courseBonus = parseInt(localStorage.getItem(K('home_courses_completed_bonus')) || '0', 10) || 0;
    const hoursBonus  = parseInt(localStorage.getItem(K('home_hours_learned_bonus'))  || '0', 10) || 0;
    document.querySelectorAll('.progress-stats .stat-item').forEach(function (item) {
      const label = (item.querySelector('.stat-label')?.textContent || '').trim().toLowerCase();
      const numEl = item.querySelector('.stat-number'); if (!numEl) return;
      const base = parseInt((numEl.textContent || '0').replace(/[^0-9]/g, ''), 10) || 0;
      if (label === 'courses completed') numEl.textContent = String(base + courseBonus);
      else if (label === 'hours learned') numEl.textContent = String(base + hoursBonus);
    });
  } catch (_) {}
})();

// Recent activity (per-user)
(function () {
  function userScope() { try { const u = JSON.parse(localStorage.getItem('currentUser') || 'null'); const id = u?.id || u?.email || u?.username; return id ? String(id) : 'guest'; } catch(_) { return 'guest'; } }
  function K(base) { return base + '::' + userScope(); }
  const COURSES = [
    { id: 'ai_foundations',   title: 'AI Foundations',   completedKey: K('ai_foundations_completed_v1'),   activityKey: K('home_activity_logged_ai_foundations_v1'),   icon: '<i class="fas fa-check-circle" style="color:#10b981"></i>' },
    { id: 'machine-learning', title: 'Machine Learning', completedKey: K('machine-learning_completed_v1'), activityKey: K('home_activity_logged_machine-learning_v1'), icon: '<i class="fas fa-check-circle" style="color:#10b981"></i>' },
  ];
  const ra = document.querySelector('.recent-activity'); if (!ra) return;
  function getActivityDate(course) {
    const raw = localStorage.getItem(course.activityKey);
    try { const parsed = JSON.parse(raw); if (parsed && parsed.ts) return new Date(parsed.ts); } catch(_) {}
    return new Date();
  }
  function formatDate(d) { return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
  function upsertActivity(course) {
    const completed = localStorage.getItem(course.completedKey) === 'true';
    let item = ra.querySelector(`.activity-item[data-course="${course.id}"]`);
    if (completed) {
      const whenText = formatDate(getActivityDate(course));
      if (!item) {
        item = document.createElement('div'); item.className = 'activity-item'; item.setAttribute('data-course', course.id);
        item.innerHTML = `<div class="activity-icon">${course.icon}</div><div class="activity-details"><p>Completed "${course.title}"</p><span class="activity-time">${whenText}</span></div>`;
        ra.appendChild(item);
      } else { const timeEl = item.querySelector('.activity-time'); if (timeEl) timeEl.textContent = whenText; }
    } else { if (item) item.remove(); }
  }
  function renderAll() { COURSES.forEach(upsertActivity); }
  renderAll();
  window.addEventListener('storage', (e) => { if (!e.key) return; if (COURSES.some(c => e.key === c.completedKey || e.key === c.activityKey)) renderAll(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') renderAll(); });
  window.addEventListener('pageshow', renderAll);
})();

// Leaderboard render + updater
(function () {
  const LIST_SELECTOR = '.leaderboard-list';
  const PODIUM_SELECTOR = '.leaderboard-podium';
  const KEY = 'leaderboard_v1';
  const S = window.StorageUtil;
  function sanitizeName(s) { return String(s || '').slice(0, 40); }
  function toScore(n) { const x = Number(n); return Number.isFinite(x) ? Math.max(0, Math.floor(x)) : 0; }
  function seedIfMissing() { if ((S && S.get(KEY)) || (!S && localStorage.getItem(KEY))) return; const seed = [ { name: 'Justin', score: 1240 }, { name: 'Alex', score: 1120 }, { name: 'Sam', score: 980 }, { name: 'Taylor', score: 850 }, { name: 'Riley', score: 790 } ]; if (S) S.setJSON(KEY, seed); else localStorage.setItem(KEY, JSON.stringify(seed)); }
  function loadEntries() { const arr = (S && S.getJSON(KEY, [])) || []; if (!Array.isArray(arr)) return []; return arr.map((e)=>({ name: sanitizeName(e?.name), score: toScore(e?.score) })).filter((e)=>e.name); }
  function saveEntries(entries) { if (S) S.setJSON(KEY, entries); else try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch {} }
  function render() {
    const list = document.querySelector(LIST_SELECTOR); if (!list) return;
    seedIfMissing(); let entries = loadEntries(); entries.sort((a,b)=>b.score-a.score); entries = entries.slice(0,10);
    const podiumEl = document.querySelector(PODIUM_SELECTOR);
    if (podiumEl) {
      const top3 = entries.slice(0,3).map((e,i)=>({ ...e, rank: i+1 }));
      const maxScore = Math.max(1, ...top3.map(e => e.score || 0));
      let arranged = []; if (top3.length===1) arranged=[top3[0]]; else if (top3.length===2) arranged=[top3[1], top3[0]]; else arranged=[top3[1], top3[0], top3[2]];
      const html = `<div class="podium">${arranged.map((e)=>{ const rank=e.rank; const pct=Math.min(100, Math.round((e.score/maxScore)*100)); const medal=rank===1?'🥇':rank===2?'🥈':'🥉'; return `<div class="podium-item rank-${rank}"><div class="bar" style="--h:${pct}%">${medal}</div><div class="name" title="${e.name} — ${e.score.toLocaleString()} xp">${e.name}</div></div>`; }).join('')}</div>`;
      podiumEl.innerHTML = html;
    }
    list.innerHTML=''; entries.forEach((e,i)=>{ const li=document.createElement('li'); li.className='leaderboard-item'; li.innerHTML = `<span class="rank">${i+1}</span><span class="name">${e.name}</span><span class="score">${e.score.toLocaleString()} xp</span>`; list.appendChild(li); });
  }
  window.updateLeaderboard = function (entries) { if (!Array.isArray(entries)) return; const normalized = entries.map((e)=>({ name: sanitizeName(e?.name), score: toScore(e?.score) })).filter((e)=>e.name); saveEntries(normalized); render(); };
  render();
  window.addEventListener('storage', (e) => { if (e.key === KEY) render(); });
})();

// Compute leaderboard entries from all users (per-user keys)
(function () {
  const LB_KEY = 'leaderboard_v1';
  const S = window.StorageUtil;
  function scopeForUser(u){ const id = u?.id || u?.email || u?.username; return id ? String(id) : 'guest'; }
  function KForUser(base,u){ return base + '::' + scopeForUser(u); }
  function toScore(c,h){ return c*500 + h*50; }
  function getIntRaw(key){ try { return parseInt(localStorage.getItem(key) || '0', 10) || 0; } catch { return 0; } }
  function buildEntries(){ const users = (S && S.getJSON('users', [])) || []; if (!Array.isArray(users) || users.length===0) return []; return users.map(u=>{ const c=getIntRaw(KForUser('home_courses_completed_bonus',u)); const h=getIntRaw(KForUser('home_hours_learned_bonus',u)); const name=String(u?.username || u?.email || 'User'); return { name, score: toScore(c,h) }; }); }
  function sync(){ const entries = buildEntries(); if (typeof window.updateLeaderboard === 'function') { window.updateLeaderboard(entries); } else { try { localStorage.setItem(LB_KEY, JSON.stringify(entries)); } catch {} } }
  sync();
  window.addEventListener('storage', (e)=>{ if (!e.key) return; if (e.key.includes('home_courses_completed_bonus::') || e.key.includes('home_hours_learned_bonus::') || e.key==='users') sync(); });
  document.addEventListener('visibilitychange', ()=>{ if (document.visibilityState==='visible') sync(); });
  window.addEventListener('pageshow', sync);
})();

