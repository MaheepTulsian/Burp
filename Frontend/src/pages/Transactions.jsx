import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API_BASE = 'https://burp.contactsushil.me';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('burp_auth_token');
        const resp = await fetch(`${API_BASE}/api/transactions/user`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (!resp.ok) throw new Error(`Failed to load transactions: ${resp.status}`);
        const payload = await resp.json();
        setTransactions(payload.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading transactions...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-4">Transaction History</motion.h1>

        {transactions.length === 0 ? (
          <div className="p-8 bg-muted rounded-2xl text-center">
            <p className="text-muted-foreground">No transactions found. Your purchases will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map(tx => (
              <div key={tx._id} className="p-4 bg-card rounded-lg border border-card-border flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">{new Date(tx.createdAt).toLocaleString()}</div>
                  <div className="font-medium text-foreground">{tx.type || 'purchase'} — {tx.amount} PYUSD</div>
                  <div className="text-xs text-muted-foreground">Cluster: {tx.clusterId || tx.basketId || '—'}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${tx.status === 'success' ? 'text-green-600' : tx.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{tx.status}</div>
                  {tx.transactionHash && (
                    <div className="text-xs text-muted-foreground">Tx: {tx.transactionHash}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
