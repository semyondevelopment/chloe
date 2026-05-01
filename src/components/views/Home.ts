import { getState, subscribe } from '../../lib/state';
import { rankFor, nextRank, chloe } from '../../data/chloe';
import { quests, chapters } from '../../data/quests';
import { questStatus } from '../../lib/state';
import { quotes } from '../../data/quotes';
import { letterForToday } from '../../data/letters';
import { icon } from '../../lib/icons';
import { setView } from '../../lib/router';

let host: HTMLElement | null = null;
let unsub: (() => void) | null = null;
let quoteIndex = 0;
let quoteInterval: number | null = null;

export function mountHome(parent: HTMLElement): void {
  host = parent;
  render();
  unsub = subscribe(() => render());
  startQuoteRotation();
}

export function unmountHome(): void {
  unsub?.();
  unsub = null;
  if (quoteInterval !== null) {
    window.clearInterval(quoteInterval);
    quoteInterval = null;
  }
}

function activeQuest() {
  for (const q of quests) {
    if (questStatus(q.id) === 'active') return q;
  }
  return null;
}

function render() {
  if (!host) return;
  const s = getState();
  const rank = rankFor(s.xp);
  const next = nextRank(s.xp);
  const completed = s.completedQuestIds.length;
  const total = quests.length;
  const pct = Math.round((completed / total) * 100);
  const xpInBand = next ? s.xp - rank.threshold : 0;
  const bandSize = next ? next.threshold - rank.threshold : 1;
  const xpPct = next ? Math.min(100, Math.round((xpInBand / Math.max(1, bandSize)) * 100)) : 100;
  const mission = activeQuest();
  const letter = letterForToday();
  const greet = greeting();

  const chapterProgress = chapters.map(c => {
    const cqs = quests.filter(q => q.chapter === c.id);
    const cdone = cqs.filter(q => s.completedQuestIds.includes(q.id)).length;
    return { ...c, cqs, cdone };
  });

  host.innerHTML = `
    <div class="h-full overflow-y-auto scroll-parchment pb-nav-safe">
      <div class="max-w-5xl mx-auto px-6 pt-6 pb-8 space-y-6">

        <!-- Hero -->
        <section id="home-hero" class="rounded-3xl p-5 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-bubble"
          style="background: linear-gradient(135deg, #FF5DA2 0%, #FF1493 50%, #C58BF2 100%); background-size: 200% 200%;"
          class="animate-rainbow-shift">
          <div class="absolute -top-6 -right-6 text-white/30">${icon('sparkles', 120)}</div>
          <div class="absolute bottom-2 right-6 text-white/20">${icon('flower2', 90)}</div>

          <div class="relative">
            <div class="font-heading text-[0.7rem] uppercase tracking-bubble opacity-90 mb-1">${greet}</div>
            <div class="font-display text-4xl sm:text-5xl md:text-6xl leading-none text-shadow-cute">
              <span style="font-family:'Dancing Script',cursive;font-weight:700">Chloe</span><span class="opacity-90">,</span>
            </div>
            <p class="font-display italic text-xl md:text-2xl mt-3 max-w-2xl leading-snug">
              ${rank.emoji} ${rank.title} · <span class="opacity-95">${rank.blurb}</span>
            </p>
            <p class="font-ui text-white/95 mt-2 max-w-2xl">
              From the Subway outpost in St Lucia to surgical scrubs — every quest, every cert, every cute little win, all on one sparkly map.
            </p>

            <div class="mt-5 flex flex-wrap gap-3">
              ${mission ? `
                <button id="continue-quest"
                  class="rounded-full bg-white text-bubblegum-deep font-heading font-semibold px-5 py-2.5 shadow-bubble-soft hover:-translate-y-0.5 transition flex items-center gap-2">
                  ${icon('zap', 18)} continue: ${mission.title}
                </button>
              ` : ''}
              <button id="open-map"
                class="rounded-full bg-white/25 hover:bg-white/40 transition text-white font-heading font-semibold px-5 py-2.5 flex items-center gap-2 backdrop-blur-sm border border-white/30">
                ${icon('map', 18)} open the map
              </button>
              <button id="open-letter"
                class="rounded-full bg-white/25 hover:bg-white/40 transition text-white font-heading font-semibold px-5 py-2.5 flex items-center gap-2 backdrop-blur-sm border border-white/30">
                ${icon('mail', 18)} note from semyon
              </button>
            </div>
          </div>
        </section>

        <!-- Stats grid -->
        <section class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="home-card rounded-3xl bg-white border-4 border-bubblegum p-4 shadow-bubble-soft">
            <div class="flex items-center gap-2 text-bubblegum-deep">${icon('trophy', 22)}<span class="font-heading text-[0.62rem] uppercase tracking-bubble">quests</span></div>
            <div class="font-display text-3xl text-cocoa font-semibold mt-1">${completed} <span class="text-cocoa/40 text-xl">/ ${total}</span></div>
            <div class="h-2 mt-2 rounded-full bg-rose-soft overflow-hidden"><div class="h-full xp-bar-fill" style="width:${pct}%"></div></div>
          </div>
          <div class="home-card rounded-3xl bg-white border-4 border-rose p-4 shadow-bubble-soft">
            <div class="flex items-center gap-2 text-bubblegum-deep">${icon('sparkles', 22)}<span class="font-heading text-[0.62rem] uppercase tracking-bubble">sparkles</span></div>
            <div class="font-display text-3xl text-cocoa font-semibold mt-1">${s.xp}</div>
            <div class="text-xs text-cocoa/60 mt-1">${next ? `${next.threshold - s.xp} to ${next.title}` : 'max rank ✨'}</div>
            <div class="h-2 mt-2 rounded-full bg-rose-soft overflow-hidden"><div class="h-full xp-bar-fill" style="width:${xpPct}%"></div></div>
          </div>
          <div class="home-card rounded-3xl bg-white border-4 border-sunny p-4 shadow-bubble-soft">
            <div class="flex items-center gap-2 text-bubblegum-deep">${icon('flame', 22)}<span class="font-heading text-[0.62rem] uppercase tracking-bubble">streak</span></div>
            <div class="font-display text-3xl text-cocoa font-semibold mt-1">${s.streak} day${s.streak === 1 ? '' : 's'}</div>
            <div class="text-xs text-cocoa/60 mt-1">last visit · ${s.lastVisit}</div>
          </div>
          <div class="home-card rounded-3xl bg-white border-4 border-lilac p-4 shadow-bubble-soft">
            <div class="flex items-center gap-2 text-bubblegum-deep">${icon('award', 22)}<span class="font-heading text-[0.62rem] uppercase tracking-bubble">title</span></div>
            <div class="font-display text-2xl text-cocoa font-semibold mt-1 leading-tight">${rank.emoji} ${rank.title}</div>
            <div class="text-xs text-cocoa/60 italic mt-1">${rank.blurb}</div>
          </div>
        </section>

        <!-- Two column: today's mission + quote -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div class="home-card lg:col-span-2 rounded-3xl bg-white border-4 border-bubblegum p-5 shadow-bubble-soft">
            <div class="flex items-center gap-2 text-bubblegum-deep mb-2">
              ${icon('target', 20)}
              <span class="font-heading text-[0.62rem] uppercase tracking-bubble">today's mission</span>
            </div>
            ${mission ? `
              <button id="mission-card" class="text-left w-full group">
                <div class="font-display text-2xl text-cocoa group-hover:text-bubblegum-deep transition">${mission.emoji} ${mission.title}</div>
                <div class="font-script text-bubblegum-deep text-xl">${mission.realTitle}</div>
                <p class="text-cocoa/85 mt-2 line-clamp-2">${mission.realDescription}</p>
                <div class="mt-3 flex flex-wrap gap-2 text-xs font-heading">
                  <span class="px-2.5 py-1 rounded-full bg-rose-mist text-bubblegum-deep">⏱ ${mission.estimate}</span>
                  <span class="px-2.5 py-1 rounded-full bg-rose-mist text-bubblegum-deep">+${mission.xp} sparkles</span>
                  ${mission.resources.length ? `<span class="px-2.5 py-1 rounded-full bg-rose-mist text-bubblegum-deep">${mission.resources.length} resources</span>` : ''}
                </div>
                <div class="mt-3 inline-flex items-center gap-1 text-bubblegum-deep font-heading group-hover:translate-x-1 transition">
                  open quest ${icon('arrow-right', 16)}
                </div>
              </button>
            ` : `
              <div class="text-cocoa">
                <div class="font-display text-2xl">you're ahead of the path ✨</div>
                <p class="text-cocoa/70 mt-1">amazing work, doctor. take a breath, then pick anything.</p>
              </div>
            `}
          </div>

          <div class="home-card rounded-3xl p-5 text-white shadow-bubble-soft relative overflow-hidden"
            style="background: linear-gradient(160deg, #E0B0FF, #FF5DA2);">
            <div class="absolute -bottom-4 -right-4 opacity-30 text-white">${icon('sparkles', 100)}</div>
            <div class="relative">
              <div class="font-heading text-[0.62rem] uppercase tracking-bubble opacity-90 mb-2">sparkle mantra</div>
              <div id="home-quote" class="font-script text-2xl leading-tight transition-opacity duration-500">"${quotes[0]}"</div>
            </div>
          </div>
        </section>

        <!-- Today's letter preview -->
        <section class="home-card rounded-3xl bg-gradient-to-br from-rose-mist to-cotton border-4 border-bubblegum p-5 shadow-bubble-soft">
          <div class="flex items-start gap-4">
            <div class="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-bubblegum to-hotpink text-white flex items-center justify-center shadow-bubble-soft">
              ${icon('mail', 26)}
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <div>
                  <div class="font-heading text-[0.62rem] uppercase tracking-bubble text-bubblegum-deep">today's letter from semyon</div>
                  <div class="font-script text-bubblegum-deep text-2xl">${letter.greeting}</div>
                </div>
                <button id="open-love"
                  class="rounded-full bg-white border-2 border-bubblegum text-bubblegum-deep font-heading text-xs font-semibold px-3 py-1.5 hover:bg-rose-mist transition flex items-center gap-1">
                  read full ${icon('arrow-right', 14)}
                </button>
              </div>
              <p class="font-display text-cocoa text-base leading-relaxed line-clamp-2">${letter.body}</p>
            </div>
          </div>
        </section>

        <!-- Chapter progress -->
        <section class="home-card rounded-3xl bg-white border-2 border-rose-soft p-5 shadow-bubble-soft">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="font-heading text-[0.62rem] uppercase tracking-bubble text-bubblegum-deep">the journey · chapter by chapter</div>
              <div class="font-script text-bubblegum-deep text-xl">where you are right now</div>
            </div>
            <button id="see-map" class="text-bubblegum-deep font-heading text-sm hover:underline flex items-center gap-1">
              open the map ${icon('arrow-right', 14)}
            </button>
          </div>
          <ol class="space-y-2">
            ${chapterProgress.map((c, i) => {
              const cpct = c.cqs.length ? Math.round((c.cdone / c.cqs.length) * 100) : 0;
              return `
                <li class="flex items-center gap-3">
                  <div class="shrink-0 w-9 h-9 rounded-full text-white flex items-center justify-center text-base font-heading font-semibold shadow-bubble-soft"
                    style="background: linear-gradient(135deg, ${c.color}, #FF1493)">${i + 1}</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <div class="font-heading font-semibold text-cocoa truncate">${c.emoji} ${c.title}</div>
                      <div class="text-xs text-cocoa/60 shrink-0">${c.cdone}/${c.cqs.length}</div>
                    </div>
                    <div class="h-1.5 mt-1 rounded-full bg-rose-soft overflow-hidden">
                      <div class="h-full" style="width:${cpct}%; background: linear-gradient(90deg, ${c.color}, #FF1493);"></div>
                    </div>
                  </div>
                </li>`;
            }).join('')}
          </ol>
        </section>

        <!-- Journal + Application quick-add -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a class="home-card block group rounded-3xl bg-white border-2 border-rose-soft hover:border-bubblegum p-5 shadow-bubble-soft transition" id="open-journal">
            <div class="flex items-center gap-2 text-bubblegum-deep">${icon('pen', 20)}<span class="font-heading text-[0.62rem] uppercase tracking-bubble">field journal</span></div>
            <div class="font-display text-2xl text-cocoa mt-1">${s.journal.length} ${s.journal.length === 1 ? 'entry' : 'entries'}</div>
            <div class="text-sm text-cocoa/70 mt-1">${s.journal[0]?.text ? `"${escapeHtml(s.journal[0].text.slice(0, 80))}${s.journal[0].text.length > 80 ? '…' : ''}"` : 'no entries yet — write the first one ♡'}</div>
            <div class="mt-2 inline-flex items-center gap-1 text-bubblegum-deep font-heading text-sm group-hover:translate-x-1 transition">add an entry ${icon('arrow-right', 14)}</div>
          </a>
          <a class="home-card block group rounded-3xl bg-white border-2 border-rose-soft hover:border-bubblegum p-5 shadow-bubble-soft transition" id="open-applications">
            <div class="flex items-center gap-2 text-bubblegum-deep">${icon('clipboard', 20)}<span class="font-heading text-[0.62rem] uppercase tracking-bubble">application log</span></div>
            <div class="font-display text-2xl text-cocoa mt-1">${s.applications.length} logged</div>
            <div class="text-sm text-cocoa/70 mt-1">${s.applications[0] ? `latest: ${escapeHtml(s.applications[0].role)} · ${escapeHtml(s.applications[0].company)}` : 'log the first one to start the streak ♡'}</div>
            <div class="mt-2 inline-flex items-center gap-1 text-bubblegum-deep font-heading text-sm group-hover:translate-x-1 transition">log an application ${icon('arrow-right', 14)}</div>
          </a>
        </section>

        <div class="text-center font-script text-bubblegum-deep/80 text-base pt-2">
          made with ♡ for ${chloe.name}
        </div>
      </div>
    </div>
  `;

  // Wire actions
  wire('continue-quest', () => mission && document.dispatchEvent(new CustomEvent('open-quest', { detail: mission.id })));
  wire('mission-card', () => mission && document.dispatchEvent(new CustomEvent('open-quest', { detail: mission.id })));
  wire('open-map', () => setView('map'));
  wire('see-map', () => setView('map'));
  wire('open-letter', () => setView('love'));
  wire('open-love', () => setView('love'));
  wire('open-journal', () => document.dispatchEvent(new CustomEvent('open-widget', { detail: 'journal' })));
  wire('open-applications', () => document.dispatchEvent(new CustomEvent('open-widget', { detail: 'applications' })));
}

function wire(id: string, fn: () => void) {
  if (!host) return;
  const el = host.querySelector<HTMLElement>(`#${id}`);
  el?.addEventListener('click', fn);
}

function startQuoteRotation() {
  if (quoteInterval !== null) window.clearInterval(quoteInterval);
  quoteInterval = window.setInterval(() => {
    if (getState().reducedMotion) return;
    const el = document.getElementById('home-quote');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      el.textContent = `"${quotes[quoteIndex]}"`;
      el.style.opacity = '1';
    }, 500);
  }, 8000);
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'still up, princess';
  if (h < 12) return 'good morning ♡';
  if (h < 17) return 'good afternoon ♡';
  if (h < 21) return 'good evening ♡';
  return 'good night ♡';
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
