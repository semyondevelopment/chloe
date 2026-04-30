export type StudySubject = {
  id: string;
  name: string;
  emoji: string;
  color: string;        // hex
  weeklyMinutes: number;
  blurb: string;
};

// Six default subjects. Tuned for medicine prep — UCAT subtests + a science.
// Chloe can rename them in Settings later (state stored in localStorage).
export const defaultSubjects: StudySubject[] = [
  { id: 'verbal',      name: 'UCAT · Verbal Reasoning',       emoji: '📖',  color: '#FF5DA2', weeklyMinutes: 180, blurb: 'speed-reading + comprehension' },
  { id: 'decision',    name: 'UCAT · Decision Making',         emoji: '🧠',  color: '#FF1493', weeklyMinutes: 150, blurb: 'logic puzzles, syllogisms, probability' },
  { id: 'quant',       name: 'UCAT · Quantitative Reasoning',  emoji: '🔢',  color: '#C58BF2', weeklyMinutes: 150, blurb: 'mental maths under pressure' },
  { id: 'abstract',    name: 'UCAT · Abstract Reasoning',      emoji: '✨',  color: '#E0B0FF', weeklyMinutes: 120, blurb: 'spot the pattern, fast' },
  { id: 'situational', name: 'UCAT · Situational Judgement',   emoji: '💖',  color: '#FFB6C1', weeklyMinutes: 90,  blurb: 'doctor-ethics scenarios' },
  { id: 'biology',     name: 'Biology / Anatomy',              emoji: '🌱',  color: '#B5EAD7', weeklyMinutes: 240, blurb: 'general science scaffolding' },
];

export type StudySession = {
  id: string;
  subjectId: string;
  date: string;          // YYYY-MM-DD
  minutes: number;
  note?: string;
};
