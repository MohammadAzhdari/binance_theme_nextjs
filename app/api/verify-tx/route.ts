import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { txId, currency, address } = await request.json();
  
  try {
    let isValid = false;
    
    if (currency === 'USDT') {
      // Check if ERC-20 (Ethereum) transaction
      if (txId.startsWith('0x')) {
        const API_KEY = process.env.ETHERSCAN_API_KEY;
        const url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txId}&apikey=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        isValid = data.result?.to?.toLowerCase() === address.toLowerCase();
      }
      // Check if TRC-20 (Tron) transaction
      else {
        const url = `https://apilist.tronscan.org/api/transaction-info?hash=${txId}`;
        const response = await fetch(url);
        const data = await response.json();
        isValid = data.contractData?.contract_address === address;
      }
    } else {
      // Handle other currencies (BTC, ETH)
      const response = await fetch(`https://api.blockcypher.com/v1/${currency}/main/txs/${txId}`);
      const data = await response.json();
      isValid = data.addresses?.includes(address);
    }

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { valid: false, error: "Transaction verification failed" },
      { status: 500 }
    );
  }
}