import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from './gsap';

const HERO_SCOPE = '.hero, .about-hero, .dl-hero';
const ABOVE_FOLD_LINES = '.hero .rv, .about-hero .rv, .dl-hero .rv';
const ABOVE_FOLD_FADES =
  '.hero [data-fade], .about-hero [data-fade], .dl-hero [data-fade]';

function inHero(element) {
  return Boolean(element.closest(HERO_SCOPE));
}

/**
 * Plays the first-screen entrance: headline lines rise, supporting copy fades in.
 * Runs once per page mount, after the intro curtain hands over.
 */
export function usePageIntro(rootRef, { ready, reduced, playPhone = false }) {
  useLayoutEffect(() => {
    if (!ready) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const above = gsap.utils.toArray(ABOVE_FOLD_LINES, root);
    const fades = gsap.utils.toArray(ABOVE_FOLD_FADES, root);
    const bars = root.querySelectorAll('#bars i');

    if (reduced) {
      gsap.set(above, { yPercent: 0, y: 0 });
      gsap.set(fades, { opacity: 1, y: 0 });
      gsap.set(bars, { scaleY: 1 });
      return undefined;
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
    if (above.length) {
      timeline.fromTo(
        above,
        { yPercent: 115, y: 0 },
        { yPercent: 0, y: 0, duration: 1.05, stagger: 0.08 },
        0.05,
      );
    }
    if (fades.length) {
      timeline.fromTo(
        fades,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 },
        0.35,
      );
    }
    if (playPhone) {
      timeline
        .fromTo(
          '#phone',
          { scale: 0.84, y: 70, opacity: 0 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 1.25,
            ease: 'power3.out',
            clearProps: 'scale,opacity',
          },
          0.15,
        )
        .to(
          '#bars i',
          { scaleY: 1, duration: 0.8, stagger: 0.045, ease: 'power2.out' },
          0.85,
        );
    }

    return () => {
      timeline.kill();
    };
  }, [ready, reduced, playPhone, rootRef]);
}

/**
 * Hides scroll-revealed copy and headline lines, then reveals each one
 * as it enters the viewport.
 */
export function useScrollReveal(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const context = gsap.context(() => {
      gsap.utils.toArray('[data-fade]', root).forEach((element) => {
        if (inHero(element)) return;
        gsap.fromTo(
          element,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          },
        );
      });

      gsap.utils.toArray('.reveal .rv', root).forEach((element) => {
        if (inHero(element)) return;
        gsap.to(element, {
          yPercent: 0,
          y: 0,
          duration: 1.05,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element.closest('.reveal'),
            start: 'top 86%',
            once: true,
          },
        });
      });
    }, root);

    ScrollTrigger.refresh();

    return () => context.revert();
  }, [rootRef]);
}
