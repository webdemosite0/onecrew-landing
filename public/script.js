(() => {
  const initReveal = () => {
    const items = document.querySelectorAll(".reveal:not([data-reveal-ready])");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        window.setTimeout(() => el.classList.add("visible"), Number(el.dataset.delay || 0));
        io.unobserve(el);
      });
    }, { threshold: 0.08 });
    items.forEach((el) => {
      el.dataset.revealReady = "1";
      io.observe(el);
    });
  };

  const initHeroParallax = () => {
    const scene = document.querySelector(".hero-scene");
    if (!scene || scene.dataset.parallaxReady) return;
    scene.dataset.parallaxReady = "1";
    scene.addEventListener("pointermove", (e) => {
      const r = scene.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      scene.querySelectorAll(".bot").forEach((bot, i) => {
        const n = (i % 5 + 1) * 0.9;
        bot.style.translate = x * n * 2 + "px " + y * n + "px";
      });
    });
    scene.addEventListener("pointerleave", () => {
      scene.querySelectorAll(".bot").forEach((bot) => (bot.style.translate = ""));
    });
  };

  // Remove only the dark matte connected to image edges.
  // Black details inside the mascots (eyes, camera, etc.) stay untouched.
  const cleanCrewImage = (img) => {
    if (!img || img.dataset.matteCleaned || !img.src.includes("/crew/")) return;
    if (!img.complete || !img.naturalWidth) {
      img.addEventListener("load", () => cleanCrewImage(img), { once: true });
      return;
    }
    img.dataset.matteCleaned = "working";
    try {
      const canvas = document.createElement("canvas");
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const frame = ctx.getImageData(0, 0, w, h);
      const d = frame.data;
      const seen = new Uint8Array(w * h);
      const stack = [];
      const isMatte = (idx) => {
        const p = idx * 4;
        const r = d[p], g = d[p + 1], b = d[p + 2], a = d[p + 3];
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        return a > 0 && max < 82 && max - min < 28;
      };
      const push = (idx) => {
        if (idx < 0 || idx >= w * h || seen[idx] || !isMatte(idx)) return;
        seen[idx] = 1;
        stack.push(idx);
      };
      for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
      for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
      while (stack.length) {
        const idx = stack.pop();
        const p = idx * 4;
        d[p + 3] = 0;
        const x = idx % w, y = (idx / w) | 0;
        if (x > 0) push(idx - 1);
        if (x < w - 1) push(idx + 1);
        if (y > 0) push(idx - w);
        if (y < h - 1) push(idx + w);
      }
      ctx.putImageData(frame, 0, 0);
      img.dataset.matteCleaned = "1";
      img.src = canvas.toDataURL("image/png");
    } catch {
      img.dataset.matteCleaned = "fallback";
    }
  };

  const cleanAllCrew = (root = document) => {
    root.querySelectorAll?.('img[src*="/crew/"]').forEach(cleanCrewImage);
  };

  const boot = () => {
    initReveal();
    initHeroParallax();
    cleanAllCrew();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches?.('img[src*="/crew/"]')) cleanCrewImage(node);
          cleanAllCrew(node);
        });
      }
      initReveal();
      initHeroParallax();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();