import { quests } from '../data/quests';
import { defaultSubjects } from '../data/study';
import type { StudySubject, StudySession } from '../data/study';

export type ApplicationEntry = {
  id: string;
  role: string;
  company: string;
  date: string;
  status: 'sent' | 'replied' | 'interview' | 'offered' | 'rejected';
  notes?: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  text: string;
};

export type State = {
  completedQuestIds: string[];
  completedSubtaskIds: string[];      // format: questId:subtaskId
  xp: number;
  unlockedRanks: string[];
  lastVisit: string;                  // ISO date
  streak: number;
  letterDismissedDate: string | null; // YYYY-MM-DD when dismissed
  journal: JournalEntry[];
  applications: ApplicationEntry[];
  reducedMotion: boolean;
  soundEnabled: boolean;
  hideLetter: boolean;
  jobLikes: string[];
  jobMaybes: string[];
  jobDislikes: string[];
  studySubjects: StudySubject[];
  studySessions: StudySession[];
};

const KEY = 'chloe-operations-map-v1';

const initial: State = {
  completedQuestIds: [],
  completedSubtaskIds: [],
  xp: 0,
  unlockedRanks: ['sprout'],
  lastVisit: new Date().toISOString().slice(0, 10),
  streak: 1,
  letterDismissedDate: null,
  journal: [],
  applications: [],
  reducedMotion: false,
  soundEnabled: false,
  hideLetter: false,
  jobLikes: [],
  jobMaybes: [],
  jobDislikes: [],
  studySubjects: defaultSubjects,
  studySessions: [],
};

let state: State = load();

type Listener = (s: State) => void;
const listeners = new Set<Listener>();

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed(initial);
    const parsed = JSON.parse(raw) as Partial<State>;
    return seed({ ...initial, ...parsed });
  } catch {
    return seed(initial);
  }
}

function seed(s: State): State {
  // streak handling
  const today = new Date().toISOString().slice(0, 10);
  if (s.lastVisit !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const y = yesterday.toISOString().slice(0, 10);
    s.streak = s.lastVisit === y ? s.streak + 1 : 1;
    s.lastVisit = today;
  }
  return s;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full / private mode — drop silently */
  }
}

function emit() {
  for (const l of listeners) l(state);
}

export function getState(): State {
  return state;
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ---------- Actions ----------

export type Action =
  | { type: 'COMPLETE_QUEST'; questId: string }
  | { type: 'UNCOMPLETE_QUEST'; questId: string }
  | { type: 'TOGGLE_SUBTASK'; questId: string; subtaskId: string }
  | { type: 'ADD_JOURNAL'; text: string }
  | { type: 'REMOVE_JOURNAL'; id: string }
  | { type: 'ADD_APPLICATION'; entry: Omit<ApplicationEntry, 'id'> }
  | { type: 'UPDATE_APPLICATION_STATUS'; id: string; status: ApplicationEntry['status'] }
  | { type: 'REMOVE_APPLICATION'; id: string }
  | { type: 'TOGGLE_REDUCED_MOTION' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'DISMISS_LETTER' }
  | { type: 'RATE_JOB'; jobId: string; rating: 'like' | 'maybe' | 'dislike' | 'clear' }
  | { type: 'ADD_STUDY_SESSION'; subjectId: string; minutes: number; note?: string; date?: string }
  | { type: 'REMOVE_STUDY_SESSION'; id: string }
  | { type: 'UPDATE_SUBJECT'; subjectId: string; patch: Partial<StudySubject> }
  | { type: 'RESET' };

export function dispatch(action: Action): void {
  state = reduce(state, action);
  persist();
  emit();
}

function reduce(s: State, a: Action): State {
  switch (a.type) {
    case 'COMPLETE_QUEST': {
      if (s.completedQuestIds.includes(a.questId)) return s;
      const q = quests.find(q => q.id === a.questId);
      if (!q) return s;
      return {
        ...s,
        completedQuestIds: [...s.completedQuestIds, a.questId],
        xp: s.xp + q.xp,
      };
    }
    case 'UNCOMPLETE_QUEST': {
      if (!s.completedQuestIds.includes(a.questId)) return s;
      const q = quests.find(q => q.id === a.questId);
      const xp = q ? Math.max(0, s.xp - q.xp) : s.xp;
      return {
        ...s,
        completedQuestIds: s.completedQuestIds.filter(id => id !== a.questId),
        xp,
      };
    }
    case 'TOGGLE_SUBTASK': {
      const key = `${a.questId}:${a.subtaskId}`;
      const exists = s.completedSubtaskIds.includes(key);
      return {
        ...s,
        completedSubtaskIds: exists
          ? s.completedSubtaskIds.filter(k => k !== key)
          : [...s.completedSubtaskIds, key],
      };
    }
    case 'ADD_JOURNAL': {
      const e: JournalEntry = {
        id: `j-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        text: a.text,
      };
      return { ...s, journal: [e, ...s.journal] };
    }
    case 'REMOVE_JOURNAL':
      return { ...s, journal: s.journal.filter(j => j.id !== a.id) };
    case 'ADD_APPLICATION': {
      const e: ApplicationEntry = { id: `a-${Date.now()}`, ...a.entry };
      return { ...s, applications: [e, ...s.applications] };
    }
    case 'UPDATE_APPLICATION_STATUS':
      return {
        ...s,
        applications: s.applications.map(app =>
          app.id === a.id ? { ...app, status: a.status } : app
        ),
      };
    case 'REMOVE_APPLICATION':
      return { ...s, applications: s.applications.filter(app => app.id !== a.id) };
    case 'TOGGLE_REDUCED_MOTION':
      return { ...s, reducedMotion: !s.reducedMotion };
    case 'TOGGLE_SOUND':
      return { ...s, soundEnabled: !s.soundEnabled };
    case 'DISMISS_LETTER':
      return { ...s, letterDismissedDate: new Date().toISOString().slice(0, 10) };
    case 'RATE_JOB': {
      const stripped = {
        jobLikes: s.jobLikes.filter(id => id !== a.jobId),
        jobMaybes: s.jobMaybes.filter(id => id !== a.jobId),
        jobDislikes: s.jobDislikes.filter(id => id !== a.jobId),
      };
      if (a.rating === 'clear') return { ...s, ...stripped };
      const key = a.rating === 'like' ? 'jobLikes' : a.rating === 'maybe' ? 'jobMaybes' : 'jobDislikes';
      return { ...s, ...stripped, [key]: [...stripped[key], a.jobId] };
    }
    case 'ADD_STUDY_SESSION': {
      const e: StudySession = {
        id: `st-${Date.now()}`,
        subjectId: a.subjectId,
        date: a.date ?? new Date().toISOString().slice(0, 10),
        minutes: a.minutes,
        note: a.note,
      };
      return { ...s, studySessions: [e, ...s.studySessions] };
    }
    case 'REMOVE_STUDY_SESSION':
      return { ...s, studySessions: s.studySessions.filter(x => x.id !== a.id) };
    case 'UPDATE_SUBJECT':
      return {
        ...s,
        studySubjects: s.studySubjects.map(sub =>
          sub.id === a.subjectId ? { ...sub, ...a.patch } : sub
        ),
      };
    case 'RESET':
      return seed({ ...initial, lastVisit: new Date().toISOString().slice(0, 10), streak: 1 });
  }
}

// ---------- Helpers ----------

export function isQuestComplete(questId: string): boolean {
  return state.completedQuestIds.includes(questId);
}

export function isSubtaskComplete(questId: string, subtaskId: string): boolean {
  return state.completedSubtaskIds.includes(`${questId}:${subtaskId}`);
}

export function isQuestUnlocked(questId: string): boolean {
  const q = quests.find(q => q.id === questId);
  if (!q) return false;
  return q.requires.every(req => state.completedQuestIds.includes(req));
}

export function questStatus(questId: string): 'locked' | 'active' | 'complete' {
  if (isQuestComplete(questId)) return 'complete';
  if (isQuestUnlocked(questId)) return 'active';
  return 'locked';
}
