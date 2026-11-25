document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navTrack = document.getElementById("navTrack");

navToggle.addEventListener("click", () => {
  const isOpen = navTrack.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
});

navTrack.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navTrack.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Buka menu");
  });
});

// Timeline nav: continuous playhead + reel timecode
const markers = Array.from(document.querySelectorAll(".timeline-nav__marker"));
const sections = markers.map((marker) => document.querySelector(marker.getAttribute("href")));
const playhead = document.getElementById("playhead");
const timecodeEl = document.getElementById("reelTimecode");

// Section start times in minutes, matching the nav labels.
const SECTION_TIMES = [0, 8, 16, 30, 36, 42, 50];
const NAV_OFFSET = 140;

const pad = (value) => String(value).padStart(2, "0");

function formatTimecode(minutes) {
  const totalSeconds = Math.max(0, minutes) * 60;
  const mm = Math.floor(totalSeconds / 60);
  const ss = Math.floor(totalSeconds % 60);
  const ff = Math.floor((totalSeconds % 1) * 24);
  return `00:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
}

function updateTimeline() {
  const available = sections.every(Boolean);
  if (!available || !markers.length) return;

  const tops = sections.map((section) => section.offsetTop);
  const docHeight = document.documentElement.scrollHeight;
  const maxScroll = Math.max(0, docHeight - window.innerHeight);
  const probe = window.scrollY + NAV_OFFSET;

  let index = 0;
  tops.forEach((top, i) => {
    if (top <= probe) index = i;
  });

  const atTop = window.scrollY <= 1;
  const atBottom = Math.ceil(window.scrollY) >= maxScroll - 2;
  if (atTop) {
    index = 0;
  } else if (atBottom) {
    index = markers.length - 1;
  }

  let fraction = 0;
  if (atTop) {
    fraction = 0;
  } else if (index < tops.length - 1) {
    const start = tops[index];
    const end = tops[index + 1];
    fraction = (probe - start) / Math.max(1, end - start);
  } else if (!atBottom) {
    const start = tops[index];
    const end = Math.max(start + 1, docHeight - window.innerHeight + NAV_OFFSET);
    fraction = (probe - start) / (end - start);
  } else {
    fraction = 1;
  }
  fraction = Math.min(1, Math.max(0, fraction));

  markers.forEach((marker, i) => {
    marker.classList.toggle("is-active", i === index);
    if (i === index) {
      marker.setAttribute("aria-current", "true");
    } else {
      marker.removeAttribute("aria-current");
    }
  });

  const startTime = SECTION_TIMES[index] ?? 0;
  const endTime = SECTION_TIMES[index + 1] ?? SECTION_TIMES[SECTION_TIMES.length - 1];
  if (timecodeEl) {
    timecodeEl.textContent = formatTimecode(startTime + (endTime - startTime) * fraction);
  }

  const current = markers[index];
  const next = markers[index + 1];
  if (current && playhead) {
    const startX = current.offsetLeft;
    const startW = current.offsetWidth;
    const endX = next ? next.offsetLeft : startX;
    const endW = next ? next.offsetWidth : startW;
    playhead.style.left = `${startX + (endX - startX) * fraction}px`;
    playhead.style.width = `${startW + (endW - startW) * fraction}px`;
  }
}

let ticking = false;
function requestTimelineUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateTimeline();
    ticking = false;
  });
}

window.addEventListener("scroll", requestTimelineUpdate, { passive: true });
window.addEventListener("resize", requestTimelineUpdate);
window.addEventListener("load", updateTimeline);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(updateTimeline);
}

// Case study dialogs
document.querySelectorAll("[data-case]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dialog = document.getElementById(`case-${trigger.dataset.case}`);
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  });
});

document.querySelectorAll("dialog.case-study").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });
});
