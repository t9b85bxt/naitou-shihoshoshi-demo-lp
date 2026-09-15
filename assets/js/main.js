(() => {
  "use strict";

  /* ---------------------------------------------------------------
     Sticky header shadow on scroll
  --------------------------------------------------------------- */
  const header = document.getElementById("site-header");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      header.classList.remove("nav-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------------------------------------------------------------
     Reveal-on-scroll: each [data-reveal] group animates its direct
     children together (staggered via CSS --i), once, on first view.
  --------------------------------------------------------------- */
  const revealGroups = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    revealGroups.forEach((group) => io.observe(group));
  } else {
    revealGroups.forEach((group) => group.classList.add("is-visible"));
  }

  /* ---------------------------------------------------------------
     Privacy note toggle (contact form)
  --------------------------------------------------------------- */
  const privacyToggle = document.getElementById("privacy-toggle");
  const privacyNote = document.getElementById("privacy-note");

  privacyToggle.addEventListener("click", () => {
    const isHidden = privacyNote.hidden;
    privacyNote.hidden = !isHidden;
    privacyToggle.setAttribute("aria-expanded", String(isHidden));
    privacyToggle.textContent = isHidden ? "取り扱いを閉じる" : "取り扱いをこの場で確認";
  });

  /* ---------------------------------------------------------------
     Contact form: client-side validation + demo success state
     (no network request — this is a static sales demo)
  --------------------------------------------------------------- */
  const form = document.getElementById("contact-form");
  const successPanel = document.getElementById("form-success");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(fieldEl, hasError) {
    const wrapper = fieldEl.closest(".field");
    wrapper.classList.toggle("has-error", hasError);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const type = document.getElementById("f-type");
    const name = document.getElementById("f-name");
    const email = document.getElementById("f-email");
    const agree = document.getElementById("f-agree");

    let valid = true;

    const typeOk = !!type.value;
    setFieldError(type, !typeOk);
    if (!typeOk) valid = false;

    const nameOk = name.value.trim().length > 0;
    setFieldError(name, !nameOk);
    if (!nameOk) valid = false;

    const emailOk = emailPattern.test(email.value.trim());
    setFieldError(email, !emailOk);
    if (!emailOk) valid = false;

    const agreeOk = agree.checked;
    setFieldError(agree, !agreeOk);
    if (!agreeOk) valid = false;

    if (!valid) {
      const firstError = form.querySelector(".field.has-error input, .field.has-error select");
      if (firstError) firstError.focus();
      return;
    }

    form.hidden = true;
    successPanel.hidden = false;
    successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  [
    ["f-type", "change"],
    ["f-name", "input"],
    ["f-email", "input"],
    ["f-agree", "change"],
  ].forEach(([id, evt]) => {
    const el = document.getElementById(id);
    el.addEventListener(evt, () => setFieldError(el, false));
  });
})();
