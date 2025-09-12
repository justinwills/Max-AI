(function () {
  const $ = (id) => document.getElementById(id);
  function scope() {
    try {
      const s = window.StorageUtil;
      const u = s?.getJSON?.("currentUser", null) || null;
      const id = u?.id || u?.email || u?.username;
      return id ? String(id) : "guest";
    } catch {
      return "guest";
    }
  }
  const KEY = "feedback_v2::" + scope();
  const form = $("feedback-form");
  const statusEl = $("fb-status");
  const ratingError = $("rating-error");
  const emailError = $("email-error");
  const charCount = $("char-count");
  const allowContact = $("allow-contact");
  const emailRow = $("email-row");
  const emailInput = $("email");

  // Update char counter + auto-grow textarea
  $("comment").addEventListener("input", (e) => {
    const el = e.target;
    const v = el.value || "";
    charCount.textContent = v.length + "/500";
    el.style.height = "auto";
    const maxH = 240;
    el.style.height = Math.min(maxH, el.scrollHeight) + "px";
  });

  // Show/hide email
  allowContact.addEventListener("change", () => {
    emailRow.style.display = allowContact.checked ? "flex" : "none";
  });

  function getRating() {
    const sel = form.querySelector('input[name="rating"]:checked');
    return sel ? Number(sel.value) : 0;
  }

  function getHighlights() {
    return Array.from(
      form.querySelectorAll('input[name="highlights"]:checked')
    ).map((i) => i.value);
  }

  function readAll() {
    try {
      const raw = localStorage.getItem(KEY) || "[]";
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  function writeAll(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  // Removed history/export/clear controls

  function validate() {
    let ok = true;
    ratingError.textContent = "";
    emailError.textContent = "";
    if (getRating() < 1) {
      ratingError.textContent = "Please select a rating.";
      ok = false;
    }
    if (allowContact.checked) {
      const v = (emailInput.value || "").trim();
      if (!v) {
        emailError.textContent = "Email is required if follow-up is enabled.";
        ok = false;
      } else {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(v)) {
          emailError.textContent = "Please enter a valid email.";
          ok = false;
        }
      }
    }
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusEl.textContent = "";
    if (!validate()) return;
    const entry = {
      ts: Date.now(),
      rating: getRating(),
      highlights: getHighlights(),
      comment: ($("comment").value || "").trim(),
      allowContact: !!allowContact.checked,
      email: allowContact.checked ? (emailInput.value || "").trim() : "",
    };
    const arr = readAll();
    arr.push(entry);
    writeAll(arr);
    statusEl.textContent = "Thank you! Feedback saved locally.";
    form.reset();
    charCount.textContent = "0/500";
    emailRow.style.display = "none";
  });
})();
