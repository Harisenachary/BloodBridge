import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const PageScrollControls: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
      setScrollPercent(progress);
      setIsVisible(scrollTop > 120 || progress > 5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const isAtBottom = scrollPercent >= 98;
  const isAtTop = scrollPercent <= 2;

  // SVG circular ring circumference for r=16: 2 * PI * 16 ≈ 100.53
  const circumference = 100.53;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
          role="region"
          aria-label="Page scroll navigation"
        >
          {/* Scroll to Top (Page Up) Button */}
          <motion.button
            type="button"
            onClick={scrollToTop}
            disabled={isAtTop}
            whileHover={!isAtTop ? { scale: 1.1, y: -2 } : {}}
            whileTap={!isAtTop ? { scale: 0.92 } : {}}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/40 ${
              isAtTop
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                : 'text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-slate-800'
            }`}
            title="Scroll to Top (Page Up)"
            aria-label="Scroll to top of page"
          >
            <ChevronUp className="w-5 h-5 transition-transform" />
          </motion.button>

          {/* Real-time Circular Progress Ring */}
          <div className="relative w-8 h-8 flex items-center justify-center select-none" title={`Page scrolled ${scrollPercent}%`}>
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
              {/* Background Ring */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-slate-100 dark:text-slate-800"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="url(#scrollGradient)"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-150 ease-out"
              />
              <defs>
                <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#FB7185" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300">
              {scrollPercent}%
            </span>
          </div>

          {/* Scroll to Bottom (Page Down) Button */}
          <motion.button
            type="button"
            onClick={scrollToBottom}
            disabled={isAtBottom}
            whileHover={!isAtBottom ? { scale: 1.1, y: 2 } : {}}
            whileTap={!isAtBottom ? { scale: 0.92 } : {}}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/40 ${
              isAtBottom
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                : 'text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-slate-800'
            }`}
            title="Scroll to Bottom (Page Down)"
            aria-label="Scroll to bottom of page"
          >
            <ChevronDown className="w-5 h-5 transition-transform" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
