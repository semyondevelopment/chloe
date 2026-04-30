import { dispatch, getState } from '../../lib/state';

export function renderJournal(host: HTMLElement): void {
  const s = getState();

  host.innerHTML = `
    <div class="space-y-6">
      <form id="journal-form" class="rounded-3xl bg-white border-4 border-bubblegum p-4 shadow-bubble-soft">
        <label class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep">today's note</label>
        <textarea id="journal-text" rows="3"
          class="block w-full mt-2 rounded-2xl border-2 border-rose-soft bg-rose-mist/50 px-4 py-3 text-cocoa font-display text-base resize-none focus:outline-none focus:border-bubblegum"
          placeholder="dropped 3 cvs at clinics in indooroopilly, two said come back monday ♡"></textarea>
        <div class="flex items-center justify-between mt-3">
          <span class="text-xs text-cocoa/60">stays here forever, only on this device</span>
          <button type="submit" class="btn-candy">save note</button>
        </div>
      </form>

      <div>
        <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-2">past entries · ${s.journal.length}</div>
        ${s.journal.length === 0 ? `
          <div class="rounded-2xl border-2 border-dashed border-rose-soft p-6 text-center text-cocoa/60 italic">
            no entries yet. write the first one — even one sentence counts ✨
          </div>
        ` : `
          <ul class="space-y-3">
            ${s.journal.map(j => `
              <li class="rounded-2xl bg-white border-2 border-rose-soft px-4 py-3 shadow-bubble-soft">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="font-heading text-xs text-bubblegum-deep uppercase tracking-bubble">${j.date}</div>
                    <p class="font-display text-cocoa mt-1 whitespace-pre-line">${escapeHtml(j.text)}</p>
                  </div>
                  <button data-remove="${j.id}" aria-label="Delete entry"
                    class="w-7 h-7 rounded-full bg-rose-mist hover:bg-rose-soft text-cocoa/70 transition shrink-0 text-sm">×</button>
                </div>
              </li>
            `).join('')}
          </ul>
        `}
      </div>
    </div>
  `;

  const form = host.querySelector<HTMLFormElement>('#journal-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const text = host.querySelector<HTMLTextAreaElement>('#journal-text')?.value.trim();
    if (!text) return;
    dispatch({ type: 'ADD_JOURNAL', text });
    renderJournal(host);
  });

  host.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.remove!;
      dispatch({ type: 'REMOVE_JOURNAL', id });
      renderJournal(host);
    });
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
