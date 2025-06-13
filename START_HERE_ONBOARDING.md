# 🚀 SoundRights: Start Here Onboarding & Dev Guide

Welcome to SoundRights! This document is your one-stop onboarding and reference guide for getting up to speed, running the project, and contributing effectively.

---

## 1. Project Overview & Architecture

**SoundRights** is a Web3-native music licensing platform for secure IP registration, originality verification, and smart contract licensing. It integrates with Story Protocol, Yakoa, Tomo, and Zapper, and is built with a modern TypeScript stack.

**Architecture:**
- **Frontend:** React + Vite + Tailwind + shadcn/ui
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL + Drizzle ORM
- **Blockchain:** Story Protocol SDK (testnet)
- **Integrations:** Yakoa (originality), Tomo (auth), Zapper (analytics)
- **Deployment:** Replit (autoscale), local dev supported

---

## 2. Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL (local or cloud)
- (Optional) Replit account for cloud dev

### Environment Variables
Create a `.env` file in the project root with:
```
DATABASE_URL=postgresql://<user>:<pass>@localhost:5432/soundrights_dev
SESSION_SECRET=your-session-secret
TOMO_API_KEY=your-tomo-key
ZAPPER_API_KEY=your-zapper-key
REPLIT_DOMAINS=localhost
```

### Setup & Start
```bash
npm install
npm run db:push   # migrate DB schema
npm run dev       # start dev server (http://localhost:5000)
```

**Common Issues:**
- If you see `DATABASE_URL must be set`, check your `.env`.
- If you see `REPLIT_DOMAINS not provided`, add it to `.env`.

---

## 3. Deploying/Testing on Replit
- Open the project in Replit.
- Click the **Deploy** or **Run** button.
- Your app will be live at: [https://soundrights-birdmania.replit.app/](https://soundrights-birdmania.replit.app/)
- Use `/demo` for unauthenticated testing.

---

## 4. Where to Find Docs
- **README.md** — High-level overview, setup, and roadmap
- **TECH_TEAM_HANDOVER.md** — Deep-dive technical handover
- **COMPREHENSIVE_TECH_REVIEW.md** — Honest audit of what's working
- **FINAL_INTEGRATION_STATUS.md** — Up-to-date integration status
- **COMPLETE_TECHNICAL_SPECIFICATION.md** — Full technical spec

---

## 5. API & Data Model Reference

### Key API Endpoints
- `POST /api/tracks/demo` — Demo track upload (no auth)
- `POST /api/yakoa/check-originality` — Yakoa originality check
- `POST /api/story/register-ip` — Register IP on Story Protocol
- `GET /api/tomo/status` — Tomo API status
- `GET /api/zapper/portfolio/:address` — Zapper analytics
- ...see TECH_TEAM_HANDOVER.md for full list

### Database Schema (Core Tables)
- **users**: id, replit_user_id, username, email, ...
- **tracks**: id, user_id, title, artist, ...
- **licenses**: id, track_id, license_type, ...
- **ip_assets**: id, track_id, ip_asset_id, ...
- **user_activities**: id, user_id, activity_type, ...
- **sessions**: sid, sess, expire

---

## 6. Frontend Component Map

- `client/src/components/`
  - `DemoUpload.tsx` — Main upload interface
  - `EnhancedIPVerification.tsx` — Multi-step verification UI
  - `TomoIntegration.tsx` — Tomo auth
  - `YakoaIntegration.tsx` — Yakoa verification
  - `ZapperIntegration.tsx` — Zapper analytics
  - `WalletConnection.tsx` — Web3 wallet
  - `ui/` — shadcn/ui components
- `client/src/pages/`
  - `Index.tsx` — Landing page
  - `Demo.tsx` — Demo environment
  - `Upload.tsx` — Upload page
  - `Marketplace.tsx` — Licensing marketplace (to build)
  - `Sponsors.tsx` — Sponsor integrations
- `client/src/hooks/` — Custom React hooks
- `client/src/lib/` — API client, utils

---

## 7. Roadmap & Priorities

### Immediate
- Polish upload/verification/registration flows
- Show confidence scores, blockchain status, explorer links
- Add sponsor branding and demo mode banner

### Short-Term
- Build licensing marketplace UI (browse, purchase, manage)
- Add analytics dashboard (Zapper, track stats)
- Integrate WalletConnect (connect wallet, on-chain actions)

### Medium-Term
- Advanced audio/metadata UI (waveform, BPM, tags)
- User profile & activity log
- Admin dashboard

### Long-Term
- Payment integration (Stripe/crypto)
- Mobile/PWA optimization
- Enterprise/B2B features

---

## 8. Live Demo/Testnet Link
- **Production/Testnet:** [https://soundrights-birdmania.replit.app/](https://soundrights-birdmania.replit.app/)
- **Demo page:** `/demo` (no auth required)

---

## 9. Open Issues & TODOs
- See GitHub Issues or TODO.md for up-to-date tasks
- Key outstanding items:
  - Marketplace UI
  - Analytics dashboard
  - WalletConnect integration
  - Payment flows
  - Admin tools
  - Mobile polish

---

## 10. Contact & Support
- **Project Lead:** Andy (birdmania)
- **GitHub:** [https://github.com/b1rdmania/soundrights](https://github.com/b1rdmania/soundrights)
- **Replit:** [https://soundrights-birdmania.replit.app/](https://soundrights-birdmania.replit.app/)
- **For questions:** Open an issue or ping in the team chat

---

**Welcome aboard! Build something amazing.** 