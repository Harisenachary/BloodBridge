import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export const BloodMotionCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate bio-erythrocyte particles
    const particleCount = Math.min(35, Math.floor(width / 40));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 9 + 4, // 4px to 13px
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.35 - 0.1, // Slight upward drift
        opacity: Math.random() * 0.25 + 0.08,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const currentOpacity = p.opacity + Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.05;

        // Draw soft glowing erythrocyte disk
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // Saturated radial gradient for erythrocyte cell look
        const grad = ctx.createRadialGradient(
          p.x - p.radius * 0.3,
          p.y - p.radius * 0.3,
          p.radius * 0.1,
          p.x,
          p.y,
          p.radius
        );
        grad.addColorStop(0, `rgba(255, 30, 86, ${Math.max(0.1, currentOpacity * 1.8)})`);
        grad.addColorStop(0.5, `rgba(255, 0, 85, ${Math.max(0.06, currentOpacity * 1.3)})`);
        grad.addColorStop(1, `rgba(180, 0, 45, 0)`);

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(255, 0, 85, 0.6)';
        ctx.shadowBlur = 14;
        ctx.fill();

        // Inner dimple of red blood cell
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(136, 0, 35, ${Math.max(0.04, currentOpacity * 0.7)})`;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-35 dark:opacity-75 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
