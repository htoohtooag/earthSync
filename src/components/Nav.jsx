import { APK_DOWNLOAD_URL } from '../lib/download.js';

const LINKS = [
  { route: 'home', label: 'Home' },
  { route: 'about', label: 'About' },
];

export default function Nav({ route, menuOpen, onToggleMenu, onNavigate }) {
  const go = (event, next) => {
    event.preventDefault();
    onNavigate(next);
  };

  return (
    <header className="nav" id="nav">
      <div className="nav-left">
        <button
          className="menu-btn"
          id="menuBtn"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="menuOverlay"
          onClick={onToggleMenu}
        >
          <span className="ic" aria-hidden="true">
            <i />
            <i />
          </span>
          <span className="menu-txt">Menu</span>
        </button>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.route}
              className={'nav-link' + (route === link.route ? ' on' : '')}
              href={'#/' + (link.route === 'home' ? '' : link.route)}
              data-route={link.route}
              aria-current={route === link.route ? 'page' : undefined}
              onClick={(event) => go(event, link.route)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <a
        className="brand"
        href="#/"
        data-route="home"
        aria-label="EarthSync home"
        onClick={(event) => go(event, 'home')}
      >
        <span className="mark" aria-hidden="true" />
        EarthSync
      </a>
      <a
        className="btn-pill btn-accent"
        href={APK_DOWNLOAD_URL}
      >
        <span className="dot" aria-hidden="true" />
        Download App
      </a>
    </header>
  );
}
