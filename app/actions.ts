'use server';

import { NextResponse } from 'next/server';

export interface VerificationParams {
  txId: string;
  currency: string;
  address: string;
}

export interface VerificationResult {
  valid: boolean;
  message?: string;
  error?: string;
  amount?: number;
}

export const verifyTransaction = async ({
  txId,
  currency,
  address
}: VerificationParams): Promise<VerificationResult> => {
  try {

    const response = await sendAsync({ txId, currency, address });
    const data = await response.json();

    if (!response.ok) {
      return {
        valid: false,
        error: `Verification failed: ${data.error}`
      };
    }

    return data;

  } catch (error) {
    console.error('Verification error:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Connection error'
    };
  }
};


async function sendAsync(model: VerificationParams) {

  try {
    let isValid = false;
    let amount = "0.00";

    switch (model.currency.toUpperCase()) {
      case 'USDT':
        // ERC-20 (Ethereum)
        if (model.txId.startsWith('0x')) {
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
              `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${model.txId}&apikey=92QDZNA9XFTSHQZQTE939VS2F9S1Q6RWNA`
            );
            const ethData = await ethResponse.json();
            isValid = ethData.result?.to?.toLowerCase() === model.address.toLowerCase();
            amount = (parseInt(ethData.result?.value || '0') / 1e18).toFixed(4);
          }
        }
        // TRC-20 (Tron)
        else {
          const tronResponse = await fetch(`https://apilist.tronscan.org/api/transaction-info?hash=${model.txId}`);
          const tronData = await tronResponse.json();
          isValid = tronData.contractData?.to_address === model.address;
          amount = (tronData.contractData?.amount / 1e6).toFixed(4);
        }
        break;

      case 'BTC':
        const btcResponse = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${model.txId}`);
        const btcData = await btcResponse.json();
        isValid = btcData.addresses?.includes(model.address);
        amount = (btcData.total / 1e8).toFixed(8);
        break;

      case 'ETH':
        const ethResponse = await fetch(
          `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${model.txId}&apikey=92QDZNA9XFTSHQZQTE939VS2F9S1Q6RWNA`
        );
        const ethData = await ethResponse.json();
        isValid = ethData.result?.to?.toLowerCase() === model.address.toLowerCase();
        amount = (parseInt(ethData.result?.value || '0') / 1e18).toFixed(4);
        break;

      case 'XRP':
        const xrpResponse = await fetch(`https://api.xrpscan.com/api/v1/tx/${model.txId}`);
        const xrpData = await xrpResponse.json();
        isValid = xrpData?.Destination === model.address;
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