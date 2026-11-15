let resync = () => {};

export function resyncScroll(y = window.scrollY) {
  resync(y);
}

/**
 * Lerped wheel scrolling, mirroring the original page.
 * Skipped on touch devices and when reduced motion is requested.
 */
export function initSmoothScroll() {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (coarse || reduced) return () => {};

  let target = window.scrollY;
  let current = window.scrollY;
  let raf = null;
  let maxScroll = 1;

  const measure = () => {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };

  const loop = () => {
    raf = null;
    current += (target - current) * 0.115;
    if (Math.abs(target - current) < 0.5) current = target;
    window.scrollTo(0, Math.round(current));
    if (Math.abs(target - current) > 0.5) raf = requestAnimationFrame(loop);
  };

  const onWheel = (event) => {
    if (document.body.classList.contains('menu-open')) return;
    event.preventDefault();
    /* the page grows as deferred sections and images arrive, so remeasure here */
    measure();
    const delta =
      event.deltaMode === 1
        ? event.deltaY * 33
        : event.deltaMode === 2
          ? event.deltaY * window.innerHeight
          : event.deltaY;
    target = Math.max(0, Math.min(maxScroll, target + delta));
    if (!raf) raf = requestAnimationFrame(loop);
  };

  const onScroll = () => {
    if (!raf && Math.abs(window.scrollY - current) > 2) {
      target = current = window.scrollY;
    }
  };

  measure();

  let observer;
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
  }

  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('scroll', onScroll, { passive: true });

  resync = (y) => {
    measure();
    target = current = typeof y === 'number' ? y : window.scrollY;
  };

  return () => {
    if (raf) cancelAnimationFrame(raf);
    if (observer) observer.disconnect();
    window.removeEventListener('resize', measure);
    window.removeEventListener('load', measure);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('scroll', onScroll);
    resync = () => {};
  };
}
