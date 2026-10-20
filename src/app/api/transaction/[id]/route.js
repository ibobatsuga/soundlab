import { NextResponse } from 'next/server';
import { transactions } from '@/lib/transactionStore';

export async function GET(request, { params }) {
  const { id } = params;
  const tx = transactions.get(id);

  if (!tx) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
  }

  // If not sandbox, simulate payment approval after 8 seconds of polling if desired,
  // or stay pending until user clicks 'Simulate Instant Payment' in UI.
  return NextResponse.json({
    transactionId: tx.transactionId,
    orderId: tx.orderId,
    status: tx.status,
    queuePosition: tx.queuePosition,
    amountDisplay: tx.amountDisplay,
    isSandbox: tx.isSandbox,
  });
}

// Allow client to manually trigger payment simulation in sandbox/demo mode
export async function POST(request, { params }) {
  const { id } = params;
  const tx = transactions.get(id);

  if (!tx) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
  }

  tx.status = "PAID";
  tx.queuePosition = 0;
  transactions.set(id, tx);

  return NextResponse.json({
    success: true,
    message: "Pembayaran berhasil disimulasikan!",
    status: "PAID",
  });
}
