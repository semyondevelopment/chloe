export const chloe = {
  name: 'Chloe',
  fullName: 'Chloe Trost',
  age: 18,
  location: 'St Lucia, Brisbane, QLD',
  goal: 'Medicine → Surgery',
  currentRole: 'Subway · Crew Trainer & Senior Team Member',
  signature: '~ a Chloe original ~',
};

export type Rank = {
  id: string;
  title: string;
  emoji: string;
  threshold: number;
  blurb: string;
  color: string;
};

export const ranks: Rank[] = [
  { id: 'sprout',     title: 'Sprout',              emoji: '🌱', threshold: 0,    blurb: 'just getting started ♡', color: '#B5EAD7' },
  { id: 'cadet3',     title: 'Cadet III',           emoji: '🎀', threshold: 80,   blurb: 'lacing up the sneakers',  color: '#FFE066' },
  { id: 'cadet2',     title: 'Cadet II',            emoji: '⭐', threshold: 200,  blurb: 'on the move',             color: '#FFB6C1' },
  { id: 'cadet1',     title: 'Cadet I',             emoji: '🦋', threshold: 360,  blurb: 'gathering momentum',      color: '#FF8AAE' },
  { id: 'fieldmedic', title: 'Field Princess',      emoji: '👑', threshold: 540,  blurb: 'first cert earned!',      color: '#FF5DA2' },
  { id: 'apprentice', title: 'Apothecary Apprentice', emoji: '🌸', threshold: 760, blurb: 'studying the craft',     color: '#E0B0FF' },
  { id: 'striker',    title: 'Frontier Striker',    emoji: '💖', threshold: 1020, blurb: 'doors are opening',       color: '#FF1493' },
  { id: 'gate',       title: 'Gate-Crosser',        emoji: '✨', threshold: 1320, blurb: 'first interview claimed', color: '#C58BF2' },
  { id: 'foothold',   title: 'Foothold Claimed',    emoji: '🏰', threshold: 1700, blurb: 'first healthcare gig!',   color: '#FF5DA2' },
  { id: 'citadel',    title: 'Citadel Initiate',    emoji: '🎓', threshold: 2200, blurb: 'university bound',        color: '#7A2A60' },
  { id: 'court',      title: 'Court Apothecary',    emoji: '⚕️', threshold: 3000, blurb: 'medicine, here we come',  color: '#FF1493' },
  { id: 'surgeon',    title: 'Surgeon-in-Becoming', emoji: '🌹', threshold: 5000, blurb: 'the dream realised',      color: '#C58BF2' },
];

export function rankFor(xp: number): Rank {
  let current = ranks[0]!;
  for (const r of ranks) {
    if (xp >= r.threshold) current = r;
  }
  return current;
}

export function nextRank(xp: number): Rank | null {
  for (const r of ranks) {
    if (xp < r.threshold) return r;
  }
  return null;
}
