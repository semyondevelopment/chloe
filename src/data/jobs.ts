export type JobType = {
  id: string;
  title: string;
  emoji: string;
  iconName: string;
  tagline: string;
  pay: string;
  hours: string;
  whatYouDo: string;
  whyItFits: string;
  vibe: 'calm' | 'busy' | 'mixed';
  difficulty: 'easy' | 'moderate' | 'harder';
  prereqs: string[];
  pros: string[];
  cons: string[];
  // Brisbane-specific target companies (chains + general types)
  targets: { name: string; url: string }[];
  // Live job-board search links
  searches: { label: string; url: string }[];
  // Suggested # of applications to send
  targetApplications: number;
};

export const jobs: JobType[] = [
  {
    id: 'med-reception',
    title: 'Medical Receptionist',
    emoji: '🩷',
    iconName: 'stethoscope',
    tagline: 'front desk of a clinic — the doctor\'s right hand',
    pay: '$26 – 30 / hr',
    hours: 'mostly weekday business hours',
    whatYouDo: 'Greet patients, manage bookings, take payments, handle records. The clinic runs on you.',
    whyItFits: 'Subway already taught you how to handle people on a busy day. Here, the day ends at 5pm and the people leave grateful. Closest cousin to medicine you can do at 18.',
    vibe: 'mixed',
    difficulty: 'moderate',
    prereqs: ['First Aid (HLTAID011) helpful', 'good phone manner', 'fast typing'],
    pros: ['daytime hours', 'real exposure to medicine', 'transferable to specialist & hospital roles', 'CV gold for med school applications'],
    cons: ['busy mornings', 'occasional difficult patients', 'sitting all day'],
    targets: [
      { name: 'Sonic Healthcare clinics', url: 'https://www.sonichealthcare.com/careers/' },
      { name: 'Healius (IPN Medical Centres)', url: 'https://www.healius.com.au/careers/' },
      { name: 'Local GP practices (Indooroopilly / Toowong / St Lucia)', url: 'https://www.healthengine.com.au/find/practices/qld/brisbane' },
      { name: 'Medibank Health Solutions', url: 'https://careers.medibank.com.au/' },
    ],
    searches: [
      { label: 'Seek — medical receptionist Brisbane', url: 'https://www.seek.com.au/medical-receptionist-jobs/in-brisbane-qld' },
      { label: 'Indeed — medical reception Brisbane', url: 'https://au.indeed.com/jobs?q=medical+receptionist&l=Brisbane+QLD' },
      { label: 'Healthshare Careers', url: 'https://www.healthshare.com.au/jobs/' },
    ],
    targetApplications: 5,
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy Assistant',
    emoji: '💊',
    iconName: 'pill',
    tagline: 'apothecary apprentice in disguise',
    pay: '$26 – 30 / hr',
    hours: 'shifts incl. some weekends',
    whatYouDo: 'Customer service, stock, dispensing assistance, sometimes blood-pressure checks and S2/S3 sales.',
    whyItFits: 'You\'ll learn drug names, drug interactions, and what people actually take. Walking medical school prep. The retail energy is gentler than fast food.',
    vibe: 'busy',
    difficulty: 'easy',
    prereqs: ['no formal qual needed for entry', 'Cert II Pharmacy Assistant earns $1-2 more / hr'],
    pros: ['easy entry', 'pretty stores', 'discount on skincare & vitamins', 'great science exposure'],
    cons: ['retail rhythm', 'standing all shift', 'flu season is rough'],
    targets: [
      { name: 'Chemist Warehouse', url: 'https://careers.chemistwarehouse.com.au/' },
      { name: 'Priceline Pharmacy', url: 'https://www.priceline.com.au/careers' },
      { name: 'Terry White Chemmart', url: 'https://www.terrywhitechemmart.com.au/careers' },
      { name: 'Amcal Pharmacy', url: 'https://www.amcal.com.au/about-us/careers' },
      { name: 'Local independent chemists (walk-in)', url: 'https://www.google.com/maps/search/pharmacy+near+st+lucia+brisbane' },
    ],
    searches: [
      { label: 'Seek — pharmacy assistant Brisbane', url: 'https://www.seek.com.au/pharmacy-assistant-jobs/in-brisbane-qld' },
      { label: 'Indeed — pharmacy Brisbane', url: 'https://au.indeed.com/jobs?q=pharmacy+assistant&l=Brisbane+QLD' },
    ],
    targetApplications: 5,
  },
  {
    id: 'pathology',
    title: 'Pathology Collector (trainee)',
    emoji: '🩸',
    iconName: 'syringe',
    tagline: 'paid traineeship — they teach you to take blood',
    pay: '$27 – 32 / hr (paid training)',
    hours: 'early starts (5–6am), finished by lunch',
    whatYouDo: 'Take blood samples, process specimens, support patients through their day. They train you on the job.',
    whyItFits: 'This is the secret-weapon job. Paid training in a real medical skill, sets you up for nursing/med school interview answers, and the schedule frees up afternoons for study.',
    vibe: 'calm',
    difficulty: 'moderate',
    prereqs: ['Working with Children check', 'vaccinations (they help arrange)', 'steady hands + calm manner'],
    pros: ['real clinical skill', 'paid training', 'afternoons free', 'looks incredible on CV', 'pay scales with tenure'],
    cons: ['very early starts', 'some squeamish patients', 'fewer entry openings'],
    targets: [
      { name: 'Sullivan Nicolaides Pathology (SNP)', url: 'https://www.snp.com.au/careers/' },
      { name: 'QML Pathology', url: 'https://www.qml.com.au/careers/' },
      { name: '4Cyte Pathology', url: 'https://4cyte.com.au/careers/' },
      { name: 'Mater Pathology', url: 'https://www.mater.org.au/careers' },
    ],
    searches: [
      { label: 'Seek — pathology collector Brisbane', url: 'https://www.seek.com.au/pathology-collector-jobs/in-brisbane-qld' },
      { label: 'Indeed — pathology Brisbane', url: 'https://au.indeed.com/jobs?q=pathology+collector&l=Brisbane+QLD' },
    ],
    targetApplications: 3,
  },
  {
    id: 'uq-admin',
    title: 'UQ Casual Admin / Library / Events',
    emoji: '🏛️',
    iconName: 'building',
    tagline: 'work where you want to study',
    pay: '$32 – 42 / hr (UQ award rates)',
    hours: 'flexible, fits around classes',
    whatYouDo: 'Filing, email triage, library shifts, open-day staffing, exam invigilation.',
    whyItFits: 'You\'re aiming at UQ. Working there means knowing the campus, the people, the systems before you start. UQ pay rates also crush retail.',
    vibe: 'calm',
    difficulty: 'moderate',
    prereqs: ['most roles need you to be a UQ student already (apply once enrolled)', 'tidy email writing'],
    pros: ['high pay', 'calm environments', 'campus access', 'study buffer between shifts', 'connections in academic medicine'],
    cons: ['need to be a student first', 'casual = inconsistent hours'],
    targets: [
      { name: 'UQ Jobs Portal', url: 'https://jobs.uq.edu.au/' },
      { name: 'UQ Student Employability', url: 'https://employability.uq.edu.au/' },
      { name: 'UQ Student Helpers Program', url: 'https://employability.uq.edu.au/student-employment-uq' },
    ],
    searches: [
      { label: 'UQ Jobs — search casual', url: 'https://jobs.uq.edu.au/jobs?type=casual' },
    ],
    targetApplications: 5,
  },
  {
    id: 'ward-clerk',
    title: 'Hospital Ward Clerk',
    emoji: '🏥',
    iconName: 'briefcase',
    tagline: 'inside the actual hospital — admin desk on the ward',
    pay: '$30 – 34 / hr (QLD Health award)',
    hours: 'rotating shifts incl. some evenings/weekends',
    whatYouDo: 'Handle patient files, answer phones, support nursing staff, route admissions. The control tower of the ward.',
    whyItFits: 'You\'re in the hospital. You see how it actually runs. Doctors and nurses learn your name. Med school interviewers eat this experience up.',
    vibe: 'busy',
    difficulty: 'harder',
    prereqs: ['often wants admin experience or Cert III HSA', 'WWCC + immunisation record'],
    pros: ['real hospital exposure', 'public-sector pay', 'pathway to bigger health roles', 'shift penalties = good $$'],
    cons: ['shift work', 'higher bar to entry', 'can be chaotic'],
    targets: [
      { name: 'Royal Brisbane & Women\'s Hospital', url: 'https://www.health.qld.gov.au/employment' },
      { name: 'Princess Alexandra Hospital', url: 'https://www.health.qld.gov.au/employment' },
      { name: 'Mater Hospital Brisbane', url: 'https://www.mater.org.au/careers' },
      { name: 'QLD Health smartjobs portal', url: 'https://smartjobs.qld.gov.au/' },
    ],
    searches: [
      { label: 'Smart Jobs QLD — ward clerk', url: 'https://smartjobs.qld.gov.au/jobs/search?keyword=ward+clerk' },
      { label: 'Seek — ward clerk Brisbane', url: 'https://www.seek.com.au/ward-clerk-jobs/in-brisbane-qld' },
    ],
    targetApplications: 4,
  },
  {
    id: 'dental-reception',
    title: 'Dental Receptionist',
    emoji: '🦷',
    iconName: 'sparkles',
    tagline: 'medical reception, but quieter rooms and nicer biscuits',
    pay: '$26 – 30 / hr',
    hours: 'business hours + Saturday morning common',
    whatYouDo: 'Bookings, EFTPOS, patient records, sterilisation help in a clean private practice.',
    whyItFits: 'Most of the same skills as medical reception, but typically calmer. Dentistry is also a med-adjacent backup if life curves left.',
    vibe: 'calm',
    difficulty: 'moderate',
    prereqs: ['warm phone manner', 'comfortable with numbers'],
    pros: ['quieter than GP', 'pretty offices', 'consistent hours', 'often dental discount perks'],
    cons: ['some patients hate the dentist (and bring it)', 'small teams = no hiding'],
    targets: [
      { name: 'Pacific Smiles', url: 'https://pacificsmiles.com.au/careers/' },
      { name: 'Bupa Dental', url: 'https://careers.bupa.com.au/' },
      { name: 'Local independent dental clinics', url: 'https://www.google.com/maps/search/dental+clinic+near+st+lucia+brisbane' },
    ],
    searches: [
      { label: 'Seek — dental receptionist Brisbane', url: 'https://www.seek.com.au/dental-receptionist-jobs/in-brisbane-qld' },
    ],
    targetApplications: 4,
  },
  {
    id: 'allied-health',
    title: 'Allied Health Reception',
    emoji: '🌿',
    iconName: 'flower2',
    tagline: 'physio / psych / OT clinics — calm energy',
    pay: '$26 – 30 / hr',
    hours: 'business hours mostly',
    whatYouDo: 'Bookings, billing, light admin in a small allied-health practice. Quieter than GP.',
    whyItFits: 'Want clinic experience without the GP rush? This. Plus you\'ll learn how the allied-health world works (great context for medicine).',
    vibe: 'calm',
    difficulty: 'easy',
    prereqs: ['friendly phone manner', 'basic admin'],
    pros: ['low-stress', 'small team energy', 'reliable hours', 'learn about non-doctor health careers'],
    cons: ['quiet days can drag', 'no shift penalties'],
    targets: [
      { name: 'Independent physio practices (search local)', url: 'https://www.google.com/maps/search/physiotherapist+near+st+lucia+brisbane' },
      { name: 'Headspace Brisbane', url: 'https://headspace.org.au/work-at-headspace/' },
      { name: 'Independent psychology clinics', url: 'https://www.google.com/maps/search/psychologist+near+st+lucia+brisbane' },
    ],
    searches: [
      { label: 'Seek — allied health receptionist Brisbane', url: 'https://www.seek.com.au/allied-health-receptionist-jobs/in-brisbane-qld' },
    ],
    targetApplications: 4,
  },
  {
    id: 'aged-care',
    title: 'Aged Care Support',
    emoji: '🌷',
    iconName: 'handheart',
    tagline: 'direct patient care — empathy school',
    pay: '$28 – 34 / hr',
    hours: 'shifts incl. weekends',
    whatYouDo: 'Help residents with meals, mobility, hygiene, company. The job is half care, half conversation.',
    whyItFits: 'If you want to test "do I really love patient contact?" — this answers that loudly. Med-school applications love sustained aged-care work.',
    vibe: 'mixed',
    difficulty: 'easy',
    prereqs: ['Cert III Individual Support helps a lot', 'WWCC + NDIS Worker Screen', 'patience'],
    pros: ['high pay (especially with Cert III)', 'genuine relationships', 'powerful interview stories', 'medicine-adjacent maturity'],
    cons: ['emotionally heavy days', 'physical work', 'shift work'],
    targets: [
      { name: 'Bolton Clarke', url: 'https://www.boltonclarke.com.au/careers/' },
      { name: 'BlueCare', url: 'https://www.bluecare.org.au/careers' },
      { name: 'Anglicare Southern Queensland', url: 'https://www.anglicaresq.org.au/careers/' },
      { name: 'TriCare Aged Care', url: 'https://www.tricare.com.au/careers/' },
    ],
    searches: [
      { label: 'Seek — aged care support Brisbane', url: 'https://www.seek.com.au/aged-care-jobs/in-brisbane-qld' },
    ],
    targetApplications: 3,
  },
  {
    id: 'vet-reception',
    title: 'Vet Reception / Assistant',
    emoji: '🐾',
    iconName: 'cherry',
    tagline: 'clinical environment, but the patients are dogs',
    pay: '$25 – 30 / hr',
    hours: 'business hours mostly',
    whatYouDo: 'Greet pet owners, schedule, sometimes hold animals during exams, help with stock.',
    whyItFits: 'Clinic vibes, customer service, occasional clinical exposure — and dogs. Fun if you love animals; also genuinely transferable to medical reception.',
    vibe: 'mixed',
    difficulty: 'easy',
    prereqs: ['comfortable around animals', 'ok with sad cases sometimes'],
    pros: ['cute coworkers', 'clinic exposure', 'easy entry', 'reliable hours'],
    cons: ['emotional days (euthanasia)', 'occasional bites/scratches'],
    targets: [
      { name: 'Greencross Vets', url: 'https://www.greencrossvets.com.au/careers/' },
      { name: 'Animal Emergency Centre Brisbane', url: 'https://www.animalemergencycentre.com.au/careers/' },
      { name: 'Local independent vets', url: 'https://www.google.com/maps/search/veterinary+clinic+near+st+lucia+brisbane' },
    ],
    searches: [
      { label: 'Seek — vet receptionist Brisbane', url: 'https://www.seek.com.au/veterinary-receptionist-jobs/in-brisbane-qld' },
    ],
    targetApplications: 3,
  },
  {
    id: 'tutoring',
    title: 'Paid Tutoring (level up)',
    emoji: '✏️',
    iconName: 'pen',
    tagline: 'you already do this — turn it into a real income',
    pay: '$45 – 90 / hr',
    hours: 'after school + weekends, you set them',
    whatYouDo: 'Teach maths, biology, chemistry to high-school students. You\'re basically already doing this; charge proper rates.',
    whyItFits: 'Highest hourly rate on this list. Builds the medical-school interview muscle (explaining hard things simply). Total schedule control.',
    vibe: 'calm',
    difficulty: 'easy',
    prereqs: ['WWCC', 'your QCE results as proof', 'a pretty Canva flyer'],
    pros: ['highest pay/hour by miles', 'set your own hours', 'flexible around uni', 'CV story for med interviews'],
    cons: ['takes effort to get clients', 'unpaid prep time', 'inconsistent at first'],
    targets: [
      { name: 'Cluey Learning (online)', url: 'https://clueylearning.com.au/become-a-tutor/' },
      { name: 'Tutoring For Excellence Brisbane', url: 'https://tutoringforexcellence.com.au/become-a-tutor/' },
      { name: 'Superprof — set your own rate', url: 'https://www.superprof.com.au/become-a-tutor/' },
      { name: 'School community pages (FB groups for parents)', url: 'https://www.facebook.com/search/groups/?q=brisbane%20tutor' },
    ],
    searches: [
      { label: 'Seek — tutor Brisbane', url: 'https://www.seek.com.au/tutor-jobs/in-brisbane-qld' },
    ],
    targetApplications: 2,
  },
];

// Why leaving Subway is the right call
export const subwayCons: { title: string; body: string }[] = [
  { title: 'no skill compounding', body: "Three years from now you'll have the same sandwich recipe. Healthcare-adjacent jobs build a CV that opens medical-school doors." },
  { title: 'late nights cost you study time', body: 'Closing shifts wreck the next morning. Most of the jobs on this page are 9–5 or finish at lunch.' },
  { title: 'pay ceiling is low', body: 'Crew-trainer max is around $25/hr. Pathology trainees and UQ casuals start at $27–35/hr — for less stress and better hours.' },
  { title: 'the smell', body: "you don't have to live this." },
];

// How to quit gracefully
export const quittingPlaybook: string[] = [
  'Land the new job in writing first. Confirmed start date in your inbox = the green light.',
  'Give two weeks\' notice. In QLD casual hospitality, one week is the legal minimum but two is the kind move.',
  'Tell your store manager in person, then hand a short written note. Three sentences: "Thank you for the opportunity. My last shift will be [date]. I\'ve appreciated working here."',
  'Don\'t over-explain. You don\'t owe a why. "Pursuing a healthcare career" is enough.',
  'Offer to help train your replacement. Burns zero bridges, takes ten minutes.',
  'Get a written reference before your last shift. Manager + a senior team member is plenty.',
  'On the last shift, hug whoever was kind to you. Subway is a chapter, not a ceiling.',
];
