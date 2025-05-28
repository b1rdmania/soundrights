# Zapper.fi Integration Plan for SoundRights

## 1. Overview

Zapper.fi provides a comprehensive API for accessing onchain data, including token balances, NFT details, transaction history, and DeFi positions across over 50 blockchains. Their API supports Story Protocol (listed as "Story" in their chain documentation), making it valuable for SoundRights to display and manage users' onchain sound IP assets.

This document outlines the plan for integrating Zapper into SoundRights.

## 2. API Details

*   **Endpoint:** GraphQL API at `https://public.zapper.xyz/graphql`
*   **Authentication:** Requires an API key. The key must be included in the request headers as `x-zapper-api-key: YOUR_API_KEY`.
*   **Documentation:**
    *   Main Docs: `https://docs.zapper.fi/`
    *   Protocol/API Docs: `https://protocol.zapper.xyz/`
    *   Agent Instructions (useful for LLM interaction/understanding schema): `https://protocol.zapper.xyz/agents.txt`

## 3. Key Features for SoundRights

The primary Zapper API features relevant to SoundRights are:

*   **`portfolioV2` Query:** To fetch a user's portfolio, including:
    *   Token balances (fungible tokens).
    *   NFT balances (non-fungible tokens).
    *   Ability to filter by network (e.g., Story Protocol) and wallet addresses.
*   **`transactionHistoryV2` Query:** To fetch onchain transaction history for an address, which could be used to display royalty payments or other IP-related activities.
*   **NFT Data:** Detailed metadata and media for NFTs.
*   **Chain Support:** Explicit support for "Story" network.

## 4. Integration Plan

### Prerequisites

*   Successful integration of Tomo for user social login and EVM wallet management.
*   Users must be able to interact with Story Protocol via their Tomo wallet to register IP assets (which become onchain tokens/NFTs).
*   Obtain a Zapper API Key.
*   Backend service/endpoint in SoundRights to proxy requests to the Zapper API (to securely manage the API key).

### Phase 1: Basic Onchain IP Asset Display (Hackathon Goal)

**Goal:** Allow users to see their Sound IP assets that are on Story Protocol, as reflected by Zapper.

**Backend:**
1.  Create a new service, e.g., `app/services/onchain_analytics/zapper_service.py`.
2.  This service will have methods to call the Zapper GraphQL API.
    *   Method to fetch portfolio data for a given list of wallet addresses, specifically filtering for assets on the Story Protocol network.
3.  Add `ZAPPER_API_KEY` to `app/core/config.py` and `.env` files.
4.  Create a new API endpoint, e.g., `/api/v1/analytics/portfolio/{user_wallet_address}`.
    *   This endpoint will use the `ZapperService` to fetch data.
    *   It should handle authentication to ensure only authorized users can request their portfolio data.

**Frontend:**
1.  In the user dashboard, create a new section or component to display "Onchain IP Assets."
2.  This component will call the new backend endpoint to fetch and display assets from Story Protocol.
    *   Display token/NFT name, symbol, quantity, and perhaps a link to view the asset on a Story Protocol explorer (if available) or Zapper.fi itself.

**Example GraphQL Query (Conceptual - `portfolioV2`):**

```graphql
query UserStoryProtocolAssets($userAddresses: [Address!]!, $storyChainId: [Int!]) {
  portfolioV2(addresses: $userAddresses, chainIds: $storyChainId) {
    # Token Balances (Fungible IP representations)
    tokenBalances {
      totalBalanceUSD
      byToken(first: 50) { # Adjust 'first' as needed
        edges {
          node {
            symbol
            balance
            balanceUSD
            imgUrlV2
            network {
              name # Should be "Story" or similar
            }
            tokenAddress
          }
        }
      }
    }
    # NFT Balances (Non-Fungible IP representations)
    nftBalances {
      totalBalanceUSD
      byCollection(first: 20) { # Adjust 'first' as needed
        edges {
          node {
            collection {
              name
              network {
                name # Should be "Story" or similar
              }
            }
            tokens(first: 10) { # NFTs within that collection
              edges {
                node {
                  tokenId
                  name
                  mediasV3 {
                    images {
                      edges {
                        node {
                          thumbnail
                          original
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```
*Variables for the query would be something like:*
`{ "userAddresses": ["0xUserWalletAddress1", "0xUserWalletAddress2"], "storyChainId": [CHAIN_ID_FOR_STORY_PROTOCOL] }`
*(Note: The exact `CHAIN_ID_FOR_STORY_PROTOCOL` will need to be identified from Zapper's network list or Story Protocol's documentation).*

### Phase 2: Enhanced Analytics (Post-Hackathon / Future)

*   **Transaction History:** Integrate `transactionHistoryV2` to show onchain transactions related to the user's IP (e.g., license payments received).
*   **Detailed NFT View:** Allow users to click on an NFT asset to see more details fetched from Zapper (traits, larger media, etc.).
*   **Cross-Chain Portfolio View (Optional):** If users hold IP assets on multiple chains supported by Story Protocol and Zapper, provide a consolidated view.

## 5. Open Questions / Considerations

*   **Zapper API Rate Limits:** Investigate and implement appropriate caching or request batching if necessary.
*   **Story Protocol Chain ID:** Confirm the exact Chain ID Zapper uses for Story Protocol.
*   **Error Handling:** Robust error handling for API calls to Zapper.
*   **Data Privacy:** Ensure user wallet addresses are handled securely and API keys are not exposed client-side.
*   **Cost:** Understand Zapper's API pricing model, if any, for post-hackathon usage. (Assumed free/generous tier for hackathon).

## 6. Zapper API Key Management

The `ZAPPER_API_KEY` should be stored securely in environment variables (`.env` for local development, and appropriate secret management for production). It should **never** be hardcoded or exposed in the frontend application. All API calls to Zapper should be proxied through the SoundRights backend. 