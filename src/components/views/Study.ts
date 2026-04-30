import { dispatch, getState, subscribe } from '../../lib/state';
import type { StudySubject } from '../../data/study';
import { icon } from '../../lib/icons';

let host: HTMLElement | null = null;
let unsub: (() => void) | null = null;
let editing: string | null = null;     // subject being edited inline
let openLog: string | null = null;     // subject whose log is expanded

export function mountStudy(parent: HTMLElement): void {
  host = parent;
  render();
  unsub = subscribe(() => render());
}

export function unmountStudy(): void {
  unsub?.();
  unsub = null;
  host = null;
}

// ---------- helpers ----------

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay(); // 0 = Sun
  const diff = (day === 0 ? -6 : 1 - day); // make Monday = 0
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}
function isInThisWeek(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  const start = startOfWeek(new Date());
  const end = new Date(start); end.setDate(end.getDate() + 7);
  return d >= start && d < end;
}
function minutesThisWeek(subjectId: string): number {
  return getState().studySessions
    .filter(s => s.subjectId === subjectId && isInThisWeek(s.date))
    .reduce((sum, s) => sum + s.minutes, 0);
}
function minutesAllTime(subjectId: string): number {
  return getState().studySessions
    .filter(s => s.subjectId === subjectId)
    .reduce((sum, s) => sum + s.minutes, 0);
}
function streakDays(subjectId: string): number {
  // Consecutive days with at least 1 study session for this subject, ending today or yesterday
  const sessions = getState().studySessions.filter(s => s.subjectId === subjectId);
  if (sessions.length === 0) return 0;
  const datesWith = new Set(sessions.map(s => s.date));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const key = dayKey(d);
    if (datesWith.has(key)) streak++;
    else if (i === 0) continue; // allow no entry today, start at yesterday
    else break;
  }
  return streak;
}
function fmtMins(m: number): string {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60); const r = m % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
}

// 7-day mini bar chart
function weekChart(subjectId: string, color: string, weeklyTarget: number): string {
  const today = new Date();
  const start = startOfWeek(today);
  const dailyTarget = Math.max(15, Math.round(weeklyTarget / 7));
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const sessions = getState().studySessions.filter(s => s.subjectId === subjectId);
  const bars: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const key = dayKey(d);
    const mins = sessions.filter(s => s.date === key).reduce((sum, s) => sum + s.minutes, 0);
    const pct = Math.min(100, Math.round((mins / Math.max(1, dailyTarget * 1.5)) * 100));
    const isToday = dayKey(today) === key;
    bars.push(`
      <div class="flex flex-col items-center gap-1 flex-1">
        <div class="w-full h-12 rounded bg-rose-soft/50 relative overflow-hidden">
          <div class="absolute bottom-0 left-0 right-0 transition-all rounded-t"
               style="height:${pct}%; background:${color};"></div>
          ${mins > 0 ? `<div class="absolute inset-0 flex items-center justify-center text-[0.55rem] font-heading font-bold text-cocoa">${mins}</div>` : ''}
        </div>
        <div class="text-[0.6rem] font-heading ${isToday ? 'text-bubblegum-deep font-bold' : 'text-cocoa/50'}">${days[i]}</div>
      </div>
    `);
  }
  return `<div class="flex items-end gap-1">${bars.join('')}</div>`;
}

// ---------- main render ----------

function render() {
  if (!host) return;
  const s = getState();
  const subjects = s.studySubjects;
  const totalThisWeek = subjects.reduce((sum, sub) => sum + minutesThisWeek(sub.id), 0);
  const totalTarget = subjects.reduce((sum, sub) => sum + sub.weeklyMinutes, 0);
  const overallPct = Math.min(100, Math.round((totalThisWeek / Math.max(1, totalTarget)) * 100));
  const totalAllTime = subjects.reduce((sum, sub) => sum + minutesAllTime(sub.id), 0);
  const today = new Date().toISOString().slice(0, 10);
  const sessionsToday = s.studySessions.filter(x => x.date === today);

  host.innerHTML = `
    <div class="h-full overflow-y-auto scroll-parchment pb-32">
      <div class="max-w-5xl mx-auto px-6 pt-6 pb-8 space-y-6">

        <!-- Hero -->
        <header class="rounded-3xl text-white p-7 shadow-bubble relative overflow-hidden"
          style="background: linear-gradient(135deg, #C58BF2 0%, #FF5DA2 60%, #FFE066 100%); background-size: 200% 200%;">
          <div class="absolute -top-3 -right-3 text-white/25">${icon('book', 130)}</div>
          <div class="absolute bottom-2 right-12 text-white/20">${icon('lightbulb', 70)}</div>
          <div class="relative">
            <div class="font-heading text-[0.62rem] uppercase tracking-bubble opacity-90">study</div>
            <div class="font-display text-5xl mt-1 leading-none" style="font-family:'Dancing Script',cursive;font-weight:700">Every subject, every minute</div>
            <p class="font-display italic text-xl mt-2 max-w-xl">Log a session. Watch the bars climb. The capital is built one study block at a time. ♡</p>
            <div class="mt-4 flex flex-wrap gap-3 text-sm font-heading">
              <span class="px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm">⏱ ${fmtMins(totalThisWeek)} this week</span>
              <span class="px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm">🎯 ${overallPct}% of target</span>
              <span class="px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm">💖 ${fmtMins(totalAllTime)} all time</span>
              <span class="px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm">📅 ${sessionsToday.length} session${sessionsToday.length === 1 ? '' : 's'} today</span>
            </div>
          </div>
        </header>

        <!-- Quick log form -->
        <form id="study-form" class="rounded-3xl bg-white border-4 border-bubblegum p-4 shadow-bubble-soft">
          <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-2">log a session</div>
          <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-2 items-end">
            <select id="study-subject" class="rounded-2xl border-2 border-rose-soft bg-rose-mist/50 px-4 py-2.5 text-cocoa focus:outline-none focus:border-bubblegum">
              ${subjects.map(sub => `<option value="${sub.id}">${sub.emoji} ${sub.name}</option>`).join('')}
            </select>
            <input id="study-mins" type="number" min="1" max="600" placeholder="minutes (e.g. 25)"
              class="rounded-2xl border-2 border-rose-soft bg-rose-mist/50 px-4 py-2.5 text-cocoa focus:outline-none focus:border-bubblegum"/>
            <button type="submit" class="btn-candy whitespace-nowrap">log it ♡</button>
          </div>
          <input id="study-note" placeholder="optional note (e.g. 'Medify mock test 2 — 612')"
            class="block w-full mt-2 rounded-2xl border-2 border-rose-soft bg-rose-mist/50 px-4 py-2 text-cocoa text-sm focus:outline-none focus:border-bubblegum"/>
          <div class="mt-2 flex flex-wrap gap-1.5 text-xs">
            <span class="text-cocoa/60 self-center mr-1">quick:</span>
            ${[15, 25, 45, 60, 90].map(m => `<button type="button" data-quick="${m}" class="px-2.5 py-1 rounded-full bg-rose-mist border border-rose-soft hover:border-bubblegum text-cocoa font-heading">${m}m</button>`).join('')}
          </div>
        </form>

        <!-- Subject grid -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${subjects.map(sub => subjectCard(sub)).join('')}
        </section>

        <!-- Recent sessions -->
        ${s.studySessions.length > 0 ? `
          <section class="rounded-3xl bg-white border-2 border-rose-soft p-5 shadow-bubble-soft">
            <div class="flex items-center justify-between mb-2">
              <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep">recent sessions · ${s.studySessions.length}</div>
            </div>
            <ul class="space-y-1.5 max-h-64 overflow-y-auto scroll-parchment pr-1">
              ${s.studySessions.slice(0, 50).map(sess => {
                const sub = subjects.find(x => x.id === sess.subjectId);
                if (!sub) return '';
                return `
                  <li class="flex items-center gap-3 rounded-xl border border-rose-soft px-3 py-2 hover:bg-rose-mist/40 transition">
                    <span class="text-xl">${sub.emoji}</span>
                    <div class="flex-1 min-w-0">
                      <div class="font-heading font-semibold text-cocoa text-sm truncate">${sub.name}</div>
                      ${sess.note ? `<div class="text-xs text-cocoa/70 truncate italic">"${escapeHtml(sess.note)}"</div>` : ''}
                    </div>
                    <span class="text-xs font-heading text-cocoa/60">${sess.date}</span>
                    <span class="font-heading font-bold text-bubblegum-deep" style="color:${sub.color}">${fmtMins(sess.minutes)}</span>
                    <button data-rm-session="${sess.id}" aria-label="Remove" class="w-6 h-6 rounded-full bg-rose-mist hover:bg-rose-soft text-cocoa/70 transition shrink-0 text-xs">×</button>
                  </li>`;
              }).join('')}
            </ul>
          </section>
        ` : ''}

        <!-- Tips card -->
        <section class="rounded-3xl bg-gradient-to-br from-rose-mist to-cotton border-2 border-rose-soft p-5">
          <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-2 flex items-center gap-2">${icon('lightbulb', 16)} study notes</div>
          <ul class="text-sm text-cocoa space-y-1 list-disc list-inside">
            <li>One subject per session. Don't smush.</li>
            <li>25-minute Pomodoros + 5-minute breaks beat any 2-hour grind.</li>
            <li>Daily target = weekly target ÷ 7. Smaller blocks every day &gt; one big crunch.</li>
            <li>Add a note for each block — your future self thanks you when reviewing.</li>
            <li>Tap ✏️ on any subject to rename it, change the colour, or update the weekly target.</li>
          </ul>
        </section>
      </div>
    </div>
  `;

  // Wire form
  const form = host.querySelector<HTMLFormElement>('#study-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const subjectId = host!.querySelector<HTMLSelectElement>('#study-subject')?.value;
    const mins = parseInt(host!.querySelector<HTMLInputElement>('#study-mins')?.value || '0', 10);
    const note = host!.querySelector<HTMLInputElement>('#study-note')?.value.trim();
    if (!subjectId || !mins || mins < 1) return;
    dispatch({ type: 'ADD_STUDY_SESSION', subjectId, minutes: mins, note: note || undefined });
  });

  host.querySelectorAll<HTMLButtonElement>('[data-quick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = host!.querySelector<HTMLInputElement>('#study-mins');
      if (input) input.value = btn.dataset.quick!;
      input?.focus();
    });
  });

  host.querySelectorAll<HTMLButtonElement>('[data-rm-session]').forEach(btn => {
    btn.addEventListener('click', () => dispatch({ type: 'REMOVE_STUDY_SESSION', id: btn.dataset.rmSession! }));
  });

  // Subject edit
  host.querySelectorAll<HTMLButtonElement>('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      editing = editing === btn.dataset.edit ? null : btn.dataset.edit!;
      render();
    });
  });
  host.querySelectorAll<HTMLFormElement>('[data-edit-form]').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      const id = f.dataset.editForm!;
      const name = (f.querySelector('[name="name"]') as HTMLInputElement).value.trim();
      const emoji = (f.querySelector('[name="emoji"]') as HTMLInputElement).value.trim();
      const target = parseInt((f.querySelector('[name="target"]') as HTMLInputElement).value, 10);
      const color = (f.querySelector('[name="color"]') as HTMLInputElement).value;
      const patch: Partial<StudySubject> = {};
      if (name) patch.name = name;
      if (emoji) patch.emoji = emoji;
      if (!Number.isNaN(target) && target > 0) patch.weeklyMinutes = target;
      if (color) patch.color = color;
      dispatch({ type: 'UPDATE_SUBJECT', subjectId: id, patch });
      editing = null;
    });
  });

  host.querySelectorAll<HTMLButtonElement>('[data-quick-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [subjectId, mins] = btn.dataset.quickAdd!.split(':');
      dispatch({ type: 'ADD_STUDY_SESSION', subjectId: subjectId!, minutes: parseInt(mins!, 10) });
    });
  });

  host.querySelectorAll<HTMLButtonElement>('[data-toggle-log]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleLog!;
      openLog = openLog === id ? null : id;
      render();
    });
  });
}

function subjectCard(sub: StudySubject): string {
  const week = minutesThisWeek(sub.id);
  const all = minutesAllTime(sub.id);
  const pct = Math.min(100, Math.round((week / Math.max(1, sub.weeklyMinutes)) * 100));
  const streak = streakDays(sub.id);
  const isEditing = editing === sub.id;
  const showLog = openLog === sub.id;
  const sessions = getState().studySessions.filter(s => s.subjectId === sub.id).slice(0, 12);

  return `
    <article class="rounded-3xl bg-white border-4 shadow-bubble-soft overflow-hidden transition"
             style="border-color:${sub.color};">
      <header class="px-5 py-4 text-white relative" style="background: linear-gradient(135deg, ${sub.color}, #FF1493);">
        <div class="flex items-start gap-3">
          <span class="text-3xl shrink-0">${sub.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="font-heading font-semibold leading-tight truncate">${escapeHtml(sub.name)}</div>
            <div class="font-script opacity-95 text-base leading-tight">${sub.blurb}</div>
          </div>
          <button data-edit="${sub.id}" class="w-7 h-7 rounded-full bg-white/30 hover:bg-white/50 transition flex items-center justify-center text-white text-xs" aria-label="Edit subject">✏️</button>
        </div>
      </header>

      <div class="px-5 py-4 space-y-3">
        ${isEditing ? `
          <form data-edit-form="${sub.id}" class="space-y-2">
            <div class="grid grid-cols-[2fr_auto] gap-2">
              <input name="name" value="${escapeHtml(sub.name)}" class="rounded-xl border-2 border-rose-soft bg-rose-mist/50 px-3 py-2 text-cocoa text-sm" placeholder="Subject name"/>
              <input name="emoji" value="${sub.emoji}" maxlength="3" class="w-16 rounded-xl border-2 border-rose-soft bg-rose-mist/50 px-3 py-2 text-cocoa text-sm text-center" placeholder="🌸"/>
            </div>
            <div class="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
              <input name="target" type="number" min="15" max="3000" value="${sub.weeklyMinutes}" class="rounded-xl border-2 border-rose-soft bg-rose-mist/50 px-3 py-2 text-cocoa text-sm" placeholder="Weekly minutes"/>
              <input name="color" type="color" value="${sub.color}" class="h-10 w-12 rounded-xl border-2 border-rose-soft cursor-pointer"/>
              <button type="submit" class="btn-candy text-xs px-4 py-2">save</button>
            </div>
          </form>
        ` : ''}

        <!-- Stat pills -->
        <div class="flex flex-wrap gap-1.5 text-xs font-heading">
          <span class="px-2.5 py-1 rounded-full" style="background:${sub.color}33; color:${sub.color};">⏱ ${fmtMins(week)} / ${fmtMins(sub.weeklyMinutes)} this week</span>
          ${streak > 0 ? `<span class="px-2.5 py-1 rounded-full bg-sunny/40 text-amber-700">🔥 ${streak}d streak</span>` : ''}
          <span class="px-2.5 py-1 rounded-full bg-rose-mist text-bubblegum-deep">💖 ${fmtMins(all)} total</span>
        </div>

        <!-- Progress bar -->
        <div class="h-3 rounded-full bg-rose-soft overflow-hidden">
          <div class="h-full transition-all" style="width:${pct}%; background: linear-gradient(90deg, ${sub.color}, #FF1493);"></div>
        </div>

        <!-- Week chart -->
        ${weekChart(sub.id, sub.color, sub.weeklyMinutes)}

        <!-- Quick add buttons -->
        <div class="flex flex-wrap gap-1.5">
          <span class="text-xs text-cocoa/60 self-center">quick add:</span>
          ${[15, 25, 45, 60].map(m => `<button data-quick-add="${sub.id}:${m}" class="px-2.5 py-1 rounded-full bg-rose-mist border border-rose-soft hover:border-bubblegum text-cocoa text-xs font-heading">+${m}m</button>`).join('')}
          ${sessions.length > 0 ? `<button data-toggle-log="${sub.id}" class="ml-auto text-xs text-bubblegum-deep font-heading hover:underline">${showLog ? 'hide log' : `log (${sessions.length})`}</button>` : ''}
        </div>

        ${showLog && sessions.length > 0 ? `
          <ul class="space-y-1 pt-2 border-t border-rose-soft">
            ${sessions.map(sess => `
              <li class="flex items-center gap-2 text-xs text-cocoa">
                <span class="text-cocoa/60">${sess.date}</span>
                <span class="font-bold" style="color:${sub.color}">${fmtMins(sess.minutes)}</span>
                ${sess.note ? `<span class="italic text-cocoa/70 truncate">"${escapeHtml(sess.note)}"</span>` : ''}
              </li>
            `).join('')}
          </ul>
        ` : ''}
      </div>
    </article>
  `;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
