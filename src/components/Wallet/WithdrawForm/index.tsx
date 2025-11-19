import { useState } from 'react';
import { useAuth } from "@/hooks/use-auth"
import './index.css';

import ServiceTransport from '@/services/Transport'
import {useTranslation} from "react-i18next";
import {ShadowContainer} from "@/ui/shadow-container";
import {ReactSVG} from "react-svg";
import TonIcon from "@/assets/images/wallet/ton.svg";

async function onWithdrawClick(withdrawValue: number) {
  const transport = new ServiceTransport();

  try {
    const response = await transport.request('/transactions/withdraw', { value: withdrawValue },  "post")
    console.log(response.data)
  } catch (error) {
    console.error('Failed to withdraw:', error)
  }
}

export function WithdrawForm() {
  const { t } = useTranslation();

  const { user } = useAuth();
  const [withdrawValue, setWithdrawValue] = useState(0.01);

  return (
    <ShadowContainer>
      <div id="withdraw-form" className="form">
        <div className="method">
          <ReactSVG src={TonIcon} className="icon"/>
          <span className="title">TON</span>
        </div>
        <input
          className="dollar"
          type="number" min="0.01" max={user?.balance} step="0.01"
          placeholder="Number of coins"
          defaultValue={withdrawValue}
          onChange={(e) => setWithdrawValue(Number(e.target.value))}
        />
        <div className="button"
             onClick={() => onWithdrawClick(withdrawValue)}
        >
          {t('wallet.withdraw.withdraw')}
        </div>
      </div>
    </ShadowContainer>
  );
}
