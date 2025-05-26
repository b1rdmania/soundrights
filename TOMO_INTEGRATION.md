# Tomo Integration Plan for SoundRights

This document outlines the plan for integrating Tomo into the SoundRights platform to provide seamless social login and Web3 wallet functionalities for users.

## 1. Overview of Tomo

Tomo aims to simplify Web3 interactions with an all-in-one social wallet solution. It offers two main product lines: Tomo Labs (for developer integrations) and Tomo Wallets (end-user applications).

SoundRights will primarily use **Tomo Labs**, specifically the **Tomo Web SDK**, to integrate social login and wallet interactions directly into the frontend application.

Reference: [Tomo Docs Overview](https://docs.tomo.inc/)

## 2. Relevance to SoundRights

Integrating Tomo will significantly improve the user onboarding experience by:
- Allowing users to sign up/log in using familiar social accounts (Google, X, Facebook, Apple etc.).
- Abstracting away the complexities of traditional seed phrase wallet management for new Web3 users.
- Providing a secure way for users to connect their wallets and interact with Story Protocol for IP registration and licensing.

## 3. Key Tomo Web SDK Features & Integration Points

Based on the Tomo documentation, the following are key for SoundRights:

### 3.1. Setup & Initialization

1.  **Installation:**
    ```bash
    npm install @tomo-inc/tomo-web-sdk
    # or
    pnpm i @tomo-inc/tomo-web-sdk
    ```
2.  **Client ID Requirement:**
    - A `clientId` is mandatory to initialize the SDK.
    - **Action Required:** Register for a Tomo developer account using their [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSfqMQH80c9Py0V1rNDgfXqL8kNXKn66WMCgtczNLriruJicjw/viewform).
    - Once approved, log in to the [Tomo Developer Dashboard](https://dashboard.tomo.inc/) to create a project and obtain the `clientId`.
3.  **SDK Initialization (React Frontend):**
    - Wrap the SoundRights React application (or relevant parts) with `TomoContextProvider`:
      ```javascript
      import { TomoContextProvider } from '@tomo-inc/tomo-web-sdk';

      <TomoContextProvider
        theme="light" // or "dark"
        // IMPORTANT: chainTypes needs to be configured to enable EVM and Story Protocol.
        // Example given in docs was ['solana','tron','movement'].
        // EVM provider docs suggest EVM is available.
        // Story Protocol testnets ('Story Odyssey', 'Story Aeneid') are supported by TomoEVMKit.
        // We need to confirm the exact chainType string for EVM/Story.
        // Possible options: ['ethereum'], or specific chain IDs if Tomo maps them.
        chainTypes={['ethereum']} // Placeholder - VERIFY THIS!
        clientId="YOUR_TOMO_CLIENT_ID"
      >
        <YourApp />
      </TomoContextProvider>
      ```
    - For Next.js, specific `transpilePackages` and `core-js-pure` installation are needed as per Tomo docs.

Reference: [Tomo Web SDK - Quick Start](https://docs.tomo.inc/tomo-sdk/tomo-web-sdk/quick-start)

### 3.2. User Authentication & Wallet Connection

-   **Connect Modal:** Use the `openConnectModal()` function from the `useTomo()` hook to display Tomo's UI for social login and wallet connection.
    ```javascript
    import { useTomo } from '@tomo-inc/tomo-web-sdk';

    const { openConnectModal, connected, disconnect } = useTomo();
    // Call openConnectModal() on a user action (e.g., "Login with Tomo" button)
    ```
-   **Connection Status:** The `connected` boolean from `useTomo()` indicates if a wallet is connected.
-   **Disconnect:** Use `disconnect()` from `useTomo()`.

### 3.3. Accessing User Wallet Information (EVM)

-   **EVM Provider:** Access the EVM provider via `useTomo()`:
    ```javascript
    const { providers, walletState } = useTomo();
    const { ethereumProvider } = providers; // or window.tomo_ethereum for pure JS
    ```
-   **User's EVM Address:** This is crucial for SoundRights backend to identify the user and for Story Protocol interactions.
    -   From `walletState.address` (preferred if it provides the EVM address directly when an EVM chain is active).
    -   Alternatively, via the provider: `const accounts = await ethereumProvider.request({ method: "eth_accounts" }); const userAddress = accounts?.[0];`

Reference: [Tomo Web SDK - EVM Provider](https://docs.tomo.inc/tomo-sdk/tomo-web-sdk/evm-provider)

### 3.4. Interacting with Story Protocol (Sending Transactions)

-   **Sending Transactions:** Use `ethereumProvider.sendTransaction(txParams)` to prompt the user to sign and send transactions for Story Protocol (e.g., registering IP, minting licenses).
    ```javascript
    // Example txParams structure
    const txParams = {
      from: userAddress, // User's address from Tomo
      to: "STORY_PROTOCOL_CONTRACT_ADDRESS",
      value: "0x0", // If no ETH is being sent directly
      data: "0x_encoded_story_protocol_function_call_and_parameters",
      // gasPrice, gasLimit, maxFeePerGas, maxPriorityFeePerGas might be needed or handled by Tomo
    };
    const txResponse = await ethereumProvider.sendTransaction(txParams);
    // txResponse would typically be a transaction hash
    ```
-   **Signing Messages:** `ethereumProvider.signMessage()` or `ethereumProvider.signTypedData()` can be used for off-chain operations if needed (e.g., backend authentication challenge).

### 3.5. Supported Chains

- Tomo explicitly supports Story Protocol testnets: **"Story Odyssey"** and **"Story Aeneid"**.
- This is excellent for development and testing on SoundRights.
- The exact `chainId` values or string identifiers for these networks when using `switchChain()` or in `TomoContextProvider` need to be confirmed.

Reference: [TomoEVMKit - Supported Chains](https://docs.tomo.inc/tomo-sdk/tomoevmkit/supported-chains)

## 4. Integration Steps for SoundRights

1.  **Prerequisite:** Obtain `clientId` from Tomo Developer Dashboard.
2.  **Frontend (React App):**
    - Install `@tomo-inc/tomo-web-sdk`.
    - Implement `TomoContextProvider` at the root of the application, configuring `chainTypes` for EVM and Story Protocol.
    - Create a login/connect button that calls `openConnectModal()`.
    - On successful connection:
        - Retrieve the user's EVM address.
        - Send this address to the SoundRights backend to create/authenticate the user session (e.g., link it to a SoundRights user account).
    - For actions requiring on-chain interaction (e.g., registering a track on Story Protocol):
        - The backend will prepare the necessary transaction parameters (contract address, function data).
        - The frontend will use `ethereumProvider.sendTransaction(txParams)` to prompt the user to sign and send via Tomo.
        - The resulting transaction hash will be sent to the backend to monitor its status.
3.  **Backend (FastAPI App - Primarily for user association and tx preparation):**
    - Store the Tomo-provided EVM address as part of the SoundRights user model.
    - Provide endpoints that the frontend can call to get necessary data for Story Protocol transactions (e.g., encoded function calls for specific actions).
    - Potentially, an endpoint for the frontend to notify the backend about a submitted transaction hash for monitoring.

## 5. Open Questions & Further Investigation

-   **Exact `chainTypes` for EVM/Story Protocol:** What specific string(s) should be used in `TomoContextProvider` for `chainTypes` to enable EVM and specifically target Story Protocol testnets (Odyssey, Aeneid)? Is it a generic `'ethereum'` and then `switchChain()` is used, or can target networks be specified at init?
-   **`chainId` for `switchChain()`:** What are the numerical or string `chainId`s for Story Odyssey and Story Aeneid when using `ethereumProvider.switchChain()`?
-   **Error Handling:** How are errors from the Tomo SDK (e.g., user closes modal, transaction rejection, social login failure) propagated and best handled in the frontend?
-   **Session Management:** How does Tomo SDK handle session persistence? If a user refreshes the page, does `useTomo()` automatically reflect the connected state if previously connected?
-   **Retrieving User's Social Profile (Optional):** Does the SDK provide access to any (consented) basic social profile information if logged in via a social provider? This might be useful for user profiles in SoundRights.
-   **Gas Fee Estimation/Handling:** How are gas fees estimated and presented to the user by Tomo when `sendTransaction` is called? Can the dApp suggest gas parameters?

## 6. Next Steps

1.  Sign up for a Tomo developer account to get a `clientId`.
2.  Experiment with the [Tomo Web SDK Demo](https://socialwallet-react-demo.tomo.inc/) to understand the user flow and SDK behavior.
3.  Begin frontend integration based on the steps above, focusing on the login/connect flow first.
4.  Clarify open questions by consulting Tomo's support or community if not found in docs/demo.

This document will be updated as more information is gathered during the integration process. 