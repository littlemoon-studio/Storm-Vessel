/*
 * Storm polish layer: small, quiet details that make the site feel finished.
 * Everything here is an enhancement. If this file fails, the site still works and nothing stays hidden.
 *  1. Lazy product images fade in instead of popping in.
 *  2. A thin loading bar shows while filters, cart and search requests are in flight.
 *  3. Home page sections below the first screen rise in once as they scroll into view.
 * All motion is skipped for visitors who ask their device to reduce motion.
 */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Image fade-in ------------------------------------------------------------------- */
  const IMG = '.card-gallery img[loading="lazy"], .storm-card__media img[loading="lazy"], .product-media-container img[loading="lazy"]';
  const markImage = (img) => {
    if (img.dataset.stormFade) return;
    img.dataset.stormFade = '1';
    img.decoding = 'async';
    if (reduce || img.complete) return;
    img.classList.add('storm-img-fade');
    const show = () => img.classList.add('storm-img-in');
    img.addEventListener('load', show, { once: true });
    img.addEventListener('error', show, { once: true });
  };
  const scanImages = () => document.querySelectorAll(IMG).forEach(markImage);
  scanImages();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; scanImages(); });
  }).observe(document.body, { childList: true, subtree: true });

  /* 2. Loading bar for filter, cart and search requests --------------------------------- */
  const bar = document.createElement('div');
  bar.id = 'storm-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  const WATCH = /([?&](section_id|sections)=|\/cart\/(add|change|update|clear)|\/search\/suggest)/;
  let pending = 0, startTimer = null, visible = false;
  const begin = () => { clearTimeout(startTimer); startTimer = setTimeout(() => { visible = true; bar.className = 'is-on'; }, 160); };
  const finish = () => {
    clearTimeout(startTimer);
    if (!visible) return;
    bar.className = 'is-done';
    setTimeout(() => { bar.className = ''; visible = false; }, 450);
  };
  const nativeFetch = window.fetch;
  window.fetch = function (input) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const request = nativeFetch.apply(this, arguments);
    if (WATCH.test(url)) {
      pending++;
      if (pending === 1) begin();
      const done = () => { pending = Math.max(0, pending - 1); if (pending === 0) finish(); };
      request.then(done, done);
    }
    return request;
  };

  /* 3. Home page: sections below the first screen rise in once ----------------------------- */
  const main = document.querySelector('main[data-template="index"]');
  if (!reduce && main && 'IntersectionObserver' in window) {
    const sections = [...main.querySelectorAll(':scope > .shopify-section')].slice(2)
      .filter((s) => !s.querySelector('.storm-split') && !s.querySelector('marquee-component'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('storm-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.92) return;   // already on screen: leave it alone
      s.classList.add('storm-reveal');
      io.observe(s);
    });
  }
})();
