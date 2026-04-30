import { questById } from '../data/quests';
import type { Resource } from '../data/quests';
import { dispatch, getState, isQuestComplete, isSubtaskComplete, questStatus } from '../lib/state';
import { icon } from '../lib/icons';
import { rankFor } from '../data/chloe';
import { gsap } from 'gsap';
import { burstHearts } from './Confetti';

const RESOURCE_ICON: Record<Resource['kind'], string> = {
  course: 'cap',
  application: 'send',
  guide: 'lightbulb',
  tool: 'wand',
  directory: 'briefcase',
  community: 'hearts',
};

const RESOURCE_LABEL: Record<Resource['kind'], string> = {
  course: 'course',
  application: 'apply',
  guide: 'guide',
  tool: 'tool',
  directory: 'job board',
  community: 'community',
};

let host: HTMLElement | null = null;
let currentQuestId: string | null = null;

export function mountQuestPanel(parent: HTMLElement): void {
  const div = document.createElement('div');
  div.id = 'quest-panel-root';
  div.className = 'fixed inset-0 z-50 hidden';
  parent.appendChild(div);
  host = div;
}

export function openQuestPanel(questId: string): void {
  if (!host) return;
  currentQuestId = questId;
  render();
  host.classList.remove('hidden');
  const card = host.querySelector('.qp-card') as HTMLElement | null;
  const backdrop = host.querySelector('.qp-backdrop') as HTMLElement | null;
  if (card && backdrop) {
    if (getState().reducedMotion) {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(card, { x: 0, opacity: 1 });
    } else {
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(card, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' });
    }
  }
}

export function closeQuestPanel(): void {
  if (!host) return;
  document.removeEventListener('keydown', escListener);
  host.classList.add('hidden');
  currentQuestId = null;
}

function resourceCard(r: Resource): string {
  return `
    <a href="${r.url}" target="_blank" rel="noopener noreferrer"
       class="block group rounded-2xl border-2 border-rose-soft hover:border-bubblegum bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-bubble-soft">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-rose-mist text-bubblegum-deep flex items-center justify-center shrink-0">
          ${icon(RESOURCE_ICON[r.kind], 18)}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-heading font-semibold text-cocoa truncate">${r.label}</span>
            <span class="text-[0.62rem] uppercase tracking-bubble font-heading text-bubblegum-deep bg-rose-mist px-2 py-0.5 rounded-full">
              ${RESOURCE_LABEL[r.kind]}
            </span>
          </div>
          ${r.blurb ? `<div class="text-sm text-cocoa/70 mt-0.5">${r.blurb}</div>` : ''}
          ${r.cost ? `<div class="text-xs text-bubblegum-deep mt-0.5 font-heading">💰 ${r.cost}</div>` : ''}
        </div>
        <div class="text-bubblegum-deep opacity-0 group-hover:opacity-100 transition-opacity">${icon('external', 14)}</div>
      </div>
    </a>`;
}

function render() {
  if (!host || !currentQuestId) return;
  const q = questById(currentQuestId);
  if (!q) return;

  const status = questStatus(q.id);
  const complete = isQuestComplete(q.id);
  const locked = status === 'locked';
  const completedSubtasks = q.subtasks.filter(st => isSubtaskComplete(q.id, st.id)).length;
  const subtaskPct = q.subtasks.length ? Math.round((completedSubtasks / q.subtasks.length) * 100) : 0;

  const headerGradient = `linear-gradient(135deg, ${q.chapterColor}, #FF1493)`;

  host.innerHTML = `
    <div class="qp-backdrop absolute inset-0 bg-cocoa/40 backdrop-blur-sm" data-close></div>

    <div class="qp-card absolute right-0 top-0 bottom-0 w-[min(560px,96vw)] bg-cotton flex flex-col shadow-[0_0_60px_-10px_rgba(122,42,96,0.45)] border-l-4 border-bubblegum">

      <header class="relative px-7 pt-7 pb-5 text-white" style="background:${headerGradient}">
        <button data-close
          class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/30 hover:bg-white/50 transition flex items-center justify-center text-white text-xl"
          aria-label="Close">×</button>

        <div class="flex items-center gap-3 mb-2">
          <span class="text-5xl">${q.emoji}</span>
          <span class="text-[0.62rem] tracking-bubble uppercase font-heading bg-white/30 px-2 py-1 rounded-full">
            ${q.chapter} · ${status}
          </span>
        </div>
        <h2 class="font-display text-4xl leading-tight text-shadow-cute">${q.title}</h2>
        <div class="font-script text-white/95 text-xl mt-1">${q.realTitle}</div>
        <div class="mt-3 flex items-center gap-3 text-sm font-heading">
          <span class="bg-white/30 px-2 py-1 rounded-full">⏱ ${q.estimate}</span>
          <span class="bg-white/30 px-2 py-1 rounded-full">✨ +${q.xp} sparkles</span>
          ${q.rewardTitle ? `<span class="bg-white/30 px-2 py-1 rounded-full">👑 unlocks: ${q.rewardTitle}</span>` : ''}
        </div>
      </header>

      <div class="flex-1 overflow-y-auto scroll-parchment px-7 py-6 space-y-6">

        ${locked ? `
          <div class="rounded-2xl bg-lilac/40 border-2 border-lilac p-4 text-center">
            <div class="text-3xl mb-1">🔒</div>
            <div class="font-heading font-semibold text-plum">Complete earlier quests to unlock this</div>
            <div class="text-sm text-plum/80 mt-1">Required: ${q.requires.length ? q.requires.map(r => questById(r)?.title ?? r).join(', ') : 'nothing'}</div>
          </div>
        ` : ''}

        <section>
          <div class="font-heading text-xs uppercase tracking-bubble text-bubblegum-deep mb-1">In flavour ♡</div>
          <p class="font-display italic text-lg text-cocoa leading-relaxed border-l-4 border-bubblegum pl-4">
            ${q.description}
          </p>
        </section>

        <section>
          <div class="font-heading text-xs uppercase tracking-bubble text-bubblegum-deep mb-1">In real life</div>
          <p class="text-cocoa leading-relaxed">${q.realDescription}</p>
        </section>

        ${q.subtasks.length ? `
          <section>
            <div class="flex items-end justify-between mb-2">
              <div class="font-heading text-xs uppercase tracking-bubble text-bubblegum-deep">Tiny steps</div>
              <div class="font-heading text-xs text-bubblegum-deep">${completedSubtasks}/${q.subtasks.length} · ${subtaskPct}%</div>
            </div>
            <div class="h-2 rounded-full bg-rose-soft overflow-hidden mb-3">
              <div class="h-full xp-bar-fill" style="width:${subtaskPct}%"></div>
            </div>
            <ul class="space-y-2">
              ${q.subtasks.map(st => {
                const done = isSubtaskComplete(q.id, st.id);
                return `
                  <li>
                    <button data-subtask="${st.id}"
                      class="w-full flex items-center gap-3 text-left rounded-2xl border-2 ${done ? 'border-bubblegum bg-rose-mist' : 'border-rose-soft bg-white'} px-4 py-3 hover:border-bubblegum transition">
                      <span class="w-7 h-7 rounded-full border-2 ${done ? 'bg-bubblegum border-bubblegum text-white' : 'border-rose'} flex items-center justify-center text-sm font-bold">
                        ${done ? '✓' : ''}
                      </span>
                      <span class="font-heading font-medium ${done ? 'text-cocoa/60 line-through' : 'text-cocoa'}">${st.label}</span>
                    </button>
                  </li>`;
              }).join('')}
            </ul>
          </section>
        ` : ''}

        ${q.resources.length ? `
          <section>
            <div class="font-heading text-xs uppercase tracking-bubble text-bubblegum-deep mb-2">Resources & courses</div>
            <div class="grid grid-cols-1 gap-2">
              ${q.resources.map(resourceCard).join('')}
            </div>
          </section>
        ` : ''}

        ${!locked ? `
          <section class="pt-2">
            ${complete ? `
              <button data-uncomplete
                class="w-full rounded-full border-2 border-rose-soft bg-white text-cocoa font-heading py-3 hover:bg-rose-mist transition">
                ↺ undo completion
              </button>
            ` : `
              <button data-complete
                class="btn-candy w-full text-lg py-4">
                mark as done ♡ +${q.xp} sparkles
              </button>
            `}
          </section>
        ` : ''}

        <div class="h-2"></div>
      </div>

      <footer class="px-7 py-3 border-t-2 border-rose-soft bg-white/60 backdrop-blur-sm">
        <div class="flex items-center justify-between text-xs font-heading text-cocoa/70">
          <span>${q.subtasks.length} tiny steps · ${q.resources.length} resources</span>
          <span>esc to close</span>
        </div>
      </footer>
    </div>
  `;

  // Wire close
  host.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeQuestPanel));

  // Wire subtask toggles
  host.querySelectorAll<HTMLButtonElement>('[data-subtask]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.subtask!;
      dispatch({ type: 'TOGGLE_SUBTASK', questId: q.id, subtaskId: id });
      render();
    });
  });

  // Complete button
  const completeBtn = host.querySelector<HTMLButtonElement>('[data-complete]');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      const before = getState();
      dispatch({ type: 'COMPLETE_QUEST', questId: q.id });
      const after = getState();
      const oldRank = rankFor(before.xp);
      const newRank = rankFor(after.xp);
      celebrate(q.id, oldRank.id !== newRank.id ? newRank.title : null);
      // re-render after celebration completes (fast)
      setTimeout(() => render(), 800);
    });
  }

  const uncompleteBtn = host.querySelector<HTMLButtonElement>('[data-uncomplete]');
  if (uncompleteBtn) {
    uncompleteBtn.addEventListener('click', () => {
      dispatch({ type: 'UNCOMPLETE_QUEST', questId: q.id });
      render();
    });
  }

  // Esc to close
  document.addEventListener('keydown', escListener);
}

function escListener(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeQuestPanel();
    document.removeEventListener('keydown', escListener);
  }
}

function celebrate(questId: string, newRankTitle: string | null) {
  if (!host) return;
  const card = host.querySelector('.qp-card') as HTMLElement | null;
  if (card && !getState().reducedMotion) {
    gsap.fromTo(card, { scale: 1 }, { scale: 1.02, yoyo: true, repeat: 1, duration: 0.18 });
  }
  burstHearts(window.innerWidth / 2, window.innerHeight / 2);

  if (newRankTitle) {
    showRankToast(newRankTitle);
  }

  void questId; // not currently needed but kept for sound hook
}

function showRankToast(title: string) {
  const toast = document.createElement('div');
  toast.className = 'fixed inset-0 z-[60] flex items-center justify-center pointer-events-none';
  toast.innerHTML = `
    <div class="rank-toast text-center">
      <div class="font-script text-bubblegum-deep text-3xl">a new title!</div>
      <div class="chloe-wordmark text-7xl mt-1">${title}</div>
      <div class="text-bubblegum-deep mt-3 flex justify-center">${icon('crown', 56)}</div>
    </div>
  `;
  document.body.appendChild(toast);
  const el = toast.firstElementChild as HTMLElement;
  if (getState().reducedMotion) {
    setTimeout(() => toast.remove(), 1800);
    return;
  }
  gsap.fromTo(el,
    { scale: 0.6, opacity: 0, rotate: -8 },
    { scale: 1, opacity: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.6)' }
  );
  gsap.to(el, { opacity: 0, scale: 1.1, duration: 0.4, delay: 1.6, onComplete: () => toast.remove() });
}
