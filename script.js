(() => {
  const intro = document.getElementById("intro");
  const enterBtn = document.getElementById("enterBtn");
  const main = document.getElementById("main");
  const glow = document.querySelector(".cursor-glow");

  const startSite = () => {
    intro.classList.add("is-gone");
    main.hidden = false;
    document.body.classList.add("has-glow");
    requestAnimationFrame(() => {
      observeReveals();
    });
    setTimeout(() => {
      intro.remove();
    }, 950);
  };

  enterBtn.addEventListener("click", startSite);

  // Soft cursor glow
  let glowX = 0;
  let glowY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener(
    "pointermove",
    (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    },
    { passive: true }
  );

  const tickGlow = () => {
    glowX += (targetX - glowX) * 0.12;
    glowY += (targetY - glowY) * 0.12;
    if (glow) {
      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
    }
    requestAnimationFrame(tickGlow);
  };
  tickGlow();

  // Scroll reveals
  const observeReveals = () => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
  };

  // Gallery lightbox
  const shots = [...document.querySelectorAll(".shot")];
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  let current = 0;

  const openLightbox = (index) => {
    current = index;
    const shot = shots[current];
    const img = shot.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = shot.dataset.slogan || shot.querySelector("figcaption")?.textContent || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  };

  const showNext = (dir) => {
    current = (current + dir + shots.length) % shots.length;
    openLightbox(current);
  };

  shots.forEach((shot, i) => {
    shot.addEventListener("click", () => openLightbox(i));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => showNext(-1));
  lightboxNext.addEventListener("click", () => showNext(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext(1);
    if (e.key === "ArrowLeft") showNext(-1);
  });

  // Gentle parallax on hero
  const heroImg = document.querySelector(".hero-img");
  window.addEventListener(
    "scroll",
    () => {
      if (!heroImg || main.hidden) return;
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.translate = `0 ${y * 0.18}px`;
      }
    },
    { passive: true }
  );
})();
