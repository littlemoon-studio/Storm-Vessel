/* Storm magnetic scroll snap: after scrolling settles, eases the nearest section top into place if it is within the snap zone. */
(() => {
  const cfg = document.currentScript ? document.currentScript.dataset : {};
  const zonePct = Number(cfg.zone || 22) / 100;
  const duration = Number(cfg.duration || 700);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let timer = null, raf = null, touching = false;
  const ease = (t) => 1 - Math.pow(1 - t, 4);
  const headerOffset = () => parseFloat(getComputedStyle(document.body).getPropertyValue('--header-height')) || 0;
  const targets = () => [...document.querySelectorAll('#MainContent > .shopify-section')].filter((el) => el.offsetHeight > 240);
  const cancel = (e) => {
    if (e.type === 'touchend') { touching = false; return; }
    if (e.type === 'touchstart') touching = true;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  };
  ['wheel', 'touchstart', 'touchend', 'keydown', 'mousedown'].forEach((t) => window.addEventListener(t, cancel, { passive: true }));
  const trySnap = () => {
    if (touching) return;
    const offset = headerOffset(), zone = zonePct * window.innerHeight;
    let best = null;
    for (const el of targets()) {
      const d = el.getBoundingClientRect().top - offset;
      if (Math.abs(d) < zone && (best === null || Math.abs(d) < Math.abs(best))) best = d;
    }
    if (best === null || Math.abs(best) < 2) return;
    const start = window.scrollY, t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, start + best * ease(t));
      raf = t < 1 ? requestAnimationFrame(step) : null;
    };
    raf = requestAnimationFrame(step);
  };
  window.addEventListener('scroll', () => {
    if (raf) return;
    clearTimeout(timer);
    timer = setTimeout(trySnap, 140);
  }, { passive: true });
})();
