# Mission: PS5 Pro — family fund site

A mobile-first, game-style Next.js site. Family members play 4 quick levels and pay by UPI at the end.

## Edit
Everything (name, UPI ID, goal, amount raised, reasons, power-ups) is in `app/config.js`.
Update `raisedSoFar` as money comes in and push again — the progress bar updates.

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. vercel.com → Add New → Project → import the repo → Deploy (no settings needed).
3. Share the Vercel link in the family WhatsApp group.
