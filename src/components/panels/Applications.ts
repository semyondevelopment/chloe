import { dispatch, getState } from '../../lib/state';
import type { ApplicationEntry } from '../../lib/state';

const STATUS_META: Record<ApplicationEntry['status'], { label: string; emoji: string; color: string }> = {
  sent:      { label: 'sent',      emoji: '💌', color: 'bg-rose-soft text-cocoa border-rose' },
  replied:   { label: 'replied',   emoji: '💛', color: 'bg-yellow-100 text-cocoa border-sunny' },
  interview: { label: 'interview', emoji: '🌟', color: 'bg-mint text-cocoa border-jade' },
  offered:   { label: 'offered',   emoji: '👑', color: 'bg-bubblegum text-white border-hotpink' },
  rejected:  { label: 'rejected',  emoji: '🌧️', color: 'bg-lilac/60 text-plum border-lilac' },
};

export function renderApplications(host: HTMLElement): void {
  const s = getState();

  const counts = (Object.keys(STATUS_META) as ApplicationEntry['status'][]).reduce((acc, k) => {
    acc[k] = s.applications.filter(a => a.status === k).length;
    return acc;
  }, {} as Record<ApplicationEntry['status'], number>);

  host.innerHTML = `
    <div class="space-y-6">
      <div class="grid grid-cols-5 gap-1.5">
        ${(Object.keys(STATUS_META) as ApplicationEntry['status'][]).map(k => `
          <div class="rounded-2xl border-2 border-rose-soft bg-white px-1.5 sm:px-3 py-2 text-center">
            <div class="text-xl sm:text-2xl">${STATUS_META[k].emoji}</div>
            <div class="hidden sm:block font-heading text-xs uppercase tracking-bubble text-bubblegum-deep">${STATUS_META[k].label}</div>
            <div class="font-display text-xl sm:text-2xl text-cocoa font-semibold">${counts[k]}</div>
          </div>
        `).join('')}
      </div>

      <form id="app-form" class="rounded-3xl bg-white border-4 border-bubblegum p-4 shadow-bubble-soft grid grid-cols-1 md:grid-cols-3 gap-3">
        <input id="app-role" required placeholder="role (e.g. Pharmacy Assistant)"
          class="rounded-2xl border-2 border-rose-soft bg-rose-mist/50 px-4 py-2.5 text-cocoa focus:outline-none focus:border-bubblegum"/>
        <input id="app-company" required placeholder="company / clinic"
          class="rounded-2xl border-2 border-rose-soft bg-rose-mist/50 px-4 py-2.5 text-cocoa focus:outline-none focus:border-bubblegum"/>
        <input id="app-date" type="date" required
          class="rounded-2xl border-2 border-rose-soft bg-rose-mist/50 px-4 py-2.5 text-cocoa focus:outline-none focus:border-bubblegum"/>
        <button type="submit" class="btn-candy md:col-span-3">log this application ♡</button>
      </form>

      ${s.applications.length === 0 ? `
        <div class="rounded-2xl border-2 border-dashed border-rose-soft p-8 text-center text-cocoa/60 italic">
          no applications logged yet. one is enough to start the streak ✨
        </div>
      ` : `
        <ul class="space-y-2">
          ${s.applications.map(app => `
            <li class="rounded-2xl bg-white border-2 border-rose-soft px-4 py-3 shadow-bubble-soft flex items-start gap-3">
              <div class="text-3xl shrink-0">${STATUS_META[app.status].emoji}</div>
              <div class="flex-1 min-w-0">
                <div class="font-heading font-semibold text-cocoa truncate">${escapeHtml(app.role)}</div>
                <div class="text-sm text-cocoa/70 truncate">${escapeHtml(app.company)} · ${app.date}</div>
              </div>
              <select data-update="${app.id}"
                class="rounded-full border-2 ${STATUS_META[app.status].color} px-3 py-1 text-xs font-heading uppercase tracking-bubble shrink-0 cursor-pointer">
                ${(Object.keys(STATUS_META) as ApplicationEntry['status'][])
                  .map(k => `<option value="${k}" ${app.status === k ? 'selected' : ''}>${STATUS_META[k].emoji} ${STATUS_META[k].label}</option>`).join('')}
              </select>
              <button data-remove="${app.id}" aria-label="Delete"
                class="w-7 h-7 rounded-full bg-rose-mist hover:bg-rose-soft text-cocoa/70 transition shrink-0">×</button>
            </li>
          `).join('')}
        </ul>
      `}
    </div>
  `;

  const today = new Date().toISOString().slice(0, 10);
  const dateInput = host.querySelector<HTMLInputElement>('#app-date');
  if (dateInput && !dateInput.value) dateInput.value = today;

  host.querySelector<HTMLFormElement>('#app-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const role = host.querySelector<HTMLInputElement>('#app-role')?.value.trim();
    const company = host.querySelector<HTMLInputElement>('#app-company')?.value.trim();
    const date = host.querySelector<HTMLInputElement>('#app-date')?.value;
    if (!role || !company || !date) return;
    dispatch({ type: 'ADD_APPLICATION', entry: { role, company, date, status: 'sent' } });
    renderApplications(host);
  });

  host.querySelectorAll<HTMLSelectElement>('[data-update]').forEach(sel => {
    sel.addEventListener('change', () => {
      dispatch({ type: 'UPDATE_APPLICATION_STATUS', id: sel.dataset.update!, status: sel.value as ApplicationEntry['status'] });
      renderApplications(host);
    });
  });
  host.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      dispatch({ type: 'REMOVE_APPLICATION', id: btn.dataset.remove! });
      renderApplications(host);
    });
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
