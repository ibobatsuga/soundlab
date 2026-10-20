import { NextResponse } from 'next/server';
import { transactions } from '@/lib/transactionStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      genre,
      artistReference,
      vocalType,
      dropIntensity,
      tempo,
      lyrics,
      phoneNumber,
      isSandbox = false,
    } = body;

    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const orderId = `XXL-${Math.floor(100000 + Math.random() * 900000)}`;

    // Store transaction details
    const txData = {
      transactionId,
      orderId,
      promptData: {
        genre,
        artistReference,
        vocalType,
        dropIntensity,
        tempo,
        lyrics,
        phoneNumber,
      },
      status: isSandbox ? "PAID" : "PENDING",
      amount: 10000,
      amountDisplay: "Rp10.000",
      isSandbox,
      createdAt: Date.now(),
      queuePosition: isSandbox ? 0 : Math.floor(Math.random() * 2) + 1,
    };

    transactions.set(transactionId, txData);

    // Dynamic QR URL (Using QR server / ASPI standard mock QR code)
    const qrPayload = `00020101021226600016ID.ASPI-QRIS.WWW01189360099900000012340215${orderId}51440014ID.CO.QRIS.WWW0215${orderId}5204581253033605405100005802ID5917XXLCHICKEN SOUND6007JAKARTA61051295062210117${orderId}6304C92A`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrPayload)}&bgcolor=14-17-23&color=212-255-0`;

    return NextResponse.json({
      success: true,
      transactionId,
      orderId,
      amountDisplay: "Rp10.000",
      qrUrl,
      isSandbox,
      status: txData.status,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal membuat transaksi. Silakan coba lagi.", details: error.message },
      { status: 500 }
    );
  }
}
