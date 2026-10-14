import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Droplet,
  MapPin,
  Clock,
  Heart,
  ShieldCheck,
  Pause,
  Play,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BloodRequest } from '@/types';

interface EmergencySliderProps {
  requests: BloodRequest[];
  onPledge?: (request: BloodRequest) => void;
}

export const EmergencySlider: React.FC<EmergencySliderProps> = ({ requests, onPledge }) => {
  // Filter for urgent or active cases
  const urgentCases = requests.slice(0, 6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 5500; // ms

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % urgentCases.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + urgentCases.length) % urgentCases.length);
  };

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (isPaused || urgentCases.length <= 1) return;
    timerRef.current = setInterval(nextSlide, SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, urgentCases.length]);

  if (!urgentCases.length) return null;

  const current = urgentCases[currentIndex];

  // Motion variants for sliding
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_24px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all p-5 sm:p-7"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Top Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
        <motion.div
          key={currentIndex + (isPaused ? '-paused' : '')}
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? undefined : '100%' }}
          transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600"
        />
      </div>

      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
          </span>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <span>Critical Emergency Broadcast</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
              Live Slider
            </span>
          </h2>
        </div>

        {/* Controls: Play/Pause, Prev, Next */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isPaused ? 'Resume Autoplay' : 'Pause Autoplay'}
            aria-label={isPaused ? 'Resume slider autoplay' : 'Pause slider autoplay'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={prevSlide}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
            title="Previous Case"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 px-1">
            {currentIndex + 1}/{urgentCases.length}
          </span>

          <button
            type="button"
            onClick={nextSlide}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
            title="Next Case"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card Container with AnimatePresence */}
      <div className="relative min-h-[160px] sm:min-h-[140px] flex items-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000 || offset.x < -80) {
                nextSlide();
              } else if (swipe > 10000 || offset.x > 80) {
                prevSlide();
              }
            }}
            className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50/40 via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-rose-100 dark:border-slate-800 cursor-grab active:cursor-grabbing"
          >
            {/* Left: Blood Group + Patient Details */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600 text-white flex flex-col items-center justify-center font-mono font-black shadow-md shadow-rose-500/20 shrink-0">
                <span className="text-xl sm:text-2xl leading-none">{current.blood_group}</span>
                <span className="text-[9px] font-sans font-semibold opacity-90 uppercase tracking-wider mt-0.5">
                  ABO
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    {current.patient_ref_name}
                  </span>
                  <span className="badge-verified text-[10px] py-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Verified Emergency
                  </span>
                  {current.urgency === 'CRITICAL_IMMEDIATE' && (
                    <span className="badge-emergency text-[10px] py-0.5">
                      Immediate Trauma
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {current.hospital_name}
                  </span>
                  <span>&bull;</span>
                  <span>{current.hospital_city}</span>
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1 font-medium">
                    <Droplet className="w-3.5 h-3.5 text-rose-500" />
                    <strong className="text-rose-600 dark:text-rose-400 font-bold">
                      {current.units_needed} Units
                    </strong>{' '}
                    ({current.component.replace(/_/g, ' ')})
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Need within 12h
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
              <Link
                to={`/request-status/${current.public_token}`}
                className="btn-secondary text-xs px-3.5 py-2 rounded-xl"
              >
                <span>Track Case</span>
              </Link>

              {onPledge ? (
                <button
                  type="button"
                  onClick={() => onPledge(current)}
                  className="btn-primary text-xs px-4 py-2 rounded-xl gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Pledge to Donate</span>
                </button>
              ) : (
                <Link
                  to="/find-donors"
                  className="btn-primary text-xs px-4 py-2 rounded-xl gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Respond</span>
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots at Bottom */}
      <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {urgentCases.map((caseItem, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={caseItem.id}
              type="button"
              onClick={() => goToSlide(idx)}
              className="relative p-1 focus:outline-none"
              title={`Go to case ${idx + 1}`}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <motion.span
                animate={{
                  width: isActive ? 24 : 6,
                  backgroundColor: isActive ? '#F43F5E' : 'rgba(148, 163, 184, 0.4)',
                }}
                transition={{ duration: 0.25 }}
                className="h-1.5 rounded-full block"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
