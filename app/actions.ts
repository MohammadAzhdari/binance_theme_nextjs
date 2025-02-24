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
    const response = await fetch('/api/verify-tx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txId, currency, address }),
    });

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
