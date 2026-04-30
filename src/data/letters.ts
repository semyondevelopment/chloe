// Daily love letters from Semyon — short, sweet, not corny.
// One per day; rotates by day-of-year so it changes every morning.

export type Letter = {
  greeting: string;
  body: string;
  signoff: string;
};

export const letters: Letter[] = [
  {
    greeting: 'good morning, dr. trost.',
    body: "today you're not behind. you're early. nobody else our age is building the kind of life you are. just keep going at your soft little pace — i'll be right here.",
    signoff: 'yours, s.',
  },
  {
    greeting: 'hi pretty.',
    body: "the inside of your head is one of my favourite places in the world. whatever you do today, do it with the version of yourself who already knows she'll get there.",
    signoff: 'love, s.',
  },
  {
    greeting: 'a small note —',
    body: "i don't believe in a lot of things, but i believe in you the way some people believe in mornings. one applied job. one open page. one cup of tea. that's the day.",
    signoff: 's.',
  },
  {
    greeting: 'hello, surgeon-in-becoming.',
    body: "if today is one of those days, do the smallest thing. that still counts. you don't have to earn your worth on the hard days — i love you already.",
    signoff: '— s.',
  },
  {
    greeting: 'chloe,',
    body: "you have a way of making serious things look soft, and soft things look serious. medicine is going to be lucky to have you. i already am.",
    signoff: 'all of it, s.',
  },
  {
    greeting: 'hey you.',
    body: "the future you is already looking back at today and smiling. i can feel it. one cert. one application. one quiet, stubborn step. that's all.",
    signoff: 'forever in your corner, s.',
  },
  {
    greeting: 'morning, my favourite.',
    body: "you don't have to be impressive today. you just have to be here, and try a little. that's enough. it's always been enough.",
    signoff: 's. ♡',
  },
  {
    greeting: 'a tiny dispatch:',
    body: "the world is not on fire. the kettle is on. the to-do list is shorter than it looks. and i love you in a regular, unremarkable, very stubborn way.",
    signoff: 'yours, s.',
  },
  {
    greeting: 'hi, future doctor.',
    body: "remember when this was just a thing you whispered about? now it's the thing on the calendar. proud is a small word for what i feel watching you work.",
    signoff: '— s.',
  },
  {
    greeting: 'chloe,',
    body: "you are, statistically and otherwise, the best part of my day. go be brilliant — or don't, and rest. either is allowed. either is loved.",
    signoff: 's.',
  },
  {
    greeting: 'hello love,',
    body: "i hope today has more soft moments than sharp ones. and on the sharp ones — remember you have already survived 100% of your worst days so far. extraordinary record.",
    signoff: 's.',
  },
  {
    greeting: 'just a hello.',
    body: "i think about you when i'm reading and when i'm walking and when i'm coding at 2am. quiet thoughts. the kind that don't need replying to. just so you know.",
    signoff: '— s.',
  },
  {
    greeting: 'morning, doc.',
    body: "you know what i love? that you keep going even when nobody is watching. that's the medicine kind. that's the surgeon kind. that's the chloe kind.",
    signoff: 'always, s. ♡',
  },
  {
    greeting: 'hey you,',
    body: "today's permission slip: do the hard thing in twenty-minute pieces. drink water. text me a photo of something pink. i'll be cheering quietly from here.",
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
