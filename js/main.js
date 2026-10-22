(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a[href]").forEach((link) => {
    const href = (link.getAttribute("href") || "").split("?")[0].toLowerCase();
    if (href === page || ((page === "" || page === "/") && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });

  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    const setOpen = (open) => {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const panel = item.querySelector(".faq-panel");
      const willOpen = panel.hidden;
      item.parentElement.querySelectorAll(".faq-item").forEach((other) => {
        other.querySelector(".faq-panel").hidden = true;
        other.querySelector("button").setAttribute("aria-expanded", "false");
      });
      panel.hidden = !willOpen;
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });

  const filters = document.querySelector(".filters");
  if (filters) {
    const cards = [...document.querySelectorAll(".work-page-grid .work-card")];
    const empty = document.querySelector(".empty");
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      filters.querySelectorAll("button").forEach((item) => {
        item.classList.toggle("is-on", item === button);
      });
      const filter = button.dataset.filter;
      let shown = 0;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.cat === filter;
        card.hidden = !match;
        if (match) shown += 1;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  }

  const form = document.querySelector("#enquiry");
  if (form) {
    const params = new URLSearchParams(location.search);
    const service = params.get("service");
    const project = params.get("project");
    const serviceField = form.querySelector("#service");
    const message = form.querySelector("#message");
    if (service && serviceField && [...serviceField.options].some((option) => option.value === service)) {
      serviceField.value = service;
    }
    if (project && message && !message.value) {
      message.value = `I want to talk about a project like ${project}.`;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const trap = form.querySelector("#company");
      const success = document.querySelector(".form-success");
      if (trap && trap.value) {
        form.hidden = true;
        if (success) success.hidden = false;
        return;
      }

      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const wrap = field.closest(".field");
        const filled = field.value.trim().length > 0 && field.checkValidity();
        wrap.classList.toggle("is-invalid", !filled);
        const error = wrap.querySelector(".error");
        if (error) error.hidden = filled;
        if (!filled) valid = false;
      });
      if (!valid) {
        const first = form.querySelector(".is-invalid input, .is-invalid select, .is-invalid textarea");
        if (first) first.focus();
        return;
      }

      const data = new FormData(form);
      const lines = [
        `Name: ${data.get("name")}`,
        `Brand: ${data.get("brand")}`,
        `Email: ${data.get("email")}`,
        `Phone: ${data.get("phone") || "—"}`,
        `Service: ${data.get("service")}`,
        `Budget: ${data.get("budget") || "—"}`,
        "",
        String(data.get("message") || ""),
      ];
      const href = `mailto:hello@ezer.studio?subject=${encodeURIComponent(
        "Ezer enquiry — " + data.get("brand")
      )}&body=${encodeURIComponent(lines.join("\n"))}`;
      const mail = document.querySelector("#mailto-link");
      if (mail) mail.href = href;
      form.hidden = true;
      if (success) success.hidden = false;
    });
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
