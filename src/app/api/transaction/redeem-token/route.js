import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: "Token tidak valid." }, { status: 400 });
    }

    const cleanToken = token.trim().toUpperCase();

    // Support standard promotional or retry tokens
    if (cleanToken.startsWith("XXL-") || cleanToken === "FREEBEAT" || cleanToken === "CRISPYDROP") {
      const mockTxId = `tx_token_${Date.now()}`;
      return NextResponse.json({
        success: true,
        transactionId: mockTxId,
        message: "Token promosi XXL berhasil diklaim!",
        promptData: {
          genre: "Indobounce",
          artistReference: "Whisnu Santika",
          dropIntensity: "heavy",
        },
      });
    }

    return NextResponse.json(
      { error: "Token tidak ditemukan atau sudah kadaluarsa. Coba kode 'CRISPYDROP'." },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Gagal memproses token." }, { status: 500 });
  }
}
