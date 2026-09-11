import React, { useRef, useEffect } from 'react';

export default function ParticleText({ text1 = "Explore", text2 = "Sri Lanka", className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let particles = [];
    let mouse = { x: -1000, y: -1000, radius: 100 };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const width = canvas.width;
      const height = canvas.height;

      if (width === 0 || height === 0) return;

      // Temporary off-screen canvas to render text and read pixel data
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d');

      // Font setup
      const fontSize = Math.min(width / 6.5, 90);
      offCtx.font = `900 ${fontSize}px "Playfair Display", serif, sans-serif`;
      offCtx.textAlign = 'left';
      offCtx.textBaseline = 'top';
      offCtx.fillStyle = '#ffffff';

      // Draw text
      const line1Y = 10;
      const line2Y = line1Y + fontSize * 1.05;

      offCtx.fillText(text1, 0, line1Y);
      offCtx.font = `italic 700 ${fontSize}px "Playfair Display", serif, sans-serif`;
      offCtx.fillText(text2, 0, line2Y);

      // Extract pixel data
      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const step = Math.max(2, Math.floor(fontSize / 24)); // particle density

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 128) {
            // Determine if it belongs to text2 (Sri Lanka) for green accent color
            const isText2 = y > line2Y - 10;
            const color = isText2 
              ? (Math.random() > 0.3 ? '#34d399' : '#10b981') // Emerald gradient
              : (Math.random() > 0.4 ? '#ffffff' : '#e2e8f0'); // Crisp slate-white

            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              originX: x,
              originY: y,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              size: Math.random() * 1.8 + 1.2,
              color: color,
              friction: 0.88,
              ease: 0.1
            });
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Calculate distance from mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          const pushX = Math.cos(angle) * force * 12;
          const pushY = Math.sin(angle) * force * 12;

          p.vx -= pushX;
          p.vy -= pushY;
        }

        // Return to origin (spring back)
        p.vx += (p.originX - p.x) * p.ease;
        p.vy += (p.originY - p.y) * p.ease;

        p.vx *= p.friction;
        p.vy *= p.friction;

        p.x += p.vx;
        p.y += p.vy;

        // Render particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [text1, text2]);

  return (
    <div className={`relative w-full h-[180px] sm:h-[220px] md:h-[260px] ${className}`}>
      {/* Interactive Canvas for 3D Particle Text */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10 cursor-pointer w-full h-full"
      />

      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
