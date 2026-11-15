import { useEffect, useState } from 'react';

const BARS = [22, 14, 30, 52, 78, 96, 100, 88, 64, 38, 18, 12];

const PLANS = [
  { name: 'Rice — baseline', tag: 'current' },
  { name: 'Rice → Black gram', tag: 'evidence' },
  { name: 'Rice → Mung bean', tag: 'low risk' },
];

export default function PhoneMockup({ ready }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!ready) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % PLANS.length);
    }, 2400);

    return () => window.clearInterval(id);
  }, [ready]);

  return (
    <div className="phone" id="phone" aria-label="EarthSync app preview">
      <div className="screen">
        <div className="scr-head">
          <b>EarthSync</b>
          <span>လယ်ယာ 04 · Yangon</span>
        </div>
        <div className="scr-map">
          <svg viewBox="0 0 300 190" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 60 Q70 30 150 55 T300 45" fill="none" stroke="#2A7B46" strokeWidth="1" />
            <path d="M0 110 Q90 80 180 105 T300 95" fill="none" stroke="#2A7B46" strokeWidth="1" />
            <path d="M0 155 Q110 130 220 150 T300 140" fill="none" stroke="#2A7B46" strokeWidth="1" />
            <rect x="40" y="60" width="70" height="42" fill="none" stroke="#eef1e3" strokeWidth="1.2" strokeDasharray="4 3" />
            <rect x="170" y="80" width="58" height="36" fill="none" stroke="#eef1e3" strokeWidth="1" strokeDasharray="4 3" />
          </svg>
          <div className="scr-pin" />
          <div className="scr-chip">Field 04 · 1.2 ha</div>
          <div className="scr-chip b">Sentinel-style view · NASA GIBS</div>
        </div>
        <div className="scr-block">
          <div className="t">
            <span>Rainfall · NASA POWER</span>
            <span>mm / month</span>
          </div>
          <div className="bars" id="bars" aria-hidden="true">
            {BARS.map((height, index) => (
              <i key={index} style={{ height: height + '%' }} />
            ))}
          </div>
        </div>
        <div className="scr-block rot" id="rotCards">
          <div className="t">
            <span>Rotation plans</span>
            <span>3 options</span>
          </div>
          {PLANS.map((plan, index) => (
            <div className={'rot-card' + (index === active ? ' hl' : '')} key={plan.name}>
              <span className="n">{plan.name}</span>
              <span className="s">{plan.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
