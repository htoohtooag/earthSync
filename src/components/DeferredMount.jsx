import { useEffect, useState } from 'react';

/**
 * Mounts children after the first screen is on the page and the browser is idle.
 * Used for everything below the fold so the hero paints first.
 */
export default function DeferredMount({ enabled = true, children }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled || show) return undefined;

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setShow(true), { timeout: 600 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(() => setShow(true), 120);
    return () => window.clearTimeout(id);
  }, [enabled, show]);

  return show ? children : null;
}
