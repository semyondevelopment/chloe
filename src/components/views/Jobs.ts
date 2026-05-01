import { jobs, subwayCons, quittingPlaybook } from '../../data/jobs';
import type { JobType } from '../../data/jobs';
import { dispatch, getState, subscribe } from '../../lib/state';
import { icon } from '../../lib/icons';
import { setView } from '../../lib/router';

let host: HTMLElement | null = null;
let unsub: (() => void) | null = null;
type Tab = 'discover' | 'shortlist' | 'leaving';
let activeTab: Tab = 'discover';

export function mountJobs(parent: HTMLElement): void {
  host = parent;
  render();
  unsub = subscribe(() => render());
}

export function unmountJobs(): void {
  unsub?.();
  unsub = null;
  host = null;
}

function ratingOf(jobId: string): 'like' | 'maybe' | 'dislike' | null {
  const s = getState();
  if (s.jobLikes.includes(jobId)) return 'like';
  if (s.jobMaybes.includes(jobId)) return 'maybe';
  if (s.jobDislikes.includes(jobId)) return 'dislike';
  return null;
}

function vibePill(v: JobType['vibe']): string {
  const map: Record<JobType['vibe'], string> = {
    calm:  'bg-mint/40 border-jade text-jade-deep',
    busy:  'bg-rose-soft border-hotpink text-hotpink',
    mixed: 'bg-sunny/40 border-amber-500 text-amber-700',
  };
  return map[v];
}

function difficultyPill(d: JobType['difficulty']): string {
  const map: Record<JobType['difficulty'], string> = {
    easy:    'bg-mint/40 border-jade text-jade-deep',
    moderate:'bg-sunny/40 border-amber-500 text-amber-700',
    harder:  'bg-rose-soft border-hotpink text-hotpink',
  };
  return map[d];
}

function jobCardHTML(j: JobType, expanded = false): string {
  const r = ratingOf(j.id);
  const ringClass =
    r === 'like'    ? 'border-bubblegum ring-4 ring-bubblegum/20' :
    r === 'maybe'   ? 'border-sunny ring-4 ring-sunny/30' :
    r === 'dislike' ? 'border-lilac/60 opacity-60' :
    'border-rose-soft hover:border-bubblegum';

  return `
    <article class="job-card relative rounded-3xl bg-white border-4 ${ringClass} shadow-bubble-soft overflow-hidden transition-all" data-job-id="${j.id}">
      <header class="px-5 pt-4 pb-3 text-white relative overflow-hidden"
        style="background: linear-gradient(135deg, #FF5DA2, #FF1493 75%, #C58BF2);">
        <div class="absolute -right-3 -top-3 text-white/25">${icon(j.iconName, 100)}</div>
        <div class="relative flex items-start gap-3">
          <span class="text-4xl">${j.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="font-display text-2xl leading-tight" style="font-family:'Dancing Script',cursive;font-weight:700">${j.title}</div>
            <div class="font-script text-base opacity-95 leading-tight">${j.tagline}</div>
          </div>
        </div>
      </header>

      <div class="px-5 py-4 space-y-3">
        <div class="flex flex-wrap gap-2">
          <span class="font-heading text-xs px-2.5 py-1 rounded-full bg-rose-mist border border-rose-soft text-bubblegum-deep">💰 ${j.pay}</span>
          <span class="font-heading text-xs px-2.5 py-1 rounded-full bg-rose-mist border border-rose-soft text-bubblegum-deep">⏰ ${j.hours}</span>
          <span class="font-heading text-xs px-2.5 py-1 rounded-full border ${vibePill(j.vibe)}">${j.vibe} vibe</span>
          <span class="font-heading text-xs px-2.5 py-1 rounded-full border ${difficultyPill(j.difficulty)}">${j.difficulty}</span>
        </div>

        <div>
          <div class="font-heading uppercase tracking-bubble text-[0.62rem] text-bubblegum-deep mb-0.5">what you'd do</div>
          <p class="text-cocoa text-sm">${j.whatYouDo}</p>
        </div>

        <div>
          <div class="font-heading uppercase tracking-bubble text-[0.62rem] text-bubblegum-deep mb-0.5">why it fits chloe</div>
          <p class="font-ui text-cocoa text-base sm:text-lg leading-relaxed border-l-4 border-bubblegum pl-3">${j.whyItFits}</p>
        </div>

        ${expanded ? `
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="font-heading uppercase tracking-bubble text-[0.62rem] text-jade-deep mb-1">${icon('check', 12)} pros</div>
              <ul class="text-sm text-cocoa space-y-0.5">
                ${j.pros.map(p => `<li class="flex gap-1"><span class="text-jade">+</span>${p}</li>`).join('')}
              </ul>
            </div>
            <div>
              <div class="font-heading uppercase tracking-bubble text-[0.62rem] text-hotpink mb-1">${icon('zap', 12)} the cost</div>
              <ul class="text-sm text-cocoa space-y-0.5">
                ${j.cons.map(c => `<li class="flex gap-1"><span class="text-hotpink">−</span>${c}</li>`).join('')}
              </ul>
            </div>
          </div>

          ${j.prereqs.length ? `
            <div>
              <div class="font-heading uppercase tracking-bubble text-[0.62rem] text-bubblegum-deep mb-1">what you'll need</div>
              <div class="flex flex-wrap gap-1.5">
                ${j.prereqs.map(p => `<span class="text-xs px-2 py-1 rounded-full bg-rose-mist border border-rose-soft text-cocoa">${p}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <div>
            <div class="font-heading uppercase tracking-bubble text-[0.62rem] text-bubblegum-deep mb-1">target companies (Brisbane)</div>
            <div class="grid grid-cols-1 gap-1.5">
              ${j.targets.map(t => `
                <a href="${t.url}" target="_blank" rel="noopener noreferrer"
                  class="text-sm rounded-xl border border-rose-soft hover:border-bubblegum bg-white px-3 py-2 flex items-center justify-between gap-2 transition">
                  <span class="text-cocoa truncate">${t.name}</span>
                  <span class="text-bubblegum-deep shrink-0">${icon('external', 14)}</span>
                </a>
              `).join('')}
            </div>
          </div>

          <div>
            <div class="font-heading uppercase tracking-bubble text-[0.62rem] text-bubblegum-deep mb-1">live job-board search</div>
            <div class="flex flex-wrap gap-1.5">
              ${j.searches.map(s => `
                <a href="${s.url}" target="_blank" rel="noopener noreferrer"
                   class="text-xs rounded-full bg-bubblegum text-white px-3 py-1.5 hover:bg-hotpink transition shadow-bubble-soft flex items-center gap-1">
                  ${icon('send', 12)} ${s.label}
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <button data-toggle="${j.id}"
          class="w-full text-center font-heading text-xs text-bubblegum-deep hover:underline mt-1">
          ${expanded ? 'collapse ↑' : 'see more ↓'}
        </button>

        <!-- Rating row -->
        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-rose-soft">
          <button data-rate="${j.id}:dislike"
            class="rounded-xl border-2 ${r === 'dislike' ? 'bg-lilac text-white border-lilac-deep' : 'border-rose-soft hover:border-lilac text-cocoa'} font-heading text-sm py-2 transition flex items-center justify-center gap-1">
            👎 not for me
          </button>
          <button data-rate="${j.id}:maybe"
            class="rounded-xl border-2 ${r === 'maybe' ? 'bg-sunny text-cocoa border-amber-500' : 'border-rose-soft hover:border-sunny text-cocoa'} font-heading text-sm py-2 transition flex items-center justify-center gap-1">
            🤔 maybe
          </button>
          <button data-rate="${j.id}:like"
            class="rounded-xl border-2 ${r === 'like' ? 'bg-bubblegum text-white border-hotpink' : 'border-rose-soft hover:border-bubblegum text-cocoa'} font-heading text-sm py-2 transition flex items-center justify-center gap-1">
            ${icon('heart', 14)} love it
          </button>
        </div>
      </div>
    </article>
  `;
}

const expanded = new Set<string>();

function tabBtn(id: Tab, label: string, iconName: string, count?: number): string {
  const active = id === activeTab;
  return `
    <button data-tab="${id}"
      class="flex items-center gap-2 rounded-full px-4 py-2 transition border-2
        ${active ? 'bg-bubblegum text-white border-hotpink shadow-bubble-soft' : 'bg-white text-cocoa border-rose-soft hover:border-bubblegum'}">
      <span class="${active ? 'text-white' : 'text-bubblegum-deep'}">${icon(iconName, 16)}</span>
      <span class="font-heading text-sm font-semibold">${label}${count !== undefined ? ` · ${count}` : ''}</span>
    </button>
  `;
}

function render() {
  if (!host) return;
  const s = getState();
  const liked = jobs.filter(j => s.jobLikes.includes(j.id));
  const maybe = jobs.filter(j => s.jobMaybes.includes(j.id));
  const undone = jobs.filter(j => !s.jobLikes.includes(j.id) && !s.jobMaybes.includes(j.id) && !s.jobDislikes.includes(j.id));
  const sorted = [...undone, ...maybe]; // show un-rated first, then maybes; dislikes hidden by default in discover

  host.innerHTML = `
    <div class="h-full overflow-y-auto scroll-parchment pb-nav-safe">
      <div class="max-w-5xl mx-auto px-6 pt-6 pb-8 space-y-6">

        <!-- Hero -->
        <header class="rounded-3xl text-white p-7 shadow-bubble relative overflow-hidden"
          style="background: linear-gradient(135deg, #FF1493 0%, #C58BF2 60%, #7A2A60 100%);">
          <div class="absolute -top-4 -right-4 text-white/25">${icon('briefcase', 130)}</div>
          <div class="absolute bottom-2 right-12 text-white/20">${icon('sparkles', 70)}</div>
          <div class="relative">
            <div class="font-heading text-[0.62rem] uppercase tracking-bubble opacity-90">jobs</div>
            <div class="font-display text-5xl mt-1 leading-none" style="font-family:'Dancing Script',cursive;font-weight:700">Time to leave Subway</div>
            <p class="font-display italic text-xl mt-2 max-w-xl">Pick what you actually like. Apply to those. Quit gracefully. ♡</p>
            <div class="mt-4 flex flex-wrap gap-3 text-sm font-heading">
              <span class="px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm">💖 ${s.jobLikes.length} loved</span>
              <span class="px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm">🤔 ${s.jobMaybes.length} maybe</span>
              <span class="px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm">👎 ${s.jobDislikes.length} not for me</span>
            </div>
          </div>
        </header>

        <!-- Tabs -->
        <div class="flex flex-wrap gap-2 sticky top-0 z-10 py-2 bg-cotton/85 backdrop-blur-sm rounded-2xl">
          ${tabBtn('discover', 'Discover', 'compass')}
          ${tabBtn('shortlist', 'Shortlist', 'heart', s.jobLikes.length + s.jobMaybes.length)}
          ${tabBtn('leaving', 'Leaving Subway', 'mail-open')}
        </div>

        ${activeTab === 'discover'  ? renderDiscover(sorted) : ''}
        ${activeTab === 'shortlist' ? renderShortlist(liked, maybe) : ''}
        ${activeTab === 'leaving'   ? renderLeaving() : ''}
      </div>
    </div>
  `;

  // Wire
  host.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab as Tab;
      render();
    });
  });
  host.querySelectorAll<HTMLButtonElement>('[data-rate]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [jobId, rating] = btn.dataset.rate!.split(':');
      const cur = ratingOf(jobId!);
      const next = cur === rating ? 'clear' : (rating as 'like' | 'maybe' | 'dislike');
      dispatch({ type: 'RATE_JOB', jobId: jobId!, rating: next });
    });
  });
  host.querySelectorAll<HTMLButtonElement>('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggle!;
      if (expanded.has(id)) expanded.delete(id);
      else expanded.add(id);
      render();
    });
  });
}

function renderDiscover(list: JobType[]): string {
  const s = getState();
  if (list.length === 0 && (s.jobLikes.length + s.jobDislikes.length + s.jobMaybes.length) > 0) {
    return `
      <div class="rounded-3xl bg-white border-2 border-bubblegum p-8 text-center shadow-bubble-soft">
        <div class="text-bubblegum-deep flex justify-center mb-2">${icon('check', 36)}</div>
        <div class="font-display text-3xl text-cocoa mb-1" style="font-family:'Dancing Script',cursive;font-weight:700">all sorted ♡</div>
        <p class="text-cocoa/75 mb-4">you've rated every role. open your shortlist to start applying.</p>
        <button data-tab="shortlist" class="btn-candy inline-flex items-center gap-2">
          ${icon('heart', 16)} open my shortlist
        </button>
      </div>
    `;
  }
  return `
    <div class="rounded-2xl bg-rose-mist border-2 border-rose-soft p-3 text-sm text-cocoa">
      <span class="font-heading text-bubblegum-deep">how to use this:</span>
      tap each card · expand to see pros, cons, target companies, live job links · rate "love it" / "maybe" / "not for me". your favourites land in the Shortlist tab.
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${list.map(j => jobCardHTML(j, expanded.has(j.id))).join('')}
    </div>
  `;
}

function renderShortlist(liked: JobType[], maybe: JobType[]): string {
  if (liked.length === 0 && maybe.length === 0) {
    return `
      <div class="rounded-3xl bg-white border-2 border-rose-soft p-8 text-center shadow-bubble-soft">
        <div class="text-3xl mb-2">💼</div>
        <div class="font-display text-2xl text-cocoa mb-1" style="font-family:'Dancing Script',cursive;font-weight:700">shortlist is empty</div>
        <p class="text-cocoa/75 mb-4">go rate some jobs in Discover and the favourites will appear here, ready to apply.</p>
        <button data-tab="discover" class="btn-candy inline-flex items-center gap-2">${icon('compass', 16)} open discover</button>
      </div>
    `;
  }
  const totalApps = liked.reduce((sum, j) => sum + j.targetApplications, 0);
  return `
    <div class="rounded-3xl bg-gradient-to-br from-rose-mist to-cotton border-2 border-rose-soft p-5">
      <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-1">your application plan</div>
      <p class="text-cocoa">
        Send <span class="font-display text-2xl text-bubblegum-deep" style="font-family:'Dancing Script',cursive;font-weight:700">${totalApps}</span> applications across
        <span class="font-heading font-semibold">${liked.length}</span> role type${liked.length === 1 ? '' : 's'}. Don't apply to all on the same day — pace it across one week so each cover letter is sharp.
      </p>
    </div>

    ${liked.length ? `
      <section>
        <div class="flex items-center gap-2 mb-3">
          <span class="text-bubblegum-deep">${icon('heart', 18)}</span>
          <span class="font-heading uppercase tracking-bubble text-sm text-bubblegum-deep">love it · ${liked.length}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${liked.map(j => jobCardHTML(j, true)).join('')}
        </div>
      </section>
    ` : ''}

    ${maybe.length ? `
      <section>
        <div class="flex items-center gap-2 mb-3">
          <span class="text-amber-500">${icon('lightbulb', 18)}</span>
          <span class="font-heading uppercase tracking-bubble text-sm text-amber-700">maybe · ${maybe.length}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${maybe.map(j => jobCardHTML(j, expanded.has(j.id))).join('')}
        </div>
      </section>
    ` : ''}
  `;
}

function renderLeaving(): string {
  return `
    <section class="rounded-3xl bg-white border-2 border-rose-soft p-6 shadow-bubble-soft">
      <div class="flex items-center gap-2 text-bubblegum-deep mb-2">
        ${icon('lightbulb', 22)}
        <span class="font-heading uppercase tracking-bubble text-sm">why leaving subway is the right call</span>
      </div>
      <ul class="space-y-3">
        ${subwayCons.map(c => `
          <li class="rounded-2xl border-2 border-rose-soft p-4 bg-rose-mist/40">
            <div class="font-heading font-semibold text-cocoa mb-1">${c.title}</div>
            <p class="text-cocoa/85 text-sm">${c.body}</p>
          </li>
        `).join('')}
      </ul>
    </section>

    <section class="rounded-3xl bg-white border-2 border-bubblegum p-6 shadow-bubble-soft">
      <div class="flex items-center gap-2 text-bubblegum-deep mb-2">
        ${icon('scroll', 22)}
        <span class="font-heading uppercase tracking-bubble text-sm">how to quit gracefully · the playbook</span>
      </div>
      <ol class="space-y-2.5">
        ${quittingPlaybook.map((step, i) => `
          <li class="flex gap-3 items-start">
            <span class="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-bubblegum to-hotpink text-white font-heading font-bold flex items-center justify-center text-sm shadow-bubble-soft">${i + 1}</span>
            <span class="text-cocoa pt-0.5">${step}</span>
          </li>
        `).join('')}
      </ol>
    </section>

    <section class="rounded-3xl bg-gradient-to-br from-bubblegum to-hotpink text-white p-6 shadow-bubble">
      <div class="font-heading uppercase tracking-bubble text-xs opacity-90 mb-1">a small reminder</div>
      <div class="font-display text-2xl mb-1" style="font-family:'Dancing Script',cursive;font-weight:700">a job is a job, not your identity.</div>
      <p class="opacity-95">Subway gave you customer skills, leadership, and grit. You're not throwing that away — you're stacking it onto something better. Walk out with the references and the muscle memory. Leave the polo behind.</p>
    </section>

    <div class="text-center pt-2">
      <button data-tab="discover" class="btn-candy inline-flex items-center gap-2">${icon('compass', 16)} back to discover</button>
    </div>
  `;
}

void setView;
