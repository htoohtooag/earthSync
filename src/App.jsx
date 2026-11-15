import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import Ambience from './components/Ambience.jsx';
import Footer from './components/Footer.jsx';
import MenuOverlay from './components/MenuOverlay.jsx';
import Nav from './components/Nav.jsx';
import Preloader from './components/Preloader.jsx';
import RouteWipe from './components/RouteWipe.jsx';
import HomePage from './pages/HomePage.jsx';
import { gsap } from './lib/gsap';
import { useHashRoute, readRoute } from './lib/useHashRoute';
import { initSmoothScroll, resyncScroll } from './lib/smoothScroll';
import useMagneticButtons from './lib/useMagneticButtons';
import { usePrefersReducedMotion } from './lib/useMediaQuery';

const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const DownloadPage = lazy(() => import('./pages/DownloadPage.jsx'));

const PAGES = {
  home: HomePage,
  about: AboutPage,
  download: DownloadPage,
};

export default function App() {
  const [route, navigate] = useHashRoute();
  const [shownRoute, setShownRoute] = useState(readRoute);
  const [booted, setBooted] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPhoneIntro, setShowPhoneIntro] = useState(() => readRoute() === 'home');

  const shownRef = useRef(shownRoute);
  const wipeRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useMagneticButtons();

  const handleNavigate = useCallback(
    (next) => {
      setMenuOpen(false);
      if (next === shownRef.current) return;
      navigate(next);
    },
    [navigate],
  );

  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  /* smooth wheel scrolling */
  useEffect(() => initSmoothScroll(), []);

  /* solid nav once the page moves */
  useEffect(() => {
    const onScroll = () => {
      document.body.classList.toggle('nav-solid', window.scrollY > 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* menu state on the body, used by the burger icon and smooth scroll */
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  /* ambient blob drift */
  useEffect(() => {
    if (reduced) return undefined;
    const first = gsap.to('.blob.b1', {
      x: '6vw',
      y: '5vh',
      duration: 17,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    const second = gsap.to('.blob.b2', {
      x: '-5vw',
      y: '-6vh',
      duration: 21,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => {
      first.kill();
      second.kill();
    };
  }, [reduced]);

  /* route change: wipe the screen, swap the page, lift the wipe */
  useEffect(() => {
    if (route === shownRef.current) return undefined;

    const commit = () => {
      shownRef.current = route;
      setShownRoute(route);
      window.scrollTo(0, 0);
      resyncScroll(0);
      setShowPhoneIntro(false);
    };

    if (reduced) {
      commit();
      return undefined;
    }

    const wipe = wipeRef.current;
    const panels = wipe ? wipe.querySelectorAll('i') : [];

    const timeline = gsap.timeline();
    timeline
      .set(wipe, { pointerEvents: 'auto' })
      .set(panels, { transformOrigin: 'bottom' })
      .to(panels, { scaleY: 1, duration: 0.55, stagger: 0.07, ease: 'power4.inOut' })
      .add(commit)
      .set(panels, { transformOrigin: 'top' })
      .to(panels, { scaleY: 0, duration: 0.6, stagger: 0.07, ease: 'power4.inOut' }, '+=.06')
      .set(wipe, { pointerEvents: 'none' });

    return () => {
      timeline.kill();
    };
  }, [route, reduced]);

  const Page = PAGES[shownRoute];

  return (
    <>
      <Ambience />
      {!preloaderDone && (
        <Preloader onBoot={() => setBooted(true)} onDone={() => setPreloaderDone(true)} />
      )}
      <RouteWipe ref={wipeRef} />

      <Nav
        route={shownRoute}
        menuOpen={menuOpen}
        onToggleMenu={toggleMenu}
        onNavigate={handleNavigate}
      />

      <MenuOverlay
        open={menuOpen}
        route={shownRoute}
        onClose={closeMenu}
        onNavigate={handleNavigate}
      />

      <main>
        <Suspense fallback={null}>
          <Page ready={booted} onNavigate={handleNavigate} showPhoneIntro={showPhoneIntro} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
