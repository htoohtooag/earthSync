import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';

const ITEMS = [
  'Smarter rotations',
  'NASA evidence',
  'Less stress',
  'Plain language',
  'Burmese + English',
  'No sign-up',
  'Works with weak internet',
];

export default function Marquee() {
  const trackRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return undefined;
    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      repeat: -1,
      ease: 'none',
      duration: 26,
    });
    return () => tween.kill();
  }, [reduced]);

  return (
    <div className="marquee" aria-hidden="true">
      <div className="track" id="mqTrack" ref={trackRef}>
        {ITEMS.map((item) => (
          <span key={item}>{item}</span>
        ))}
        {ITEMS.map((item) => (
          <span key={item + '-copy'}>{item}</span>
        ))}
      </div>
    </div>
  );
}
