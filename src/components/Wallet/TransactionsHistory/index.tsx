import {useEffect, useState} from 'react';
import './index.css';

import ServiceTransport from '@/services/Transport'
import {useTranslation} from "react-i18next";
import {ShadowContainer} from "@/ui/shadow-container";

interface Transaction {
  type: string
  amount: number
  reason: string
  createdAt: string
  executed_at: string
}

interface History {
  data: []
}

async function getHistory() {

  const transport = new ServiceTransport();

  try {
    return await transport.request('/transactions/history', {}, "get");
  } catch (error) {
    console.error('Failed to get history:', error)
    return [];
  }
}

export function TransactionsHistory() {
  const { t } = useTranslation();

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getHistory().then((history: History) => {
      setTransactions(history.data.reverse());
    })
  }, []);

  return (
    <ShadowContainer>
      <div id="transactions-list">

        <div className="row header">
          <div>{t('wallet.history.date')}</div>
          <div>{t('wallet.history.amount')}</div>
          <div>{t('wallet.history.reason')}</div>
          <div>{t('wallet.history.status')}</div>
        </div>
        {transactions.map((transaction: Transaction, index) => (
          <div key={index} className="row">
            <div>{(new Date(transaction.createdAt)).toLocaleString()}</div>
            <div>{transaction.type === 'increase' ? '+' : '-'}{transaction.amount}</div>
            <div>{transaction.reason}</div>
            <div>{transaction.executed_at ? "Completed" : "In processing" }</div>
          </div>
        ))}
      </div>
    </ShadowContainer>
  );
}
