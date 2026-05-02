# sold-main

The operational app for the **SOLd. Protocol** — a decentralized, merit-based sales guild on Solana.

This repo is intentionally separate from `sold-presentation` (the marketing landing site).
`sold-main` ships the **portals people actually use**:

- `/driver` — Driver Hub (Soul Stat card, campaigns, payouts)
- `/client` — Vendor Portal (campaign management, ROI metrics)
- `/admin` — Protocol Admin (treasury, SBT lifecycle, fraud monitor, audit ledger)

The root `/` page is a minimal entry — just a hero and the three portal CTAs.
Heavy marketing content lives in `sold-presentation`.

## Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS 3
- TypeScript

Theming, fonts, and color tokens are inherited 1:1 from the SOLd. design system
(`sold-primary` purple `#7c3aed`, `sold-gray` scale, Unbounded / IBM Plex Sans / Space Mono).

## Run

```bash
npm install
npm run dev
```

App will be live at <http://localhost:3000>.

## Backend

The Driver Hub and Vendor Portal try to fetch campaigns from the SOLd. campaign-service.
Override the base URL with an env var:

```bash
# .env.local
NEXT_PUBLIC_API_BASE=http://localhost:3001
```

If the API is unreachable, the UI falls back gracefully (empty state on the driver feed,
mock data on dashboards).

## Roadmap

- [ ] Wire SIWS (Sign In With Solana) auth on each portal
- [ ] Replace mock metrics with live data from `reputation-service` / `reward-service`
- [ ] Embed the Soul Stat card as a shared component
- [ ] Add `/driver/campaign/[id]` and `/client/campaign/[id]` detail routes
- [ ] Hook the "Launch Campaign" form into the escrow funding flow

---

Earn. Prove. Scale.
