// Download helpers for notes and Mini Lab code
(function () {
  function download(filename, content, mime) {
    try {
      const blob = new Blob([content], { type: mime || "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 400);
    } catch (_) {
      // Fallback: open data URL
      const a = document.createElement("a");
      a.href =
        "data:" +
        (mime || "text/plain") +
        ";charset=utf-8," +
        encodeURIComponent(content);
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }
  const codeBtn = document.querySelector(".download-code");
  codeBtn &&
    codeBtn.addEventListener("click", function () {
      const code = ``;
      download("ai-ethics-sample.js", code, "application/javascript");
    });
})();
// Lesson interaction (header-only toggling; no lock system)
$(document).on("click", ".lesson-item .lesson-header", function () {
  const $item = $(this).closest(".lesson-item");
  $item.toggleClass("expanded");
});

// Prevent quiz interactions from toggling the lesson container
$(document).on("click mousedown keydown", ".quiz, .quiz *", function (e) {
  e.stopPropagation();
});

// Quiz rendering + logic with localStorage progress
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
  const STORAGE_KEY = K("ai_ethics_quiz_v1");
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  // Persist per-quiz option order so the correct answer isn't always first,
  // and the order remains stable across reloads.
  const ORDER_KEY = K("ai_ethics_quiz_order_v1");
  let savedOrderMap = {};
  try {
    savedOrderMap = JSON.parse(localStorage.getItem(ORDER_KEY) || "{}");
  } catch (_) {
    savedOrderMap = {};
  }
  // Build a unique MCQ spec per lesson from its title/topic (no essays)
  function specForLesson(item, lessonId, index) {
    // Prefer mapping by lesson title so Qs match topics explicitly
    const title = (
      item?.querySelector(".lesson-content h4")?.textContent || ""
    ).toLowerCase();

    // Title-based specs (one per lesson topic)
    if (title.includes("fairness from data to decisions")) {
      return {
        type: "mcq",
        prompt:
          "Which statement best distinguishes demographic parity from equalized odds?",
        options: [
          [
            "a",
            "Demographic parity equalizes error rates; equalized odds equalizes selection rates",
          ],
          [
            "b",
            "Demographic parity equalizes selection rates; equalized odds equalizes error rates",
            true,
          ],
          ["c", "Both require identical ROC curves across groups"],
          ["d", "Both guarantee optimal accuracy"],
        ],
        hint: "Think about an agent interacting with an environment.",
      };
    }

    if (title.includes("privacy & data governance by design")) {
      return {
        type: "mcq",
        prompt: "What does differential privacy aim to guarantee?",
        options: [
          ["a", "Encrypted storage at rest"],
          [
            "b",
            "Individual records have limited influence on outputs, even if attacked",
            true,
          ],
          ["c", "Models never overfit"],
          ["d", "Data cannot be shared across organizations"],
        ],
        hint: "Follow the natural workflow from raw data to inference.",
      };
    }

    if (title.includes("transparency, explainability & accountability")) {
      return {
        type: "mcq",
        prompt: "Which item is most appropriate to include in a Model Card?",
        options: [
          ["a", "The SHA of your Git repository only"],
          ["b", "Intended use, subgroup metrics, and known limitations", true],
          ["c", "Raw training data dumps"],
          ["d", "Proprietary feature weights"],
        ],
        hint: "Think about squared differences between true and predicted values.",
      };
    }

    if (title.includes("safety, alignment & misuse prevention")) {
      return {
        type: "mcq",
        prompt: "What is the primary purpose of red-teaming an AI system?",
        options: [
          ["a", "Speeding up inference"],
          [
            "b",
            "Stress-testing for unsafe behaviors and vulnerabilities before deployment",
            true,
          ],
          ["c", "Reducing compute cost"],
          ["d", "Increasing dataset size"],
        ],
        hint: "Think about averaging across more neighbors.",
      };
    }

    if (title.includes("the near future of ai trends you can use")) {
      return {
        type: "mcq",
        prompt:
          "What is the main goal of Retrieval-Augmented Generation (RAG)?",
        options: [
          ["a", "Speed up training by pruning layers"],
          [
            "b",
            "Ground model outputs in external, trusted sources at query time",
            true,
          ],
          ["c", "Replace the need for vector databases"],
          ["d", "Guarantee identical outputs every run"],
        ],
        hint: "Compare performance on training vs test sets.",
      };
    }

    // No fallback; require explicit mapping by title
    return null;
  }

  function markLessonComplete(lessonId, itemOverride) {
    try {
      const item =
        itemOverride ||
        document.querySelector(`.lesson-item[data-lesson="${lessonId}"]`);
      const icon = item?.querySelector(".lesson-status i");
      if (icon) {
        icon.classList.remove("fa-lock", "fa-lock-open", "fa-circle");
        icon.classList.add("fa-circle-check");
        icon.style.color = "#10b981";
      }
      item?.classList.add("completed");
      // Log a quiz attempt with timestamp for challenges on Home
      try {
        const key = K("quiz_attempts_v1");
        let arr = [];
        try {
          const raw =
            localStorage.getItem(key) || window.sessionStorage.getItem(key);
          arr = raw ? JSON.parse(raw) : [];
        } catch (_) {
          arr = [];
        }
        if (!Array.isArray(arr)) arr = [];
        arr.push({ ts: Date.now(), percent: 100, source: "lesson" });
        if (arr.length > 50) arr = arr.slice(arr.length - 50);
        localStorage.setItem(key, JSON.stringify(arr));
        try {
          window.sessionStorage.setItem(key, JSON.stringify(arr));
        } catch (_) {}
      } catch (_) {}
    } catch (_) {}
  }

  function renderQuizForLesson(lessonId, itemEl, index) {
    const item =
      itemEl ||
      document.querySelector(`.lesson-item[data-lesson="${lessonId}"]`);
    if (!item) return;
    const spec = specForLesson(item, lessonId, index);
    if (!spec) return; // no quiz for this lesson
    const host =
      item.querySelector(".lesson-preview") ||
      item.querySelector(".lesson-details");
    if (!host) return;
    if (host.querySelector(".quiz")) return; // avoid duplicates
    const group = item.dataset.quizKey || `q-lesson-idx-${index ?? 0}`;
    item.dataset.quizKey = group;
    const wrap = document.createElement("div");
    wrap.className = "quiz";
    let inner =
      `<div class="quiz-title"><i class="fas fa-question-circle"></i> Quick Check</div>` +
      `<p class="quiz-question">${spec.prompt}</p>`;
    if (spec.type === "mcq") {
      // Determine presentation order for MCQ options (stable across reloads)
      const options = Array.isArray(spec.options) ? spec.options.slice() : [];
      if (savedOrderMap[group] && Array.isArray(savedOrderMap[group])) {
        options.sort(
          (a, b) =>
            savedOrderMap[group].indexOf(a[0]) -
            savedOrderMap[group].indexOf(b[0])
        );
      } else {
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }
        savedOrderMap[group] = options.map((o) => o[0]);
        try {
          localStorage.setItem(ORDER_KEY, JSON.stringify(savedOrderMap));
        } catch (_) {}
      }
      inner += `<div class="quiz-options" role="radiogroup" aria-label="Lesson ${lessonId} options">`;
      options.forEach(([val, label, correct]) => {
        const cls = correct ? "quiz-option correct" : "quiz-option";
        inner += `<label class="${cls}"><input type="radio" name="${group}" value="${val}"> ${label}</label>`;
      });
      inner += `</div><button class="quiz-check" data-target="${group}" data-lesson="${lessonId}">Check Answer</button><div class="quiz-feedback" aria-live="polite"></div>`;
    } else {
      inner +=
        `<textarea class="quiz-textarea" name="${group}" rows="4" placeholder="Write your answer..."></textarea>` +
        `<button class="quiz-check" data-type="essay" data-target="${group}" data-lesson="${lessonId}">Check Answer</button>` +
        `<div class="quiz-feedback" aria-live="polite"></div>`;
    }
    wrap.innerHTML = inner;
    host.appendChild(wrap);

    // restore saved
    const sv = saved[group];
    if (sv) {
      const quiz = wrap;
      const feedback = quiz.querySelector(".quiz-feedback");
      if (spec.type === "mcq") {
        const input = quiz.querySelector(
          `input[name="${group}"][value="${sv.value}"]`
        );
        if (input) {
          input.checked = true;
        }
        if (sv.correct) {
          quiz.classList.add("correct-state");
          const chosen = input.closest(".quiz-option");
          chosen.classList.add("opt-correct");
          const mark = document.createElement("span");
          mark.className = "mark ok";
          mark.innerHTML = '<i class="fa-solid fa-check"></i>';
          chosen.appendChild(mark);
          feedback.textContent = "Completed.";
          feedback.style.color = "#10b981";
          quiz
            .querySelectorAll('input[type="radio"]')
            .forEach((i) => (i.disabled = true));
          markLessonComplete(lessonId);
        }
      } else {
        quiz.querySelector(".quiz-textarea").value = sv.value || "";
        if (sv.correct) {
          quiz.classList.add("correct-state");
          feedback.textContent = "Completed.";
          feedback.style.color = "#10b981";
          markLessonComplete(lessonId);
        }
      }
    }
  }

  // Render quizzes for each lesson item (fallback to generic if not in bank)
  const lessonItems = Array.from(
    document.querySelectorAll(".lesson-item[data-lesson]")
  );
  lessonItems.forEach((item, idx) => {
    const id = Number(item.getAttribute("data-lesson"));
    renderQuizForLesson(id, item, idx);
  });

  // Simple status: no locking. Only show check when completed.
  function updateStatus() {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    lessonItems.forEach((item) => {
      const icon = item.querySelector(".lesson-status i");
      if (icon) {
        icon.classList.remove("fa-lock", "fa-lock-open");
      }
      item.classList.remove("locked");

      const group = item.dataset.quizKey;
      const completed =
        item.classList.contains("completed") ||
        !!(group && savedState[group]?.correct);
      if (completed) {
        item.classList.add("completed");
        if (icon) {
          icon.classList.remove("fa-circle");
          icon.classList.add("fa-circle-check");
          icon.style.color = "#10b981";
        }
      } else if (icon) {
        icon.classList.remove("fa-circle-check");
        icon.classList.add("fa-circle");
        icon.style.color = "#94a3b8";
      }
      // Always allow interaction
      item
        .querySelectorAll('input[type="radio"]')
        .forEach((i) => (i.disabled = false));
    });
    updateProgress();
  }
  updateStatus();

  // Learning progress bar and text
  function updateProgress() {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const progLabel = document.getElementById("progress-label");
    const progFill = document.getElementById("progress-fill");
    const progBar = document.getElementById("progress-bar");
    if (!progLabel || !progFill || !progBar) return;
    const withQuiz = lessonItems.filter((it) => it.querySelector(".quiz"));
    const total = withQuiz.length;
    let done = 0;
    withQuiz.forEach((it) => {
      const group = it.dataset.quizKey;
      const completed =
        it.classList.contains("completed") ||
        !!(group && savedState[group]?.correct);
      if (completed) done++;
    });
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    progLabel.textContent = `${pct}% Completed`;
    progFill.style.width = pct + "%";
    progBar.setAttribute("aria-valuenow", String(pct));
    // Persist coarse progress so other pages (e.g., home) can read it
    try {
      const tKey = K("ai_ethics_quiz_total_v1");
      const dKey = K("ai_ethics_quiz_done_v1");
      const tVal = String(total);
      const dVal = String(done);
      localStorage.setItem(tKey, tVal);
      localStorage.setItem(dKey, dVal);
      try {
        sessionStorage.setItem(tKey, tVal);
        sessionStorage.setItem(dKey, dVal);
      } catch (_) {}
    } catch (_) {}

    // When the course is completed (100%), set completion in localStorage
    // and increment home stats bonuses exactly once.
    try {
      if (
        pct === 100 &&
        localStorage.getItem(K("ai_ethics_completed_v1")) !== "true"
      ) {
        const cKey = K("ai_ethics_completed_v1");
        localStorage.setItem(cKey, "true");
        try {
          sessionStorage.setItem(cKey, "true");
        } catch (_) {}
        const courseKey = K("home_courses_completed_bonus");
        const hoursKey = K("home_hours_learned_bonus");
        const curCourses =
          parseInt(localStorage.getItem(courseKey) || "0", 10) || 0;
        const curHours =
          parseInt(localStorage.getItem(hoursKey) || "0", 10) || 0;
        const newC = String(curCourses + 1);
        const newH = String(curHours + 3);
        localStorage.setItem(courseKey, newC);
        localStorage.setItem(hoursKey, newH);
        try {
          sessionStorage.setItem(courseKey, newC);
          sessionStorage.setItem(hoursKey, newH);
        } catch (_) {}
        // Log recent activity timestamp
        try {
          const actKey = K("home_activity_logged_ai_ethics_v1");
          const payload = JSON.stringify({ ts: Date.now() });
          localStorage.setItem(actKey, payload);
          try {
            sessionStorage.setItem(actKey, payload);
          } catch (_) {}
        } catch (_) {}
      }
    } catch (_) {}
  }

  function handleCheck(btn) {
    const group = btn.getAttribute("data-target");
    let lessonId = Number(btn.getAttribute("data-lesson"));
    const quiz = btn.closest(".quiz");
    const feedback = quiz.querySelector(".quiz-feedback");
    if (!Number.isFinite(lessonId)) {
      const parentItem = btn.closest(".lesson-item");
      lessonId = parentItem
        ? Number(parentItem.getAttribute("data-lesson"))
        : NaN;
    }
    const itemEl =
      document.querySelector(`.lesson-item[data-lesson="${lessonId}"]`) ||
      btn.closest(".lesson-item");
    // derive fixed index from the group key or list order
    let idx = -1;
    const m = (group || "").match(/q-lesson-idx-(\d+)/);
    if (m) {
      idx = parseInt(m[1], 10);
    }
    if (idx < 0) {
      const items = Array.from(
        document.querySelectorAll(".lesson-item[data-lesson]")
      );
      idx = Math.max(0, items.indexOf(itemEl));
    }
    const spec = specForLesson(itemEl, lessonId, idx);

    // reset visuals
    quiz.classList.remove("correct-state", "wrong-state", "shake");
    quiz.querySelectorAll(".quiz-option").forEach((opt) => {
      opt.classList.remove("opt-correct", "opt-wrong", "opt-right");
      const m = opt.querySelector(".mark");
      if (m) m.remove();
    });

    if (spec.type === "mcq") {
      const selected = quiz.querySelector(`input[name="${group}"]:checked`);
      if (!selected) {
        Swal.fire({
          icon: "info",
          title: "Select an answer",
          text: "Please choose an option to check.",
        });
        return;
      }
      const chosenOpt = selected.closest(".quiz-option");
      const isCorrect = chosenOpt.classList.contains("correct");
      // store
      saved[group] = { value: selected.value, correct: !!isCorrect };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      if (isCorrect) {
        quiz.classList.add("correct-state");
        chosenOpt.classList.add("opt-correct");
        const mark = document.createElement("span");
        mark.className = "mark ok";
        mark.innerHTML = '<i class="fa-solid fa-check"></i>';
        chosenOpt.appendChild(mark);
        quiz
          .querySelectorAll('input[type="radio"]')
          .forEach((i) => (i.disabled = true));
        markLessonComplete(lessonId, itemEl);
        updateStatus();
      } else {
        quiz.classList.add("wrong-state", "shake");
        chosenOpt.classList.add("opt-wrong");
        const mark = document.createElement("span");
        mark.className = "mark err";
        mark.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        chosenOpt.appendChild(mark);
        const right = quiz.querySelector(".quiz-option.correct");
        if (right) right.classList.add("opt-right");
      }
    } else {
      const text = (
        quiz.querySelector(".quiz-textarea").value || ""
      ).toLowerCase();
      const keywords = spec.keywords || [];
      const matches = keywords.filter((k) => text.includes(k)).length;
      const ok = matches >= (spec.minMatches || 2);
      // store
      saved[group] = { value: text, correct: !!ok };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      if (ok) {
        quiz.classList.add("correct-state");
        markLessonComplete(lessonId, itemEl);
        updateStatus();
      } else {
        quiz.classList.add("wrong-state", "shake");
      }
    }
  }

  // Delegate quiz checks (vanilla)
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".quiz-check");
    if (!btn) return;
    e.preventDefault();
    handleCheck(btn);
  });
  // Delegate quiz checks (jQuery fallback)
  if (window.jQuery) {
    $(document).on("click", ".quiz-check", function (ev) {
      ev.preventDefault();
      handleCheck(this);
    });
  }
})();
