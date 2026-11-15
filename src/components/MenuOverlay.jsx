import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

const LINKS = [
  { route: 'home', index: '01', label: 'Home' },
  { route: 'about', index: '02', label: 'About' },
  { route: 'download', index: '03', label: 'Download' },
];

export default function MenuOverlay({ open, route, onClose, onNavigate }) {
  const panelRef = useRef(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const links = panel.querySelectorAll('.m-link');
    const foot = panel.querySelectorAll('.menu-foot span');

    if (reduced) {
      panel.style.visibility = open ? 'visible' : 'hidden';
      return undefined;
    }

    let timeline;
    if (open) {
      panel.style.visibility = 'visible';
      timeline = gsap
        .timeline()
        .fromTo(
          panel,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power4.inOut' },
        )
        .fromTo(
          links,
          { y: 46, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, delay: 0.18, ease: 'power3.out' },
          0,
        )
        .fromTo(
          foot,
          { opacity: 0 },
          { opacity: 1, stagger: 0.05, duration: 0.4, delay: 0.4 },
          0,
        );
    } else {
      timeline = gsap.timeline().to(panel, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.45,
        ease: 'power4.inOut',
        onComplete() {
          panel.style.visibility = 'hidden';
        },
      });
    }

    return () => timeline.kill();
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <nav className="menu-overlay" id="menuOverlay" aria-label="Main menu" ref={panelRef}>
      {LINKS.map((link) => (
        <a
          key={link.route}
          className={'m-link' + (route === link.route ? ' on' : '')}
          href={'#/' + (link.route === 'home' ? '' : link.route)}
          data-route={link.route}
          onClick={(event) => {
            event.preventDefault();
            onNavigate(link.route);
          }}
        >
          <small>{link.index}</small> {link.label}
        </a>
      ))}
      <div className="menu-foot">
        <span>EarthSync © 2026</span>
        <span>Adapting Farms with NASA Data</span>
        <span>Yangon · Myanmar</span>
      </div>
      <svg className="menu-art" viewBox="0 0 200 200" aria-hidden="true">
        <g fill="none" stroke="#2A7B46" strokeWidth="1.6">
          <circle cx="100" cy="100" r="62" />
          <ellipse cx="100" cy="100" rx="62" ry="24" />
          <ellipse cx="100" cy="100" rx="62" ry="46" />
          <ellipse cx="100" cy="100" rx="24" ry="62" />
          <ellipse cx="100" cy="100" rx="46" ry="62" />
          <circle cx="100" cy="100" r="86" strokeDasharray="2 8" opacity=".7" />
        </g>
        <circle cx="72" cy="78" r="3.4" fill="#8FD6A6" />
        <circle cx="128" cy="112" r="3" fill="#8FD6A6" />
        <circle cx="104" cy="146" r="2.6" fill="#F8F9F6" />
      </svg>
    </nav>
  );
}
