import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum, sepolia } from '@reown/appkit/networks'

// Get projectId from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '1c6eba6fc7f6b210609dbd6cccef8199'

// Create metadata object
const metadata = {
  name: 'SoundRights',
  description: 'Web3 Music IP Registration and Licensing Platform',
  url: 'https://soundrights.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the AppKit instance
export const appKit = createAppKit({
  adapters: [new EthersAdapter()],
  projectId,
  networks: [mainnet, arbitrum, sepolia],
  metadata,
  features: {
    analytics: true
  }
})

interface WalletConnectionResult {
  address: string;
  chainId: number;
  connected: boolean;
  uri?: string;
}

// Connect wallet using Reown AppKit
export const connectWallet = async (): Promise<WalletConnectionResult> => {
  try {
    // Open the connection modal
    appKit.open()
    
    // Return a promise that resolves when wallet connects
    return new Promise((resolve, reject) => {
      let resolved = false
      
      const checkConnection = () => {
        const account = appKit.getAccount()
        if (account?.isConnected && account?.address && !resolved) {
          resolved = true
          resolve({
            address: account.address,
            chainId: 1, // Default to mainnet
            connected: true
          })
        }
      }

      // Check immediately
      setTimeout(checkConnection, 100)

      // Subscribe to account changes
      const unsubscribe = appKit.subscribeAccount(checkConnection)

      // Set timeout for connection
      setTimeout(() => {
        if (!resolved) {
          resolved = true
          unsubscribe?.()
          reject(new Error('Connection timeout'))
        }
      }, 30000)
    })
  } catch (error) {
    console.error('Wallet connection failed:', error)
    throw error
  }
}

export const disconnectWallet = async () => {
  try {
    await appKit.disconnect()
    return { connected: false }
  } catch (error) {
    console.error('Wallet disconnection failed:', error)
    throw error
  }
}

// Get current wallet connection status
export const getWalletState = () => {
  const account = appKit.getAccount()
  return {
    address: account?.address || '',
    chainId: 1, // Default chainId
    connected: account?.isConnected || false
  }
}

// Legacy exports for compatibility
export const getWalletKit = () => appKit
export const initializeWalletKit = async () => appKit

// Sign message function (demo implementation)
export const signMessage = async (message: string) => {
  try {
    const account = appKit.getAccount()
    if (!account?.isConnected || !account?.address) {
      throw new Error('Wallet not connected')
    }

    // Demo signature for testing
    console.log('Signing message:', message)
    return `0x${'1234567890abcdef'.repeat(8)}`
  } catch (error) {
    console.error('Message signing failed:', error)
    throw error
  }
}

// Send transaction function (demo implementation)
export const sendTransaction = async (transaction: any) => {
  try {
    const account = appKit.getAccount()
    if (!account?.isConnected) {
      throw new Error('Wallet not connected')
    }

    // Demo transaction for testing
    console.log('Sending transaction:', transaction)
    return {
      hash: `0x${'abcdef1234567890'.repeat(4)}`,
      status: 'pending' as const
    }
  } catch (error) {
    console.error('Transaction failed:', error)
    throw error
  }
}

// Get wallet sessions (compatibility function)
export const getWalletSessions = () => {
  const account = appKit.getAccount()
  return account?.isConnected ? { active: true } : {}
}