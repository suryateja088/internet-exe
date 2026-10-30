import { useEffect, useRef } from 'react';

export default function StarfieldCanvas({ isWarping = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse parallax tracking
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Star initialization (Lightweight: 90 stars total for great performance on 3GB RAM laptops)
    const STAR_COUNT = 90;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      size: Math.random() * 1.6 + 0.6,
      color: ['#00f0ff', '#39ff14', '#ff007f', '#ffffff', '#ffaa00'][Math.floor(Math.random() * 5)],
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(7, 8, 13, 0.35)';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      const offsetX = (mouseX - width / 2) * 0.08;
      const offsetY = (mouseY - height / 2) * 0.08;

      const speed = prefersReducedMotion ? 0 : isWarping ? 18 : 1.2;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          star.z -= speed;
          if (star.z <= 0) {
            star.z = width;
            star.x = (Math.random() - 0.5) * width * 2;
            star.y = (Math.random() - 0.5) * height * 2;
          }
        }

        const k = 180 / star.z;
        const px = star.x * k + width / 2 + offsetX;
        const py = star.y * k + height / 2 + offsetY;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const depthAlpha = Math.min(1, Math.max(0.15, (1 - star.z / width) * 1.5));
          const starRadius = Math.max(0.5, star.size * k * 0.8);

          ctx.beginPath();
          ctx.arc(px, py, isWarping ? starRadius * 1.8 : starRadius, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = depthAlpha;
          ctx.fill();

          // If warping, draw motion tail
          if (isWarping && !prefersReducedMotion) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            const prevK = 180 / (star.z + speed * 1.8);
            const prevPx = star.x * prevK + width / 2 + offsetX;
            const prevPy = star.y * prevK + height / 2 + offsetY;
            ctx.lineTo(prevPx, prevPy);
            ctx.strokeStyle = star.color;
            ctx.lineWidth = starRadius;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isWarping]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        width: '100%',
        height: '100%',
      }}
      aria-hidden="true"
    />
  );
}
