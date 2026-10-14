import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Intelligent Scroll Manager:
 * 1. When clicking links to navigate to a new page (PUSH): scrolls to top (0, 0) ("open from the start").
 * 2. When pressing browser back/forward or coming back (POP): restores exact scroll position ("stay at what state we opened").
 */
export const ScrollManager: React.FC = () => {
  const location = useLocation();
  const navType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const isPopNavRef = useRef(false);

  // Continuously record scroll position for the current path in sessionStorage
  useEffect(() => {
    const handleScroll = () => {
      // Don't overwrite with 0 while restoring
      if (!isPopNavRef.current) {
        try {
          sessionStorage.setItem(`bb_scroll_${location.pathname}`, String(window.scrollY));
        } catch {}
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Handle navigation events
  useEffect(() => {
    if (navType === 'POP') {
      isPopNavRef.current = true;
      // User navigated Back / Forward: restore previous scroll position
      const saved = sessionStorage.getItem(`bb_scroll_${location.pathname}`);
      const targetY = saved ? parseInt(saved, 10) : 0;

      // Use requestAnimationFrame to ensure DOM is rendered before restoring scroll
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
        setTimeout(() => {
          isPopNavRef.current = false;
        }, 100);
      });
    } else {
      isPopNavRef.current = false;
      // User clicked a link to a new page: scroll to the start (top)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname, navType]);

  return null;
};
