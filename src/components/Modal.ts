import { gsap } from 'gsap';
import { getState } from '../lib/state';
import { renderJournal } from './panels/Journal';
import { renderApplications } from './panels/Applications';
import { renderSettings } from './panels/Settings';
import { icon } from '../lib/icons';

type Widget = 'journal' | 'applications' | 'settings';

const META: Record<Widget, { title: string; subtitle: string; iconName: string; render: (host: HTMLElement) => void }> = {
  journal:      { title: 'Field Journal',     subtitle: 'tiny wins, kept on paper ♡',  iconName: 'pen',       render: renderJournal },
  applications: { title: 'Application Log',   subtitle: 'every door you knocked on ♡', iconName: 'clipboard', render: renderApplications },
  settings:     { title: 'Settings',          subtitle: 'make it yours ♡',             iconName: 'settings',  render: renderSettings },
};

let host: HTMLElement | null = null;
let active: Widget | null = null;

export function mountModal(parent: HTMLElement): void {
  const div = document.createElement('div');
  div.id = 'modal-root';
  div.className = 'fixed inset-0 z-40 hidden';
  parent.appendChild(div);
  host = div;

  document.addEventListener('open-widget', (e: Event) => {
    const detail = (e as CustomEvent<Widget>).detail;
    if (detail) open(detail);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && host && !host.classList.contains('hidden')) close();
  });
}

export function open(w: Widget): void {
  if (!host) return;
  active = w;
  render();
  host.classList.remove('hidden');
  if (!getState().reducedMotion) {
    const card = host.querySelector('.modal-card');
    const backdrop = host.querySelector('.modal-backdrop');
    gsap.fromTo(backdrop as Element, { opacity: 0 }, { opacity: 1, duration: 0.22 });
    gsap.fromTo(card as Element, { y: 24, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' });
  }
}

export function close(): void {
  if (!host) return;
  host.classList.add('hidden');
  active = null;
}

function render() {
  if (!host || !active) return;
  const meta = META[active];
  host.innerHTML = `
    <div class="modal-backdrop absolute inset-0 bg-cocoa/40 backdrop-blur-sm" data-close></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="modal-card relative w-full max-w-3xl max-h-[88vh] flex flex-col bg-cotton rounded-[2rem] border-4 border-bubblegum shadow-bubble overflow-hidden">
        <header class="flex items-start justify-between gap-3 px-6 py-4 bg-gradient-to-r from-bubblegum to-hotpink text-white">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-white/25 flex items-center justify-center">
              ${icon(meta.iconName, 22)}
            </div>
            <div>
              <div class="font-heading text-[0.62rem] uppercase tracking-bubble opacity-90">${meta.subtitle}</div>
              <div class="font-display text-2xl">${meta.title}</div>
            </div>
          </div>
          <button data-close class="w-9 h-9 rounded-full bg-white/30 hover:bg-white/50 transition flex items-center justify-center text-white" aria-label="Close">
            ${icon('x', 18)}
          </button>
        </header>
        <div id="modal-body" class="flex-1 overflow-y-auto scroll-parchment p-6"></div>
      </div>
    </div>
  `;

  host.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));

  const body = host.querySelector<HTMLElement>('#modal-body');
  if (body) meta.render(body);
}
