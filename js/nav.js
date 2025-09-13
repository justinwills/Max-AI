// Common navigation helpers: profile dropdown + mobile menu toggle
(function () {
  // Lightweight SweetAlert fallbacks for offline/file:// contexts
  (function () {
    try {
      if (typeof window.swal !== "function") {
        if (window.Swal && typeof window.Swal.fire === "function") {
          window.swal = function (title, text, icon) {
            return window.Swal.fire({ title, text, icon });
          };
        } else {
          window.swal = function (title, text) {
            try {
              const msg = [title || "", text || ""].filter(Boolean).join("\n");
              alert(msg || "Notice");
            } catch {
              alert("Notice");
            }
            try {
              return Promise.resolve({});
            } catch {
              return undefined;
            }
          };
        }
      }
      if (!window.Swal || typeof window.Swal.fire !== "function") {
        window.Swal = window.Swal || {};
        window.Swal.fire = function (opts) {
          try {
            const title = (opts && opts.title) || "";
            const text = (opts && opts.text) || "";
            const msg =
              [title, text].filter(Boolean).join("\n") || "Are you sure?";
            if (opts && opts.showCancelButton) {
              const ok = confirm(msg);
              return Promise.resolve({ isConfirmed: !!ok });
            } else {
              alert(msg);
              return Promise.resolve({});
            }
          } catch {
            alert("Notice");
            try {
              return Promise.resolve({});
            } catch {
              return undefined;
            }
          }
        };
      }
    } catch {}
  })();
  // Profile dropdown toggle (click + outside close)
  (function () {
    const menu = document.querySelector(".profile-menu");
    if (!menu) return;
    const btn = menu.querySelector(".profile-btn");
    btn?.setAttribute("aria-expanded", "false");
    btn?.addEventListener("click", function (e) {
      e.preventDefault();
      const open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target)) {
        menu.classList.remove("open");
        btn?.setAttribute("aria-expanded", "false");
      }
    });
  })();

  // Mobile nav toggle
  (function () {
    const btn = document.querySelector(".mobile-menu-btn");
    if (!btn) return;
    // Primary layout (most pages)
    const links = document.querySelector(".nav-links");
    // Inner module layout alternate (nav .navigation ul)
    const alt = document.querySelector("nav .navigation ul");
    btn.addEventListener("click", function () {
      if (links) links.classList.toggle("active");
      if (alt) alt.classList.toggle("active");
    });
  })();

  // Lightweight site-wide animations (injected once, works across pages)
  (function () {
    // Inject CSS once
    function ensureAnimCSS() {
      if (document.getElementById("maxai-anim-css")) return;
      const css = `
      /* Base animation primitives */
      .anim-init{opacity:0;transform:translateY(12px)}
      .anim-in{opacity:1;transform:none}
      .anim-up.anim-init{transform:translateY(16px)}
      .anim-right.anim-init{transform:translateX(-16px)}
      .anim-scale.anim-init{transform:scale(.96)}
      .anim-fade.anim-init{transform:none}
      .anim-init,.anim-in{transition:opacity .6s ease, transform .6s ease}
      .anim-slow .anim-init,.anim-slow.anim-init{transition-duration:.9s}
      .anim-fast .anim-init,.anim-fast.anim-init{transition-duration:.35s}
      /* Stagger helper */
      [data-anim-delay]{transition-delay:var(--anim-delay,0ms)}
      /* Respect reduced motion */
      @media (prefers-reduced-motion: reduce){
        .anim-init,.anim-in{transition:none}
        .anim-init{opacity:1;transform:none}
      }`;
      const style = document.createElement("style");
      style.id = "maxai-anim-css";
      style.textContent = css;
      document.head.appendChild(style);
    }

    function prepareTargets() {
      // Common targets across pages; authors can also add data-anim to any element
      const selectors = [
        "[data-anim]",
        ".section-header",
        ".card",
        ".module-card",
        ".lesson-item",
        ".objective-item",
        ".team-member",
        ".hero-content",
        ".hero-visual .floating-card",
        ".stat-item",
        ".leaderboard-card",
        ".sidebar-card",
        ".quiz-card",
      ];
      const set = new Set();
      selectors.forEach((sel) =>
        document.querySelectorAll(sel).forEach((el) => set.add(el))
      );
      set.forEach((el) => {
        if (el.__animPrepared) return;
        el.__animPrepared = true;
        const type = (el.getAttribute("data-anim") || "").trim();
        if (
          type === "up" ||
          type === "right" ||
          type === "scale" ||
          type === "fade"
        )
          el.classList.add("anim-" + type);
        el.classList.add("anim-init");
        const delay = el.getAttribute("data-anim-delay");
        if (delay) {
          const n = Math.max(0, parseInt(delay, 10) || 0);
          el.style.setProperty("--anim-delay", n + "ms");
          el.setAttribute("data-anim-delay", "");
        }
      });
    }

    function runObserver() {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("anim-in");
              e.target.classList.remove("anim-init");
              // Animate once by default
              io.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
      );
      document.querySelectorAll(".anim-init").forEach((el) => io.observe(el));
    }

    function init() {
      try {
        ensureAnimCSS();
        prepareTargets();
        runObserver();
      } catch {}
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }

    // Re-prepare after dynamic content changes (very light safeguard)
    let raf;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => prepareTargets());
    });
  })();

  // Data handoff for file:// via URL hash when navigating to home
  (function () {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", () =>
        normalizeMojibake(document.body)
      );
    else normalizeMojibake(document.body);

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
    function g(key) {
      try {
        const S = window.StorageUtil;
        const v = S?.get?.(key);
        if (v != null && v !== "") return v;
      } catch {}
      try {
        const v = localStorage.getItem(key);
        if (v != null && v !== "") return v;
      } catch {}
      try {
        const v = sessionStorage.getItem(key);
        if (v != null && v !== "") return v;
      } catch {}
      return null;
    }
    function gj(key, d) {
      try {
        const v = g(key);
        if (v == null || v === "") return d;
        return JSON.parse(v);
      } catch {
        return d;
      }
    }
    function dataSnapshot() {
      const sc = scope();
      const K = (b) => b + "::" + sc;
      const out = {
        s: sc,
        c: parseInt(g(K("home_courses_completed_bonus")) || "0", 10) || 0,
        h: parseInt(g(K("home_hours_learned_bonus")) || "0", 10) || 0,
        qb: parseInt(g(K("home_quizzes_completed_bonus")) || "0", 10) || 0,
        comp: {},
        a: {},
        q: [],
      };
      const ids = [
        "ai_foundations",
        "machine_learning",
        "deep_learning",
        "neural_networks",
        "natural_language_processing",
        "ai_ethics",
      ];
      ids.forEach((id) => {
        const ck = K(id + "_completed_v1");
        const tKey = K(id + "_quiz_total_v1");
        const dKey = K(id + "_quiz_done_v1");
        const ckVal = g(ck) === "true";
        const tVal = parseInt(g(tKey) || "0", 10) || 0;
        const dVal = parseInt(g(dKey) || "0", 10) || 0;
        out.comp[id] = ckVal || (tVal > 0 && dVal >= tVal);
        const ak = K("home_activity_logged_" + id + "_v1");
        const raw = g(ak);
        if (raw) {
          try {
            const p = JSON.parse(raw);
            if (p && p.ts) out.a[id] = p.ts;
          } catch {}
        }
      });
      const qr = gj(K("quiz_attempts_v1"), []);
      if (Array.isArray(qr) && qr.length) {
        out.q = qr.slice(-8);
      }
      return out;
    }
    function encode(obj) {
      try {
        return encodeURIComponent(JSON.stringify(obj));
      } catch {
        return "";
      }
    }
    document.addEventListener(
      "click",
      function (ev) {
        const a = ev.target.closest(
          'a[href$="home.html"], a[href*="/home.html"]'
        );
        if (!a) return;
        try {
          const href = a.getAttribute("href");
          if (!href) return;
          const snap = dataSnapshot();
          const hash = "#sync=" + encode(snap);
          // Preserve relative path
          const clean = href.split("#")[0];
          ev.preventDefault();
          window.location.href = clean + hash;
        } catch {}
      },
      true
    );
  })();
})();
