# SoundRights - Blockchain Music Licensing Platform

**🚀 NOW LIVE**: The first blockchain-native music licensing platform for independent labels.

## Platform Status: OPERATIONAL ✅

SoundRights is deployed and accessible with WalletConnect authentication. Independent labels can now register music IP as NFTs, verify originality, and license tracks directly to buyers.

**Live Platform Access**: Connect any crypto wallet to start using the platform immediately.

## Overview

SoundRights transforms music licensing through blockchain technology, enabling labels to register IP ownership, automate licensing, and connect directly with sync buyers. Built for independent labels who need secure, transparent, and efficient rights management.

## Features

**Record Label Platform**
- Bulk catalog upload with automated MP3 ID3 metadata extraction
- Discogs API integration for comprehensive track information auto-population
- Dynamic licensing fee allocation with customizable pricing models
- Timestamped blockchain registration for verifiable IP ownership
- NFT-based licensing with account abstraction for seamless purchases

**Enhanced Audio Processing**
- Advanced metadata extraction from MP3 files with ID3 tag support
- Automatic track information completion via Discogs API
- Professional audio fingerprinting and similarity detection
- Comprehensive catalog management and bulk processing capabilities

**Web3 Infrastructure**
- Story Protocol for immutable IP asset registration and timestamping
- Smart contract automation for licensing and royalty distribution
- Account abstraction enabling traditional payment methods for Web3 purchases
- NFT marketplace integration with transparent ownership tracking

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