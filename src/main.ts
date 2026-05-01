import './styles/main.css';
import { gsap } from 'gsap';

import { mountQuestPanel, openQuestPanel } from './components/QuestPanel';
import { mountModal } from './components/Modal';
import { mountBottomNav } from './components/BottomNav';
import { mountHud } from './components/Hud';

import { mountHome, unmountHome } from './components/views/Home';
import { mountMapView, unmountMapView } from './components/views/MapView';
import { mountResources, unmountResources } from './components/views/Resources';
import { mountLove, unmountLove } from './components/views/Love';
import { mountJobs, unmountJobs } from './components/views/Jobs';
import { mountStudy, unmountStudy } from './components/views/Study';

import { getView, setView, onViewChange } from './lib/router';
import type { ViewName } from './lib/router';
import { getState, subscribe } from './lib/state';
import { icon } from './lib/icons';

const app = document.getElementById('app');
if (!app) throw new Error('Mount point #app missing');

// --- Page shell ---
app.innerHTML = `
  <main class="candy-field absolute inset-0 overflow-hidden">

    <!-- Drifting clouds (decor, fixed) -->
    <div class="absolute pointer-events-none cloud animate-bobble" style="top:8%; left:6%; opacity:0.7;"></div>
    <div class="absolute pointer-events-none cloud animate-bobble" style="top:14%; right:10%; transform:scale(0.7); animation-delay:.5s; opacity:0.7;"></div>
    <div class="absolute pointer-events-none cloud" style="bottom:14%; left:30%; transform:scale(0.55); opacity:0.55;"></div>

    <!-- Sparkles -->
    <div class="sparkle-dot animate-sparkle-spin" style="top:24%; left:42%;"></div>
    <div class="sparkle-dot animate-sparkle-spin" style="top:34%; right:18%; animation-delay:.4s;"></div>
    <div class="sparkle-dot animate-sparkle-spin" style="bottom:30%; right:14%; animation-delay:1s;"></div>
    <div class="sparkle-dot animate-sparkle-spin" style="bottom:42%; left:18%; animation-delay:1.6s;"></div>

    <!-- Top HUD (slim, persistent) -->
    <header id="hud-top" class="absolute top-0 left-0 right-0 z-30 flex items-center justify-between gap-3 pl-4 pr-16 sm:px-5 pt-3 pb-2"></header>

    <!-- View host -->
    <section id="view-host" class="absolute z-10 left-0 right-0" style="top:74px; bottom:0;"></section>

    <!-- Settings floating button -->
    <button id="open-settings"
      class="fixed top-3 right-5 z-40 w-10 h-10 rounded-full bg-white/90 border-2 border-bubblegum text-bubblegum-deep shadow-bubble-soft hover:bg-rose-mist hover:rotate-45 transition flex items-center justify-center"
      aria-label="Settings">
      ${icon('settings', 18)}
    </button>

    <!-- Bottom nav -->
    <div id="bottom-nav-host"></div>

    <!-- Tiny Chloe stamp -->
    <div class="absolute bottom-1 right-3 z-30 font-script text-bubblegum-deep/80 text-xs pointer-events-none">
      ♡ chloe.exe ♡
    </div>
  </main>
`;

// --- Mount global components ---
const top = document.getElementById('hud-top')!;
const viewHost = document.getElementById('view-host')!;
const navHost = document.getElementById('bottom-nav-host')!;

mountHud(top);
mountQuestPanel(document.body);
mountModal(document.body);
mountBottomNav(navHost);

// --- View switching ---
let currentView: ViewName | null = null;

function unmountCurrent() {
  if (currentView === 'home') unmountHome();
  if (currentView === 'map') unmountMapView();
  if (currentView === 'resources') unmountResources();
  if (currentView === 'love') unmountLove();
  if (currentView === 'jobs') unmountJobs();
  if (currentView === 'study') unmountStudy();
}

function showView(v: ViewName) {
  if (currentView === v) return;
  unmountCurrent();
  currentView = v;
  viewHost.innerHTML = '';
  if (v === 'home')      mountHome(viewHost);
  if (v === 'map')       mountMapView(viewHost);
  if (v === 'jobs')      mountJobs(viewHost);
  if (v === 'study')     mountStudy(viewHost);
  if (v === 'resources') mountResources(viewHost);
  if (v === 'love')      mountLove(viewHost);

  if (!getState().reducedMotion) {
    gsap.fromTo(viewHost, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
  }
}

onViewChange(showView);
showView(getView());

// --- Cross-component events ---
document.addEventListener('open-quest', (e: Event) => {
  const detail = (e as CustomEvent<string>).detail;
  if (typeof detail === 'string') openQuestPanel(detail);
});

document.getElementById('open-settings')?.addEventListener('click', () => {
  document.dispatchEvent(new CustomEvent('open-widget', { detail: 'settings' }));
});

// --- Reduced motion class ---
subscribe(s => {
  if (s.reducedMotion) document.body.classList.add('reduced-motion-on');
  else document.body.classList.remove('reduced-motion-on');
});
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduced-motion-on');
}

// --- Entrance ---
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || getState().reducedMotion;
if (!reduced) {
  gsap.from('#hud-top', { y: -28, opacity: 0, duration: 0.6, ease: 'power3.out' });
  gsap.from('#bottom-nav-host nav', { y: 28, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 });
}

// quick keyboard shortcut: 1/2/3/4 jumps tabs
document.addEventListener('keydown', e => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
  if (e.key === '1') setView('home');
  if (e.key === '2') setView('map');
  if (e.key === '3') setView('jobs');
  if (e.key === '4') setView('study');
  if (e.key === '5') setView('resources');
  if (e.key === '6') setView('love');
});
