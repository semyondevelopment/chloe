import { letters, letterForToday, letterIndexForToday } from '../../data/letters';
import { icon } from '../../lib/icons';
import { gsap } from 'gsap';
import { getState } from '../../lib/state';

let host: HTMLElement | null = null;
let revealedExtras = false;

export function mountLove(parent: HTMLElement): void {
  host = parent;
  revealedExtras = false;
  render();
  // Animations cause flickering on rapid view-switches; skip for now and rely on the parent fade-in.
}

export function unmountLove(): void {
  host = null;
}

function render() {
  if (!host) return;
  const today = letterForToday();
  const todayIdx = letterIndexForToday();
  const dateLabel = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });

  // Archive — all OTHER letters, ordered with today first then the rest
  const archive = letters
    .map((l, i) => ({ l, i }))
    .filter(x => x.i !== todayIdx);

  host.innerHTML = `
    <div class="h-full overflow-y-auto scroll-parchment pb-28">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 pt-3 sm:pt-6 pb-6 space-y-3 sm:space-y-5">

        <!-- Compact hero — fits well on small screens -->
        <header id="love-hero" class="rounded-3xl text-white px-5 py-4 sm:p-6 shadow-bubble relative overflow-hidden"
          style="background: linear-gradient(135deg, #FF1493 0%, #FF5DA2 50%, #C58BF2 100%);">
          <div class="absolute -top-3 -right-3 text-white/25">${icon('heart', 80)}</div>
          <div class="relative flex items-center justify-between gap-3">
            <div>
              <div class="font-heading text-[0.6rem] uppercase tracking-bubble opacity-90">${dateLabel}</div>
              <div class="font-display text-2xl sm:text-3xl mt-0.5 font-bold leading-tight">From Semyon</div>
              <div class="font-display text-sm opacity-95 mt-0.5">a daily letter for chloe</div>
            </div>
            <div class="text-4xl sm:text-5xl">💌</div>
          </div>
        </header>

        <!-- Today's letter (the headline card) -->
        <article class="love-card rounded-[1.75rem] bg-gradient-to-br from-rose-mist via-cotton to-rose-soft border-4 border-bubblegum shadow-bubble overflow-hidden">
          <div class="px-5 pt-3 pb-2 bg-gradient-to-r from-bubblegum to-hotpink text-white flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-white">${icon('mail-open', 22)}</span>
              <div>
                <div class="font-heading text-[0.58rem] uppercase tracking-bubble opacity-90">today's note</div>
                <div class="font-display font-bold text-lg leading-tight">letter ${todayIdx + 1}</div>
              </div>
            </div>
            <div class="text-2xl">💌</div>
          </div>
          <div class="px-5 sm:px-6 py-5">
            <div class="font-display font-semibold text-cocoa text-lg sm:text-xl leading-snug mb-2">${today.greeting}</div>
            <p class="font-display text-cocoa text-base sm:text-[1.0625rem] leading-relaxed mb-3">${today.body}</p>
            <div class="font-display italic text-bubblegum-deep text-base font-semibold text-right">${today.signoff}</div>
          </div>
          <div class="px-5 pb-3 flex items-center justify-between text-[0.65rem] font-heading text-cocoa/60">
            <span>re-rolls at midnight</span>
            <span class="flex items-center gap-1 text-bubblegum-deep">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-bubblegum animate-pulse"></span>
              delivered
            </span>
          </div>
        </article>

        <!-- Stat row — compact on mobile -->
        <section class="grid grid-cols-3 gap-2 sm:gap-3">
          <div class="love-card rounded-2xl bg-white border-2 border-rose-soft p-2.5 sm:p-4 shadow-bubble-soft text-center">
            <div class="text-bubblegum-deep flex justify-center mb-0.5">${icon('heart', 18)}</div>
            <div class="font-display text-xl sm:text-2xl text-cocoa font-semibold leading-tight">${letters.length}</div>
            <div class="font-heading text-[0.55rem] sm:text-[0.6rem] uppercase tracking-bubble text-bubblegum-deep leading-tight">letters in rotation</div>
          </div>
          <div class="love-card rounded-2xl bg-white border-2 border-rose-soft p-2.5 sm:p-4 shadow-bubble-soft text-center">
            <div class="text-bubblegum-deep flex justify-center mb-0.5">${icon('calendarheart', 18)}</div>
            <div class="font-display text-xl sm:text-2xl text-cocoa font-semibold leading-tight">∞</div>
            <div class="font-heading text-[0.55rem] sm:text-[0.6rem] uppercase tracking-bubble text-bubblegum-deep leading-tight">days you are loved</div>
          </div>
          <div class="love-card rounded-2xl bg-white border-2 border-rose-soft p-2.5 sm:p-4 shadow-bubble-soft text-center">
            <div class="text-bubblegum-deep flex justify-center mb-0.5">${icon('hearts', 18)}</div>
            <div class="font-display text-xl sm:text-2xl text-cocoa font-semibold leading-tight">1</div>
            <div class="font-heading text-[0.55rem] sm:text-[0.6rem] uppercase tracking-bubble text-bubblegum-deep leading-tight">rooting for you</div>
          </div>
        </section>

        <!-- Archive header + reveal -->
        <section class="love-card rounded-3xl bg-white border-2 border-rose-soft p-4 sm:p-5 shadow-bubble-soft">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <div class="font-heading text-[0.6rem] uppercase tracking-bubble text-bubblegum-deep">the love archive</div>
              <div class="font-display font-semibold text-cocoa text-base sm:text-lg leading-tight">${revealedExtras ? `every other letter` : `${archive.length} other letters waiting`}</div>
            </div>
            ${revealedExtras ? '' : `
              <button id="reveal-archive"
                class="shrink-0 rounded-full bg-bubblegum text-white font-heading font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 hover:bg-hotpink transition flex items-center gap-1.5 shadow-bubble-soft">
                ${icon('eye', 14)} <span class="hidden sm:inline">open the archive</span><span class="sm:hidden">open</span>
              </button>
            `}
          </div>

          ${revealedExtras ? `
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              ${archive.map(({ l, i }) => `
                <li class="rounded-2xl border-2 border-rose-soft bg-rose-mist/40 p-3.5 hover:border-bubblegum transition">
                  <div class="flex items-start justify-between mb-1">
                    <div class="font-heading text-[0.58rem] uppercase tracking-bubble text-bubblegum-deep">letter ${i + 1}</div>
                    <span class="text-bubblegum-deep">${icon('mail', 14)}</span>
                  </div>
                  <div class="font-display font-semibold text-cocoa text-sm mb-1">${escapeHtml(l.greeting)}</div>
                  <p class="font-display text-cocoa/85 text-sm leading-relaxed line-clamp-3">${escapeHtml(l.body)}</p>
                  <div class="font-display italic text-bubblegum-deep text-sm font-semibold text-right mt-1.5">${escapeHtml(l.signoff)}</div>
                </li>
              `).join('')}
            </ul>
          ` : `
            <p class="font-display text-cocoa/70 text-sm mt-1.5">a stash of past notes — for the days when today's isn't quite enough.</p>
          `}
        </section>

        <!-- Closing card -->
        <section class="love-card rounded-3xl text-center text-white px-5 py-4 sm:p-6 shadow-bubble"
          style="background: linear-gradient(135deg, #FFB6C1, #FF5DA2);">
          <div class="text-white/90 mb-1 flex justify-center">${icon('handheart', 28)}</div>
          <div class="font-display font-bold text-xl">always your s. ♡</div>
          <div class="font-ui text-white/85 text-xs mt-1">this drawer is just for you. nobody else sees it.</div>
        </section>
      </div>
    </div>
  `;

  host.querySelector<HTMLButtonElement>('#reveal-archive')?.addEventListener('click', () => {
    revealedExtras = true;
    render();
    if (!getState().reducedMotion) {
      gsap.from('.love-card li', { y: 12, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power3.out' });
    }
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
