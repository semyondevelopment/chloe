// Daily love letters from Semyon — short, sweet, not corny.
// One per day; rotates by day-of-year so it changes every morning.

export type Letter = {
  greeting: string;
  body: string;
  signoff: string;
};

export const letters: Letter[] = [
  {
    greeting: 'morning, chlo.',
    body: "you don't have to feel ready. you just have to start. the version of you that figures it out is the same one sitting there now, half-awake, a bit unsure. that's her. always was.",
    signoff: 'yours, s.',
  },
  {
    greeting: 'hi pretty.',
    body: "you're allowed to take up space today. opinions, hunger, rest, whatever. you don't owe anyone a smaller version of yourself. especially not me.",
    signoff: 'love, s.',
  },
  {
    greeting: 'a small note —',
    body: "the bad days don't undo the good ones. you're not starting over, you're just continuing. that's the whole trick.",
    signoff: 's.',
  },
  {
    greeting: 'hey you.',
    body: "if today feels heavy, lower the bar. eat something. step outside for two minutes. that's not giving up — that's how people who go the distance actually do it.",
    signoff: '— s.',
  },
  {
    greeting: 'chloe,',
    body: "you think harder than most people i know, and you're harder on yourself for it. try giving yourself the benefit of the doubt today, the way you give it to everyone else.",
    signoff: 'all of it, s.',
  },
  {
    greeting: 'morning.',
    body: "consistency beats intensity, every time. you don't need a perfect day. you need a normal one, done. that's the whole game.",
    signoff: 'in your corner, s.',
  },
  {
    greeting: 'morning, my favourite.',
    body: "you don't have to be impressive today. you just have to be here, and try a little. that's enough. it's always been enough.",
    signoff: 's.',
  },
  {
    greeting: 'a tiny dispatch:',
    body: "the world is not on fire. the kettle is on. the list is shorter than it looks. take it one thing at a time and the day shrinks back down to a normal size.",
    signoff: 'yours, s.',
  },
  {
    greeting: 'hi.',
    body: "remember the things you used to think you'd never figure out? you figured them out. you'll figure this one out too. it just doesn't feel like it yet.",
    signoff: '— s.',
  },
  {
    greeting: 'chloe,',
    body: "rest isn't lazy. it's part of the work. nobody good at anything is good at it because they never stopped. go easy if you need to. it's allowed.",
    signoff: 's.',
  },
  {
    greeting: 'hello love,',
    body: "you have already survived 100% of your worst days so far. that's an extraordinary record. whatever today brings, you've got more practice than you think.",
    signoff: 's.',
  },
  {
    greeting: 'just a hello.',
    body: "you don't have to have it all together. nobody does, they just hide it better. you're doing fine. better than fine. just keep moving at your own pace.",
    signoff: '— s.',
  },
  {
    greeting: 'morning, chlo.',
    body: "the way you keep going even when nobody is watching — that's the part that matters. nobody sees the boring middle bit. but it's the bit that actually builds the thing.",
    signoff: 'always, s.',
  },
  {
    greeting: 'hey you,',
    body: "today's permission slip: do the hard thing in twenty-minute pieces. drink water. step away when you need to. small and steady is still moving.",
    signoff: 's.',
  },
];

export function letterForToday(): Letter {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return letters[dayOfYear % letters.length]!;
}

export function letterIndexForToday(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return dayOfYear % letters.length;
}
