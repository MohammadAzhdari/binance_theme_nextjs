import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { txId, currency, address } = await request.json();
  console.log(txId);
  console.log(currency);
  console.log(address);
  try {
    let isValid = false;
    let amount = "0.00";

    switch(currency.toUpperCase()) {
      case 'USDT':
        // ERC-20 (Ethereum)
        if (txId.startsWith('0x')) {
          // Check Binance Smart Chain first
          // const bscResponse = await fetch(
          //   `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${txId}&apikey=${process.env.BSCSCAN_API_KEY}`
          // );
          // const bscData = await bscResponse.json();
          // if (bscData.result?.to?.toLowerCase() === address.toLowerCase()) {
          //   isValid = true;
          //   amount = (parseInt(bscData.result.value) / 1e18).toFixed(4);
          // } else 
          {
            // Fallback to Ethereum check
            const ethResponse = await fetch(
              `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txId}&apikey=92QDZNA9XFTSHQZQTE939VS2F9S1Q6RWNA`
            );
            const ethData = await ethResponse.json();
            isValid = ethData.result?.to?.toLowerCase() === address.toLowerCase();
            amount = (parseInt(ethData.result?.value || '0') / 1e18).toFixed(4);
          }
        }
        // TRC-20 (Tron)
        else {
          const tronResponse = await fetch(`https://apilist.tronscan.org/api/transaction-info?hash=${txId}`);
          const tronData = await tronResponse.json();
          isValid = tronData.contractData?.to_address === address;
          amount = (tronData.contractData?.amount / 1e6).toFixed(4);
        }
        break;

      case 'BTC':
        const btcResponse = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${txId}`);
        const btcData = await btcResponse.json();
        isValid = btcData.addresses?.includes(address);
        amount = (btcData.total / 1e8).toFixed(8);
        break;

      case 'ETH':
        const ethResponse = await fetch(
          `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txId}&apikey=92QDZNA9XFTSHQZQTE939VS2F9S1Q6RWNA`
        );
        const ethData = await ethResponse.json();
        isValid = ethData.result?.to?.toLowerCase() === address.toLowerCase();
        amount = (parseInt(ethData.result?.value || '0') / 1e18).toFixed(4);
        break;

      case 'XRP':
        const xrpResponse = await fetch(`https://api.xrpscan.com/api/v1/tx/${txId}`);
        const xrpData = await xrpResponse.json();
        isValid = xrpData?.Destination === address;
        amount = (xrpData.Amount?.value ? xrpData.Amount?.value / 1e6 : 0).toFixed(2);
        break;

      default:
        return NextResponse.json(
          { valid: false, error: "Unsupported currency" },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      valid: isValid,
      amount: isValid ? amount : "0.00"
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { valid: false, error: "Transaction verification failed" },
      { status: 500 }
    );
  }
}