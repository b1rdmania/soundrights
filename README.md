# SoundRights - Web3 Music Licensing Platform

A comprehensive blockchain-based music licensing platform that enables secure IP registration, similarity matching, and smart contract licensing through Story Protocol integration.

## 🎯 Project Overview

SoundRights transforms music licensing by combining Web3 technology with AI-powered audio analysis. Users can upload tracks, register intellectual property on-chain, and manage licensing through automated smart contracts.

## ✅ Completed Features

### Core Infrastructure
- ✓ **Full-stack TypeScript application** with Express/Vite architecture
- ✓ **PostgreSQL database** with comprehensive schema for users, tracks, licenses, and IP assets
- ✓ **Replit Authentication** with session management and user registration
- ✓ **File upload system** with Multer for audio track handling
- ✓ **Database migrations** configured with Drizzle ORM

### User Management
- ✓ **User authentication** with secure session handling
- ✓ **User profiles** with metadata and activity tracking
- ✓ **Activity logging** for all user interactions
- ✓ **API key management** for external service access

### Track Management
- ✓ **Track upload** with metadata extraction and storage
- ✓ **Track status tracking** (uploaded, processing, verified, registered, licensed)
- ✓ **File validation** and secure storage handling
- ✓ **Track ownership** and access control

### Licensing System
- ✓ **License model** with multiple license types (commercial, attribution, sync, master, mechanical)
- ✓ **License creation** and management APIs
- ✓ **Track-license relationships** with proper database relations
- ✓ **License terms** and pricing configuration

### Story Protocol Integration (Foundation)
- ✓ **IP asset schema** for blockchain registration tracking
- ✓ **Story Protocol service** with registration and license creation endpoints
- ✓ **API routes** for IP registration (`/api/story/register-ip`, `/api/story/create-license`)
- ✓ **Blockchain metadata** storage with transaction hash tracking
- ✓ **Web3 configuration** with wallet connection setup

### Frontend Components
- ✓ **React application** with wouter routing (converted from react-router-dom)
- ✓ **Landing page** with feature showcases and CTA sections
- ✓ **Authentication hooks** and protected route handling
- ✓ **Track upload interface** with form validation
- ✓ **UI components** built with shadcn/ui and Tailwind CSS
- ✓ **Responsive design** with mobile-first approach

## 🚧 Current Issues & Required Fixes

### 1. Database Schema Migration
**Status:** Schema defined but not pushed to database
**Issue:** New IP assets table needs to be migrated
**Fix Required:**
```bash
npm run db:push
```

### 2. Storage Interface Implementation
**Status:** Interface defined but methods not implemented
**Issue:** IP asset CRUD operations missing in DatabaseStorage class
**Required Methods:**
- `createIpAsset()`
- `getIpAsset()`
- `getTrackIpAssets()`
- `getUserIpAssets()`
- `updateIpAssetStatus()`

### 3. Story Protocol SDK Integration
**Status:** Simulated implementation in place
**Issue:** Using mock responses instead of actual Story Protocol API
**Fix Required:**
- Configure actual Story Protocol SDK with proper API keys
- Replace simulated responses with real blockchain transactions
- Add proper error handling for blockchain operations

### 4. Web3 Wallet Integration
**Status:** Components created but not integrated
**Issue:** Wallet connection not implemented in main application
**Fix Required:**
- Add Web3Provider to main App component
- Implement wallet connection UI
- Configure RainbowKit with proper project ID

### 5. Frontend Routing
**Status:** Partially migrated from react-router-dom to wouter
**Issue:** Some components may still have routing inconsistencies
**Fix Required:** Complete migration and test all navigation

## 🔧 Technical Stack

### Backend
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Replit Auth with session management
- **File Handling:** Multer for audio uploads
- **Blockchain:** Story Protocol SDK for IP registration

### Frontend
- **Framework:** React with TypeScript
- **Routing:** wouter (migrated from react-router-dom)
- **Styling:** Tailwind CSS with shadcn/ui components
- **State Management:** TanStack Query for server state
- **Build Tool:** Vite

### Web3 Integration
- **Wallet:** RainbowKit for wallet connections
- **Blockchain:** wagmi for Web3 interactions
- **IP Protocol:** Story Protocol for on-chain IP management

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database provisioned
- Environment variables configured

### Installation
```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Environment Variables
Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secure session secret
- `STORY_API_KEY` - Story Protocol API key (when implementing real integration)

## 📋 Next Development Priorities

### Immediate (Week 1)
1. **Complete database migration** - Push IP assets schema to database
2. **Implement storage methods** - Add IP asset CRUD operations to DatabaseStorage
3. **Fix wallet integration** - Add Web3Provider to main application
4. **Test Story Protocol endpoints** - Verify API routes work correctly

### Short-term (Week 2-3)
1. **Real Story Protocol integration** - Replace mock implementation with actual SDK
2. **Audio analysis integration** - Add similarity matching and fingerprinting
3. **Enhanced UI** - Complete track management and licensing interfaces
4. **Testing suite** - Add comprehensive test coverage

### Medium-term (Month 2)
1. **Advanced licensing** - Smart contract automation
2. **Analytics dashboard** - User and system metrics
3. **Mobile optimization** - PWA capabilities
4. **Performance optimization** - Caching and optimization

## 🔍 Known Technical Debt

1. **Error Handling:** Inconsistent error handling across API endpoints
2. **Validation:** Missing input validation on several endpoints
3. **Logging:** Insufficient logging for debugging and monitoring
4. **Security:** Rate limiting and security headers not implemented
5. **Testing:** No automated test suite currently in place

## 📖 API Documentation

### Authentication Endpoints
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Logout user

### Track Management
- `POST /api/tracks` - Upload new track
- `GET /api/tracks` - List user tracks
- `PUT /api/tracks/:id` - Update track
- `DELETE /api/tracks/:id` - Delete track

### Licensing
- `POST /api/licenses` - Create license
- `GET /api/licenses/track/:trackId` - Get track licenses
- `GET /api/licenses/user` - Get user licenses

### Story Protocol Integration
- `POST /api/story/register-ip` - Register IP asset on blockchain
- `POST /api/story/create-license` - Create blockchain license
- `POST /api/story/get-ip-asset` - Retrieve IP asset data
- `GET /api/story/licenses/:ipId` - Get IP asset licenses

## 📁 Project Structure

```
soundrights/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend application
│   ├── db.ts              # Database configuration
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   ├── replitAuth.ts      # Authentication middleware
│   └── storyProtocol.ts   # Blockchain integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── docs/                  # Additional documentation
```

## 🤝 Contributing

This project is in active development. Key areas needing attention:
1. Complete Story Protocol real integration
2. Implement comprehensive testing
3. Add proper error handling and validation
4. Optimize performance and security

## 📄 License

This project is part of a larger web3 music licensing initiative. Contact the development team for licensing information.

---

**Last Updated:** January 2025  
**Status:** Core foundation complete, blockchain integration in progress  
**Next Milestone:** Production-ready Story Protocol integration