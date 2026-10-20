// Simple in-memory transaction store for demo & production staging

if (!globalThis._xxlTransactions) {
  globalThis._xxlTransactions = new Map();
}

export const transactions = globalThis._xxlTransactions;
