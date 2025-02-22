import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { txId, currency, address } = await request.json();

  try {
    // Server-side API call to blockchain explorer
    const apiUrl = `https://api.blockcypher.com/v1/${currency.toLowerCase()}/main/txs/${txId}`;
    const response = await fetch(apiUrl);
    console.log(apiUrl);
    if (!response.ok) {
      return NextResponse.json(
        { valid: false, error: "Transaction not found" },
        { status: 400 }
      );
    }

    const data = await response.json();
    const isValid = data.addresses?.includes(address);

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Server verification error:', error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}