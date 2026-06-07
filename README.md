# State Shift

A mobile-first web app that helps adults move through a difficult emotional moment - without therapy-speak or wellness theater.

Pick what you're feeling, get one small intervention, and say whether it helped. That's it.

## How it works

1. **Feeling picker** — choose from 8 feelings (anxious, nervous, overwhelmed, stressed, stuck, tired, unfocused, unmotivated) and rate intensity
2. **Intervention** — get a short, actionable prompt (breathing, grounding, cognitive reframe, behavioral nudge, or environmental change)
3. **Feedback** — mark whether it helped; the app learns your preferences over time
4. **Repeat or stop** — try another if you want, or end the session

Personalization is stored locally in the browser — no account, no server.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- Deployed on [Vercel](https://vercel.com)

## Design

Warm editorial. Off-white background, earthy neutrals, typography-led. Light mode only. WCAG AA.

Anti-references: no pastel wellness gradients, no glassmorphism, no AI color palette.

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build   # production build
pnpm start   # production server
```
