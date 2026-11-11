/* ============================================================
   Ahmed Kabia – UX Portfolio · js/main.js
   1. Projects dropdown in the navigation (tap/click on mobile)
   2. Hamburger menu on small screens
   3. Image viewer (lightbox) for any figure with data-gallery
   ============================================================ */

/* 1. Navigation dropdown */
(function () {
  var dd = document.querySelector(".dd");
  if (!dd) return;
  var btn = dd.querySelector(".ddbtn");

  function set(open) {
    dd.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    set(!dd.classList.contains("open"));
  });
  document.addEventListener("click", function (e) {
    if (!dd.contains(e.target)) set(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") set(false);
  });
})();

/* 2. Hamburger menu (the button only shows on small screens; see styles.css) */
(function () {
  var btn = document.querySelector(".menubtn"),
      nav = document.getElementById("mainnav");
  if (!btn || !nav) return;

  function set(open) {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    set(!nav.classList.contains("open"));
  });
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target) && !btn.contains(e.target)) set(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      set(false);
      btn.focus();
    }
  });
  /* Reset when the window is widened past the breakpoint (keep in sync with styles.css) */
  var wide = window.matchMedia("(min-width: 721px)");
  function onChange(e) { if (e.matches) set(false); }
  if (wide.addEventListener) wide.addEventListener("change", onChange);
  else wide.addListener(onChange);
})();


/* 3. Image viewer
   Figures that share the same data-gallery value are grouped, and the
   arrow buttons switch between them. Add data-tall to a figure for very
   tall images so they scroll inside the viewer. */
(function () {
  var dlg = document.getElementById("lb");
  if (!dlg) return;
  var stage = document.getElementById("lbstage"),
      cap = document.getElementById("lbcap"),
      prev = document.getElementById("lbprev"),
      next = document.getElementById("lbnext");
  var items = [], i = 0, opener = null;

  function render() {
    var f = items[i],
        src = f.querySelector("img") || f.querySelector(".ph");
    stage.className = "lbstage" + (f.hasAttribute("data-tall") ? " tall" : "");
    stage.scrollTop = 0;
    stage.textContent = "";
    stage.appendChild(src.cloneNode(true));
    var fc = f.querySelector("figcaption"),
        base = fc ? fc.textContent : "";
    cap.textContent = base + (items.length > 1
      ? (base ? " (" : "(") + (i + 1) + " of " + items.length + ")"
      : "");
  }
  function step(d) {
    i = (i + d + items.length) % items.length;
    render();
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".shot");
    if (!b) return;
    var fig = b.closest("figure"),
        g = fig.getAttribute("data-gallery");
    items = Array.prototype.slice.call(
      document.querySelectorAll('figure[data-gallery="' + g + '"]'));
    i = items.indexOf(fig);
    opener = b;
    prev.hidden = next.hidden = items.length < 2;
    render();
    dlg.showModal();
  });
  prev.onclick = function () { step(-1); };
  next.onclick = function () { step(1); };
  document.getElementById("lbclose").onclick = function () { dlg.close(); };
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg || e.target.className === "lbwrap") dlg.close();
  });
  dlg.addEventListener("keydown", function (e) {
    if (items.length > 1) {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    }
  });
  dlg.addEventListener("close", function () { if (opener) opener.focus(); });
})();
