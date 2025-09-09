// Profile menu handled by nav.js

// Redirect if not logged in and populate profile UI
(function () {
  try {
    const store = window.StorageUtil;
    const current = store.getJSON("currentUser", null);
    if (!current || !current.email) {
      window.location.href = "login.html";
      return;
    }
    const users = store.getJSON("users", []);
    const user =
      users.find((u) => u.id === current.id) ||
      users.find(
        (u) =>
          (u.email || "").toLowerCase() === String(current.email).toLowerCase()
      );
    const username = (user && user.username) || current.username || "";
    const email = (user && user.email) || current.email || "";
    const avatar = user && user.avatar ? user.avatar : null;
    const dn = document.getElementById("display-name");
    if (dn) dn.textContent = username || "";
    const de = document.getElementById("display-email");
    if (de) de.textContent = email || "";
    const un = document.getElementById("username");
    if (un) un.value = username || "";
    const em = document.getElementById("email");
    if (em) em.value = email || "";
    const pic = document.getElementById("profile-pic");
    if (pic && avatar) {
      pic.src = avatar;
    }
  } catch (e) {
    console.error(e);
  }
})();

// Image upload + downscale + persist
document.getElementById("file-input")?.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    const dataUrl = ev.target.result;
    const imgEl = new Image();
    imgEl.onload = function () {
      const maxSize = 256;
      let { width, height } = imgEl;
      const scale = Math.min(1, maxSize / Math.max(width, height));
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imgEl, 0, 0, w, h);
      const out = canvas.toDataURL("image/jpeg", 0.85);
      const img = document.getElementById("profile-pic");
      if (img) img.src = out;
      try {
        const store = window.StorageUtil;
        const current = store.getJSON("currentUser", null);
        if (!current) return;
        const users = store.getJSON("users", []);
        const idx = users.findIndex((u) => u.id === current.id);
        if (idx >= 0) {
          users[idx].avatar = out;
          store.setJSON("users", users);
        }
      } catch (err) {
        console.error(err);
      }
    };
    imgEl.src = dataUrl;
  };
  reader.readAsDataURL(file);
});

// Save personal info
document.getElementById("user-form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("username")?.value.trim() || "";
  const email =
    document.getElementById("email")?.value.trim().toLowerCase() || "";
  if (!name || !email) {
    Swal.fire({
      icon: "warning",
      title: "Missing info",
      text: "Please enter both name and email.",
    });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Invalid email",
      text: "Please enter a valid email address.",
    });
    return;
  }
  try {
    const store = window.StorageUtil;
    const current = store.getJSON("currentUser", null);
    if (!current) throw new Error("Not logged in");
    const users = store.getJSON("users", []);
    const idx = users.findIndex((u) => u.id === current.id);
    if (idx === -1) throw new Error("User not found");
    const taken = users.some(
      (u, i) => i !== idx && (u.email || "").toLowerCase() === email
    );
    if (taken) {
      Swal.fire({
        icon: "error",
        title: "Email in use",
        text: "Another account already uses this email.",
      });
      return;
    }
    users[idx].username = name;
    users[idx].email = email;
    store.setJSON("users", users);
    store.setJSON("currentUser", {
      id: users[idx].id,
      username: users[idx].username,
      email: users[idx].email,
    });
    const dn = document.getElementById("display-name");
    if (dn) dn.textContent = name;
    const de = document.getElementById("display-email");
    if (de) de.textContent = email;
    Swal.fire({ icon: "success", title: "Saved", text: "Profile updated." });
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Could not save changes.",
    });
  }
});

// Change password
document
  .getElementById("password-form")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const store = window.StorageUtil;
    const users = store.getJSON("users", []);
    const current = store.getJSON("currentUser", null);
    const idx = users.findIndex((u) => current && u.id === current.id);
    const saved = idx >= 0 ? users[idx].password || "" : "";
    const cur = document.getElementById("curPassword")?.value || "";
    const npw = document.getElementById("newPassword")?.value || "";
    const cfm = document.getElementById("confirmPassword")?.value || "";
    const fb = document.getElementById("pw-feedback");
    const setMsg = (cls, msg) => {
      if (fb) {
        fb.classList.remove("ok", "err");
        fb.classList.add(cls);
        fb.textContent = msg;
      }
    };
    if (npw.length < 8) {
      setMsg("err", "Password must be at least 8 characters.");
      return;
    }
    if (npw !== cfm) {
      setMsg("err", "New password and confirmation do not match.");
      return;
    }
    if (saved && cur !== saved) {
      setMsg("err", "Current password is incorrect.");
      return;
    }
    try {
      if (idx >= 0) {
        users[idx].password = npw;
        store.setJSON("users", users);
      }
    } catch (_) {}
    const cp = document.getElementById("curPassword");
    if (cp) cp.value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
    setMsg("ok", "Password updated.");
  });

// Delete account (bind once)
(function () {
  const __del = document.getElementById("delete-account");
  if (!__del || __del.__delBound) return;
  __del.__delBound = true;
  __del.addEventListener("click", function () {
    Swal.fire({
      title: "Delete account?",
      text: "This will permanently remove your profile and learning progress on this device.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    }).then(function (res) {
      if (!res.isConfirmed) return;
      try {
        const S = window.StorageUtil;
        const current = S.getJSON("currentUser", null);
        if (!current) {
          window.location.href = "login.html";
          return;
        }
        const users = S.getJSON("users", []);
        const filtered = Array.isArray(users)
          ? users.filter((u) => u && u.id !== current.id)
          : [];
        // Persist updated users list across both storages
        S.setJSON("users", filtered);
        try {
          sessionStorage.setItem("users", JSON.stringify(filtered));
        } catch (_) {}
        try {
          sessionStorage.setItem("users", JSON.stringify(filtered));
        } catch (_) {}
        const scope = (function () {
          try {
            return String(
              current.id || current.email || current.username || "guest"
            );
          } catch (_) {
            return "guest";
          }
        })();
        const suffix = "::" + scope;
        // Remove per-user keys for both localStorage and sessionStorage
        try {
          const keys = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k) keys.push(k);
          }
          keys.forEach((k) => {
            if (k && k.endsWith(suffix)) localStorage.removeItem(k);
          });
        } catch (_) {}
        try {
          const sKeys = [];
          for (let i = 0; i < sessionStorage.length; i++) {
            const k = sessionStorage.key(i);
            if (k) sKeys.push(k);
          }
          sKeys.forEach((k) => {
            if (k && k.endsWith(suffix)) sessionStorage.removeItem(k);
          });
        } catch (_) {}
        try {
          localStorage.removeItem("currentUser");
        } catch (_) {}
        try {
          sessionStorage.removeItem("currentUser");
        } catch (_) {}
        S.setJSON("currentUser", null);
        Swal.fire({
          icon: "success",
          title: "Account deleted",
          text: "Your account was removed.",
        });
        setTimeout(function () {
          window.location.href = "login.html";
        }, 800);
      } catch (e) {
        console.error(e);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not delete account.",
        });
      }
    });
  });
})();

// Password visibility toggles on profile page
(function () {
  function setupToggle(btn) {
    const id = btn.getAttribute("data-target");
    const input = id
      ? document.getElementById(id)
      : btn?.previousElementSibling;
    if (!input) return;
    btn.addEventListener("click", function () {
      const showing = input.getAttribute("type") === "text";
      input.setAttribute("type", showing ? "password" : "text");
      btn.setAttribute("aria-pressed", String(!showing));
      const icon = btn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-eye", showing);
        icon.classList.toggle("fa-eye-slash", !showing);
      }
      btn.setAttribute(
        "aria-label",
        showing ? "Show password" : "Hide password"
      );
    });
  }
  document.querySelectorAll(".toggle-password").forEach(setupToggle);
})();

// Load current user and populate profile
(function () {
  try {
    const store = window.StorageUtil;
    const current = store.getJSON("currentUser", null);
    if (!current || !current.email) {
      // Not logged in; redirect to login
      window.location.href = "login.html";
      return;
    }
    const users = store.getJSON("users", []);
    const user =
      users.find((u) => u.id === current.id) ||
      users.find(
        (u) =>
          (u.email || "").toLowerCase() === String(current.email).toLowerCase()
      );
    const username = (user && user.username) || current.username || "";
    const email = (user && user.email) || current.email || "";
    const avatar = user && user.avatar ? user.avatar : null;

    const dn = document.getElementById("display-name");
    if (dn) dn.textContent = username || "";
    const de = document.getElementById("display-email");
    if (de) de.textContent = email || "";
    const un = document.getElementById("username");
    if (un) un.value = username || "";
    const em = document.getElementById("email");
    if (em) em.value = email || "";
    const pic = document.getElementById("profile-pic");
    if (pic && avatar) {
      pic.src = avatar;
    }
  } catch (e) {
    console.error(e);
  }
})();

// Profile image upload preview + persist to localStorage (compressed)
document.getElementById("file-input")?.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    const dataUrl = ev.target.result;
    // Downscale to max 256x256 to keep storage small
    const imgEl = new Image();
    imgEl.onload = function () {
      const maxSize = 256;
      let { width, height } = imgEl;
      const scale = Math.min(1, maxSize / Math.max(width, height));
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imgEl, 0, 0, w, h);
      const out = canvas.toDataURL("image/jpeg", 0.85);

      const img = document.getElementById("profile-pic");
      if (img) img.src = out;

      try {
        const store = window.StorageUtil;
        const current = store.getJSON("currentUser", null);
        if (!current) return;
        const users = store.getJSON("users", []);
        const idx = users.findIndex((u) => u.id === current.id);
        if (idx >= 0) {
          users[idx].avatar = out;
          store.setJSON("users", users);
        }
      } catch (err) {
        console.error(err);
      }
    };
    imgEl.src = dataUrl;
  };
  reader.readAsDataURL(file);
});

// Save personal info and persist to localStorage
document.getElementById("user-form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("username")?.value.trim() || "";
  const email =
    document.getElementById("email")?.value.trim().toLowerCase() || "";

  if (!name || !email) {
    Swal.fire({
      icon: "warning",
      title: "Missing info",
      text: "Please enter both name and email.",
    });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Invalid email",
      text: "Please enter a valid email address.",
    });
    return;
  }

  try {
    const store = window.StorageUtil;
    const current = store.getJSON("currentUser", null);
    if (!current) throw new Error("Not logged in");
    const users = store.getJSON("users", []);
    const idx = users.findIndex((u) => u.id === current.id);
    if (idx === -1) throw new Error("User not found");

    // Ensure email uniqueness (exclude current user)
    const taken = users.some(
      (u, i) => i !== idx && (u.email || "").toLowerCase() === email
    );
    if (taken) {
      Swal.fire({
        icon: "error",
        title: "Email in use",
        text: "Another account already uses this email.",
      });
      return;
    }

    users[idx].username = name;
    users[idx].email = email;
    store.setJSON("users", users);
    store.setJSON("currentUser", {
      id: users[idx].id,
      username: users[idx].username,
      email: users[idx].email,
    });

    const dn = document.getElementById("display-name");
    if (dn) dn.textContent = name;
    const de = document.getElementById("display-email");
    if (de) de.textContent = email;

    Swal.fire({
      icon: "success",
      title: "Saved",
      text: "Profile updated.",
    });
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Could not save changes.",
    });
  }
});

// Change password and persist to the same user record
document
  .getElementById("password-form")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const store = window.StorageUtil;
    const users = store.getJSON("users", []);
    const current = store.getJSON("currentUser", null);
    const idx = users.findIndex((u) => current && u.id === current.id);
    const saved = idx >= 0 ? users[idx].password || "" : "";
    const cur = document.getElementById("curPassword")?.value || "";
    const npw = document.getElementById("newPassword")?.value || "";
    const cfm = document.getElementById("confirmPassword")?.value || "";
    const fb = document.getElementById("pw-feedback");
    const setMsg = (cls, msg) => {
      if (fb) {
        fb.classList.remove("ok", "err");
        fb.classList.add(cls);
        fb.textContent = msg;
      }
    };
    if (npw.length < 8) {
      setMsg("err", "Password must be at least 8 characters.");
      return;
    }
    if (npw !== cfm) {
      setMsg("err", "New password and confirmation do not match.");
      return;
    }
    if (saved && cur !== saved) {
      setMsg("err", "Current password is incorrect.");
      return;
    }
    try {
      if (idx >= 0) {
        users[idx].password = npw;
        store.setJSON("users", users);
      }
    } catch (_) {}
    // Clear fields and confirm
    const cp = document.getElementById("curPassword");
    if (cp) cp.value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
    setMsg("ok", "Password updated.");
  });

// Password visibility toggles for profile page
(function () {
  function setupToggle(btn) {
    const id = btn.getAttribute("data-target");
    const input = id
      ? document.getElementById(id)
      : btn?.previousElementSibling;
    if (!input) return;
    btn.addEventListener("click", function () {
      const showing = input.getAttribute("type") === "text";
      input.setAttribute("type", showing ? "password" : "text");
      btn.setAttribute("aria-pressed", String(!showing));
      const icon = btn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-eye", showing);
        icon.classList.toggle("fa-eye-slash", !showing);
      }
      btn.setAttribute(
        "aria-label",
        showing ? "Show password" : "Hide password"
      );
    });
  }
  document.querySelectorAll(".toggle-password").forEach(setupToggle);
})();

// Delete account: remove user + all per-user progress keys, then sign out (bind once)
(function () {
  const __del = document.getElementById("delete-account");
  if (!__del || __del.__delBound) return;
  __del.__delBound = true;
  __del.addEventListener("click", function () {
    Swal.fire({
      title: "Delete account?",
      text: "This will permanently remove your profile and learning progress on this device.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    }).then(function (res) {
      if (!res.isConfirmed) return;
      try {
        const S = window.StorageUtil;
        const current = S.getJSON("currentUser", null);
        if (!current) {
          window.location.href = "login.html";
          return;
        }
        // Remove from users list
        const users = S.getJSON("users", []);
        const filtered = Array.isArray(users)
          ? users.filter((u) => u && u.id !== current.id)
          : [];
        S.setJSON("users", filtered);

        // Remove all keys scoped to this user (suffix ::scope)
        const scope = (function () {
          try {
            return String(
              current.id || current.email || current.username || "guest"
            );
          } catch (_) {
            return "guest";
          }
        })();
        const suffix = "::" + scope;
        try {
          const keys = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k) keys.push(k);
          }
          keys.forEach((k) => {
            if (k && k.endsWith(suffix)) localStorage.removeItem(k);
          });
        } catch (_) {}
        try {
          const sKeys = [];
          for (let i = 0; i < sessionStorage.length; i++) {
            const k = sessionStorage.key(i);
            if (k) sKeys.push(k);
          }
          sKeys.forEach((k) => {
            if (k && k.endsWith(suffix)) sessionStorage.removeItem(k);
          });
        } catch (_) {}

        // Clear session
        try {
          localStorage.removeItem("currentUser");
        } catch (_) {}
        try {
          sessionStorage.removeItem("currentUser");
        } catch (_) {}
        S.setJSON("currentUser", null);

        Swal.fire({
          icon: "success",
          title: "Account deleted",
          text: "Your account was removed.",
        });
        setTimeout(function () {
          window.location.href = "login.html";
        }, 800);
      } catch (e) {
        console.error(e);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not delete account.",
        });
      }
    });
  });
})();
