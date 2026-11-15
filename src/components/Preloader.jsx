import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

const WORD = 'EARTHSYNC';

/**
 * Intro curtain. Lifts the "preload" class from the body and hands over to the
 * hero entrance once the counter is nearly done.
 */
export default function Preloader({ onBoot, onDone }) {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);
  const bootRef = useRef(onBoot);
  const doneRef = useRef(onDone);
  bootRef.current = onBoot;
  doneRef.current = onDone;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      root.style.display = 'none';
      document.body.classList.remove('preload');
      bootRef.current();
      doneRef.current();
      return undefined;
    }

    const chars = root.querySelectorAll('.ch');
    const counter = { value: 0 };

    gsap.set(chars, { yPercent: 120, y: 0 });

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline
      .to(chars, { yPercent: 0, duration: 0.85, stagger: 0.05, ease: 'power4.out' }, 0.15)
      .to(barRef.current, { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.25)
      .to(
        counter,
        {
          value: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate() {
            if (!countRef.current) return;
            countRef.current.textContent = ('00' + Math.round(counter.value)).slice(-3);
          },
        },
        0.25,
      )
      .to(chars, { yPercent: -120, duration: 0.55, stagger: 0.02, ease: 'power2.in' }, '+=.12')
      .to(root, { yPercent: -100, duration: 0.75, ease: 'power4.inOut' }, '-=.18')
      .add(() => {
        document.body.classList.remove('preload');
        bootRef.current();
      }, '-=.30')
      .add(() => {
        root.style.display = 'none';
        doneRef.current();
      });

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div className="preloader" id="preloader" aria-hidden="true" ref={rootRef}>
      <div className="pre-tag">NASA Space Apps Challenge 2026</div>
      <div className="pre-word" id="preWord">
        {WORD.split('').map((char, index) => (
          <span className="ch" key={index}>
            {char}
          </span>
        ))}
      </div>
      <div className="pre-bar">
        <i id="preBar" ref={barRef} />
      </div>
      <div className="pre-count" id="preCount" ref={countRef}>
        000
      </div>
    </div>
  );
}
