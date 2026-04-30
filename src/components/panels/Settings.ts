import { dispatch, getState } from '../../lib/state';

export function renderSettings(host: HTMLElement): void {
  const s = getState();
  host.innerHTML = `
    <div class="space-y-6">
      <div class="space-y-3">
        ${toggleRow('reduced-motion', 'Calm motion', 'dial down the bobbles, sparkles, and pulses', s.reducedMotion)}
        ${toggleRow('sound', 'Sound effects', '(coming soon — toggle for when it lands)', s.soundEnabled)}
      </div>

      <div class="rounded-3xl bg-rose-mist border-2 border-rose-soft p-5">
        <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-1">Where everything lives</div>
        <p class="text-sm text-cocoa">All your data — quests, journal, applications — stays on this device only, in <code class="bg-white px-1.5 py-0.5 rounded text-xs">localStorage</code>. There is no backend, no analytics, nobody watching. This is yours.</p>
      </div>

      <div class="rounded-3xl bg-white border-4 border-lilac p-5 shadow-bubble-soft">
        <div class="font-heading uppercase tracking-bubble text-xs text-plum mb-1">Danger zone</div>
        <div class="text-sm text-cocoa mb-3">Wipe all progress and start fresh. (Ranks, journal, applications, completed quests — all of it.)</div>
        <button id="reset-btn"
          class="rounded-full px-5 py-2 bg-lilac text-white font-heading hover:bg-lilac-deep transition">
          reset everything
        </button>
      </div>

      <div class="text-center font-script text-bubblegum-deep text-xl pt-2">
        made with ♡ for chloe
      </div>
    </div>
  `;

  host.querySelector<HTMLInputElement>('[data-toggle="reduced-motion"]')?.addEventListener('change', () => {
    dispatch({ type: 'TOGGLE_REDUCED_MOTION' });
    renderSettings(host);
  });
  host.querySelector<HTMLInputElement>('[data-toggle="sound"]')?.addEventListener('change', () => {
    dispatch({ type: 'TOGGLE_SOUND' });
    renderSettings(host);
  });

  host.querySelector<HTMLButtonElement>('#reset-btn')?.addEventListener('click', () => {
    if (confirm('this will wipe everything. you sure, sweetheart?')) {
      dispatch({ type: 'RESET' });
      renderSettings(host);
    }
  });
}

function toggleRow(id: string, label: string, blurb: string, checked: boolean): string {
  return `
    <label class="flex items-center justify-between gap-4 rounded-2xl bg-white border-2 border-rose-soft px-4 py-3 cursor-pointer hover:border-bubblegum transition">
      <div>
        <div class="font-heading font-semibold text-cocoa">${label}</div>
        <div class="text-xs text-cocoa/60">${blurb}</div>
      </div>
      <span class="relative inline-block w-12 h-6">
        <input type="checkbox" data-toggle="${id}" ${checked ? 'checked' : ''} class="sr-only peer"/>
        <span class="absolute inset-0 rounded-full bg-rose-soft peer-checked:bg-bubblegum transition"></span>
        <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition peer-checked:translate-x-6"></span>
      </span>
    </label>
  `;
}
