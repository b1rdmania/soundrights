export interface WalletState {
  address: string;
  chainId: number;
  chainName: string;
  balance: string;
  connected: boolean;
}

export interface TransactionRequest {
  to: string;
  value: string;
  data?: string;
}

export interface TransactionResponse {
  txHash: string;
  status: 'pending' | 'success' | 'failed';
}

export class WalletConnectService {
  private readonly projectId: string;
  private readonly demoMode: boolean;
  private connectedWallet: WalletState | null = null;

  constructor() {
    this.projectId = process.env.WALLETCONNECT_PROJECT_ID || '';
    this.demoMode = !this.projectId;
    
    if (this.demoMode) {
      console.log('WalletConnect Service running in demo mode - provide WALLETCONNECT_PROJECT_ID for full integration');
    } else {
      console.log('WalletConnect Service initialized with project ID');
    }
  }

  /**
   * Check current wallet connection status
   */
  async getConnectionStatus(): Promise<{ connected: boolean; wallet?: WalletState }> {
    if (this.demoMode) {
      return {
        connected: !!this.connectedWallet,
        wallet: this.connectedWallet || undefined
      };
    }

    // In production, this would check actual WalletConnect session
    return {
      connected: !!this.connectedWallet,
      wallet: this.connectedWallet || undefined
    };
  }

  /**
   * Initiate wallet connection using WalletConnect protocol
   */
  async connectWallet(): Promise<{ wallet: WalletState; uri?: string }> {
    if (this.demoMode) {
      // Simulate successful connection in demo mode
      const demoWallet: WalletState = {
        address: '0x742B24aB32B6f9b6E2170df9b21845a7Ad5B6fDa',
        chainId: 1,
        chainName: 'Ethereum Mainnet',
        balance: '1.2345',
        connected: true
      };
      
      this.connectedWallet = demoWallet;
      
      return {
        wallet: demoWallet,
        uri: 'wc:demo-uri-for-testing@2?relay-protocol=irn&symKey=demo-key'
      };
    }

    // In production, this would use actual WalletConnect SDK
    // const { uri, approval } = await this.client.connect({
    //   requiredNamespaces: {
    //     eip155: {
    //       methods: ['eth_sendTransaction', 'personal_sign'],
    //       chains: ['eip155:1'],
    //       events: ['accountsChanged', 'chainChanged']
    //     }
    //   }
    // });

    throw new Error('WalletConnect project ID required for wallet connection');
  }

  /**
   * Disconnect current wallet session
   */
  async disconnectWallet(): Promise<void> {
    if (this.connectedWallet) {
      this.connectedWallet = null;
    }

    if (!this.demoMode) {
      // In production, disconnect from actual WalletConnect session
      // await this.client.disconnect({
      //   topic: session.topic,
      //   reason: getSdkError('USER_DISCONNECTED')
      // });
    }
  }

  /**
   * Send transaction through connected wallet
   */
  async sendTransaction(request: TransactionRequest): Promise<TransactionResponse> {
    if (!this.connectedWallet) {
      throw new Error('No wallet connected');
    }

    if (this.demoMode) {
      // Generate demo transaction hash
      const demoTxHash = `0x${Math.random().toString(16).slice(2, 34).padStart(32, '0')}${Math.random().toString(16).slice(2, 34).padStart(32, '0')}`;
      
      return {
        txHash: demoTxHash,
        status: 'pending'
      };
    }

    // In production, this would send actual transaction
    // const result = await this.client.request({
    //   topic: session.topic,
    //   chainId: 'eip155:1',
    //   request: {
    //     method: 'eth_sendTransaction',
    //     params: [{
    //       from: this.connectedWallet.address,
    //       to: request.to,
    //       value: ethers.utils.parseEther(request.value).toHexString(),
    //       data: request.data || '0x'
    //     }]
    //   }
    // });

    throw new Error('WalletConnect project ID required for transaction signing');
  }

  /**
   * Sign message with connected wallet
   */
  async signMessage(message: string): Promise<string> {
    if (!this.connectedWallet) {
      throw new Error('No wallet connected');
    }

    if (this.demoMode) {
      // Generate demo signature
      return `0x${'a'.repeat(130)}`;
    }

    // In production, sign with actual wallet
    // const signature = await this.client.request({
    //   topic: session.topic,
    //   chainId: 'eip155:1',
    //   request: {
    //     method: 'personal_sign',
    //     params: [message, this.connectedWallet.address]
    //   }
    // });

    throw new Error('WalletConnect project ID required for message signing');
  }

  /**
   * Get supported chains and methods
   */
  getSupportedFeatures() {
    return {
      chains: [
        { chainId: 1, name: 'Ethereum Mainnet', rpc: 'https://mainnet.infura.io' },
        { chainId: 137, name: 'Polygon', rpc: 'https://polygon-rpc.com' },
        { chainId: 42161, name: 'Arbitrum One', rpc: 'https://arb1.arbitrum.io/rpc' }
      ],
      methods: [
        'eth_sendTransaction',
        'personal_sign',
        'eth_signTypedData',
        'wallet_switchEthereumChain'
      ],
      events: [
        'accountsChanged',
        'chainChanged',
        'disconnect'
      ]
    };
  }
}

export const walletConnectService = new WalletConnectService();