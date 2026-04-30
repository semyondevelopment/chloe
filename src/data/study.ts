export type StudySubject = {
  id: string;
  name: string;
  emoji: string;
  color: string;        // hex
  weeklyMinutes: number;
  blurb: string;
};

// Default subjects — Chloe's Year 12 lineup. Tap ✏️ on any card to rename, recolor, or change the weekly target.
export const defaultSubjects: StudySubject[] = [
  { id: 'english',    name: 'English',     emoji: '📖',  color: '#FF5DA2', weeklyMinutes: 180, blurb: 'persuasive + analytical writing' },
  { id: 'literature', name: 'Literature',  emoji: '📜',  color: '#FF1493', weeklyMinutes: 180, blurb: 'close reading + essay craft' },
  { id: 'economics',  name: 'Economics',   emoji: '💰',  color: '#FFE066', weeklyMinutes: 180, blurb: 'markets, policy, graphs' },
  { id: 'geography',  name: 'Geography',   emoji: '🌏',  color: '#B5EAD7', weeklyMinutes: 150, blurb: 'systems + case studies' },
  { id: 'maths',      name: 'Maths',       emoji: '🔢',  color: '#C58BF2', weeklyMinutes: 240, blurb: 'practice problems daily' },
  { id: 'biology',    name: 'Biology',     emoji: '🌱',  color: '#FFB6C1', weeklyMinutes: 210, blurb: 'cells, systems, evolution' },
  { id: 'chemistry',  name: 'Chemistry',   emoji: '🧪',  color: '#E0B0FF', weeklyMinutes: 210, blurb: 'reactions, organic, equilibrium' },
];

export type StudySession = {
  id: string;
  subjectId: string;
  date: string;          // YYYY-MM-DD
  minutes: number;
  note?: string;
};
