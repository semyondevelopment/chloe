export type ViewName = 'home' | 'map' | 'jobs' | 'resources' | 'love';

let current: ViewName = 'home';
const listeners = new Set<(v: ViewName) => void>();

export function getView(): ViewName {
  return current;
}

export function setView(v: ViewName): void {
  if (current === v) return;
  current = v;
  for (const l of listeners) l(v);
}

export function onViewChange(fn: (v: ViewName) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
