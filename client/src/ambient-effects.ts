// ================= 环境光效 & 点击特效 - Rin 博客版本 =================

export function initAmbientCanvas() {
  if (document.getElementById('ambient-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-canvas';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d')!;
  const particles: Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; pulse: number;
  }> = [];

  for (let i = 0; i < 20; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.15 - 0.05,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    });
  }

  let animId: number;

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 流动渐变光球
    const time = Date.now() * 0.0004;
    const cx1 = w * 0.3 + Math.sin(time) * w * 0.12;
    const cy1 = h * 0.3 + Math.cos(time * 0.7) * h * 0.1;
    const cx2 = w * 0.7 + Math.cos(time * 0.8) * w * 0.1;
    const cy2 = h * 0.7 + Math.sin(time * 0.6) * h * 0.12;

    const isDark = document.documentElement.getAttribute('data-color-mode') === 'dark';

    const g1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, w * 0.35);
    const primaryColor = isDark ? '165,180,252' : '99,102,241';
    const secondaryColor = isDark ? '244,114,182' : '236,72,153';
    g1.addColorStop(0, `rgba(${primaryColor}, ${isDark ? 0.04 : 0.06})`);
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, w * 0.28);
    g2.addColorStop(0, `rgba(${secondaryColor}, ${isDark ? 0.03 : 0.05})`);
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    // 粒子
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      const pulsedOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${primaryColor}, ${pulsedOpacity})`;
      ctx.fill();

      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
      glow.addColorStop(0, `rgba(${primaryColor}, ${pulsedOpacity * 0.25})`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(p.x - p.size * 5, p.y - p.size * 5, p.size * 10, p.size * 10);
    }

    animId = requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  return () => cancelAnimationFrame(animId);
}

export function initClickEffect() {
  const handler = (e: MouseEvent) => {
    // 波纹
    const ripple = document.createElement('div');
    ripple.className = 'click-effect';
    ripple.style.left = (e.clientX - 50) + 'px';
    ripple.style.top = (e.clientY - 50) + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  document.addEventListener('click', handler);
  return () => document.removeEventListener('click', handler);
}
