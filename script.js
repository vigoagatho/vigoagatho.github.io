document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navTrack = document.getElementById("navTrack");

navToggle.addEventListener("click", () => {
  const isOpen = navTrack.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

navTrack.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navTrack.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Active section + playhead
const markers = Array.from(document.querySelectorAll(".timeline-nav__marker"));
const sections = markers.map((m) => document.querySelector(m.getAttribute("href")));
const playhead = document.getElementById("playhead");

function updateActiveMarker() {
  let activeIndex = 0;
  const scrollPos = window.scrollY + 140;

  sections.forEach((section, i) => {
    if (section && section.offsetTop <= scrollPos) {
      activeIndex = i;
    }
  });

  markers.forEach((m, i) => m.classList.toggle("is-active", i === activeIndex));

  const activeMarker = markers[activeIndex];
  if (activeMarker && playhead) {
    playhead.style.left = activeMarker.offsetLeft + "px";
    playhead.style.width = activeMarker.offsetWidth + "px";
  }
}

window.addEventListener("scroll", updateActiveMarker, { passive: true });
window.addEventListener("resize", updateActiveMarker);
window.addEventListener("load", updateActiveMarker);
