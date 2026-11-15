import { useLayoutEffect, useRef } from 'react';
import { useCoarsePointer, usePrefersReducedMotion } from '../lib/useMediaQuery';
import { gsap } from '../lib/gsap';

const SELECTOR = '.btn-big,.btn-accent,.btn-ghost,.btn-pill';

/**
 * Magnetic buttons: the element leans toward the pointer, then springs back.
 * One delegated listener so lazily mounted buttons work too.
 */
export default function useMagneticButtons() {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();

  useLayoutEffect(() => {
    if (reduced || coarse) return undefined;

    let hovered = null;

    const reset = (element) => {
      gsap.to(element, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,.55)' });
    };

    const onPointerMove = (event) => {
      const element = event.target.closest(SELECTOR);
      if (element !== hovered) {
        if (hovered) reset(hovered);
        hovered = element;
      }
      if (!element) return;
      const rect = element.getBoundingClientRect();
      gsap.to(element, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.16,
        y: (event.clientY - rect.top - rect.height / 2) * 0.28,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const onPointerLeave = () => {
      if (hovered) reset(hovered);
      hovered = null;
    };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      if (hovered) gsap.killTweensOf(hovered);
    };
  }, [reduced, coarse]);
}
