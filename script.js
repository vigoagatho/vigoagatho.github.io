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

  // If the page is scrolled to (or near) the bottom, force the last marker
  // active — short trailing sections/footer can mean scrollPos never
  // actually reaches the last section's offsetTop.
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom) {
    activeIndex = markers.length - 1;
  }

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

// Project reel horizontal scroller: arrow buttons + edge fade state
document.querySelectorAll(".reel__scroller").forEach((scroller) => {
  const track = scroller.querySelector(".clip-grid");
  const prevBtn = scroller.querySelector(".reel__arrow--prev");
  const nextBtn = scroller.querySelector(".reel__arrow--next");
  if (!track) return;

  function refreshEdges() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    scroller.classList.toggle("is-at-start", track.scrollLeft <= 4);
    scroller.classList.toggle("is-at-end", track.scrollLeft >= maxScroll - 4);
  }

  function scrollByCard(direction) {
    const card = track.querySelector(".clip-card");
    const step = card ? card.getBoundingClientRect().width + 20 : 280;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  prevBtn?.addEventListener("click", () => scrollByCard(-1));
  nextBtn?.addEventListener("click", () => scrollByCard(1));
  track.addEventListener("scroll", refreshEdges, { passive: true });
  window.addEventListener("resize", refreshEdges);
  refreshEdges();
});
