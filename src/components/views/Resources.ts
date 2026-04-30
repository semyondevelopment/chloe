import { quests } from '../../data/quests';
import type { Resource } from '../../data/quests';
import { icon } from '../../lib/icons';

const KIND_META: Record<Resource['kind'], { iconName: string; label: string; tint: string }> = {
  course:      { iconName: 'cap',         label: 'Courses',         tint: 'border-bubblegum bg-rose-mist text-bubblegum-deep' },
  application: { iconName: 'send',        label: 'Apply directly',  tint: 'border-hotpink bg-rose-mist text-hotpink' },
  guide:       { iconName: 'lightbulb',   label: 'Guides',          tint: 'border-sunny bg-yellow-50 text-amber-700' },
  tool:        { iconName: 'wand',        label: 'Tools',           tint: 'border-lilac bg-purple-50 text-lilac-deep' },
  directory:   { iconName: 'briefcase',   label: 'Job boards',      tint: 'border-mint bg-green-50 text-emerald-700' },
  community:   { iconName: 'hearts',      label: 'Communities',     tint: 'border-coral bg-rose-mist text-coral' },
};

type SubTab = 'all' | 'ai' | 'resume' | 'letters' | 'drillyard';
let host: HTMLElement | null = null;
let activeTab: SubTab = 'all';

export function mountResources(parent: HTMLElement): void {
  host = parent;
  render();
}

export function unmountResources(): void {
  host = null;
}

function render() {
  if (!host) return;
  host.innerHTML = `
    <div class="h-full overflow-y-auto scroll-parchment pb-32">
      <div class="max-w-5xl mx-auto px-6 pt-6 pb-8 space-y-6">

        <header class="rounded-3xl text-white p-7 shadow-bubble relative overflow-hidden"
          style="background: linear-gradient(135deg, #FF1493, #C58BF2 90%);">
          <div class="absolute -bottom-3 -right-3 text-white/25">${icon('library', 130)}</div>
          <div class="relative">
            <div class="font-heading text-[0.62rem] uppercase tracking-bubble opacity-90">resources</div>
            <div class="font-display text-5xl leading-none mt-1" style="font-family:'Dancing Script',cursive;font-weight:700">Toolkit</div>
            <div class="font-script text-2xl mt-1 opacity-95">every link, course, and template — one cute drawer ♡</div>
          </div>
        </header>

        <!-- Sub-tabs -->
        <div class="flex flex-wrap gap-2 sticky top-0 z-10 py-2 bg-cotton/80 backdrop-blur-sm rounded-2xl">
          ${subTabBtn('all',       'All Resources',  'library')}
          ${subTabBtn('ai',        'AI Study Tools', 'wand')}
          ${subTabBtn('resume',    'Resume',         'file')}
          ${subTabBtn('letters',   'Cover Letters',  'mail')}
          ${subTabBtn('drillyard', 'Drill Yard',     'dumbbell')}
        </div>

        ${activeTab === 'all'       ? renderAllResources() : ''}
        ${activeTab === 'ai'        ? renderAIBlock()      : ''}
        ${activeTab === 'resume'    ? renderResumeBlock()  : ''}
        ${activeTab === 'letters'   ? renderLettersBlock() : ''}
        ${activeTab === 'drillyard' ? renderDrillBlock()   : ''}
      </div>
    </div>
  `;

  host.querySelectorAll<HTMLButtonElement>('[data-subtab]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.subtab as SubTab;
      render();
    });
  });
}

function subTabBtn(id: SubTab, label: string, iconName: string): string {
  const active = id === activeTab;
  return `
    <button data-subtab="${id}"
      class="flex items-center gap-2 rounded-full px-4 py-2 transition border-2
        ${active ? 'bg-bubblegum text-white border-hotpink shadow-bubble-soft' : 'bg-white text-cocoa border-rose-soft hover:border-bubblegum'}">
      <span class="${active ? 'text-white' : 'text-bubblegum-deep'}">${icon(iconName, 16)}</span>
      <span class="font-heading text-sm font-semibold">${label}</span>
    </button>
  `;
}

function renderAIBlock(): string {
  type AITool = { name: string; url: string; tagline: string; cost: string; bestFor: string; tier: 'must' | 'great' | 'nice' };
  const tools: AITool[] = [
    { name: 'ChatGPT (GPT-5)',       url: 'https://chatgpt.com/',                 tagline: 'the swiss-army study buddy',         cost: 'free + $30/mo plus',  bestFor: 'explaining concepts, generating practice questions, summarising notes, essay outlines',                 tier: 'must' },
    { name: 'Claude',                url: 'https://claude.ai/',                   tagline: 'the careful, long-form thinker',     cost: 'free + $25/mo pro',   bestFor: 'long PDF / textbook chapter summaries, essay feedback, working through proofs step-by-step',           tier: 'must' },
    { name: 'NotebookLM (Google)',   url: 'https://notebooklm.google.com/',       tagline: 'upload your notes — get instant tutor', cost: 'free',             bestFor: 'paste in your school notes / textbook PDFs and ask it questions, generate audio overviews of chapters', tier: 'must' },
    { name: 'Khanmigo (Khan Academy)', url: 'https://www.khanacademy.org/khan-labs', tagline: 'AI tutor that won\'t just give the answer', cost: 'free for QLD students', bestFor: 'maths and science walk-throughs, especially Methods + Specialist topics',                              tier: 'great' },
    { name: 'Wolfram Alpha',         url: 'https://www.wolframalpha.com/',        tagline: 'the maths cheat-code (use ethically)', cost: 'free + paid pro',   bestFor: 'check your maths working, plot graphs, see step-by-step solutions',                                     tier: 'great' },
    { name: 'Photomath',             url: 'https://photomath.com/',               tagline: 'phone camera → solved equation',     cost: 'free + premium',      bestFor: 'snap a Methods or Specialist question, get a step-by-step solution',                                   tier: 'great' },
    { name: 'Quizlet (with AI)',     url: 'https://quizlet.com/',                 tagline: 'flashcards + AI question generator',  cost: 'free + $35/yr plus',  bestFor: 'auto-generate flashcards from notes, ready-made decks for Bio + Chem',                                  tier: 'great' },
    { name: 'Anki + ChatGPT plugin', url: 'https://apps.ankiweb.net/',            tagline: 'spaced-repetition GOAT',             cost: 'free (Mac/PC/web)',   bestFor: 'long-term memory for Bio facts, Chem reactions, Lit quotes — paste a topic into ChatGPT, get a deck',  tier: 'great' },
    { name: 'Yoodli',                url: 'https://app.yoodli.ai/',               tagline: 'AI speaking coach',                  cost: 'free tier',           bestFor: 'practice oral presentations + interview answers, get filler-word + pace feedback',                      tier: 'nice' },
    { name: 'Perplexity',            url: 'https://www.perplexity.ai/',           tagline: 'AI search engine with citations',    cost: 'free + $20/mo pro',   bestFor: 'research for Geography case studies and Lit context — links its sources',                              tier: 'nice' },
    { name: 'Grammarly',             url: 'https://www.grammarly.com/',           tagline: 'silent essay editor',                cost: 'free + $30/mo prem',  bestFor: 'final-pass on essays — catches the typos a tired brain misses',                                        tier: 'nice' },
    { name: 'Mathpix',               url: 'https://mathpix.com/',                 tagline: 'OCR for handwritten maths',          cost: 'free 50/mo',          bestFor: 'scan handwritten working into LaTeX, then ask Claude to check it',                                      tier: 'nice' },
  ];

  type Tip = { title: string; body: string; emoji: string };
  const tips: Tip[] = [
    { emoji: '🎯', title: 'Use AI for active recall, not passive reading',
      body: 'Don\'t just ask "explain mitosis." Ask: "Quiz me on mitosis with 5 multiple-choice questions, then mark my answers and explain what I missed." Active retrieval = real learning.' },
    { emoji: '🧠', title: 'The "explain it to a Year 9" trick',
      body: 'When a topic feels foggy, type: "Explain [topic] like I\'m in Year 9. Then explain it again at Year 12 level." The double-pass cements the foundation.' },
    { emoji: '📝', title: 'Have it grade your essays — but read the feedback',
      body: 'Paste your draft + the marking rubric (your syllabus has one). Ask: "Give me 3 specific weaknesses and one thing to keep." Don\'t accept "great work!" — push for harsh.' },
    { emoji: '⚡', title: 'Practice questions, every time',
      body: 'After learning anything, end with: "Give me 10 exam-style questions on this, with answers I can check after." Better than re-reading the same notes for the 4th time.' },
    { emoji: '🌸', title: 'Voice-explain to AI, then let it correct',
      body: 'Open ChatGPT voice mode. Explain a topic out loud as if to a friend. Ask: "What did I get wrong? What did I miss?" The Feynman technique on rocket fuel.' },
    { emoji: '⏱', title: 'Pomodoro + AI = a great study hour',
      body: '25 min of practice questions → 5 min ask AI to clarify everything you flagged → repeat 4×. Ends a study session knowing exactly what your weak spots are.' },
    { emoji: '📚', title: 'For Lit + English: paste-and-probe',
      body: '"Here\'s a paragraph from [text]. List 3 techniques the author uses, name them, and explain the effect on the reader." Builds your essay analysis vocabulary fast.' },
    { emoji: '🌏', title: 'For Geography: case-study generators',
      body: 'Ask: "Give me 3 recent Australian case studies for [topic, e.g. urban consolidation]. Include statistics, dates, and one quote per case." Your essays get specific, not generic.' },
    { emoji: '🛡️', title: 'Don\'t paste exam answers wholesale',
      body: 'Use AI to learn, not to submit. Most QCE assessments are checked by Turnitin + AI detectors now. Use it to *understand*, then write in your own voice.' },
    { emoji: '🩷', title: 'Ask "what would the marker want?"',
      body: '"For QCE [subject] [task], what does a top-grade response usually contain that a B-grade response doesn\'t?" Calibrates your aim.' },
  ];

  const tierLabel: Record<AITool['tier'], { name: string; tint: string }> = {
    must:  { name: 'must-have', tint: 'border-hotpink bg-hotpink text-white' },
    great: { name: 'great',     tint: 'border-bubblegum bg-bubblegum text-white' },
    nice:  { name: 'nice',      tint: 'border-lilac bg-lilac text-white' },
  };

  return `
    <div class="space-y-6">
      <div class="res-card rounded-3xl bg-gradient-to-br from-bubblegum via-hotpink to-lilac-deep text-white p-6 shadow-bubble relative overflow-hidden">
        <div class="absolute -top-3 -right-3 text-white/25">${icon('wand', 110)}</div>
        <div class="relative">
          <div class="font-heading uppercase tracking-bubble text-xs opacity-90">AI study tools</div>
          <div class="font-display text-3xl mt-1" style="font-family:'Dancing Script',cursive;font-weight:700">Smarter, not harder</div>
          <p class="opacity-95 mt-1">A curated stack — what to use, what each is best at, and how to actually study with it. ♡</p>
        </div>
      </div>

      <section class="res-card">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-bubblegum-deep">${icon('lightbulb', 18)}</span>
          <span class="font-heading uppercase tracking-bubble text-sm text-bubblegum-deep">how to actually study with AI</span>
        </div>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${tips.map(t => `
            <li class="rounded-2xl border-2 border-rose-soft bg-white p-4 hover:border-bubblegum transition shadow-bubble-soft">
              <div class="flex items-start gap-2 mb-1">
                <span class="text-2xl shrink-0">${t.emoji}</span>
                <div class="font-heading font-semibold text-cocoa text-sm">${t.title}</div>
              </div>
              <p class="text-sm text-cocoa/85">${t.body}</p>
            </li>
          `).join('')}
        </ul>
      </section>

      <section class="res-card">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-bubblegum-deep">${icon('sparkles', 18)}</span>
          <span class="font-heading uppercase tracking-bubble text-sm text-bubblegum-deep">the toolkit · ranked by usefulness for QCE study</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${tools.map(t => `
            <a href="${t.url}" target="_blank" rel="noopener noreferrer"
               class="block group rounded-2xl border-2 border-rose-soft hover:border-bubblegum bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-bubble-soft">
              <div class="flex items-start justify-between gap-2 mb-1">
                <div class="font-heading font-semibold text-cocoa">${t.name}</div>
                <span class="text-[0.6rem] uppercase tracking-bubble font-heading rounded-full px-2 py-0.5 border-2 ${tierLabel[t.tier].tint}">
                  ${tierLabel[t.tier].name}
                </span>
              </div>
              <div class="font-script text-bubblegum-deep text-base leading-tight mb-1">${t.tagline}</div>
              <div class="text-xs text-bubblegum-deep font-heading mb-1">💰 ${t.cost}</div>
              <div class="text-sm text-cocoa/85 leading-snug">${t.bestFor}</div>
              <div class="mt-2 inline-flex items-center gap-1 text-xs text-bubblegum-deep font-heading group-hover:translate-x-0.5 transition">
                open ${icon('external', 12)}
              </div>
            </a>
          `).join('')}
        </div>
      </section>

      <section class="res-card rounded-3xl bg-rose-mist border-2 border-rose-soft p-5">
        <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-2 flex items-center gap-2">${icon('zap', 16)} a starter routine</div>
        <ol class="text-sm text-cocoa space-y-1.5 list-decimal list-inside">
          <li>Open the textbook chapter / class notes you're studying.</li>
          <li>Upload them to <span class="font-heading font-semibold">NotebookLM</span> as a source.</li>
          <li>Ask it: "summarise the key concepts, then quiz me on them with 10 multiple-choice questions."</li>
          <li>Whatever you got wrong → ask <span class="font-heading font-semibold">Claude</span> to explain that exact concept again with a worked example.</li>
          <li>Re-do the questions. Move on only when you're hitting 9/10.</li>
          <li>Log the session in <span class="font-heading font-semibold">Study</span> tab. Watch the bars climb. ♡</li>
        </ol>
      </section>
    </div>
  `;
}

function renderAllResources(): string {
  // Aggregate + dedupe
  const seen = new Set<string>();
  const grouped: Record<Resource['kind'], Resource[]> = {
    course: [], application: [], guide: [], tool: [], directory: [], community: [],
  };
  for (const q of quests) {
    for (const r of q.resources) {
      if (seen.has(r.url)) continue;
      seen.add(r.url);
      grouped[r.kind].push(r);
    }
  }

  return `
    <div class="space-y-7">
      <section class="res-card rounded-3xl bg-gradient-to-br from-rose-mist to-cotton border-2 border-rose-soft p-5">
        <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-2 flex items-center gap-2">
          ${icon('star', 18)} Brisbane essentials
        </div>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          ${quickLink('🩹 St John QLD — First Aid courses', 'https://stjohnqld.com.au/training/first-aid-courses/')}
          ${quickLink('🎓 TAFE Queensland (free TAFE eligible)', 'https://tafeqld.edu.au/')}
          ${quickLink('📨 QTAC — uni applications', 'https://www.qtac.edu.au/')}
          ${quickLink('🧠 UCAT ANZ — register', 'https://www.ucat.edu.au/')}
          ${quickLink('🏛️ UQ — Provisional Medicine', 'https://study.uq.edu.au/study-options/programs/provisional-entry-medical-program')}
          ${quickLink('💰 Fair Work pay calculator', 'https://calculate.fairwork.gov.au/')}
        </ul>
      </section>

      ${(Object.keys(grouped) as Resource['kind'][]).map(kind => {
        const list = grouped[kind];
        if (list.length === 0) return '';
        const meta = KIND_META[kind];
        return `
          <section class="res-card">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-9 h-9 rounded-2xl ${meta.tint} flex items-center justify-center border-2">${icon(meta.iconName, 18)}</span>
              <span class="font-heading uppercase tracking-bubble text-sm text-bubblegum-deep">${meta.label}</span>
              <span class="text-xs text-cocoa/50">· ${list.length}</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              ${list.map(r => resourceCard(r)).join('')}
            </div>
          </section>`;
      }).join('')}
    </div>
  `;
}

function resourceCard(r: Resource): string {
  return `
    <a href="${r.url}" target="_blank" rel="noopener noreferrer"
       class="block group rounded-2xl border-2 border-rose-soft hover:border-bubblegum bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-bubble-soft">
      <div class="flex items-start gap-2">
        <div class="flex-1 min-w-0">
          <div class="font-heading font-semibold text-cocoa truncate">${r.label}</div>
          ${r.blurb ? `<div class="text-sm text-cocoa/70 mt-0.5">${r.blurb}</div>` : ''}
          ${r.cost ? `<div class="text-xs text-bubblegum-deep mt-0.5 font-heading">💰 ${r.cost}</div>` : ''}
        </div>
        <div class="text-bubblegum-deep opacity-0 group-hover:opacity-100 transition shrink-0 mt-0.5">${icon('external', 14)}</div>
      </div>
    </a>
  `;
}

function quickLink(label: string, href: string): string {
  return `<li><a class="hover:text-bubblegum-deep transition" href="${href}" target="_blank" rel="noopener">${label} ↗</a></li>`;
}

function renderResumeBlock(): string {
  return `
    <article class="res-card rounded-3xl border-4 border-bubblegum bg-white shadow-bubble overflow-hidden">
      <div class="px-6 py-5 bg-gradient-to-r from-bubblegum to-hotpink text-white">
        <div class="font-display text-3xl">Chloe Trost</div>
        <div class="font-script text-lg opacity-95">aspiring medical professional · Brisbane, QLD</div>
      </div>
      <div class="p-6 space-y-5">
        <section>
          <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-1">Summary</div>
          <p class="text-cocoa">Year-12 graduate with strong sciences, working toward medicine. Two years of customer-facing leadership at Subway, plus regular tutoring and babysitting. Calm under pressure, loves teaching, and shows up.</p>
        </section>
        <section>
          <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-1">Experience</div>
          <ul class="space-y-3">
            <li>
              <div class="flex items-baseline justify-between">
                <div class="font-heading font-semibold text-cocoa">Crew Trainer & Senior Team Member · Subway</div>
                <div class="text-xs text-cocoa/60">2024 – present</div>
              </div>
              <ul class="text-sm text-cocoa/85 list-disc list-inside ml-1 mt-1 space-y-0.5">
                <li>Trains new starters on station setup, food-safety, and customer service.</li>
                <li>Closes the store unsupervised; handles cash reconciliation and stock.</li>
                <li>Promoted to Senior Team Member within ~6 months.</li>
              </ul>
            </li>
            <li>
              <div class="flex items-baseline justify-between">
                <div class="font-heading font-semibold text-cocoa">Private Tutor & Babysitter · Self-employed</div>
                <div class="text-xs text-cocoa/60">2023 – present</div>
              </div>
              <ul class="text-sm text-cocoa/85 list-disc list-inside ml-1 mt-1 space-y-0.5">
                <li>Tutors primary & early-secondary students in maths and biology.</li>
                <li>Regular babysitting clients across St Lucia / Indooroopilly.</li>
              </ul>
            </li>
          </ul>
        </section>
        <section>
          <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-1">Education</div>
          <p class="text-cocoa">QCE completed 2025 · Strong results in Biology & Chemistry · School leadership role · Competitive team sport (coaches & referees juniors)</p>
        </section>
        <section>
          <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-1">Skills</div>
          <div class="flex flex-wrap gap-2">
            ${['Customer service','Cash handling','Training new starters','Food safety','Time management','Tutoring','Empathy','Team leadership']
              .map(s => `<span class="px-3 py-1 rounded-full bg-rose-mist border border-rose-soft text-cocoa text-sm font-heading">${s}</span>`).join('')}
          </div>
        </section>
      </div>
    </article>

    <div class="res-card rounded-2xl bg-rose-mist border-2 border-rose-soft p-4 mt-4">
      <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-1">💡 polish tips</div>
      <ul class="text-sm text-cocoa space-y-1 list-disc list-inside">
        <li>One page only. Use a Canva pink template for soft-but-clean.</li>
        <li>Lead each role with a verb (Trains, Closes, Tutors).</li>
        <li>Save as PDF named <span class="font-mono bg-white px-1.5 py-0.5 rounded">Chloe_Trost_CV.pdf</span>.</li>
        <li>For healthcare roles: highlight First Aid cert + reliability + people skills.</li>
      </ul>
      <a href="https://www.canva.com/resumes/templates/" target="_blank" rel="noopener"
         class="btn-candy inline-flex items-center gap-2 mt-3">${icon('external', 16)} open Canva templates</a>
    </div>
  `;
}

function renderLettersBlock(): string {
  return `
    <div class="space-y-5">
      <div class="res-card rounded-2xl bg-rose-mist border-2 border-rose-soft p-4">
        <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-1 flex items-center gap-2">${icon('scroll', 16)} rules of the letter</div>
        <ul class="text-sm text-cocoa space-y-1 list-disc list-inside">
          <li>Three short paragraphs. Never more than 280 words total.</li>
          <li>Open with one specific reason you want THIS clinic / pharmacy.</li>
          <li>Middle: 2 evidence bullets from your CV that match the job ad.</li>
          <li>Close with a warm sentence + availability + your phone number.</li>
        </ul>
      </div>
      ${letterTemplate('Healthcare admin / reception', 'the gentle pitch', 'mail',
        `Dear [Practice Manager's name, if listed — otherwise "Hiring Team"],

I am writing to apply for the [role title] position at [clinic / pharmacy name]. I am drawn to [one specific thing — e.g. "your women's health focus"], and I am working toward a career in medicine, so a role in your team would be an exceptional fit.

In my current role at Subway I train new staff, manage cash, and close the store unsupervised. I also tutor primary-school students each week, which has made me genuinely calm with people of every age. I hold a current HLTAID011 First Aid + CPR certificate.

I would be delighted to interview at a time that suits you. I am available [days / times] and contactable on [phone] or [email].

Warm regards,
Chloe Trost`)}
      ${letterTemplate('Pharmacy assistant', "the apothecary's pitch", 'pill',
        `Hello,

I'd love to be considered for the Pharmacy Assistant role at [pharmacy]. I am eighteen, in Brisbane, and aiming for a career in medicine — so the chance to work closely with a pharmacist team excites me genuinely.

Hospitality has taught me to keep the queue moving without making anyone feel rushed. I'm methodical with stock and cash, comfortable using POS, and I learn product info quickly. I hold a current First Aid + CPR certificate.

If a brief trial shift would be useful before committing, I'd happily come in. Otherwise I'm available across [days / times].

Thank you for your time,
Chloe Trost · [phone] · [email]`)}
      ${letterTemplate('Pathology trainee collector', 'the steady-hands pitch', 'syringe',
        `Dear [Pathology Recruitment Team],

I would like to apply for the Trainee Pathology Collector role advertised on your careers page. The combination of a structured paid traineeship and direct patient contact is exactly the kind of work I want — I'm working toward medicine, and I learn best on my feet.

I am calm with nervous people (two years of hospitality, plus regular babysitting and tutoring), I have a current HLTAID011 First Aid certificate, and I can commit to early starts. I am happy to provide a Working with Children check and any required vaccinations on request.

Available for interview at any time during the week.

Thank you,
Chloe Trost · [phone] · [email]`)}
    </div>
  `;
}

function letterTemplate(label: string, scriptName: string, iconName: string, body: string): string {
  return `
    <article class="res-card rounded-3xl border-4 border-bubblegum bg-white shadow-bubble-soft overflow-hidden">
      <div class="px-6 py-3 bg-gradient-to-r from-bubblegum to-hotpink text-white flex items-center justify-between">
        <div>
          <div class="font-heading uppercase tracking-bubble text-xs opacity-90">Template · ${label}</div>
          <div class="font-script text-2xl">${scriptName}</div>
        </div>
        <span class="text-white">${icon(iconName, 28)}</span>
      </div>
      <pre class="p-6 font-display text-cocoa text-base leading-relaxed whitespace-pre-wrap break-words bg-white">${body}</pre>
    </article>
  `;
}

function renderDrillBlock(): string {
  type Drill = { q: string; iconName: string; tip: string; example: string };
  const drills: Drill[] = [
    {
      q: 'Tell me about yourself.',
      iconName: 'flower',
      tip: 'Three layers: who you are now (Subway crew trainer + tutor), what you\'re working toward (medicine), and one specific reason you applied here. ~90 seconds.',
      example: '"I\'m Chloe, eighteen, currently a Crew Trainer at Subway in St Lucia. I tutor primary-school maths and biology on weekends, and I\'m working toward studying medicine. I applied here because [specific clinic detail], and I\'ve just earned my First Aid + CPR cert."',
    },
    {
      q: 'Why this role / clinic / pharmacy?',
      iconName: 'heart',
      tip: 'Mention something specific from THEIR website or ad. The clinic name, their patient demographic, their focus. Then connect it to your goal.',
      example: '"I noticed you specialise in [women\'s health / chronic conditions]. I\'m heading toward medicine, and a year on the front desk of a clinic that takes patient relationships this seriously is exactly the experience I want."',
    },
    {
      q: 'What\'s your greatest strength?',
      iconName: 'star',
      tip: 'Pick ONE — staying calm with people. Back it with a real story (STAR-light): a nervous customer, a panicked tutoring kid, a Subway rush. Show the trait, don\'t list it.',
      example: '"Staying soft when people are sharp. At Subway during a rush a customer was upset their order was wrong; I remade it, walked it out to their car, and they came back as a regular. I\'d rather de-escalate than be right."',
    },
    {
      q: 'What\'s a weakness?',
      iconName: 'sprout',
      tip: 'Real, but with a fix. Avoid "I work too hard." Choose something genuinely you, then say what you\'re actively doing about it.',
      example: '"I used to over-prepare — I\'d study every angle of an exam topic and run out of time on essays. I now timebox study to 50-minute blocks, and my essay marks went up a grade band."',
    },
    {
      q: 'Tell me about a time you led / handled conflict.',
      iconName: 'crown',
      tip: 'Use Subway crew-training. Pick one new starter, one shift, one issue you solved. STAR: Situation, Task, Action, Result. Keep it under 90 seconds.',
      example: '"A new starter on a Friday rush froze at the till. I quietly took the line, set them on bread duty, and after the rush walked them through transactions for ten minutes. They closed solo the next week."',
    },
  ];

  return `
    <div class="space-y-4">
      <div class="res-card rounded-2xl bg-rose-mist border-2 border-rose-soft p-4">
        <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-1 flex items-center gap-2">${icon('dumbbell', 16)} drill rules</div>
        <ul class="text-sm text-cocoa space-y-1 list-disc list-inside">
          <li>Practice OUT LOUD. Mirror, phone voice memo, anything.</li>
          <li>Each answer ≤ 90 seconds. Time yourself once.</li>
          <li>STAR method: Situation, Task, Action, Result.</li>
          <li>Ending strong > starting strong. Land each answer.</li>
        </ul>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        ${drills.map((d, i) => `
          <article class="res-card rounded-3xl border-4 border-bubblegum bg-white shadow-bubble-soft overflow-hidden">
            <header class="px-5 py-4 bg-gradient-to-r from-bubblegum to-hotpink text-white">
              <div class="flex items-center gap-3">
                <span class="text-white">${icon(d.iconName, 28)}</span>
                <div>
                  <div class="font-heading uppercase text-[0.6rem] tracking-bubble opacity-90">dummy ${i + 1}</div>
                  <div class="font-display text-xl leading-tight">${d.q}</div>
                </div>
              </div>
            </header>
            <div class="p-5 space-y-3">
              <div>
                <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-1">how to swing</div>
                <p class="text-cocoa text-sm">${d.tip}</p>
              </div>
              <div>
                <div class="font-heading uppercase tracking-bubble text-xs text-bubblegum-deep mb-1">a chloe answer</div>
                <p class="font-display italic text-cocoa text-sm border-l-4 border-bubblegum pl-3">${d.example}</p>
              </div>
            </div>
          </article>
        `).join('')}
      </div>

      <div class="res-card rounded-3xl bg-gradient-to-br from-lilac to-bubblegum text-white p-5 shadow-bubble">
        <div class="font-heading uppercase tracking-bubble text-xs opacity-90 mb-1">⚡ bonus question to expect</div>
        <div class="font-display text-2xl mb-1">"Where do you see yourself in 5 years?"</div>
        <p class="opacity-95">Be honest: medical school, working part-time, still tutoring. Real answers beat polished ones in healthcare interviews.</p>
      </div>
    </div>
  `;
}
