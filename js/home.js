// Common nav handled by nav.js

(() => {
  const headerText = document.getElementById("header-text");
  if (!headerText) return;
  const user = window.StorageUtil?.getJSON?.("currentUser", null) || null;
  const name = user?.name || user?.username || user?.email;
  headerText.innerHTML = `<h1>Welcome Back, ${name}!</h1>`;
})();

// Dashboard bonuses (per-user)
(function () {
  function refreshDashboard() {
    function userScope() {
      try {
        const store = window.StorageUtil;
        const u = store?.getJSON?.("currentUser", null) || null;
        const id = u?.id || u?.email || u?.username;
        return id ? String(id) : "guest";
      } catch (_) {
        return "guest";
      }
    }
    function K(base) {
      return base + "::" + userScope();
    }
    try {
      const anyFlag = (base) => {
        const userKey = K(base);
        const vU =
          localStorage.getItem(userKey) ??
          window.sessionStorage.getItem(userKey);
        if (vU === "true") return true;
        const guestKey = base + "::guest";
        const vG =
          localStorage.getItem(guestKey) ??
          window.sessionStorage.getItem(guestKey);
        return vG === "true";
      };
      const anyRaw = (base) => {
        const userKey = K(base);
        const vU =
          localStorage.getItem(userKey) ??
          window.sessionStorage.getItem(userKey);
        if (vU != null) return vU;
        const guestKey = base + "::guest";
        return (
          localStorage.getItem(guestKey) ??
          window.sessionStorage.getItem(guestKey)
        );
      };
      const isCompleted = (prefix) => {
        if (anyFlag(prefix + "_completed_v1")) return true;
        const total =
          parseInt(anyRaw(prefix + "_quiz_total_v1") || "0", 10) || 0;
        const done = parseInt(anyRaw(prefix + "_quiz_done_v1") || "0", 10) || 0;
        return total > 0 && done >= total;
      };
      const completedAI = isCompleted("ai_foundations");
      const completedML = isCompleted("machine_learning");
      const completedDL = isCompleted("deep_learning");
      const completedNN = isCompleted("neural_networks");
      const completedNLP = isCompleted("natural_language_processing");
      const completedAIE = isCompleted("ai_ethics");
      const expectedCourses =
        (completedAI ? 1 : 0) +
        (completedML ? 1 : 0) +
        (completedDL ? 1 : 0) +
        (completedNN ? 1 : 0) +
        (completedNLP ? 1 : 0) +
        (completedAIE ? 1 : 0);
      const expectedHours =
        (completedAI ? 2 : 0) +
        (completedML ? 3 : 0) +
        (completedDL ? 4 : 0) +
        (completedNN ? 4 : 0) +
        (completedNLP ? 3 : 0) +
        (completedAIE ? 1 : 0);
      const ccKey = K("home_courses_completed_bonus");
      const hrKey = K("home_hours_learned_bonus");
      // Prefer stored values if present (written by modules on completion), else computed
      const storedC = parseInt(
        localStorage.getItem(ccKey) ??
          window.sessionStorage.getItem(ccKey) ??
          "",
        10
      );
      const storedH = parseInt(
        localStorage.getItem(hrKey) ??
          window.sessionStorage.getItem(hrKey) ??
          "",
        10
      );
      const courses =
        Number.isFinite(storedC) && storedC >= 0
          ? Math.max(storedC, expectedCourses)
          : expectedCourses;
      const hours =
        Number.isFinite(storedH) && storedH >= 0
          ? Math.max(storedH, expectedHours)
          : expectedHours;
      localStorage.setItem(ccKey, String(courses));
      localStorage.setItem(hrKey, String(hours));
      try {
        window.sessionStorage.setItem(ccKey, String(courses));
        window.sessionStorage.setItem(hrKey, String(hours));
      } catch {}
      // Average score
      let avgScore = 0;
      try {
        const attemptsRaw =
          localStorage.getItem(K("quiz_attempts_v1")) ||
          window.sessionStorage.getItem(K("quiz_attempts_v1"));
        const attempts = attemptsRaw ? JSON.parse(attemptsRaw) : [];
        if (Array.isArray(attempts) && attempts.length > 0) {
          const sum = attempts.reduce(
            (s, a) => s + (Number(a?.percent) || 0),
            0
          );
          avgScore = Math.round(sum / attempts.length);
        }
      } catch {}
      document
        .querySelectorAll(".progress-stats .stat-item")
        .forEach((item) => {
          const label = (item.querySelector(".stat-label")?.textContent || "")
            .trim()
            .toLowerCase();
          const numEl = item.querySelector(".stat-number");
          if (!numEl) return;
          if (label === "courses completed")
            numEl.textContent = String(courses);
          else if (label === "hours learned") numEl.textContent = String(hours);
          else if (label === "average score")
            numEl.textContent =
              (Number.isFinite(avgScore) ? avgScore : 0) + "%";
        });
    } catch (_) {}
  }

  // Initial render
  refreshDashboard();
  // Recompute when returning to the page or storage changes
  window.addEventListener("pageshow", refreshDashboard);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") refreshDashboard();
  });
  window.addEventListener("storage", function (e) {
    if (!e.key) return;
    if (
      e.key.includes("_completed_v1::") ||
      e.key.includes("_quiz_total_v1::") ||
      e.key.includes("_quiz_done_v1::") ||
      e.key.includes("home_courses_completed_bonus::") ||
      e.key.includes("home_hours_learned_bonus::")
    ) {
      refreshDashboard();
    }
  });
  function userScope() {
    try {
      const store = window.StorageUtil;
      const u = store?.getJSON?.("currentUser", null) || null;
      const id = u?.id || u?.email || u?.username;
      return id ? String(id) : "guest";
    } catch (_) {
      return "guest";
    }
  }
  function K(base) {
    return base + "::" + userScope();
  }
  try {
    // Normalize bonuses based on actual completed courses to avoid double counting
    const anyFlag = (base) => {
      const userKey = K(base);
      const vU =
        localStorage.getItem(userKey) ?? window.sessionStorage.getItem(userKey);
      if (vU === "true") return true;
      const guestKey = base + "::guest";
      const vG =
        localStorage.getItem(guestKey) ??
        window.sessionStorage.getItem(guestKey);
      return vG === "true";
    };
    const anyRaw = (base) => {
      const userKey = K(base);
      const vU =
        localStorage.getItem(userKey) ?? window.sessionStorage.getItem(userKey);
      if (vU != null) return vU;
      const guestKey = base + "::guest";
      return (
        localStorage.getItem(guestKey) ??
        window.sessionStorage.getItem(guestKey)
      );
    };
    function isCompleted(prefix) {
      if (anyFlag(prefix + "_completed_v1")) return true;
      const total = parseInt(anyRaw(prefix + "_quiz_total_v1") || "0", 10) || 0;
      const done = parseInt(anyRaw(prefix + "_quiz_done_v1") || "0", 10) || 0;
      return total > 0 && done >= total;
    }
    const completedAI = isCompleted("ai_foundations");
    const completedML = isCompleted("machine_learning");
    const completedDL = isCompleted("deep_learning");
    const completedNN = isCompleted("neural_networks");
    const completedNLP = isCompleted("natural_language_processing");
    const completedAIE = isCompleted("ai_ethics");
    const expectedCourses =
      (completedAI ? 1 : 0) +
      (completedML ? 1 : 0) +
      (completedDL ? 1 : 0) +
      (completedNN ? 1 : 0) +
      (completedNLP ? 1 : 0) +
      (completedAIE ? 1 : 0);
    const expectedHours =
      (completedAI ? 2 : 0) +
      (completedML ? 3 : 0) +
      (completedDL ? 4 : 0) +
      (completedNN ? 4 : 0) +
      (completedNLP ? 3 : 0) +
      (completedAIE ? 1 : 0);
    const ccKey = K("home_courses_completed_bonus");
    const hrKey = K("home_hours_learned_bonus");
    localStorage.setItem(ccKey, String(expectedCourses));
    localStorage.setItem(hrKey, String(expectedHours));
    try {
      window.sessionStorage.setItem(ccKey, String(expectedCourses));
      window.sessionStorage.setItem(hrKey, String(expectedHours));
    } catch {}

    const courseBonus = expectedCourses;
    const hoursBonus = expectedHours;
    // Compute Average Score from stored quiz attempts (per-user)
    let avgScore = 0;
    try {
      const attemptsRaw =
        localStorage.getItem(K("quiz_attempts_v1")) ||
        window.sessionStorage.getItem(K("quiz_attempts_v1"));
      const attempts = attemptsRaw ? JSON.parse(attemptsRaw) : [];
      if (Array.isArray(attempts) && attempts.length > 0) {
        const sum = attempts.reduce((s, a) => s + (Number(a?.percent) || 0), 0);
        avgScore = Math.round(sum / attempts.length);
      }
    } catch (_) {}

    document
      .querySelectorAll(".progress-stats .stat-item")
      .forEach(function (item) {
        const label = (item.querySelector(".stat-label")?.textContent || "")
          .trim()
          .toLowerCase();
        const numEl = item.querySelector(".stat-number");
        if (!numEl) return;
        if (label === "courses completed") {
          numEl.textContent = String(courseBonus);
        } else if (label === "hours learned") {
          numEl.textContent = String(hoursBonus);
        } else if (label === "average score") {
          numEl.textContent = (Number.isFinite(avgScore) ? avgScore : 0) + "%";
        }
      });
  } catch (_) {}
})();

// XP progress + Achievements renderer
(function () {
  function userScope() {
    try {
      const store = window.StorageUtil;
      const u = store?.getJSON?.("currentUser", null) || null;
      const id = u?.id || u?.email || u?.username;
      return id ? String(id) : "guest";
    } catch (_) {
      return "guest";
    }
  }
  function K(base) {
    return base + "::" + userScope();
  }
  const COURSE_PREFIXES = [
    "ai_foundations",
    "machine_learning",
    "deep_learning",
    "neural_networks",
    "natural_language_processing",
    "ai_ethics",
  ];
  function getInt(key, d = 0) {
    try {
      const v = localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
      const n = parseInt(v || "", 10);
      return Number.isFinite(n) ? n : d;
    } catch (_) {
      return d;
    }
  }
  function anyFlag(base) {
    try {
      const userKey = K(base);
      const vU = localStorage.getItem(userKey) ?? window.sessionStorage.getItem(userKey);
      if (vU === "true") return true;
      const guestKey = base + "::guest";
      const vG = localStorage.getItem(guestKey) ?? window.sessionStorage.getItem(guestKey);
      return vG === "true";
    } catch (_) {
      return false;
    }
  }
  function isCompleted(prefix) {
    if (anyFlag(prefix + "_completed_v1")) return true;
    const total = getInt(K(prefix + "_quiz_total_v1"));
    const done = getInt(K(prefix + "_quiz_done_v1"));
    return total > 0 && done >= total;
  }
  function anyQuizDone() {
    return COURSE_PREFIXES.some((p) => getInt(K(p + "_quiz_done_v1")) > 0 || anyFlag(p + "_completed_v1"));
  }
  function computeXP() {
    const courses = getInt(K("home_courses_completed_bonus"), 0);
    const hours = getInt(K("home_hours_learned_bonus"), 0);
    // Same scale used for leaderboard scoring
    const xp = courses * 500 + hours * 50;
    return { courses, hours, xp };
  }
  function levelFromXP(xp) {
    const stride = 1000; // xp per level
    const level = Math.floor(xp / stride) + 1;
    const into = xp % stride;
    const pct = Math.max(0, Math.min(100, Math.round((into / stride) * 100)));
    return { level, stride, into, pct, next: stride };
  }
  function renderXP() {
    const containers = document.querySelectorAll(".xp-card, .xp-section");
    if (!containers.length) return;
    const { xp } = computeXP();
    const L = levelFromXP(xp);
    containers.forEach((root)=>{
      const levelEl = root.querySelector(".xp-level");
      const currEl = root.querySelector(".xp-current");
      const nextEl = root.querySelector(".xp-next");
      const barFill = root.querySelector(".xp-progress-fill");
      const bar = root.querySelector(".xp-progress");
      const label = root.querySelector(".xp-progress-label");
      if (levelEl) levelEl.textContent = `Level ${L.level}`;
      if (currEl) currEl.textContent = String(L.into);
      if (nextEl) nextEl.textContent = String(L.next);
      if (barFill) barFill.style.width = `${L.pct}%`;
      if (bar) bar.setAttribute("aria-valuenow", String(L.pct));
      if (label) label.textContent = `${L.pct}% to next level`;
    });
  }
  function renderAchievements() {
    const root = document.querySelector(".achievements-card .achievements-list");
    if (!root) return;
    const { hours } = computeXP();
    const badges = [];
    if (anyQuizDone()) badges.push({ key: "first_quiz", icon: "🏁", label: "First Quiz Completed" });
    if (hours >= 5) badges.push({ key: "five_hours", icon: "⏱️", label: "5 Hours Learned" });
    if (isCompleted("neural_networks")) badges.push({ key: "nn_master", icon: "🧠", label: "Neural Network Master" });
    if (badges.length === 0) {
      root.innerHTML = '<div class="achievement-empty">No achievements yet — start a quiz to earn your first badge!</div>';
      return;
    }
    root.innerHTML = badges
      .map((b) => `<span class="achievement-badge" data-badge="${b.key}"><span class="icon">${b.icon}</span><span class="label">${b.label}</span></span>`)
      .join("");
  }
  function renderChallenges() {
    const root = document.querySelector('.challenges-card .challenge-list');
    if (!root) return;
    const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const today = dayKey(new Date());
    // Quiz today
    let quizToday = false;
    try {
      const attemptsRaw = localStorage.getItem(K('quiz_attempts_v1')) || window.sessionStorage.getItem(K('quiz_attempts_v1'));
      const attempts = attemptsRaw ? JSON.parse(attemptsRaw) : [];
      if (Array.isArray(attempts)) {
        quizToday = attempts.some((a)=>{ const ts = a?.ts || a?.time || a?.date; return ts && dayKey(new Date(ts))===today; });
      }
    } catch {}
    // Module completion today
    const ids = ['ai_foundations','machine_learning','deep_learning','neural_networks','natural_language_processing','ai_ethics'];
    let moduleToday = false;
    try {
      moduleToday = ids.some((id)=>{
        const raw = localStorage.getItem(K(`home_activity_logged_${id}_v1`)) || window.sessionStorage.getItem(K(`home_activity_logged_${id}_v1`));
        if (!raw) return false;
        try { const parsed = JSON.parse(raw); return parsed?.ts && dayKey(new Date(parsed.ts))===today; } catch { return false; }
      });
    } catch {}
    // XP milestone: reach 50% to next level
    const { xp } = computeXP();
    const L = levelFromXP(xp);
    const milestone = L.pct >= 50;
    const items = [
      { key: 'quiz_today', label: 'Complete a quiz today', done: !!quizToday },
      { key: 'module_today', label: 'Complete a module today', done: !!moduleToday },
      { key: 'xp_50', label: 'Reach 50% to next level', done: !!milestone },
    ];
    root.innerHTML = items.map(i => `
      <li class="challenge-item ${i.done?'done':''}" data-key="${i.key}">
        <span class="state">${i.done?'<i class="fas fa-check-circle"></i>':'<i class="far fa-circle"></i>'}</span>
        <span class="label">${i.label}</span>
      </li>
    `).join('');
  }
  function renderAll() {
    renderXP();
    renderAchievements();
    renderChallenges();
  }
  renderAll();
  window.addEventListener("pageshow", renderAll);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") renderAll();
  });
  window.addEventListener("storage", function (e) {
    if (!e.key) return;
    if (
      e.key.includes("home_courses_completed_bonus::") ||
      e.key.includes("home_hours_learned_bonus::") ||
      e.key.includes("_quiz_done_v1::") ||
      e.key.includes("_completed_v1::")
    ) {
      renderAll();
    }
  });
})();

// Personalized learning plan (based on onboarding)
(function () {
  const card = document.getElementById("learning-plan-card");
  if (!card) return;
  const body = card.querySelector(".learning-plan-body");
  function getCurrent() {
    try {
      const store = window.StorageUtil;
      const cu = store.getJSON("currentUser", null);
      if (!cu) return null;
      const users = store.getJSON("users", []);
      return users.find((u) => u.id === cu.id) || null;
    } catch {
      return null;
    }
  }
  function recommendedModules(level) {
    // Map of id -> {id, title, href, icon, desc}
    const Mods = {
      ai_foundations: {
        id: "ai_foundations",
        title: "AI Foundations",
        href: "modules/ai-foundation.html",
        icon: "img/ai-foundation.png",
        desc: "Core concepts and terminology",
      },
      ai_ethics: {
        id: "ai_ethics",
        title: "AI Ethics",
        href: "modules/ai-ethics.html",
        icon: "img/ai-ethics.png",
        desc: "Responsible AI and fairness",
      },
      machine_learning: {
        id: "machine_learning",
        title: "Machine Learning",
        href: "modules/machine-learning.html",
        icon: "img/machine-learning.png",
        desc: "Supervised and unsupervised basics",
      },
      neural_networks: {
        id: "neural_networks",
        title: "Neural Networks",
        href: "modules/neural-networks.html",
        icon: "img/neural-networks.png",
        desc: "Perceptrons to modern architectures",
      },
      natural_language_processing: {
        id: "natural_language_processing",
        title: "Natural Language Processing",
        href: "modules/natural-language-processing.html",
        icon: "img/nlp.png",
        desc: "Text processing and embeddings",
      },
      deep_learning: {
        id: "deep_learning",
        title: "Deep Learning",
        href: "modules/deep-learning.html",
        icon: "img/deep-learning.png",
        desc: "CNNs, RNNs and beyond",
      },
    };
    if (level === "advanced")
      return [
        Mods.deep_learning,
        Mods.natural_language_processing,
        Mods.ai_ethics,
      ];
    if (level === "intermediate")
      return [
        Mods.machine_learning,
        Mods.neural_networks,
        Mods.natural_language_processing,
      ];
    return [Mods.ai_foundations, Mods.ai_ethics, Mods.machine_learning];
  }
  function userScope() {
    try {
      const store = window.StorageUtil;
      const u = store?.getJSON?.("currentUser", null) || null;
      const id = u?.id || u?.email || u?.username;
      return id ? String(id) : "guest";
    } catch (_) {
      return "guest";
    }
  }
  function K(base) {
    return base + "::" + userScope();
  }
  function anyRaw(base) {
    const userKey = K(base);
    const vU =
      localStorage.getItem(userKey) ?? window.sessionStorage.getItem(userKey);
    if (vU != null) return vU;
    const guestKey = base + "::guest";
    return (
      localStorage.getItem(guestKey) ?? window.sessionStorage.getItem(guestKey)
    );
  }
  function anyFlag(base) {
    const v = anyRaw(base);
    return v === "true";
  }
  function moduleProgress(prefix) {
    const total = parseInt(anyRaw(prefix + "_quiz_total_v1") || "0", 10) || 0;
    const done = parseInt(anyRaw(prefix + "_quiz_done_v1") || "0", 10) || 0;
    const completed =
      anyFlag(prefix + "_completed_v1") || (total > 0 && done >= total);
    const started = done > 0 && !completed;
    return { total, done, completed, started };
  }
  function render() {
    const user = getCurrent();
    const ob = user?.onboarding || null;
    if (!ob || !ob.completed) {
      body.innerHTML =
        '<p class="lp-empty">We’ll suggest modules after onboarding. <a href="onboarding.html">Start now</a>.</p>';
      return;
    }
    const mods = recommendedModules(ob.level || "beginner");
    const goalTxt =
      ob.goals && ob.goals.length ? ob.goals.join(", ") : "your goals";
    let html = "";
    html += '<div class="lp-items">';
    mods.forEach((m, i) => {
      const icon = m.icon ? m.icon : "";
      const id = m.id || "";
      const p = id
        ? moduleProgress(id)
        : { completed: false, started: false, done: 0, total: 0 };
      const ctaLabel = p.completed
        ? "Revisit"
        : p.started
        ? "Continue"
        : "Start";
      const ctaIcon = p.completed ? '<i class="fas fa-check"></i>' : "";
      const progressHtml =
        p.total > 0 && p.done > 0
          ? '<span class="lp-progress" aria-label="Progress">' +
            p.done +
            "/" +
            p.total +
            "</span>"
          : "";
      const desc = m.desc ? m.desc : "";
      const stateClass = p.completed
        ? " completed"
        : p.started
        ? " started"
        : "";
      html +=
        '<div class="lp-item' +
        stateClass +
        '"' +
        (id ? ' data-module="' + id + '"' : "") +
        ">";
      html += '<span class="lp-accent" aria-hidden="true"></span>';
      html +=
        '<a class="lp-link" href="' +
        m.href +
        '" aria-label="Open ' +
        m.title +
        '">';
      html += '<div class="lp-left">';
      if (icon)
        html +=
          '<img class="lp-icon" src="' + icon + '" alt="' + m.title + ' icon">';
      html += '<span class="lp-texts">';
      html += '<span class="lp-title">' + m.title + "</span>";
      if (desc) html += '<span class="lp-desc">' + desc + "</span>";
      html += "</span>";
      html += "</div>";
      html += progressHtml;
      html += '<span class="lp-cta">' + ctaIcon + ctaLabel + "</span>";
      html += "</a>";
      html += "</div>";
    });
    html += "</div>";
    html +=
      '<p class="lp-empty">Tailored for: ' +
      goalTxt +
      ". Preferences: " +
      (Array.isArray(ob.style) && ob.style.length
        ? ob.style.join(", ")
        : "any") +
      ".</p>";
    body.innerHTML = html;
  }
  render();
  window.addEventListener("storage", render);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") render();
  });
})();

// Live update Average Score on storage changes
(function () {
  function userScope() {
    try {
      const store = window.StorageUtil;
      const u = store?.getJSON?.("currentUser", null) || null;
      const id = u?.id || u?.email || u?.username;
      return id ? String(id) : "guest";
    } catch (_) {
      return "guest";
    }
  }
  function K(base) {
    return base + "::" + userScope();
  }
  function refresh() {
    let avgScore = 0;
    try {
      const attemptsRaw =
        localStorage.getItem(K("quiz_attempts_v1")) ||
        window.sessionStorage.getItem(K("quiz_attempts_v1"));
      const attempts = attemptsRaw ? JSON.parse(attemptsRaw) : [];
      if (Array.isArray(attempts) && attempts.length > 0) {
        const sum = attempts.reduce((s, a) => s + (Number(a?.percent) || 0), 0);
        avgScore = Math.round(sum / attempts.length);
      }
    } catch (_) {}
    document.querySelectorAll(".progress-stats .stat-item").forEach((item) => {
      const label = (item.querySelector(".stat-label")?.textContent || "")
        .trim()
        .toLowerCase();
      const numEl = item.querySelector(".stat-number");
      if (!numEl) return;
      if (label === "average score") numEl.textContent = (avgScore || 0) + "%";
    });
  }
  window.addEventListener("storage", (e) => {
    if (!e.key) return;
    if (e.key === K("quiz_attempts_v1")) refresh();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refresh();
  });
  window.addEventListener("pageshow", refresh);
})();

// Recent activity (per-user)
(function () {
  function userScope() {
    try {
      const store = window.StorageUtil;
      const u = store?.getJSON?.("currentUser", null) || null;
      const id = u?.id || u?.email || u?.username;
      return id ? String(id) : "guest";
    } catch (_) {
      return "guest";
    }
  }
  function K(base) {
    return base + "::" + userScope();
  }
  const COURSES = [
    {
      id: "ai_foundations",
      title: "AI Foundations",
      completedKey: K("ai_foundations_completed_v1"),
      activityKey: K("home_activity_logged_ai_foundations_v1"),
      icon: '<i class="fas fa-check-circle" style="color:#10b981"></i>',
    },
    {
      id: "machine_learning",
      title: "Machine Learning",
      completedKey: K("machine_learning_completed_v1"),
      activityKey: K("home_activity_logged_machine_learning_v1"),
      icon: '<i class="fas fa-check-circle" style="color:#10b981"></i>',
    },
    {
      id: "deep_learning",
      title: "Deep Learning",
      completedKey: K("deep_learning_completed_v1"),
      activityKey: K("home_activity_logged_deep_learning_v1"),
      icon: '<i class="fas fa-check-circle" style="color:#10b981"></i>',
    },
    {
      id: "neural_networks",
      title: "Neural Networks",
      completedKey: K("neural_networks_completed_v1"),
      activityKey: K("home_activity_logged_neural_networks_v1"),
      icon: '<i class="fas fa-check-circle" style="color:#10b981"></i>',
    },
    {
      id: "natural_language_processing",
      title: "Natural Language Processing",
      completedKey: K("natural_language_processing_completed_v1"),
      activityKey: K("home_activity_logged_natural_language_processing_v1"),
      icon: '<i class="fas fa-check-circle" style="color:#10b981"></i>',
    },
    {
      id: "ai_ethics",
      title: "AI Ethics",
      completedKey: K("ai_ethics_completed_v1"),
      activityKey: K("home_activity_logged_ai_ethics_v1"),
      icon: '<i class="fas fa-check-circle" style="color:#10b981"></i>',
    },
  ];
  const ra = document.querySelector(".recent-activity");
  if (!ra) return;
  function isCourseCompletedFlag(keyWithScope) {
    const base = String(keyWithScope || "").split("::")[0];
    const v =
      localStorage.getItem(keyWithScope) ||
      window.sessionStorage.getItem(keyWithScope) ||
      localStorage.getItem(base + "::guest") ||
      window.sessionStorage.getItem(base + "::guest");
    return v === "true";
  }
  function areAllCompleted() {
    try {
      return COURSES.every((c) => isCourseCompletedFlag(c.completedKey));
    } catch (_) {
      return false;
    }
  }
  function getActivityDate(course) {
    const base = String(course.activityKey || "").split("::")[0];
    const raw =
      localStorage.getItem(course.activityKey) ||
      window.sessionStorage.getItem(course.activityKey) ||
      localStorage.getItem(base + "::guest") ||
      window.sessionStorage.getItem(base + "::guest");
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.ts) return new Date(parsed.ts);
    } catch (_) {}
    return new Date();
  }
  function getLatestCompletionDate() {
    let latest = 0;
    try {
      COURSES.forEach((c) => {
        const base = String(c.activityKey || "").split("::")[0];
        const raw =
          localStorage.getItem(c.activityKey) ||
          window.sessionStorage.getItem(c.activityKey) ||
          localStorage.getItem(base + "::guest") ||
          window.sessionStorage.getItem(base + "::guest");
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw);
          const ts = Number(parsed?.ts) || 0;
          if (ts > latest) latest = ts;
        } catch (_) {}
      });
    } catch (_) {}
    return latest > 0 ? new Date(latest) : new Date();
  }
  function formatDate(d) {
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  function renderPerfectBadge() {
    const existing = ra.querySelector(".activity-item.perfect-badge");
    if (!areAllCompleted()) {
      if (existing) existing.remove();
      return;
    }
    const whenText = formatDate(getLatestCompletionDate());
    if (!existing) {
      const item = document.createElement("div");
      item.className = "activity-item perfect-badge";
      item.setAttribute("data-course", "all_courses");
      item.innerHTML = `
        <div class="activity-icon">
          <i class="fas fa-trophy" style="color:#facc15"></i>
        </div>
        <div class="activity-details">
          <p>Perfect! Completed all lessons <span class="perfect-label">PERFECT</span></p>
          <span class="activity-time">${whenText}</span>
        </div>`;
      ra.prepend(item);
    } else {
      const timeEl = existing.querySelector(".activity-time");
      if (timeEl) timeEl.textContent = whenText;
    }
  }
  function upsertActivity(course) {
    const base = String(course.completedKey || "").split("::")[0];
    const completed =
      (localStorage.getItem(course.completedKey) ||
        window.sessionStorage.getItem(course.completedKey) ||
        localStorage.getItem(base + "::guest") ||
        window.sessionStorage.getItem(base + "::guest")) === "true";
    let item = ra.querySelector(`.activity-item[data-course="${course.id}"]`);
    if (completed) {
      const whenText = formatDate(getActivityDate(course));
      if (!item) {
        item = document.createElement("div");
        item.className = "activity-item";
        item.setAttribute("data-course", course.id);
        item.innerHTML = `<div class="activity-icon">${course.icon}</div><div class="activity-details"><p>Completed "${course.title}"</p><span class="activity-time">${whenText}</span></div>`;
        ra.appendChild(item);
      } else {
        const timeEl = item.querySelector(".activity-time");
        if (timeEl) timeEl.textContent = whenText;
      }
    } else {
      if (item) item.remove();
    }
  }
  function renderAll() {
    // Render course completions
    COURSES.forEach(upsertActivity);
    // Render overall perfect badge (kept at top)
    renderPerfectBadge();
    // No bottom fade overlay needed; skip overflow toggling

    // Match Recent Activity item heights to Learning Plan items
    try {
      function syncHeights(){
        const lpItem = document.querySelector('#learning-plan-card .lp-item');
        let h = 0;
        if (lpItem) {
          const rect = lpItem.getBoundingClientRect();
          h = Math.round(rect.height);
        }
        if (!h || !Number.isFinite(h)) h = 56; // fallback
        document.querySelectorAll('.activity-grid .activity-item').forEach((el)=>{
          el.style.minHeight = h + 'px';
        });
      }
      syncHeights();
      if (!window.__lpResizeObserver){
        const target = document.getElementById('learning-plan-card');
        if (target && 'ResizeObserver' in window){
          window.__lpResizeObserver = new ResizeObserver(()=>{
            syncHeights();
          });
          window.__lpResizeObserver.observe(target);
        } else {
          window.addEventListener('resize', syncHeights);
        }
      }
    } catch(_){}
  }
  renderAll();
  window.addEventListener("storage", (e) => {
    if (!e.key) return;
    if (
      COURSES.some((c) => e.key === c.completedKey || e.key === c.activityKey)
    )
      renderAll();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") renderAll();
  });
  window.addEventListener("pageshow", renderAll);
})();

// Leaderboard render + updater
(function () {
  const LIST_SELECTOR = ".leaderboard-list";
  const PODIUM_SELECTOR = ".leaderboard-podium";
  const KEY = "leaderboard_v1";
  const S = window.StorageUtil;
  function sanitizeName(s) {
    return String(s || "").slice(0, 40);
  }
  function toScore(n) {
    const x = Number(n);
    return Number.isFinite(x) ? Math.max(0, Math.floor(x)) : 0;
  }
  function seedIfMissing() {
    // Seed when key is missing, invalid, or an empty array
    try {
      const raw = S ? S.get(KEY) : localStorage.getItem(KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return;
        } catch (_) {
          // fallthrough to seed
        }
      }
    } catch (_) {}
    const seed = [
      { name: "Justin", score: 1240 },
      { name: "Alex", score: 1120 },
      { name: "Sam", score: 980 },
      { name: "Taylor", score: 850 },
      { name: "Riley", score: 790 },
    ];
    if (S) S.setJSON(KEY, seed);
    else localStorage.setItem(KEY, JSON.stringify(seed));
  }
  function loadEntries() {
    const arr = (S && S.getJSON(KEY, [])) || [];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((e) => ({ name: sanitizeName(e?.name), score: toScore(e?.score) }))
      .filter((e) => e.name);
  }
  function saveEntries(entries) {
    if (S) S.setJSON(KEY, entries);
    else
      try {
        localStorage.setItem(KEY, JSON.stringify(entries));
      } catch {}
  }
  function render() {
    const list = document.querySelector(LIST_SELECTOR);
    if (!list) return;
    seedIfMissing();
    let entries = loadEntries();
    entries.sort((a, b) => b.score - a.score);
    entries = entries.slice(0, 10);
    const podiumEl = document.querySelector(PODIUM_SELECTOR);
    if (podiumEl) {
      const top3 = entries.slice(0, 3).map((e, i) => ({ ...e, rank: i + 1 }));
      const maxScore = Math.max(1, ...top3.map((e) => e.score || 0));
      let arranged = [];
      if (top3.length === 1) arranged = [top3[0]];
      else if (top3.length === 2) arranged = [top3[1], top3[0]];
      else arranged = [top3[1], top3[0], top3[2]];
      const html = `<div class="podium">${arranged
        .map((e) => {
          const rank = e.rank;
          const pct = Math.min(100, Math.round((e.score / maxScore) * 100));
          const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
          return `<div class="podium-item rank-${rank}"><div class="bar" style="--h:${pct}%">${medal}</div><div class="name" title="${
            e.name
          } — ${e.score.toLocaleString()} xp">${e.name}</div></div>`;
        })
        .join("")}</div>`;
      podiumEl.innerHTML = html;
    }
    list.innerHTML = "";
    entries.forEach((e, i) => {
      const li = document.createElement("li");
      li.className = "leaderboard-item";
      li.innerHTML = `<span class="rank">${i + 1}</span><span class="name">${
        e.name
      }</span><span class="score">${e.score.toLocaleString()} xp</span>`;
      list.appendChild(li);
    });
  }
  window.updateLeaderboard = function (entries) {
    if (!Array.isArray(entries)) return;
    const normalized = entries
      .map((e) => ({ name: sanitizeName(e?.name), score: toScore(e?.score) }))
      .filter((e) => e.name);
    saveEntries(normalized);
    render();
  };
  render();
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) render();
  });
})();

// Compute leaderboard entries from all users (per-user keys)
(function () {
  const LB_KEY = "leaderboard_v1";
  const S = window.StorageUtil;
  function scopeForUser(u) {
    const id = u?.id || u?.email || u?.username;
    return id ? String(id) : "guest";
  }
  function KForUser(base, u) {
    return base + "::" + scopeForUser(u);
  }
  function toScore(c, h) {
    return c * 500 + h * 50;
  }
  function getIntRaw(key) {
    try {
      const v = localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
      return parseInt(v || "0", 10) || 0;
    } catch {
      return 0;
    }
  }
  function buildEntries() {
    const users = (S && S.getJSON("users", [])) || [];
    // If there are no users, do not override existing seeded leaderboard
    if (!Array.isArray(users) || users.length === 0) return null;
    return users.map((u) => {
      const c = getIntRaw(KForUser("home_courses_completed_bonus", u));
      const h = getIntRaw(KForUser("home_hours_learned_bonus", u));
      const name = String(u?.username || u?.email || "User");
      return { name, score: toScore(c, h) };
    });
  }
  function sync() {
    const entries = buildEntries();
    if (!entries || entries.length === 0) return; // keep whatever is already rendered/seeded
    if (typeof window.updateLeaderboard === "function") {
      window.updateLeaderboard(entries);
    } else {
      try {
        localStorage.setItem(LB_KEY, JSON.stringify(entries));
      } catch {}
    }
  }
  sync();
  window.addEventListener("storage", (e) => {
    if (!e.key) return;
    if (
      e.key.includes("home_courses_completed_bonus::") ||
      e.key.includes("home_hours_learned_bonus::") ||
      e.key === "users"
    )
      sync();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") sync();
  });
  window.addEventListener("pageshow", sync);
})();
