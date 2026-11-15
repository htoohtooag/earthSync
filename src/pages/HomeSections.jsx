import { useLayoutEffect, useRef } from 'react';
import Reveal from '../components/Reveal.jsx';
import { useScrollReveal } from '../lib/usePageAnimations.js';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';

const VALUE_WORDS = ['The', 'world', 'runs', 'on', 'farmers.', 'EarthSync', 'makes', 'every', 'farmer'];

const PAINS = [
  {
    key: 'Pain 01',
    title: "Weather that won't sit still",
    body: "Monsoons shift, dry spells stretch, heat arrives early. Traditional calendars can't see it coming — satellites can.",
  },
  {
    key: 'Pain 02',
    title: 'Advice that costs too much',
    body: "Good agronomy advice is expensive or far away. What's free is often folklore — confident, but backed by nothing.",
  },
  {
    key: 'Pain 03',
    title: 'One field, many unknowns',
    body: 'Soil, water, drainage, season — farmers juggle all of it in their heads. Nobody shows them the trade-offs before they commit.',
  },
];

const FEATURES = [
  {
    idx: '/ 01',
    title: 'Point at your field',
    body: 'Pick your field on a live NASA satellite map layer, with the observation date and legend shown right on screen. No forms full of jargon.',
    tags: ['NASA GIBS imagery', 'Tap or search'],
  },
  {
    idx: '/ 02',
    title: 'Tell it your farm',
    body: 'Current crop, season, irrigation, drainage, what you care about. Big buttons, plain Burmese and English, "I don\'t know" is a valid answer. No sign-up.',
    tags: ['2-minute input', 'Unknowns allowed'],
  },
  {
    idx: '/ 03',
    title: 'See what NASA saw',
    body: 'Rainfall and temperature history for your area, pulled from NASA POWER and shown in plain units — so you can see the season before you bet on it.',
    tags: ['NASA POWER', 'GPM IMERG rain'],
  },
  {
    idx: '/ 04',
    title: 'Compare three honest plans',
    body: "Your baseline plus two rotations — for example rice → black gram or rice → mung bean. Each shows likely benefits, risks, sources and what science doesn't know yet.",
    tags: ['Evidence IDs', 'Risks shown', 'No fake %'],
  },
];

const EVIDENCE = [
  { name: 'NASA POWER', detail: 'Decades of rainfall & temperature history, your region', tag: 'Climate' },
  { name: 'NASA GIBS', detail: 'Dated satellite imagery tiles, shown live on the map', tag: 'Imagery' },
  { name: 'GPM IMERG', detail: 'Satellite rainfall estimates for season context', tag: 'Rain' },
  { name: 'Crop references', detail: 'FAO / IRRI sourced profiles with cited limits', tag: 'Agronomy' },
];

export default function HomeSections({ onNavigate }) {
  const rootRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useScrollReveal(rootRef);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const valueHead = root?.querySelector('#valueHead');
    const words = valueHead ? valueHead.querySelectorAll('.w') : [];
    if (!valueHead || !words.length) return undefined;

    if (reduced) {
      gsap.set(words, { opacity: 1 });
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.from(words, {
        opacity: 0,
        y: 44,
        stagger: 0.04,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: valueHead, start: 'top 80%', once: true },
      });
    }, root);

    return () => context.revert();
  }, [reduced]);

  return (
    <div ref={rootRef}>
      {/* 01 the problem */}
      <div className="sect">
        <div className="wrap">
          <div className="label">
            01 — The problem <b>/ farming on guesswork</b>
          </div>
          <h2 className="big">
            <Reveal>Millions of farmers</Reveal>
            <Reveal>feed the world.</Reveal>
            <Reveal>Most decide</Reveal>
            <Reveal>on hope.</Reveal>
          </h2>
          <p className="lede" data-fade>
            A farmer in Yangon chooses what to plant the way their family always has — by memory, by rumor, by luck
            of the rain. One wrong rotation can cost a whole season. EarthSync exists to replace that gamble with
            something a farmer can actually read, question and trust.
          </p>
          <div className="pains">
            {PAINS.map((pain) => (
              <div className="pain" key={pain.key} data-fade>
                <div className="k">{pain.key}</div>
                <h3>{pain.title}</h3>
                <p>{pain.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 02 the app */}
      <div className="sect">
        <div className="wrap">
          <div className="label">
            02 — The shift <b>/ what's inside the app</b>
          </div>
          <h2 className="big">
            <Reveal>A satellite-backed</Reveal>
            <Reveal>second opinion,</Reveal>
            <Reveal>in your pocket.</Reveal>
          </h2>
          <p className="lede" data-fade>
            EarthSync is an Android app built for the NASA Space Apps Challenge. You point at your field, tell it
            about your farm, and a decision engine running on your own phone compares your current rotation with two
            honest alternatives — each with its evidence, its risks and its unknowns.
          </p>
          <div className="feats">
            {FEATURES.map((feature) => (
              <div className="feat" key={feature.idx} data-fade>
                <div className="idx">{feature.idx}</div>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
                <div className="tagrow">
                  {feature.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 03 core value */}
      <div className="sect sect-dark value">
        <div className="wrap">
          <div className="label">
            03 — Why we build it <b>/ the farmer comes first</b>
          </div>
          <h2 id="valueHead">
            {VALUE_WORDS.map((word) => (
              <span className="w" key={word}>
                {word}
              </span>
            ))}
            <span className="w">
              <span className="hl">smarter</span>
            </span>
            <span className="w">—</span>
            <span className="w">
              <span className="hl">less stress</span>
            </span>
            <span className="w">,</span>
            <span className="w">more</span>
            <span className="w">control.</span>
          </h2>
          <div className="sub">
            <span className="cap">
              No jargon. No 90% success promises. Just what the satellites actually saw, what it means for your
              field, and an honest list of what nobody knows yet.
            </span>
          </div>
        </div>
      </div>

      {/* 04 evidence */}
      <div className="sect">
        <div className="wrap">
          <div className="label">
            04 — The evidence <b>/ real NASA missions, zero invention</b>
          </div>
          <div className="ev-grid">
            <div className="ev-chips">
              {EVIDENCE.map((item) => (
                <div className="ev-chip" key={item.name} data-fade>
                  <div>
                    <b>{item.name}</b>
                    <small>{item.detail}</small>
                  </div>
                  <div className="n">{item.tag}</div>
                </div>
              ))}
            </div>
            <div className="honest" data-fade>
              <div className="k">What we refuse to pretend</div>
              <h3>Uncertainty is part of the answer, not a footnote.</h3>
              <ul>
                <li>No guaranteed yields, no invented "90% success" numbers.</li>
                <li>Regional satellite estimates are labeled as regional — never sold as your exact soil.</li>
                <li>
                  Missing data shows up as <strong>unknown</strong>, clearly, instead of a confident lie.
                </li>
                <li>EarthSync supports a conversation with your agronomist — it doesn't replace it.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta">
        <div className="wrap">
          <h2>
            <Reveal>Grow smarter.</Reveal>
          </h2>
          <div className="cap" data-fade>
            EarthSync is free, needs no account, and speaks farmer first. Grab the APK and try the demo field — no
            sign-up, no tracking.
          </div>
          <div className="row" data-fade>
            <a
              className="btn-big"
              href="#/download"
              data-route="download"
              onClick={(event) => {
                event.preventDefault();
                onNavigate('download');
              }}
            >
              Download the app ↓
            </a>
            <a
              className="btn-ghost"
              href="#/about"
              data-route="about"
              onClick={(event) => {
                event.preventDefault();
                onNavigate('about');
              }}
            >
              Meet the team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
