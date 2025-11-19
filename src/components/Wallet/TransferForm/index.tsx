import { useState } from 'react';
import { useAuth } from "@/hooks/use-auth"
import './index.css';

import ServiceTransport from '@/services/Transport'
import {useTranslation} from "react-i18next";
import {ShadowContainer} from "@/ui/shadow-container";

async function onTransferClick(transferValue: number, target: number) {
  const transport = new ServiceTransport();

  try {
    const response = await transport.request('/transactions/transfer', { value: transferValue, target }, "post")
    console.log(response.data)
  } catch (error) {
    console.error('Failed to check auth status:', error)
  }
}

export function TransferForm() {
  const { t } = useTranslation();

  const { user } = useAuth();
  const [transferValue, setTransferValue] = useState(0.01);
  const [target, setTarget] = useState(1);

  return (
    <ShadowContainer>
      <div id="transfer-form" className="form">
        <input
          type="number"
          placeholder="User id"
          onChange={(e) => setTarget(Number(e.target.value))}
        />
        <input
          className="dollar"
          type="number" min="0.01" max={user?.balance} step="0.01"
          placeholder="Number of coins"
          defaultValue={transferValue}
          onChange={(e) => setTransferValue(Number(e.target.value))}
        />
        <div className="button"
             onClick={() => onTransferClick(transferValue, target)}
        >
          { t('wallet.transfer.transfer') }
        </div>
      </div>
    </ShadowContainer>
  );
}
