import { useRef } from 'react';
import Reveal from '../components/Reveal.jsx';
import { usePageIntro, useScrollReveal } from '../lib/usePageAnimations.js';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';

const FACTS = [
  ['Challenge', 'Adapting Farms with NASA Data'],
  ['Event', 'NASA Space Apps 2026'],
  ['Pilot', 'Yangon, Myanmar'],
  ['App', 'Flutter · Android first'],
  ['Engine', 'Rust, on-device'],
  ['Data', 'POWER · GIBS · IMERG'],
  ['Languages', 'မြန်မာ · English'],
];

const STEPS = [
  {
    n: 'STEP 01',
    title: 'The farmer describes the field',
    body: "Coordinates or a picked spot on the map, current crop, planting season, irrigation, drainage and priorities. Unknown answers are legal — the app never demands data a farmer doesn't have.",
  },
  {
    n: 'STEP 02',
    title: 'NASA data meets a local engine',
    body: 'The on-device Rust engine pulls compact climate summaries (NASA POWER) and crop reference profiles from the server, then validates units, dates and completeness before calculating anything.',
  },
  {
    n: 'STEP 03',
    title: 'Three plans, fully explained',
    body: "Baseline plus two alternative rotations. Each shows eligibility (supported / constrained / unknown), likely benefits, risks, evidence IDs — and the gaps science can't fill from a satellite.",
  },
];

const PRINCIPLES = [
  ['Evidence first', 'Every crop threshold traces to a cited source. No source, no claim.'],
  ['No sign-up', "Open the app and use it. A farmer's time is the scarcest resource."],
  ['Weak-internet friendly', 'Compact payloads and cached last-known data, with timestamps shown.'],
  ['Your data stays yours', 'Farm inputs stay on the device; HTTPS, no hidden tracking, no uploaded farm history.'],
];

const TEAM = [
  {
    role: 'Rust core & calculation',
    name: 'The engine builder',
    body: 'Typed contracts, on-device climate aggregation, rotation and risk logic, and the Flutter bridge. Owns the math and the missing-data honesty.',
  },
  {
    role: 'NASA data & crop evidence',
    name: 'The evidence keeper',
    body: 'Ingests NASA POWER, curates GIBS layers, vets crop profiles against FAO / IRRI sources and licenses. Owns provenance, units and missingness.',
  },
  {
    role: 'UX, research & pitch',
    name: "The farmer's advocate",
    body: 'Farmer journey, Burmese wording, wireframes, sources and the story. Makes sure a non-technical farmer understands every screen.',
  },
  {
    role: 'Flutter application',
    name: 'The face of the app',
    body: 'Map, field inputs, rainfall charts, rotation cards, loading and error states — and the Android APK that ships it all. Presents, never calculates.',
  },
];

export default function AboutPage({ ready }) {
  const rootRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  usePageIntro(rootRef, { ready, reduced });
  useScrollReveal(rootRef);

  return (
    <section className="page pg-about active" id="pg-about" ref={rootRef}>
      <div className="sect about-hero">
        <div className="wrap">
          <div className="label">
            About <b>/ team EarthSync</b>
          </div>
          <h2 className="big">
            <Reveal>We built EarthSync</Reveal>
            <Reveal>for the farms</Reveal>
            <Reveal>everyone else</Reveal>
            <Reveal>guesses about.</Reveal>
          </h2>
          <div className="about-cols">
            <div className="col" data-fade>
              <p>
                <strong>EarthSync is a farmer-friendly crop rotation explorer</strong> built for the NASA Space Apps
                Challenge 2026 and its challenge "Adapting Farms with NASA Data". Our pilot is Myanmar: a farmer
                selects a field near Yangon, tells the app their current crops, season, water situation and
                priorities — and gets back three rotation strategies compared side by side, with NASA evidence,
                risks and explicit unknowns for every one.
              </p>
              <p>
                <strong>The decisions run on the farmer's own phone.</strong> A Rust engine compiled on-device does
                the calculation — it fetches compact NASA climate summaries from our server, validates them, applies
                transparent agricultural rules, and returns three scenarios. Nothing is a black box: every plan
                carries its sources, its assumptions and its limitations. The result is a conversation starter for
                farmers and agronomists, <strong>never a guaranteed prescription</strong>.
              </p>
              <p>
                We are a four-person team — three builders and one designer-researcher — working in one repository
                across Rust, data engineering and Flutter, with honest UX as a hard requirement: large buttons, plain
                Burmese and English, no sign-up, and "we don't know" displayed proudly instead of hidden.
              </p>
            </div>
            <div className="col" data-fade>
              <div className="mini-facts">
                {FACTS.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <b>{value}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <figure className="ph-card" data-fade>
            <img
              src="/assets/paddy-field.jpg"
              alt="Aerial view of terraced rice paddies near Yangon"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>FIELD 04 · YANGON REGION</span>
              <span>MONSOON PADDY · NASA POWER GRID CELL</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="sect">
        <div className="wrap">
          <div className="label">
            How it works <b>/ satellite to farmer in four moves</b>
          </div>
          <div className="steps">
            {STEPS.map((step) => (
              <div className="step" key={step.n} data-fade>
                <div className="n">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
          <div className="princ" data-fade>
            {PRINCIPLES.map(([title, body]) => (
              <div key={title}>
                <b>{title}</b>
                <span>{body}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sect">
        <div className="wrap">
          <div className="label">
            The team <b>/ four owners, four crafts</b>
          </div>
          <div className="team">
            {TEAM.map((member) => (
              <div className="tm-card" key={member.name} data-fade>
                <div className="r">{member.role}</div>
                <h3>{member.name}</h3>
                <p>{member.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
