import { useRef } from 'react';
import Reveal from '../components/Reveal.jsx';
import { usePageIntro, useScrollReveal } from '../lib/usePageAnimations.js';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';
import { APK_DOWNLOAD_URL } from '../lib/download.js';

const INSTALL_STEPS = [
  {
    num: '1',
    title: 'Download the APK',
    body: 'Tap the button above. The app is a standard Android package — about the size of a photo album, built with Flutter.',
  },
  {
    num: '2',
    title: 'Allow the install',
    body: 'Android will ask to allow installs from your browser — one toggle in Settings, then the install finishes on its own. It is safe to switch back afterwards.',
  },
  {
    num: '3',
    title: 'Open & try the demo field',
    body: 'No sign-up screen. Pick the demo field near Yangon or your own spot, answer five big-button questions, and compare the three rotation plans.',
  },
];

const REQUIREMENTS = [
  ['Device', 'Android 8.0 or newer'],
  ['Size', 'Small APK · Flutter'],
  ['Account', 'None. Really.'],
  ['Languages', 'မြန်မာ + English'],
  ['Internet', 'Needed for live NASA data; demo fixture works offline'],
  ['Data it sends', 'Field coordinates for the analysis only'],
  ['Windows', 'Stretch goal — same Rust engine, later'],
];

export default function DownloadPage({ ready }) {
  const rootRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  usePageIntro(rootRef, { ready, reduced });
  useScrollReveal(rootRef);

  return (
    <section className="page pg-download active" id="pg-download" ref={rootRef}>
      <div className="sect dl-hero">
        <div className="wrap">
          <div className="label">
            Download <b>/ android first</b>
          </div>
          <h2 className="big">
            <Reveal>Put EarthSync</Reveal>
            <Reveal>in your pocket.</Reveal>
          </h2>
          <p className="lede" data-fade>
            One APK. No account, no ads, no tracking. Open it, pick the demo field, and watch three honest rotation
            plans come out of real NASA climate history — on your own phone, with the math running on-device.
          </p>
          <div className="row" data-fade>
            <a
              className="btn-big"
              id="apkBtn"
              href={APK_DOWNLOAD_URL}
              rel="noopener"
            >
              Download APK · Android ↓
            </a>
            <a className="btn-ghost" href="https://github.com/your-team/field-shift" rel="noopener">
              View source on GitHub
            </a>
          </div>
          <div className="dl-note" data-fade>
            Built for NASA Space Apps Challenge 2026 judging · includes an offline demo fixture so the app still
            works when the server sleeps
          </div>
        </div>
      </div>

      <div className="sect" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="dl-grid">
            <div className="dl-steps">
              {INSTALL_STEPS.map((step) => (
                <div className="dl-step" key={step.num} data-fade>
                  <div className="num">{step.num}</div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="req-card" data-fade>
              <div className="k">Before you install</div>
              <ul>
                {REQUIREMENTS.map(([label, value]) => (
                  <li key={label}>
                    <span>{label}</span>
                    <b>{value}</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
