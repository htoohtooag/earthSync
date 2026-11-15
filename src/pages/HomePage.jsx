import { Suspense, lazy, useLayoutEffect, useRef } from 'react';
import DeferredMount from '../components/DeferredMount.jsx';
import Marquee from '../components/Marquee.jsx';
import PhoneMockup from '../components/PhoneMockup.jsx';
import Reveal from '../components/Reveal.jsx';
import HomeSections from './HomeSections.jsx';
import { gsap } from '../lib/gsap';
import { usePageIntro } from '../lib/usePageAnimations.js';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';

const HeroScene = lazy(() => import('../components/HeroScene.jsx'));

export default function HomePage({ ready, onNavigate, showPhoneIntro }) {
  const rootRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (!ready || reduced) return undefined;
    const root = rootRef.current;
    const phone = root?.querySelector('#phone');
    const hero = root?.querySelector('#hero');
    if (!phone || !hero) return undefined;

    const float = gsap.to(phone, {
      y: -14,
      duration: 3.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    const parallax = gsap.to(phone, {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });

    return () => {
      float.kill();
      parallax.kill();
      if (parallax.scrollTrigger) parallax.scrollTrigger.kill();
    };
  }, [ready, reduced]);

  usePageIntro(rootRef, { ready, reduced, playPhone: showPhoneIntro });

  return (
    <section className="page pg-home active" id="pg-home" ref={rootRef}>
      <div className="hero" id="hero">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
        <div className="field-photo" aria-hidden="true">
          <img src="/assets/field-photo.jpg" alt="" decoding="async" />
        </div>

        <div className="wrap hero-top">
          <h1 className="display">
            <Reveal>
              EarthSync<span className="tm">™</span>
            </Reveal>
          </h1>
          <hr className="hero-rule" />
          <div className="hero-caps">
            <div className="cap" data-fade>
              Rotation, reinvented.
            </div>
            <div className="cap right" data-fade>
              Three honest plans for one field —<br />backed by NASA satellite data.
            </div>
          </div>
        </div>

        <div className="hero-cta-row" data-fade>
          <a
            className="btn-pill"
            href="#/download"
            data-route="download"
            onClick={(event) => {
              event.preventDefault();
              onNavigate('download');
            }}
          >
            <span className="dot" aria-hidden="true" />Get the app
          </a>
        </div>

        <div className="hero-mid" id="heroMid">
          <div className="float-chip fc1" data-fade>
            <span className="dot" />NASA POWER · rain &amp; heat history
          </div>
          <div className="float-chip fc2" data-fade>
            <span className="dot" />GIBS imagery · 2026-10-14
          </div>
          <PhoneMockup ready={ready} />
        </div>

        <div className="wrap hero-bottom">
          <div className="hb-left">
            <h2>
              <Reveal>For your fields.</Reveal>
              <Reveal>For your future.</Reveal>
            </h2>
            <div className="cap" data-fade>
              Decision support that turns NASA satellites into plain talk for farmers — benefits, risks, evidence
              and what nobody knows yet.
            </div>
          </div>
          <div className="scroll-hint" data-fade>
            Scroll{' '}
            <span className="line">
              <i />
            </span>
          </div>
        </div>
      </div>

      <Marquee />

      <DeferredMount enabled={ready}>
        <HomeSections onNavigate={onNavigate} />
      </DeferredMount>
    </section>
  );
}
