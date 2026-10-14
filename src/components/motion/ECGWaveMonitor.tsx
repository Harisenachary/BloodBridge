import React, { useState, useEffect } from 'react';
import { Activity, Volume2, VolumeX, Heart } from 'lucide-react';

interface ECGWaveMonitorProps {
  compact?: boolean;
}

export const ECGWaveMonitor: React.FC<ECGWaveMonitorProps> = ({ compact = false }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [bpm, setBpm] = useState(74);

  // Periodic heartbeat audio synthesis if sound is active
  useEffect(() => {
    if (!soundEnabled) return;

    const playCardiacSound = () => {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Lub sound
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(85, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.1);
        gain1.gain.setValueAtTime(0.2, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.1);

        // Dub sound (140ms later)
        setTimeout(() => {
          try {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(98, ctx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(36, ctx.currentTime + 0.12);
            gain2.gain.setValueAtTime(0.18, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start();
            osc2.stop(ctx.currentTime + 0.12);
          } catch {
            // Audio context cleanup
          }
        }, 140);
      } catch {
        // Fallback if browser audio policy prevents sound
      }
    };

    // Trigger initial beat
    playCardiacSound();
    const interval = setInterval(playCardiacSound, 1200);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Subtle natural BPM fluctuation
  useEffect(() => {
    const bpmInterval = setInterval(() => {
      setBpm(Math.floor(72 + Math.random() * 5));
    }, 4000);
    return () => clearInterval(bpmInterval);
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-charcoal-950 to-slate-900 border border-rose-900/40 text-white shadow-xl ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
      {/* Background glowing grid lines */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(244,63,94,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,63,94,0.15) 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Telemetry info */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-400">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-heartbeat" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-sm sm:text-base text-white tracking-wide">
                Live Bio-Grid Rhythm
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-wider">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Heart Rate: <strong className="text-rose-400 font-mono">{bpm} BPM</strong></span>
              <span className="text-slate-600">&bull;</span>
              <span className="hidden sm:inline">Telemetry Synchronized</span>
            </p>
          </div>
        </div>

        {/* Animated ECG Heartbeat SVG Wave */}
        <div className="flex-1 max-w-md mx-2 h-10 relative flex items-center overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 500 60"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="1" />
              </linearGradient>
              <filter id="ecgGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Reference baseline */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(244,63,94,0.15)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Pulsing ECG line */}
            <path
              d="M0,30 L60,30 L75,28 L85,32 L95,30 L120,30 L130,22 L140,46 L150,2 L160,54 L170,26 L180,34 L190,30 L250,30 L265,28 L275,32 L285,30 L310,30 L320,22 L330,46 L340,2 L350,54 L360,26 L370,34 L380,30 L450,30 L500,30"
              fill="none"
              stroke="url(#ecgGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ecgGlow)"
            />
          </svg>

          {/* Traveling scan head */}
          <div
            className="absolute top-0 bottom-0 w-24 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(244,63,94,0.3) 70%, rgba(255,255,255,0.8) 100%)',
              animation: 'radarSweep 2.2s linear infinite',
            }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              soundEnabled
                ? 'bg-rose-600/30 border-rose-500 text-rose-300 shadow-lg shadow-rose-900/30'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title={soundEnabled ? 'Mute Heartbeat Sound' : 'Enable Real Heartbeat Sound'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Audio: Live Beat</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Audio Beat</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
