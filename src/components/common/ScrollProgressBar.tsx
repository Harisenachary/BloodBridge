import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 via-rose-400 to-pink-500 z-50 origin-left shadow-[0_0_12px_rgba(244,63,94,0.5)] pointer-events-none"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
};
