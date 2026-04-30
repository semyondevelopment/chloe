import { icon } from '../lib/icons';
import { getView, setView, onViewChange } from '../lib/router';
import type { ViewName } from '../lib/router';

type Tab = {
  id: ViewName;
  label: string;
  iconName: string;
  emoji: string;
};

const tabs: Tab[] = [
  { id: 'home',      label: 'Home',      iconName: 'home',       emoji: '🏠' },
  { id: 'map',       label: 'Map',       iconName: 'map',        emoji: '🗺️' },
  { id: 'jobs',      label: 'Jobs',      iconName: 'briefcase',  emoji: '💼' },
  { id: 'resources', label: 'Resources', iconName: 'library',    emoji: '📚' },
  { id: 'love',      label: 'Love',      iconName: 'heart',      emoji: '💌' },
];

let host: HTMLElement | null = null;

export function mountBottomNav(parent: HTMLElement): void {
  host = parent;
  render();
  onViewChange(() => render());
}

function render() {
  if (!host) return;
  const current = getView();

  host.innerHTML = `
    <div class="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-4 px-3">
      <nav class="pointer-events-auto bg-white/95 backdrop-blur-md rounded-[2rem]
        border-4 border-bubblegum shadow-bubble flex items-stretch overflow-hidden
        max-w-[calc(100vw-1.5rem)]">
        ${tabs.map(t => {
          const active = t.id === current;
          return `
            <button data-view="${t.id}"
              class="nav-tab group relative flex flex-col items-center justify-center px-5 sm:px-7 py-2.5 transition-all
                ${active
                  ? 'text-white'
                  : 'text-cocoa hover:text-bubblegum-deep'}"
              aria-label="${t.label}"
              aria-current="${active ? 'page' : 'false'}">
              ${active ? `
                <span class="absolute inset-1 rounded-[1.5rem] bg-gradient-to-br from-bubblegum via-hotpink to-bubblegum-deep shadow-bubble-soft"
                  style="z-index:0"></span>
              ` : ''}
              <span class="relative z-10 flex flex-col items-center gap-0.5">
                <span class="block transition-transform group-hover:-translate-y-0.5 group-hover:scale-110">
                  ${icon(t.iconName, 26)}
                </span>
                <span class="font-heading text-[0.62rem] uppercase tracking-bubble font-semibold leading-none">
                  ${t.label}
                </span>
              </span>
              ${active ? `
                <span class="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-bubblegum animate-pulse z-10"></span>
              ` : ''}
            </button>
          `;
        }).join('')}
      </nav>
    </div>
  `;

  host.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.view as ViewName;
      setView(v);
    });
  });
}
