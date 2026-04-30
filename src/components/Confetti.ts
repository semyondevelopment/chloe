import { gsap } from 'gsap';
import { getState } from '../lib/state';

const HEART_GLYPHS = ['♡', '✿', '✦', '★', '🎀', '🌸', '💕', '✨'];

export function burstHearts(x: number, y: number, count = 32): void {
  if (getState().reducedMotion) return;
  const layer = ensureLayer();
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.textContent = HEART_GLYPHS[Math.floor(Math.random() * HEART_GLYPHS.length)]!;
    span.style.position = 'absolute';
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    span.style.fontSize = `${14 + Math.random() * 22}px`;
    span.style.color = pickColor();
    span.style.pointerEvents = 'none';
    span.style.userSelect = 'none';
    span.style.willChange = 'transform, opacity';
    layer.appendChild(span);

    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 220;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 60;
    const rot = (Math.random() - 0.5) * 360;

    gsap.fromTo(span,
      { x: 0, y: 0, scale: 0.4, opacity: 0, rotate: 0 },
      {
        x: dx,
        y: dy,
        scale: 1 + Math.random(),
        opacity: 1,
        rotate: rot,
        duration: 0.5 + Math.random() * 0.4,
        ease: 'power2.out',
      }
    );
    gsap.to(span, {
      y: dy + 240,
      opacity: 0,
      duration: 1.2 + Math.random() * 0.5,
      ease: 'power1.in',
      delay: 0.2,
      onComplete: () => span.remove(),
    });
  }
}

function pickColor(): string {
  const colors = ['#FF1493', '#FF5DA2', '#E0B0FF', '#FFE066', '#B5EAD7', '#FFB6C1', '#C58BF2'];
  return colors[Math.floor(Math.random() * colors.length)]!;
}

function ensureLayer(): HTMLElement {
  let el = document.getElementById('confetti-layer');
  if (!el) {
    el = document.createElement('div');
    el.id = 'confetti-layer';
    el.style.position = 'fixed';
    el.style.inset = '0';
    el.style.zIndex = '9999';
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);
  }
  return el;
}
