import { quests, chapters } from '../data/quests';
import type { Quest } from '../data/quests';
import { questStatus, getState, subscribe } from '../lib/state';
import { icon } from '../lib/icons';
import { openQuestPanel } from './QuestPanel';

const QUEST_ICON: Record<string, string> = {
  sparkle: 'sparkles',
  flower: 'flower2',
  star: 'star',
  'check-heart': 'check',
  donut: 'cookie',
  cupcake: 'cake',
  cherry: 'cherry',
  crown: 'crown',
  butterfly: 'flower',
  rainbow: 'sparkles',
  unicorn: 'wand',
  'heart-double': 'hearts',
  heart: 'heart',
};

const NODE_SIZE = 96;

type Slot = { quest: Quest; x: number; y: number };

// Build layout TOP-DOWN first (final goal at top, start at bottom)
// We'll iterate quests in order but place them with decreasing y.
function buildLayout(): { slots: Slot[]; chapterMarkers: { id: string; y: number; chapterIdx: number }[]; height: number } {
  const slots: Slot[] = [];
  const chapterMarkers: { id: string; y: number; chapterIdx: number }[] = [];
  const lateral = [50, 32, 68, 38, 62, 28, 72, 42, 58, 35, 65, 50, 30, 70, 40, 60, 36, 64];
  const TOP_PAD = 200;       // space above the very first (top) item — for "the capital" marker
  const BOTTOM_PAD = 160;    // space below the very last (bottom) item — for "you start here"
  const NODE_GAP = 170;
  const CHAPTER_GAP = 200;   // extra room above chapter banner

  // First, walk forward to compute cumulative height
  let cursor = 0;
  let lastChapter = '';
  const layouts: { kind: 'banner' | 'node'; questIndex?: number; offset: number; chapter?: string }[] = [];

  for (let i = 0; i < quests.length; i++) {
    const q = quests[i]!;
    if (q.chapter !== lastChapter) {
      cursor += CHAPTER_GAP;
      layouts.push({ kind: 'banner', offset: cursor, chapter: q.chapter });
      cursor += 110;  // banner height
      lastChapter = q.chapter;
    }
    cursor += NODE_GAP;
    layouts.push({ kind: 'node', questIndex: i, offset: cursor });
  }

  const totalContent = cursor;
  const height = totalContent + TOP_PAD + BOTTOM_PAD;

  // Now invert: bottom of page = start (offset 0), top of page = end (offset totalContent)
  // y = height - BOTTOM_PAD - offset (so first item near bottom)
  let chapterCount = 0;
  for (const l of layouts) {
    const y = height - BOTTOM_PAD - l.offset;
    if (l.kind === 'banner') {
      chapterMarkers.push({ id: l.chapter!, y, chapterIdx: chapterCount });
      chapterCount++;
    } else {
      const q = quests[l.questIndex!]!;
      slots.push({ quest: q, x: lateral[l.questIndex! % lateral.length]!, y });
    }
  }

  return { slots, chapterMarkers, height };
}

const layout = buildLayout();

function nodeStateClass(qid: string): { ring: string; bg: string; sig: string; lift: string } {
  const status = questStatus(qid);
  if (status === 'complete') {
    return {
      ring: 'border-bubblegum-deep',
      bg: 'bg-gradient-to-br from-mint to-bubblegum',
      sig: 'text-white',
      lift: 'shadow-bubble',
    };
  }
  if (status === 'active') {
    return {
      ring: 'border-white',
      bg: 'bg-gradient-to-br from-bubblegum via-hotpink to-bubblegum-deep',
      sig: 'text-white',
      lift: 'shadow-candy animate-bobble',
    };
  }
  return {
    ring: 'border-white',
    bg: 'bg-gradient-to-br from-rose-soft to-lilac/60',
    sig: 'text-plum/70',
    lift: '',
  };
}

function nodeHTML(slot: Slot): string {
  const status = questStatus(slot.quest.id);
  const cls = nodeStateClass(slot.quest.id);
  const showLock = status === 'locked';
  const showCheck = status === 'complete';

  const iconName = showLock ? 'lock' : (QUEST_ICON[slot.quest.icon] ?? 'sparkles');
  return `
    <button
      class="quest-node group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
      data-quest-id="${slot.quest.id}"
      data-status="${status}"
      style="left:${slot.x}%; top:${slot.y}px; width:${NODE_SIZE}px; height:${NODE_SIZE}px;"
      aria-label="${slot.quest.title} — ${status}">
      <span class="absolute inset-0 rounded-full ${cls.bg} ${cls.lift} border-[6px] ${cls.ring}
        flex items-center justify-center transition-transform duration-150
        group-hover:-translate-y-1 group-hover:rotate-[-3deg]"
        style="${status !== 'locked' ? 'box-shadow: 0 8px 0 rgba(122,42,96,0.25), 0 16px 28px -10px rgba(255,20,147,0.5), inset 0 -6px 0 rgba(122,42,96,0.18), inset 0 4px 0 rgba(255,255,255,0.55);' : 'box-shadow: 0 4px 0 rgba(122,42,96,0.18), 0 8px 14px -6px rgba(122,42,96,0.25), inset 0 -4px 0 rgba(122,42,96,0.18), inset 0 3px 0 rgba(255,255,255,0.5);'}">
        <span class="${cls.sig}">${icon(iconName, 40)}</span>
        ${showCheck ? `
          <span class="absolute -right-2 -top-2 w-9 h-9 rounded-full bg-mint border-[3px] border-white flex items-center justify-center text-bubblegum-deep font-bold" style="font-size:18px">✓</span>
        ` : ''}
        ${status === 'active' ? `
          <span class="absolute -inset-3 rounded-full border-[3px] border-bubblegum opacity-75 animate-ping pointer-events-none"></span>
          <span class="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-hotpink text-white font-heading text-[0.55rem] uppercase tracking-bubble shadow-bubble-soft whitespace-nowrap">YOU ARE HERE</span>
        ` : ''}
      </span>
      <span class="absolute left-1/2 -translate-x-1/2 px-3 py-1 rounded-full
        ${status === 'complete' ? 'bg-mint/90 border-2 border-bubblegum-deep text-bubblegum-deep' : ''}
        ${status === 'active' ? 'bg-white border-[3px] border-hotpink text-hotpink shadow-bubble-soft' : ''}
        ${status === 'locked' ? 'bg-white/80 border-2 border-rose-soft text-plum/60' : ''}
        font-heading text-xs whitespace-nowrap font-semibold"
        style="top:calc(100% + 14px)">
        ${slot.quest.emoji} ${slot.quest.title}
      </span>
    </button>`;
}

function chapterBannerHTML(id: string, y: number): string {
  const c = chapters.find(c => c.id === id);
  if (!c) return '';
  return `
    <div class="absolute left-1/2 -translate-x-1/2 w-[min(560px,90%)]"
         style="top:${y}px;">
      <div class="rounded-[1.5rem] px-6 py-3 text-center text-white font-heading font-semibold tracking-bubble shadow-candy flex items-center justify-center gap-2 border-[3px] border-white"
           style="background: linear-gradient(135deg, ${c.color}, #FF1493);">
        <span class="text-xl">${c.emoji}</span>
        <span>${c.title}</span>
      </div>
      <div class="text-center font-script text-plum mt-1.5 text-lg">${c.subtitle}</div>
    </div>`;
}

function pathSvgHTML(): string {
  const { slots, height } = layout;
  if (slots.length < 2) return '';

  // Reverse slots for drawing because the path goes from BOTTOM (start) to TOP (end).
  // slots are already in quest order; just use them.
  let d = '';
  for (let i = 0; i < slots.length - 1; i++) {
    const a = slots[i]!;
    const b = slots[i + 1]!;
    // viewBox is 0..100 wide; lateral.x is already 0..100 (percent)
    const ax = a.x;
    const ay = a.y;
    const bx = b.x;
    const by = b.y;
    const midY = (ay + by) / 2;
    if (i === 0) d += `M ${ax} ${ay} `;
    d += `C ${ax} ${midY}, ${bx} ${midY}, ${bx} ${by} `;
  }

  return `
    <svg class="absolute inset-0 w-full pointer-events-none" style="height:${height}px;" viewBox="0 0 100 ${height}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="pathGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#FFE066"/>
          <stop offset="22%" stop-color="#FFB6C1"/>
          <stop offset="42%" stop-color="#FF5DA2"/>
          <stop offset="65%" stop-color="#FF1493"/>
          <stop offset="85%" stop-color="#C58BF2"/>
          <stop offset="100%" stop-color="#7A2A60"/>
        </linearGradient>
        <linearGradient id="pathHalo" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0.6"/>
        </linearGradient>
      </defs>

      <!-- White halo behind the trail (more contrast on pink bg) -->
      <path d="${d}" stroke="url(#pathHalo)" stroke-width="22" fill="none" stroke-linecap="round" opacity="0.85" vector-effect="non-scaling-stroke"/>
      <!-- Main trail (solid, thick, gradient) -->
      <path d="${d}" stroke="url(#pathGrad)" stroke-width="14" fill="none" stroke-linecap="round" opacity="1" vector-effect="non-scaling-stroke"/>
      <!-- Inner highlight -->
      <path d="${d}" stroke="rgba(255,255,255,0.65)" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="3 10" vector-effect="non-scaling-stroke"/>
    </svg>`;
}

// Footprint dots scattered along the trail between consecutive nodes
function footprintsHTML(): string {
  const { slots } = layout;
  let html = '';
  for (let i = 0; i < slots.length - 1; i++) {
    const a = slots[i]!;
    const b = slots[i + 1]!;
    // 2 footprints between each pair, alternating slight side offset
    for (let k = 1; k <= 2; k++) {
      const t = k / 3;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      const heart = k % 2 === 0 ? '♡' : '✦';
      html += `<span class="absolute -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none text-bubblegum/70 text-xs font-bold animate-slow-drift"
                     style="left:${x}%; top:${y}px; animation-delay:${(i + k) * 0.2}s;">${heart}</span>`;
    }
  }
  return html;
}

export function renderPath(host: HTMLElement): void {
  const { slots, chapterMarkers, height } = layout;
  const startY = height - 60;     // y where the "you start here" stamp goes (bottom)
  const endY = 80;                 // y where "the capital" goes (top)

  host.innerHTML = `
    <div class="path-scroll relative h-full overflow-y-auto overflow-x-hidden scroll-parchment"
         style="scroll-behavior: smooth;">
      <!-- Map paper background: stronger contrast pink -->
      <div class="relative w-full" style="height:${height}px; background:
        radial-gradient(ellipse at 15% 90%, rgba(255,224,102,0.45) 0%, transparent 30%),
        radial-gradient(ellipse at 85% 70%, rgba(255,93,162,0.35) 0%, transparent 35%),
        radial-gradient(ellipse at 25% 40%, rgba(224,176,255,0.45) 0%, transparent 35%),
        radial-gradient(ellipse at 75% 15%, rgba(122,42,96,0.25) 0%, transparent 40%),
        linear-gradient(180deg, #E0B0FF 0%, #FFB6C1 30%, #FFE6EE 70%, #FFF8F0 100%);">

        <!-- Subtle grid for paper feel -->
        <div class="absolute inset-0 opacity-[0.07] pointer-events-none"
             style="background-image:
               linear-gradient(rgba(122,42,96,0.4) 1px, transparent 1px),
               linear-gradient(90deg, rgba(122,42,96,0.4) 1px, transparent 1px);
               background-size: 64px 64px, 64px 64px;"></div>

        ${pathSvgHTML()}
        ${footprintsHTML()}

        ${chapterMarkers.map(c => chapterBannerHTML(c.id, c.y)).join('')}
        ${slots.map(nodeHTML).join('')}

        <!-- "You start here" — bottom marker -->
        <div class="absolute left-1/2 -translate-x-1/2 text-center" style="top:${startY}px">
          <div class="inline-flex flex-col items-center gap-2">
            <div class="font-script text-plum text-2xl">~ you start here ~</div>
            <div class="px-4 py-2 rounded-full bg-white border-[3px] border-hotpink text-hotpink font-heading text-sm shadow-bubble-soft uppercase tracking-bubble">
              🌱 Subway Outpost · St Lucia
            </div>
          </div>
        </div>

        <!-- "The Capital" — top goal marker -->
        <div class="absolute left-1/2 -translate-x-1/2 text-center" style="top:${endY}px">
          <div class="inline-flex flex-col items-center gap-2">
            <div class="px-5 py-3 rounded-2xl bg-gradient-to-br from-hotpink via-bubblegum-deep to-plum text-white font-heading uppercase tracking-bubble shadow-candy border-[3px] border-white">
              ⚕️ THE CAPITAL
            </div>
            <div class="chloe-wordmark text-4xl">surgeon, dr. trost</div>
            <div class="font-script text-plum text-base">~ the goal at the top of the map ~</div>
          </div>
        </div>

        <!-- Decorative scattered cuteness -->
        <div class="absolute animate-bobble text-white opacity-90" style="top:${height - 320}px; left:5%;">${icon('cloud', 64)}</div>
        <div class="absolute animate-bobble text-white opacity-80" style="top:${height - 600}px; right:6%; animation-delay:.6s;">${icon('cloud', 56)}</div>
        <div class="absolute animate-wiggle text-hotpink" style="top:${height - 1000}px; left:4%;">${icon('flower2', 40)}</div>
        <div class="absolute animate-bobble text-white opacity-90" style="top:${height - 1500}px; right:8%;">${icon('cloud', 72)}</div>
        <div class="absolute animate-wiggle text-bubblegum" style="top:${height - 2000}px; left:6%;">${icon('flower2', 48)}</div>
        <div class="absolute animate-bobble text-sunny" style="top:${height - 2600}px; right:5%; animation-delay:.4s;">${icon('star', 36)}</div>
      </div>
    </div>
  `;

  host.querySelectorAll<HTMLButtonElement>('.quest-node').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.questId;
      if (!id) return;
      openQuestPanel(id);
    });
    btn.tabIndex = 0;
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Auto-scroll to active node on first render (so "you are here" is visible)
  scrollToActive(host);
}

function scrollToActive(host: HTMLElement) {
  const scroller = host.querySelector<HTMLElement>('.path-scroll');
  if (!scroller) return;
  const active = host.querySelector<HTMLElement>('.quest-node[data-status="active"]');
  if (active) {
    const top = parseFloat(active.style.top);
    const target = Math.max(0, top - scroller.clientHeight / 2 + 40);
    scroller.scrollTop = target;
    return;
  }
  // Fallback: scroll to bottom (start)
  scroller.scrollTop = scroller.scrollHeight;
}

let mounted: HTMLElement | null = null;
export function mountPath(host: HTMLElement): void {
  mounted = host;
  renderPath(host);
  let lastSig = signature(getState());
  subscribe(s => {
    const sig = signature(s);
    if (sig !== lastSig && mounted) {
      lastSig = sig;
      const scroller = mounted.querySelector<HTMLElement>('.path-scroll');
      const top = scroller?.scrollTop ?? 0;
      renderPath(mounted);
      const newScroller = mounted.querySelector<HTMLElement>('.path-scroll');
      if (newScroller) newScroller.scrollTop = top;
    }
  });
}

function signature(s: ReturnType<typeof getState>): string {
  return [s.completedQuestIds.join(','), s.xp].join('|');
}
