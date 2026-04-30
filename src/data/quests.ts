import type { SigilName } from '../lib/sigils';

export type Resource = {
  label: string;
  url: string;
  kind: 'course' | 'application' | 'guide' | 'tool' | 'directory' | 'community';
  cost?: string;
  blurb?: string;
};

export type Subtask = {
  id: string;
  label: string;
};

export type Quest = {
  id: string;
  title: string;
  realTitle: string;
  description: string;
  realDescription: string;
  chapter: string;
  chapterColor: string;
  icon: SigilName;
  emoji: string;
  xp: number;
  rewardTitle?: string;
  requires: string[];
  subtasks: Subtask[];
  resources: Resource[];
  estimate: string;
};

export type Chapter = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  emoji: string;
};

export const chapters: Chapter[] = [
  { id: 'starter',   title: 'Chapter 1 · The Sprout',          subtitle: 'set up the basics, gather the gear', color: '#FFE066', emoji: '🌱' },
  { id: 'forge',     title: 'Chapter 2 · Forge the Certs',      subtitle: 'unlock the first real doors',       color: '#FF5DA2', emoji: '🎀' },
  { id: 'frontier',  title: 'Chapter 3 · Strike the Frontier',  subtitle: 'apply, apply, apply',               color: '#FF1493', emoji: '💖' },
  { id: 'gauntlet',  title: 'Chapter 4 · The Interview Gauntlet', subtitle: 'walk through the gates',          color: '#E0B0FF', emoji: '✨' },
  { id: 'foothold',  title: 'Chapter 5 · Claim the Foothold',   subtitle: 'first paycheque in healthcare',     color: '#FF8AAE', emoji: '🏰' },
  { id: 'citadel',   title: 'Chapter 6 · The Citadel of Study', subtitle: 'ucat, uni, the long climb',         color: '#C58BF2', emoji: '🎓' },
  { id: 'capital',   title: 'Chapter 7 · The Capital',          subtitle: 'medicine. surgery. you made it.',   color: '#FF1493', emoji: '⚕️' },
];

export const quests: Quest[] = [
  // ---------------- CHAPTER 1: STARTER ----------------
  {
    id: 'q-checkin',
    title: 'Daily Check-In ♡',
    realTitle: 'Open the dashboard, log a tiny win',
    description: 'Show up. Even on the soft days. The map only works if you do.',
    realDescription: 'Open the Operations Map daily. Mark something — anything — done. A small heart in a big plan.',
    chapter: 'starter',
    chapterColor: '#FFE066',
    icon: 'sparkle',
    emoji: '🌟',
    xp: 10,
    requires: [],
    subtasks: [
      { id: 's1', label: 'Sign in to the map' },
      { id: 's2', label: 'Add one journal note' },
    ],
    resources: [],
    estimate: '2 minutes',
  },
  {
    id: 'q-resume',
    title: 'Polish the Resume 📝',
    realTitle: 'Update CV with current Subway role + tutoring',
    description: 'Your résumé is your sword. Sharpen it. One page, clean, every line earned.',
    realDescription: 'Update your one-page CV: Subway crew trainer, tutoring, babysitting, school leadership, sports, QCE results. Use a clean Canva template — no fluff, no clipart.',
    chapter: 'starter',
    chapterColor: '#FFE066',
    icon: 'flower',
    emoji: '📝',
    xp: 40,
    requires: ['q-checkin'],
    subtasks: [
      { id: 's1', label: 'Write contact line + 2-sentence summary' },
      { id: 's2', label: 'List 3 jobs with bullet wins' },
      { id: 's3', label: 'List education + QCE results' },
      { id: 's4', label: 'Export PDF named "Chloe_Trost_CV.pdf"' },
    ],
    resources: [
      { kind: 'tool', label: 'Canva — Pink Resume Templates', url: 'https://www.canva.com/resumes/templates/', cost: 'free', blurb: 'Pick a clean one — pretty but readable.' },
      { kind: 'guide', label: 'Seek — How to Write a Resume', url: 'https://www.seek.com.au/career-advice/article/how-to-write-a-resume', cost: 'free' },
      { kind: 'guide', label: 'Australian Resume Format Guide', url: 'https://www.indeed.com/career-advice/resumes-cover-letters/resume-format', cost: 'free' },
    ],
    estimate: '1–2 hours',
  },
  {
    id: 'q-linkedin',
    title: 'The Public Ledger 🌐',
    realTitle: 'Build LinkedIn profile',
    description: 'A little corner of the internet that says: I exist, I am working, please notice.',
    realDescription: 'Create a LinkedIn profile. Headshot, headline ("Aspiring medical professional · Brisbane"), Subway role, school, sports. Connect with 5 people you know.',
    chapter: 'starter',
    chapterColor: '#FFE066',
    icon: 'star',
    emoji: '🌐',
    xp: 35,
    requires: ['q-resume'],
    subtasks: [
      { id: 's1', label: 'Sign up + nice headshot photo' },
      { id: 's2', label: 'Write the headline' },
      { id: 's3', label: 'Fill in experience + education' },
      { id: 's4', label: 'Connect with 5 people' },
    ],
    resources: [
      { kind: 'tool', label: 'LinkedIn — Sign up', url: 'https://www.linkedin.com/signup', cost: 'free' },
      { kind: 'guide', label: 'LinkedIn for Students', url: 'https://university.linkedin.com/linkedin-for-students', cost: 'free' },
    ],
    estimate: '45 minutes',
  },

  // ---------------- CHAPTER 2: FORGE ----------------
  {
    id: 'q-firstaid',
    title: 'Forge the Cert 🩹',
    realTitle: 'HLTAID011 — First Aid + CPR',
    description: 'The court physician will not see you without the seal of the Healer\'s Guild. One Saturday. One certificate. Every clinic door in Brisbane begins to creak open.',
    realDescription: 'Book and complete a HLTAID011 First Aid + CPR course. Around $130–160, one Saturday in Brisbane CBD. Required by virtually every healthcare-adjacent role.',
    chapter: 'forge',
    chapterColor: '#FF5DA2',
    icon: 'check-heart',
    emoji: '🩹',
    xp: 120,
    rewardTitle: 'Field Princess',
    requires: ['q-linkedin'],
    subtasks: [
      { id: 's1', label: 'Compare 3 providers' },
      { id: 's2', label: 'Book a Saturday session' },
      { id: 's3', label: 'Attend course + pass assessment' },
      { id: 's4', label: 'Save certificate PDF' },
    ],
    resources: [
      { kind: 'course', label: 'St John Ambulance QLD — First Aid', url: 'https://stjohnqld.com.au/training/first-aid-courses/', cost: '~$155', blurb: 'Brisbane CBD, weekends available' },
      { kind: 'course', label: 'Australian Red Cross — First Aid', url: 'https://www.redcross.org.au/training/courses/first-aid/', cost: '~$160' },
      { kind: 'course', label: 'Real Response Brisbane', url: 'https://realresponse.com.au/', cost: '~$135', blurb: 'often cheapest; CBD location' },
      { kind: 'course', label: 'Allens Training', url: 'https://www.allenstraining.com.au/courses/first-aid-courses-brisbane.aspx', cost: '~$130' },
    ],
    estimate: 'one Saturday',
  },
  {
    id: 'q-cert3',
    title: 'The Apprenticeship 📚',
    realTitle: 'Cert III in Health Services Assistance (HLT33115)',
    description: 'A long study. The kind that smells of mortar dust and old textbooks. Worth every late night — it is the key to working as a hospital assistant while you climb toward medicine.',
    realDescription: 'Enrol in HLT33115 Cert III Health Services Assistance at TAFE QLD or a private RTO. ~6 months, ~$2k–4k (subsidised pathways exist). Lets you work as Assistant in Nursing, ward clerk, etc.',
    chapter: 'forge',
    chapterColor: '#FF5DA2',
    icon: 'donut',
    emoji: '📚',
    xp: 200,
    rewardTitle: 'Apothecary Apprentice',
    requires: ['q-firstaid'],
    subtasks: [
      { id: 's1', label: 'Compare TAFE QLD vs private RTOs' },
      { id: 's2', label: 'Check QLD subsidy eligibility' },
      { id: 's3', label: 'Enrol in next intake' },
      { id: 's4', label: 'Pass first module' },
    ],
    resources: [
      { kind: 'course', label: 'TAFE QLD — Cert III HSA', url: 'https://tafeqld.edu.au/course/16/16916/certificate-iii-in-health-services-assistance', cost: 'subsidy possible', blurb: 'Public option, multiple campuses' },
      { kind: 'course', label: 'Australian College — HLT33115', url: 'https://www.australiancollege.edu.au/our-courses/health/hlt33115-certificate-iii-in-health-services-assistance/', cost: '~$2900' },
      { kind: 'guide', label: 'QLD Free TAFE Eligibility', url: 'https://desbt.qld.gov.au/training/providers/funded/free-tafe', cost: 'free to read' },
    ],
    estimate: '6 months part-time',
  },

  // ---------------- CHAPTER 3: FRONTIER ----------------
  {
    id: 'q-medreception',
    title: 'Strike the Frontier — Tier 1 ⚔️',
    realTitle: 'Apply to 5 medical reception / clinic admin roles',
    description: 'The first front. Each clinic is a small fortress with its own gatekeeper. Five letters loosed at five gates — one will open. That is all you need.',
    realDescription: 'Apply to 5 medical receptionist or clinic admin roles. Tailor each cover letter. Use Seek, Indeed, and direct GP/specialist clinic websites.',
    chapter: 'frontier',
    chapterColor: '#FF1493',
    icon: 'sparkle',
    emoji: '⚔️',
    xp: 90,
    requires: ['q-firstaid'],
    subtasks: [
      { id: 's1', label: 'Apply to clinic 1' },
      { id: 's2', label: 'Apply to clinic 2' },
      { id: 's3', label: 'Apply to clinic 3' },
      { id: 's4', label: 'Apply to clinic 4' },
      { id: 's5', label: 'Apply to clinic 5' },
    ],
    resources: [
      { kind: 'directory', label: 'Seek — Medical Receptionist Brisbane', url: 'https://www.seek.com.au/medical-receptionist-jobs/in-brisbane-qld', cost: 'free' },
      { kind: 'directory', label: 'Indeed — Medical Reception Brisbane', url: 'https://au.indeed.com/jobs?q=medical+receptionist&l=Brisbane+QLD', cost: 'free' },
      { kind: 'directory', label: 'Healthshare Careers', url: 'https://www.healthshare.com.au/jobs/', cost: 'free' },
      { kind: 'guide', label: 'Cover Letter Template (Australian)', url: 'https://www.seek.com.au/career-advice/article/free-cover-letter-template', cost: 'free' },
    ],
    estimate: '1 week of evenings',
  },
  {
    id: 'q-pharmacy',
    title: 'The Apothecary Houses 💊',
    realTitle: 'Apply to 5 pharmacy assistant roles',
    description: 'Chemist Warehouse. Priceline. Terry White. Each tends its patients differently. Some will not answer. Two might. One is enough.',
    realDescription: 'Apply to 5 pharmacy assistant roles. Direct websites usually beat Seek. Walk-in resume drops also work for chains.',
    chapter: 'frontier',
    chapterColor: '#FF1493',
    icon: 'cupcake',
    emoji: '💊',
    xp: 90,
    requires: ['q-firstaid'],
    subtasks: [
      { id: 's1', label: 'Apply to Chemist Warehouse careers' },
      { id: 's2', label: 'Apply to Priceline' },
      { id: 's3', label: 'Apply to Terry White Chemmart' },
      { id: 's4', label: 'Apply to Amcal' },
      { id: 's5', label: 'Walk-in: 1 local independent' },
    ],
    resources: [
      { kind: 'application', label: 'Chemist Warehouse Careers', url: 'https://careers.chemistwarehouse.com.au/', cost: 'free' },
      { kind: 'application', label: 'Priceline Pharmacy Careers', url: 'https://www.priceline.com.au/careers', cost: 'free' },
      { kind: 'application', label: 'Terry White Chemmart Careers', url: 'https://www.terrywhitechemmart.com.au/careers', cost: 'free' },
      { kind: 'application', label: 'Amcal Pharmacy Careers', url: 'https://www.amcal.com.au/about-us/careers', cost: 'free' },
    ],
    estimate: '4–6 hours',
  },
  {
    id: 'q-pathology',
    title: 'The Bloodletters\' Guild 🩸',
    realTitle: 'Apply to 3 pathology collector trainee roles',
    description: 'A specialist guild — they will train you if you bring the gentle hands and the steady eye. Fewer doors, but they open wider.',
    realDescription: 'Apply to 3 pathology collector trainee roles. Sullivan Nicolaides, QML, 4Cyte. Many do paid trainee programs in Brisbane.',
    chapter: 'frontier',
    chapterColor: '#FF1493',
    icon: 'cherry',
    emoji: '🩸',
    xp: 80,
    requires: ['q-firstaid'],
    subtasks: [
      { id: 's1', label: 'Apply to Sullivan Nicolaides Pathology' },
      { id: 's2', label: 'Apply to QML Pathology' },
      { id: 's3', label: 'Apply to 4Cyte Pathology' },
    ],
    resources: [
      { kind: 'application', label: 'Sullivan Nicolaides Careers', url: 'https://www.snp.com.au/careers/', cost: 'free', blurb: 'Brisbane HQ; trainee programs' },
      { kind: 'application', label: 'QML Pathology Careers', url: 'https://www.qml.com.au/careers/', cost: 'free' },
      { kind: 'application', label: '4Cyte Pathology Careers', url: 'https://4cyte.com.au/careers/', cost: 'free' },
    ],
    estimate: '2–3 hours',
  },
  {
    id: 'q-uqadmin',
    title: 'The Citadel of Records 🏛️',
    realTitle: 'Apply to 5 UQ casual admin / student roles',
    description: 'Slip into the Citadel\'s shadow before you climb its walls. Casual admin pays well, looks great on a CV, and gets you onto the campus you intend to conquer.',
    realDescription: 'Apply to 5 casual admin / student / library / events roles via UQ Jobs. They specifically hire UQ-bound students.',
    chapter: 'frontier',
    chapterColor: '#FF1493',
    icon: 'crown',
    emoji: '🏛️',
    xp: 90,
    requires: ['q-resume'],
    subtasks: [
      { id: 's1', label: 'Make UQ Jobs account' },
      { id: 's2', label: 'Apply to casual admin role' },
      { id: 's3', label: 'Apply to library / IT helpdesk' },
      { id: 's4', label: 'Apply to events / open day staff' },
      { id: 's5', label: 'Apply to research assistant (admin)' },
    ],
    resources: [
      { kind: 'application', label: 'UQ Jobs Portal', url: 'https://jobs.uq.edu.au/', cost: 'free' },
      { kind: 'application', label: 'UQ Student Employability', url: 'https://employability.uq.edu.au/', cost: 'free' },
      { kind: 'directory', label: 'UQ Student Helpers Program', url: 'https://employability.uq.edu.au/student-employment-uq', cost: 'free' },
    ],
    estimate: '3 hours',
  },
  {
    id: 'q-walkin',
    title: 'Door-to-Door Sortie 🚶‍♀️',
    realTitle: 'Walk-in resume drops at 10 clinics / pharmacies',
    description: 'Nothing replaces a face. A printed CV in pink folder, a rehearsed two-sentence pitch, ten clinics, one afternoon. They will remember the girl who showed up.',
    realDescription: 'Print 10 copies of your CV. Plan a walking route through Indooroopilly / Toowong / St Lucia clinics + pharmacies. Drop in, smile, ask for the manager, leave the CV.',
    chapter: 'frontier',
    chapterColor: '#FF1493',
    icon: 'butterfly',
    emoji: '🚶‍♀️',
    xp: 100,
    rewardTitle: 'Frontier Striker',
    requires: ['q-medreception', 'q-pharmacy'],
    subtasks: [
      { id: 's1', label: 'Print 10 CVs + pretty folder' },
      { id: 's2', label: 'Plan walking route on Google Maps' },
      { id: 's3', label: 'Drop CV at 5 locations' },
      { id: 's4', label: 'Drop CV at 5 more locations' },
      { id: 's5', label: 'Log every drop in the Field Journal' },
    ],
    resources: [
      { kind: 'tool', label: 'Google Maps — Plan Route', url: 'https://maps.google.com/', cost: 'free' },
      { kind: 'guide', label: 'How to Drop In a Resume', url: 'https://www.indeed.com/career-advice/finding-a-job/how-to-hand-out-resume-in-person', cost: 'free' },
    ],
    estimate: '1 afternoon',
  },

  // ---------------- CHAPTER 4: GAUNTLET ----------------
  {
    id: 'q-drillyard',
    title: 'The Drill Yard 🥊',
    realTitle: 'Master the 5 standard interview questions',
    description: 'Five training dummies in the yard. Strike each one until your answers come without trembling. Tell me about yourself. Why this role. Strength. Weakness. A time you led.',
    realDescription: 'Practice the 5 staple interview questions out loud. Record yourself once. Listen back without flinching. This is the single highest-leverage interview prep move.',
    chapter: 'gauntlet',
    chapterColor: '#E0B0FF',
    icon: 'star',
    emoji: '🥊',
    xp: 70,
    requires: ['q-walkin'],
    subtasks: [
      { id: 's1', label: '"Tell me about yourself" — 90 seconds' },
      { id: 's2', label: '"Why this role?" — tailored per app' },
      { id: 's3', label: '"Greatest strength" + a real example' },
      { id: 's4', label: '"Weakness" — honest, with a fix' },
      { id: 's5', label: '"Tell me about a time you led" (Subway crew trainer)' },
    ],
    resources: [
      { kind: 'guide', label: 'Indeed — 5 Common Questions', url: 'https://www.indeed.com/career-advice/interviewing/most-common-interview-questions-and-answers', cost: 'free' },
      { kind: 'guide', label: 'STAR Method Guide', url: 'https://www.themuse.com/advice/star-interview-method', cost: 'free' },
      { kind: 'tool', label: 'Yoodli — AI Speaking Coach', url: 'https://app.yoodli.ai/', cost: 'free tier' },
    ],
    estimate: '2 hours practice',
  },
  {
    id: 'q-gate',
    title: 'Cross the Gate ✨',
    realTitle: 'Land your first interview',
    description: 'The gate opens. You will not be perfectly ready, and that is the point. Walk through it.',
    realDescription: 'Get invited to your first interview. Confirm time/place, plan outfit (smart casual), arrive 10 min early, bring printed CV.',
    chapter: 'gauntlet',
    chapterColor: '#E0B0FF',
    icon: 'rainbow',
    emoji: '✨',
    xp: 150,
    rewardTitle: 'Gate-Crosser',
    requires: ['q-drillyard'],
    subtasks: [
      { id: 's1', label: 'Receive interview invite' },
      { id: 's2', label: 'Confirm + plan travel' },
      { id: 's3', label: 'Pick outfit + iron it' },
      { id: 's4', label: 'Arrive early, breathe' },
      { id: 's5', label: 'Send thank-you email after' },
    ],
    resources: [
      { kind: 'guide', label: 'What to Wear: Healthcare Interview', url: 'https://www.indeed.com/career-advice/interviewing/healthcare-interview-attire', cost: 'free' },
      { kind: 'guide', label: 'Thank-You Email Template', url: 'https://www.themuse.com/advice/the-perfect-template-to-write-a-thank-you-email-after-an-interview', cost: 'free' },
    ],
    estimate: '~1 hour interview',
  },
  {
    id: 'q-bargain',
    title: 'The Bargain 💰',
    realTitle: 'Negotiate your offered rate',
    description: 'They have offered. Pause. Ask once: "Is there flexibility on the hourly rate?" The worst they can say is the number they already gave.',
    realDescription: 'When offered a role, politely ask if there\'s flexibility on rate or hours. Most entry roles have a small ceiling — but \"can I have $1 more / hour\" works surprisingly often.',
    chapter: 'gauntlet',
    chapterColor: '#E0B0FF',
    icon: 'donut',
    emoji: '💰',
    xp: 60,
    requires: ['q-gate'],
    subtasks: [
      { id: 's1', label: 'Receive offer in writing' },
      { id: 's2', label: 'Check QLD award rate for the role' },
      { id: 's3', label: 'Reply: "thanks — is there flexibility on rate?"' },
    ],
    resources: [
      { kind: 'tool', label: 'Fair Work Pay Calculator', url: 'https://calculate.fairwork.gov.au/', cost: 'free', blurb: 'Know what the award says before you ask.' },
      { kind: 'guide', label: 'How to Negotiate Your First Job Offer', url: 'https://www.themuse.com/advice/the-exact-words-to-use-when-negotiating-salary', cost: 'free' },
    ],
    estimate: '15 minutes',
  },

  // ---------------- CHAPTER 5: FOOTHOLD ----------------
  {
    id: 'q-foothold',
    title: 'Claim the Foothold 🏰',
    realTitle: 'Accept your first healthcare role',
    description: 'You are no longer outside the walls. The first paycheque from a clinic, a pharmacy, a path lab. Hold this moment — it is the one where the path becomes real.',
    realDescription: 'Accept your first healthcare-adjacent paid role. Update LinkedIn, tell your people, take a photo of the lanyard.',
    chapter: 'foothold',
    chapterColor: '#FF8AAE',
    icon: 'crown',
    emoji: '🏰',
    xp: 250,
    rewardTitle: 'Foothold Claimed',
    requires: ['q-bargain'],
    subtasks: [
      { id: 's1', label: 'Accept offer in writing' },
      { id: 's2', label: 'First shift!' },
      { id: 's3', label: 'Update LinkedIn' },
      { id: 's4', label: 'Save the lanyard photo for future you ♡' },
    ],
    resources: [
      { kind: 'guide', label: 'Onboarding Checklist (Australian)', url: 'https://www.fairwork.gov.au/starting-employment/before-starting-employment', cost: 'free' },
    ],
    estimate: 'big day',
  },

  // ---------------- CHAPTER 6: CITADEL ----------------
  {
    id: 'q-ucat',
    title: 'Train for the UCAT 🧠',
    realTitle: 'Prepare for & sit the UCAT ANZ',
    description: 'A different kind of forge. Numbers, patterns, ethical riddles. The test that lets you knock on the gates of medicine. Train daily. Train kindly.',
    realDescription: 'Register for UCAT ANZ (taken in July). Use Medify or Medentry for prep. ~3 months of consistent practice. ~$320 sitting fee.',
    chapter: 'citadel',
    chapterColor: '#C58BF2',
    icon: 'unicorn',
    emoji: '🧠',
    xp: 280,
    requires: ['q-foothold'],
    subtasks: [
      { id: 's1', label: 'Register for UCAT ANZ' },
      { id: 's2', label: 'Sign up for Medify or Medentry' },
      { id: 's3', label: 'Complete diagnostic test' },
      { id: 's4', label: '12 weeks of daily practice' },
      { id: 's5', label: 'Sit the test' },
    ],
    resources: [
      { kind: 'application', label: 'UCAT ANZ — Official', url: 'https://www.ucat.edu.au/', cost: '~$320 sitting fee' },
      { kind: 'course', label: 'Medify UCAT Prep', url: 'https://www.medify.co/au/ucat', cost: '~$120–250', blurb: 'Most popular online prep' },
      { kind: 'course', label: 'Medentry UCAT', url: 'https://www.medentry.edu.au/', cost: '~$300+', blurb: 'Brisbane workshops available' },
      { kind: 'community', label: 'r/ucat subreddit', url: 'https://www.reddit.com/r/ucat/', cost: 'free' },
    ],
    estimate: '12 weeks',
  },
  {
    id: 'q-uqapply',
    title: 'The Citadel Opens 🎓',
    realTitle: 'Apply to undergrad med pathways (UQ, Griffith, Bond)',
    description: 'You knock on the Citadel itself. Provisional medicine. Health-science gateway degrees. The pathways are many. Choose your ladder.',
    realDescription: 'Apply via QTAC. UQ Provisional Entry to Medicine. Griffith Bachelor of Medical Science. Bond MD pathway. Have a backup health-science degree as a "safety".',
    chapter: 'citadel',
    chapterColor: '#C58BF2',
    icon: 'flower',
    emoji: '🎓',
    xp: 320,
    rewardTitle: 'Citadel Initiate',
    requires: ['q-ucat'],
    subtasks: [
      { id: 's1', label: 'Make a QTAC account' },
      { id: 's2', label: 'List 6 preferences (med + safety degrees)' },
      { id: 's3', label: 'Submit before September deadline' },
      { id: 's4', label: 'Attend a UQ open day' },
    ],
    resources: [
      { kind: 'application', label: 'QTAC — Apply', url: 'https://www.qtac.edu.au/', cost: 'application fee ~$50' },
      { kind: 'guide', label: 'UQ Provisional Medicine', url: 'https://study.uq.edu.au/study-options/programs/provisional-entry-medical-program', cost: 'info only' },
      { kind: 'guide', label: 'Griffith Medicine Pathway', url: 'https://www.griffith.edu.au/study/health/medicine-doctor-of-medicine', cost: 'info only' },
      { kind: 'guide', label: 'Bond Medical Program', url: 'https://bond.edu.au/program/medical-program', cost: 'info only' },
    ],
    estimate: 'September window',
  },
  {
    id: 'q-firstyear',
    title: 'The Apothecary\'s Vow 🌹',
    realTitle: 'Complete first year of medicine / health science',
    description: 'The first year is a gauntlet of anatomy, biochem, sleepless weeks, and the slow conviction that you belong. Pass it. The rest is climbing the same kind of hill, taller.',
    realDescription: 'Pass first year. Anatomy, physiology, biochem. Build study group. Use Anki + Osmosis. Don\'t skip the GP — your own health matters.',
    chapter: 'capital',
    chapterColor: '#FF1493',
    icon: 'heart-double',
    emoji: '🌹',
    xp: 500,
    rewardTitle: 'Court Apothecary',
    requires: ['q-uqapply'],
    subtasks: [
      { id: 's1', label: 'Survive O-Week' },
      { id: 's2', label: 'Form a study group' },
      { id: 's3', label: 'Pass semester 1' },
      { id: 's4', label: 'Pass semester 2' },
    ],
    resources: [
      { kind: 'tool', label: 'Anki Flashcards', url: 'https://apps.ankiweb.net/', cost: 'free' },
      { kind: 'course', label: 'Osmosis (med school favourite)', url: 'https://www.osmosis.org/', cost: '~$AUD 30/mo student' },
      { kind: 'community', label: 'AMSA — Australian Medical Students', url: 'https://www.amsa.org.au/', cost: 'free' },
    ],
    estimate: 'one year',
  },
];

export function questById(id: string): Quest | undefined {
  return quests.find(q => q.id === id);
}
