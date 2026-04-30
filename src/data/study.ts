export type StudySubject = {
  id: string;
  name: string;
  emoji: string;
  color: string;        // hex
  weeklyMinutes: number;
  blurb: string;
};

// Six default subjects — standard QLD Year 12 sciences track for a medicine-bound student.
// Chloe can rename / recolor / change weekly target in-place by tapping the ✏️ on any card.
export const defaultSubjects: StudySubject[] = [
  { id: 'english',     name: 'English',                  emoji: '📖',  color: '#FF5DA2', weeklyMinutes: 180, blurb: 'essays, analysis, exam practice' },
  { id: 'methods',     name: 'Mathematical Methods',     emoji: '🔢',  color: '#FF1493', weeklyMinutes: 240, blurb: 'calculus, functions, statistics' },
  { id: 'specialist',  name: 'Specialist Mathematics',   emoji: '∑',   color: '#C58BF2', weeklyMinutes: 180, blurb: 'vectors, complex numbers, proof' },
  { id: 'biology',     name: 'Biology',                  emoji: '🌱',  color: '#B5EAD7', weeklyMinutes: 240, blurb: 'cells, systems, evolution' },
  { id: 'chemistry',   name: 'Chemistry',                emoji: '🧪',  color: '#FFE066', weeklyMinutes: 240, blurb: 'reactions, organic, equilibrium' },
  { id: 'physics',     name: 'Physics',                  emoji: '⚡',  color: '#E0B0FF', weeklyMinutes: 180, blurb: 'mechanics, waves, electricity' },
];

export type StudySession = {
  id: string;
  subjectId: string;
  date: string;          // YYYY-MM-DD
  minutes: number;
  note?: string;
};
