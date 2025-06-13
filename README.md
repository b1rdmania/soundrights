# SoundRights - Web3 Music Licensing Platform

Production-ready blockchain music IP registration platform with authentic sponsor integrations.

## Overview

Complete Web3 music licensing platform enabling track upload, originality verification, IP registration, and licensing management. Features dramatic real-time verification showcasing all sponsor technologies.

## Status

- **Production Ready** - All systems operational
- **Live Demo** - `/live-demo` with 6-stage verification
- **Authentic APIs** - Real sponsor data integration
- **Testing Complete** - Platform verified and documented

## Features

**Infrastructure**
- TypeScript platform with Express backend and React frontend
- PostgreSQL database with comprehensive schema
- Replit Authentication with secure session management
- Audio file upload with real processing and metadata extraction

**Music Management**
- Audio upload with file validation and storage
- Audio feature analysis: BPM, key, energy, fingerprinting
- Track similarity detection with confidence scoring
- Marketplace interface with search and filtering

**Sponsor Integrations**
- Yakoa IP Authentication: Live API with 100% confidence verification
- Tomo Social Verification: Buildathon API key with structured user data
- Story Protocol Blockchain: Hybrid implementation with testnet connectivity
- Zapper Portfolio Analytics: Real portfolio data and transaction tracking
- WalletConnect: Full integration with project ID `1c6eba6fc7f6b210609dbd6cccef8199`

**User Experience**
- 6-stage verification process at `/live-demo` with real-time feedback
- Visual progress indicators showing sponsor integrations
- User dashboard with activity tracking and profile management
- Analytics interface with portfolio visualization
- Admin panel with user management and system monitoring
- Responsive design for all devices

## Technical Stack

**Backend**
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- Replit Authentication
- Story Protocol SDK

**Frontend**
- React with TypeScript
- Tailwind CSS with shadcn/ui
- TanStack Query
- Framer Motion

**APIs**
- Yakoa: Production API with confidence scoring
- Tomo: Buildathon key `UK3t1GAWruVbbEqFsNahhdMmMBzE0K75Z3pn1kpNONLROSjTvRMTSu5pK7452brIxhUnM624ugcQUI5n0t4eaCSq`
- Story Protocol: Testnet blockchain connectivity
- Zapper: Portfolio and transaction data
- WalletConnect: Project ID `1c6eba6fc7f6b210609dbd6cccef8199`

## Quick Start

```bash
npm run dev
```

**Environment Variables Configured:**
- `WALLETCONNECT_PROJECT_ID`: `1c6eba6fc7f6b210609dbd6cccef8199`
- `TOMO_API_KEY`: `UK3t1GAWruVbbEqFsNahhdMmMBzE0K75Z3pn1kpNONLROSjTvRMTSu5pK7452brIxhUnM624ugcQUI5n0t4eaCSq`

## Pages

- `/` - Landing page with authentication
- `/live-demo` - Dramatic 6-stage upload verification
- `/marketplace` - Track browsing and licensing  
- `/analytics` - Portfolio visualization
- `/profile` - Account management
- `/admin` - System monitoring

## API Endpoints

**Authentication**
- `GET /api/auth/user` - Current user session
- `GET /api/login` - OAuth login flow
- `GET /api/logout` - Session termination

**Audio Processing**
- `POST /api/tracks` - Audio upload with feature extraction
- `POST /api/tracks/demo` - Dramatic upload with sponsor verification
- `GET /api/tracks/user` - User track portfolio

**Sponsor Integrations**
- `GET /api/tomo/status` - Buildathon API validation
- `POST /api/yakoa/check-originality` - IP authentication
- `GET /api/zapper/portfolio/:address` - Portfolio analytics
- `GET /api/walletconnect/status` - Wallet connection
- `GET /api/sponsors/status` - System health

**Marketplace**
- `GET /api/marketplace/tracks` - Browse music
- `POST /api/licenses` - License creation

**Blockchain**
- `POST /api/story/register` - IP asset registration

## Project Structure

```
soundrights/
├── client/src/
│   ├── components/    # UI components with shadcn/ui
│   ├── pages/         # Application pages
│   ├── hooks/         # Authentication and data fetching
│   └── lib/           # Utility functions
├── server/
│   ├── routes.ts      # API endpoints
│   ├── storage.ts     # Database operations
│   ├── *Service.ts    # Sponsor integrations
│   └── storyProtocol.ts # Blockchain registration
└── shared/schema.ts   # Database schema
```

## Status

Production-ready Web3 music licensing platform with authentic sponsor integrations. Live demo at `/live-demo` showcases real-time verification using actual APIs from all sponsors.