// HOME CAROUSEL: auth guard + logout + scroll-snap + swipe + dots + arrows (desktop)

// =====================
// AUTH GUARD
// =====================
try {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    // kalau belum login, lempar balik ke halaman login
    window.location.href = "index.html";
  }
} catch (e) {
  // kalau localStorage error, anggap belum login
  window.location.href = "index.html";
}

// =====================
// LOGOUT BUTTON
// =====================
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loggedInEmail");
    } catch (e) {
      console.warn("localStorage error:", e);
    }
    window.location.href = "index.html";
  });
}

// =====================
// CAROUSEL
// =====================

const track = document.querySelector(".home-carousel-track");
const slides = Array.from(document.querySelectorAll(".home-slide"));
const dots = Array.from(document.querySelectorAll(".home-dot-btn"));
const prevBtn = document.querySelector(".home-nav--prev");
const nextBtn = document.querySelector(".home-nav--next");

let currentIndex = 0;

// flag untuk bedakan scroll dari JS vs scroll dari user
let isProgrammaticScroll = false;
let programmaticTimeout = null;

function setActive(index) {
  currentIndex = index;

  slides.forEach((slide, idx) => {
    slide.classList.toggle("home-slide--active", idx === index);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle("home-dot-btn--active", idx === index);
  });
}

function normalizeIndex(index) {
  if (!slides.length) return 0;
  if (index < 0) return slides.length - 1;
  if (index >= slides.length) return 0;
  return index;
}

function scrollToSlide(index) {
  if (!slides.length) return;

  const targetIndex = normalizeIndex(index);
  const target = slides[targetIndex];

  // tandai bahwa ini scroll yang dipicu oleh JS
  isProgrammaticScroll = true;
  clearTimeout(programmaticTimeout);

  target.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });

  setActive(targetIndex);

  // setelah animasi smooth scroll kira2 selesai, izinkan scroll handler lagi
  programmaticTimeout = setTimeout(() => {
    isProgrammaticScroll = false;
  }, 450);
}

if (track && slides.length) {
  // initial state
  setActive(0);

  // tombol ← → (panah hanya kelihatan di desktop dari CSS, tapi event tetap aman)
  prevBtn?.addEventListener("click", () => {
    scrollToSlide(currentIndex - 1);
  });

  nextBtn?.addEventListener("click", () => {
    scrollToSlide(currentIndex + 1);
  });

  // dots / avatar di bawah
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = Number(dot.dataset.index);
      if (!Number.isNaN(idx)) {
        scrollToSlide(idx);
      }
    });
  });

  // deteksi slide aktif saat user swipe/scroll manual
  let scrollTimeout;

  track.addEventListener("scroll", () => {
    // kalau sedang programmatic scroll (arrow/dot), jangan override
    if (isProgrammaticScroll) return;

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const trackRect = track.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;

      let closestIndex = 0;
      let smallestDelta = Infinity;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const delta = Math.abs(slideCenter - centerX);

        if (delta < smallestDelta) {
          smallestDelta = delta;
          closestIndex = index;
        }
      });

      setActive(closestIndex);
    }, 80); // debounce kecil
  });
}
