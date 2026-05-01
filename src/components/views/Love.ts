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
    <div class="h-full overflow-y-auto scroll-parchment pb-nav-safe">
      <div class="max-w-3xl mx-auto px-6 pt-6 pb-8 space-y-6">

        <header id="love-hero" class="rounded-3xl text-white p-7 shadow-bubble relative overflow-hidden"
          style="background: linear-gradient(135deg, #FF1493 0%, #FF5DA2 50%, #C58BF2 100%);">
          <div class="absolute -top-4 -right-4 text-white/30">${icon('heart', 110)}</div>
          <div class="absolute bottom-0 right-12 text-white/20">${icon('mail-open', 90)}</div>
          <div class="relative">
            <div class="font-heading text-[0.62rem] uppercase tracking-bubble opacity-90">${dateLabel}</div>
            <div class="font-display text-5xl mt-1 leading-none" style="font-family:'Dancing Script',cursive;font-weight:700">From Semyon</div>
            <div class="font-script text-2xl mt-1 opacity-95">~ a daily love letter to chloe ~</div>
          </div>
        </header>

        <!-- Today's letter (the headline card) -->
        <article class="love-card rounded-[2rem] bg-gradient-to-br from-rose-mist via-cotton to-rose-soft border-4 border-bubblegum shadow-bubble overflow-hidden">
          <div class="px-6 pt-5 pb-3 bg-gradient-to-r from-bubblegum to-hotpink text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-white">${icon('mail-open', 28)}</span>
              <div>
                <div class="font-heading text-[0.6rem] uppercase tracking-bubble opacity-90">today's note</div>
                <div class="font-script text-2xl leading-tight">letter ${todayIdx + 1}</div>
              </div>
            </div>
            <div class="text-3xl">💌</div>
          </div>
          <div class="px-7 py-7">
            <div class="font-display italic text-cocoa text-2xl leading-snug mb-3">${today.greeting}</div>
            <p class="font-display text-cocoa text-lg leading-relaxed mb-4">${today.body}</p>
            <div class="font-script text-bubblegum-deep text-3xl text-right">${today.signoff}</div>
          </div>
          <div class="px-6 pb-4 flex items-center justify-between text-xs font-heading text-cocoa/60">
            <span>re-rolls at midnight</span>
            <span class="flex items-center gap-1 text-bubblegum-deep">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-bubblegum animate-pulse"></span>
              delivered
            </span>
          </div>
        </article>

        <!-- Stat row -->
        <section class="grid grid-cols-3 gap-3">
          <div class="love-card rounded-3xl bg-white border-2 border-rose-soft p-4 shadow-bubble-soft text-center">
            <div class="text-bubblegum-deep flex justify-center mb-1">${icon('heart', 22)}</div>
            <div class="font-display text-2xl text-cocoa font-semibold">${letters.length}</div>
            <div class="font-heading text-[0.6rem] uppercase tracking-bubble text-bubblegum-deep">letters in the rotation</div>
          </div>
          <div class="love-card rounded-3xl bg-white border-2 border-rose-soft p-4 shadow-bubble-soft text-center">
            <div class="text-bubblegum-deep flex justify-center mb-1">${icon('calendarheart', 22)}</div>
            <div class="font-display text-2xl text-cocoa font-semibold">∞</div>
            <div class="font-heading text-[0.6rem] uppercase tracking-bubble text-bubblegum-deep">days you are loved</div>
          </div>
          <div class="love-card rounded-3xl bg-white border-2 border-rose-soft p-4 shadow-bubble-soft text-center">
            <div class="text-bubblegum-deep flex justify-center mb-1">${icon('hearts', 22)}</div>
            <div class="font-display text-2xl text-cocoa font-semibold">1</div>
            <div class="font-heading text-[0.6rem] uppercase tracking-bubble text-bubblegum-deep">person rooting for you</div>
          </div>
        </section>

        <!-- Archive header + reveal -->
        <section class="love-card rounded-3xl bg-white border-2 border-rose-soft p-5 shadow-bubble-soft">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="font-heading text-[0.62rem] uppercase tracking-bubble text-bubblegum-deep">the love archive</div>
              <div class="font-script text-bubblegum-deep text-xl">${revealedExtras ? `every other letter ♡` : `${archive.length} other letters waiting`}</div>
            </div>
            ${revealedExtras ? '' : `
              <button id="reveal-archive"
                class="rounded-full bg-bubblegum text-white font-heading font-semibold px-4 py-2 hover:bg-hotpink transition flex items-center gap-2 shadow-bubble-soft">
                ${icon('eye', 16)} open the archive
              </button>
            `}
          </div>

          ${revealedExtras ? `
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              ${archive.map(({ l, i }) => `
                <li class="rounded-2xl border-2 border-rose-soft bg-rose-mist/40 p-4 hover:border-bubblegum transition">
                  <div class="flex items-start justify-between mb-1">
                    <div class="font-heading text-[0.6rem] uppercase tracking-bubble text-bubblegum-deep">letter ${i + 1}</div>
                    <span class="text-bubblegum-deep">${icon('mail', 14)}</span>
                  </div>
                  <div class="font-display italic text-cocoa text-sm mb-1">${escapeHtml(l.greeting)}</div>
                  <p class="text-cocoa/85 text-sm line-clamp-3">${escapeHtml(l.body)}</p>
                  <div class="font-script text-bubblegum-deep text-base text-right mt-1">${escapeHtml(l.signoff)}</div>
                </li>
              `).join('')}
            </ul>
          ` : `
            <p class="text-cocoa/70 text-sm mt-2">a stash of past notes — for the days when today's isn't quite enough.</p>
          `}
        </section>

        <!-- Closing card -->
        <section class="love-card rounded-3xl text-center text-white p-7 shadow-bubble"
          style="background: linear-gradient(135deg, #FFB6C1, #FF5DA2);">
          <div class="text-white/90 mb-2 flex justify-center">${icon('handheart', 36)}</div>
          <div class="font-script text-3xl">always your s. ♡</div>
          <div class="font-ui text-white/85 text-sm mt-2">this drawer is just for you. nobody else sees it.</div>
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
