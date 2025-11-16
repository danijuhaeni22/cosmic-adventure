// HOME CAROUSEL: scroll-snap + swipe + dots + (opsional) arrows di desktop

const track = document.querySelector(".home-carousel-track");
const slides = Array.from(document.querySelectorAll(".home-slide"));
const dots = Array.from(document.querySelectorAll(".home-dot-btn"));
const prevBtn = document.querySelector(".home-nav--prev");
const nextBtn = document.querySelector(".home-nav--next");

let currentIndex = 0;

function setActive(index) {
  currentIndex = index;

  slides.forEach((slide, idx) => {
    slide.classList.toggle("home-slide--active", idx === index);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle("home-dot-btn--active", idx === index);
  });
}

function scrollToSlide(index) {
  if (!slides.length) return;

  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;

  const target = slides[index];
  target.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });

  setActive(index);
}

if (track && slides.length) {
  // initial state
  setActive(0);

  // tombol ← → (hanya muncul di desktop via CSS)
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
    }, 80); // debounce sedikit biar nggak kebanyakan hitung
  });
}
