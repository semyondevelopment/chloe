import { getState, subscribe } from '../lib/state';
import { rankFor, nextRank } from '../data/chloe';
import { icon } from '../lib/icons';
import { setView } from '../lib/router';

let topHost: HTMLElement | null = null;

export function mountHud(top: HTMLElement): void {
  topHost = top;
  render();
  subscribe(() => render());
}

function render() {
  if (!topHost) return;
  const s = getState();
  const rank = rankFor(s.xp);
  const next = nextRank(s.xp);
  const xpInBand = next ? s.xp - rank.threshold : 0;
  const bandSize = next ? next.threshold - rank.threshold : 1;
  const pct = next ? Math.min(100, Math.round((xpInBand / Math.max(1, bandSize)) * 100)) : 100;

  topHost.innerHTML = `
    <button id="hud-home" class="flex items-center gap-3 group min-w-0">
      <span class="w-10 h-10 shrink-0 rounded-full bg-white border-[3px] border-bubblegum text-bubblegum-deep group-hover:border-hotpink group-hover:rotate-6 transition flex items-center justify-center shadow-bubble-soft">
        ${icon('heart', 18)}
      </span>
      <span class="min-w-0">
        <span class="block chloe-wordmark text-[1.7rem] leading-none">Chloe</span>
        <span class="block font-script text-bubblegum-deep text-sm -mt-0.5">Operations Map</span>
      </span>
    </button>

    <div class="flex items-center gap-2.5 shrink-0">
      <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border-2 border-rose-soft shadow-bubble-soft">
        <span class="text-bubblegum-deep">${icon('flame', 14)}</span>
        <span class="font-heading font-semibold text-cocoa text-xs">${s.streak}d</span>
      </div>

      <div class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border-2 border-rose-soft shadow-bubble-soft">
        <span class="text-bubblegum-deep">${icon('trophy', 14)}</span>
        <span class="font-heading font-semibold text-cocoa text-xs">${s.completedQuestIds.length}</span>
      </div>

      <div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border-2 border-bubblegum shadow-bubble-soft">
        <span class="text-bubblegum-deep">${icon('sparkles', 14)}</span>
        <span class="font-heading font-semibold text-cocoa text-xs">${s.xp}</span>
        <span class="hidden lg:inline font-heading text-[0.6rem] text-bubblegum-deep tracking-bubble uppercase">${rank.title}</span>
        <div class="relative w-20 sm:w-28 h-2.5 rounded-full bg-rose-soft overflow-hidden">
          <div class="xp-bar-fill h-full" style="width:${pct}%; background-size: 200% 200%;"></div>
        </div>
      </div>
    </div>
  `;

  topHost.querySelector<HTMLButtonElement>('#hud-home')?.addEventListener('click', () => setView('home'));
}
