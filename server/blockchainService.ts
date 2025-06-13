import { ZapperPortfolio, ZapperTransaction } from './zapperService';

/**
 * Direct blockchain integration service for real-time wallet data
 * Uses public RPC endpoints to fetch authentic wallet balances and transactions
 */
export class BlockchainService {
  private readonly ethRpcUrl = 'https://eth-mainnet.public.blastapi.io';
  private readonly polygonRpcUrl = 'https://polygon-rpc.com';

  /**
   * Get real-time wallet portfolio using direct blockchain calls
   */
  async getWalletPortfolio(address: string): Promise<ZapperPortfolio> {
    try {
      // Get ETH balance
      const ethBalance = await this.getETHBalance(address);
      
      // Get ERC-20 token balances (top tokens)
      const tokenBalances = await this.getTokenBalances(address);
      
      // Get recent transactions
      const transactions = await this.getRecentTransactions(address);

      const tokens = [
        {
          contract_address: '0x0000000000000000000000000000000000000000',
          token_id: '0',
          name: 'Ethereum',
          description: 'ETH',
          collection_name: 'Native Assets',
          owner: address,
          blockchain: 'ethereum',
          estimated_value: ethBalance.usdValue
        },
        ...tokenBalances
      ];

      const totalValue = tokens.reduce((sum, token) => sum + token.estimated_value, 0);

      return {
        address,
        total_value: totalValue,
        tokens,
        transactions,
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch blockchain portfolio:', error);
      throw new Error('Failed to retrieve real-time wallet data');
    }
  }

  private async getETHBalance(address: string): Promise<{ balance: string; usdValue: number }> {
    try {
      const response = await fetch(this.ethRpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1
        })
      });

      const data = await response.json();
      const balanceWei = BigInt(data.result || '0x0');
      const balanceEth = Number(balanceWei) / 1e18;
      
      // Get ETH price from CoinGecko (free API)
      const ethPrice = await this.getETHPrice();
      
      return {
        balance: balanceEth.toString(),
        usdValue: balanceEth * ethPrice
      };
    } catch (error) {
      console.error('Failed to get ETH balance:', error);
      return { balance: '0', usdValue: 0 };
    }
  }

  private async getETHPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      return data.ethereum?.usd || 0;
    } catch (error) {
      console.error('Failed to get ETH price:', error);
      return 0;
    }
  }

  private async getTokenBalances(address: string): Promise<any[]> {
    // For now, return empty array - would need to implement ERC-20 balance checks
    // This requires knowing contract addresses and making multiple RPC calls
    return [];
  }

  private async getRecentTransactions(address: string): Promise<ZapperTransaction[]> {
    try {
      // Using Etherscan API (free tier) for transaction history
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=YourApiKeyToken`
      );
      
      const data = await response.json();
      
      if (!data.result || !Array.isArray(data.result)) {
        return [];
      }

      return data.result.slice(0, 5).map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gas_used: tx.gasUsed,
        gas_price: tx.gasPrice,
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        status: tx.txreceipt_status === '1' ? 'success' : 'failed',
        type: this.determineTransactionType(tx, address)
      }));
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  }

  private determineTransactionType(tx: any, address: string): 'mint' | 'transfer' | 'sale' {
    if (tx.from === '0x0000000000000000000000000000000000000000') return 'mint';
    if (tx.from.toLowerCase() === address.toLowerCase() && parseInt(tx.value) > 0) return 'sale';
    return 'transfer';
  }

  /**
   * Test blockchain connectivity
   */
  async testConnection(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(this.ethRpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      });

      const data = await response.json();
      if (data.result) {
        return {
          status: 'live',
          message: 'Blockchain RPC connected - real-time wallet data available'
        };
      }
      throw new Error('No block number returned');
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to connect to blockchain RPC'
      };
    }
  }
}

export const blockchainService = new BlockchainService();