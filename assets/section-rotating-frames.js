window.RotatingFrames = (function () {
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(sectionEl) {
    if (!sectionEl) return;

    if (sectionEl._rfTimer) clearInterval(sectionEl._rfTimer);
    if (prefersReducedMotion) return;

    var startTime = Date.now();

    var frames = Array.prototype.map.call(sectionEl.querySelectorAll('[data-rf-frame]'), function (el) {
      var duration = parseInt(el.getAttribute('data-duration'), 10) || 4000;
      var delay = parseInt(el.getAttribute('data-delay'), 10) || 0;
      return {
        imageSlides: el.querySelectorAll('[data-rf-image-stack] [data-rf-slide]'),
        infoSlides: el.querySelectorAll('[data-rf-info-stack] [data-rf-slide]'),
        duration: duration,
        firstChange: delay > 0 ? delay : duration,
        current: 0
      };
    });

    function tick() {
      var elapsed = Date.now() - startTime;

      frames.forEach(function (frame) {
        var count = frame.imageSlides.length;
        if (count < 2) return;

        var step = elapsed < frame.firstChange ? 0 : Math.floor((elapsed - frame.firstChange) / frame.duration) + 1;
        var next = step % count;
        if (next === frame.current) return;

        frame.imageSlides[frame.current].classList.remove('is-active');
        if (frame.infoSlides[frame.current]) frame.infoSlides[frame.current].classList.remove('is-active');

        frame.imageSlides[next].classList.add('is-active');
        if (frame.infoSlides[next]) frame.infoSlides[next].classList.add('is-active');

        frame.current = next;
      });
    }

    sectionEl._rfTimer = setInterval(tick, 100);
  }

  return { init: init };
})();
