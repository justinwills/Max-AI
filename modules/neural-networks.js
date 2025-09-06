// Download helpers for notes and sample code
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
      download("neural-networks-sample.html", code, "text/html");
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

// Reset progress button (AI Foundations)
(function () {
  function userScope() {
    try {
      const u = JSON.parse(localStorage.getItem("currentUser") || "null");
      const id = u?.id || u?.email || u?.username;
      return id ? String(id) : "guest";
    } catch (_) {
      return "guest";
    }
  }
  function K(base) {
    return base + "::" + userScope();
  }
  const btn = document.getElementById("reset-progress");
  if (!btn) return;
  btn.addEventListener("click", function () {
    Swal.fire({
      title: "Reset progress?",
      text: "This will clear saved answers and unlink completion.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
    }).then((res) => {
      if (!res.isConfirmed) return;
      try {
        // Clear quiz state and auxiliary data for this module
        localStorage.removeItem(K("neural_networks_quiz_v1"));
        localStorage.removeItem(K("neural_networks_quiz_total_v1"));
        localStorage.removeItem(K("neural_networks_quiz_done_v1"));
        // Clear stored MCQ option order to allow reshuffle next time
        localStorage.removeItem(K("neural_networks_quiz_order_v1"));

        // If completion was recorded, subtract Home bonuses once
        if (
          localStorage.getItem(K("neural_networks_completed_v1")) === "true"
        ) {
          const courseKey = K("home_courses_completed_bonus");
          const hoursKey = K("home_hours_learned_bonus");
          const curCourses =
            parseInt(localStorage.getItem(courseKey) || "0", 10) || 0;
          const curHours =
            parseInt(localStorage.getItem(hoursKey) || "0", 10) || 0;
          const newCourses = Math.max(0, curCourses - 1);
          const newHours = Math.max(0, curHours - 2);
          localStorage.setItem(courseKey, String(newCourses));
          localStorage.setItem(hoursKey, String(newHours));
          // Remove recent-activity marker
          localStorage.removeItem(K("home_activity_logged_neural_networks_v1"));
        }
        // Unset completion flag
        localStorage.removeItem(K("neural_networks_completed_v1"));
      } catch (_) {}
      location.reload();
    });
  });
})();

// Quiz rendering + logic with localStorage progress
(function () {
  function userScope() {
    try {
      const u = JSON.parse(localStorage.getItem("currentUser") || "null");
      const id = u?.id || u?.email || u?.username;
      return id ? String(id) : "guest";
    } catch (_) {
      return "guest";
    }
  }
  function K(base) {
    return base + "::" + userScope();
  }
  const STORAGE_KEY = K("neural_networks_quiz_v1");
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  // Persist per-quiz option order so the correct answer isn't always first,
  // and the order remains stable across reloads.
  const ORDER_KEY = K("neural_networks_quiz_order_v1");
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
    if (title.includes("neurons & perceptron")) {
      return {
        type: "mcq",
        prompt:
          "What does a standard neuron compute before applying the activation?",
        options: [
          ["a", "Product of inputs only"],
          ["b", "Weighted sum plus bias", true],
          ["c", "Max over inputs"],
          ["d", "Running average"],
        ],
        hint: "Think about an agent interacting with an environment.",
      };
    }

    if (title.includes("linear neural networks")) {
      return {
        type: "mcq",
        prompt:
          "Two stacked linear layers without any activation are equivalent to:",
        options: [
          ["a", "A nonlinear map"],
          ["b", "A convolution"],
          ["c", "A single linear layer", true],
          ["d", "A decision tree"],
        ],
        hint: "Follow the natural workflow from raw data to inference.",
      };
    }

    if (title.includes("multilayer perceptrons (mlps) & nonlinearity")) {
      return {
        type: "mcq",
        prompt: "Why are nonlinear activations essential in MLPs?",
        options: [
          ["a", "They speed up matrix multiplication"],
          ["b", "They allow modeling non-linear decision boundaries", true],
          ["c", "They reduce memory usage"],
          ["d", "They eliminate the need for gradients"],
        ],
        hint: "Think about squared differences between true and predicted values.",
      };
    }

    if (title.includes("losses, backprop & gradient descent")) {
      return {
        type: "mcq",
        prompt:
          "For multi-class classification with one-hot targets, a common loss is:",
        options: [
          ["a", "Mean squared error"],
          ["b", "Hinge loss"],
          ["c", "Cross-entropy", true],
          ["d", "L1 loss"],
        ],
        hint: "Think about averaging across more neighbors.",
      };
    }

    if (title.includes("regularization & generalization")) {
      return {
        type: "mcq",
        prompt:
          "Which technique explicitly penalizes large weights during training?",
        options: [
          ["a", "Early stopping"],
          ["b", "Data augmentation"],
          ["c", "Dropout"],
          ["d", "L2 weight decay", true],
        ],
        hint: "Compare performance on training vs test sets.",
      };
    }

    if (title.includes("initialization, normalization & optimizers")) {
      return {
        type: "mcq",
        prompt: "AdamW differs from Adam mainly by:",
        options: [
          ["a", "Using momentum for the first time"],
          ["b", "Replacing bias correction"],
          ["c", "Removing adaptive learning rates"],
          ["d", "Decoupling weight decay from gradient updates", true],
        ],
        hint: "Think final evaluation, not tuning.",
      };
    }

    if (title.includes("convolutional neural networks (cnns) for vision")) {
      return {
        type: "mcq",
        prompt: "CNN efficiency largely comes from:",
        options: [
          ["a", "Fully connected layers on all pixels"],
          ["b", "Random projections of the image"],
          ["c", "Local receptive fields and shared weights", true],
          ["d", "Sorting pixels by intensity"],
        ],
        hint: "It’s the harmonic mean of two values.",
      };
    }

    if (title.includes("sequences: rnns vs. transformers")) {
      return {
        type: "mcq",
        prompt: "Transformers handle long-range dependencies primarily via:",
        options: [
          ["a", "Max pooling over time"],
          ["b", "Recurrent hidden states"],
          ["c", "Self-attention across tokens", true],
          ["d", "Convolutions with large kernels"],
        ],
        hint: "Leakage occurs when information from validation/test influences training.",
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
      localStorage.setItem(K("neural_networks_quiz_total_v1"), String(total));
      localStorage.setItem(K("neural_networks_quiz_done_v1"), String(done));
    } catch (_) {}

    // When the course is completed (100%), set completion in localStorage
    // and increment home stats bonuses exactly once.
    try {
      if (
        pct === 100 &&
        localStorage.getItem(K("neural_networks_completed_v1")) !== "true"
      ) {
        localStorage.setItem(K("neural_networks_completed_v1"), "true");
        const courseKey = K("home_courses_completed_bonus");
        const hoursKey = K("home_hours_learned_bonus");
        const curCourses =
          parseInt(localStorage.getItem(courseKey) || "0", 10) || 0;
        const curHours =
          parseInt(localStorage.getItem(hoursKey) || "0", 10) || 0;
        localStorage.setItem(courseKey, String(curCourses + 1));
        localStorage.setItem(hoursKey, String(curHours + 3));
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
