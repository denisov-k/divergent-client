import Config from "@/services/Config";
import { useState, useEffect } from 'react';
import './index.css';
import {THEME, TonConnectUI, ConnectedWallet } from "@tonconnect/ui";
import { useAuth } from "@/hooks/use-auth";

import ServiceTransport from '@/services/Transport'
import {ReactSVG} from "react-svg";

import TonIcon from "@/assets/images/wallet/ton.svg";
import {useTranslation} from "react-i18next";
import {ShadowContainer} from "@/ui/shadow-container";

async function onConnectWalletClick(tonConnect: TonConnectUI | undefined) {
  if (!tonConnect)
    return;

  await tonConnect.openModal();
}

async function onSendTransactionClick(depositValue: number, depositWallet: string, tonConnect: TonConnectUI | undefined) {
  if (!tonConnect)
    return;

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
    messages: [
      {
        address: depositWallet,
        amount: `${1000000000 * depositValue}`
      }
    ]
  }

  try {
    const result = await tonConnect.sendTransaction(transaction);
    console.log(result);
  } catch (e) {
    console.error(e);
  }

}

function tcRootFix() {
  const defineCustomElement = CustomElementRegistry.prototype.define;
  CustomElementRegistry.prototype.define = function define(name, constructor, options) {
    if (name == 'tc-root') {
      return;
    }
    return defineCustomElement.call(this, name, constructor, options);
  };
}

export function DepositForm() {
  const { t } = useTranslation();

  const [tonConnect, setTonConnect] = useState<TonConnectUI>();
  const [wallet, setWallet] = useState<unknown>();
  const [depositWallet, setDepositWallet] = useState<string>("");
  const [depositValue, setDepositValue] = useState(0.01);
  const { user } = useAuth();

  const tonConnectConfig = {
    manifestUrl: Config.data?.api.ton.manifestURL,
    twaReturnUrl: Config.data?.api.telegram.twaURL,
    /*actionsConfiguration: {
      returnStrategy: 'none'
    },*/
    uiPreferences: {
      theme: THEME.DARK
    },
    widgetRootId: 'deposit-form'
    // buttonRootId: 'button'
  };

  useEffect(() => {
    tcRootFix();
  }, []);

  useEffect(() => {
    if (wallet && !user?.wallet) {
      localStorage.clear();
    }
  }, []);

  useEffect(() => {
    const transport = new ServiceTransport();

    transport.request('/transactions/deposit', {}, "post").then(response => {
      setDepositWallet(response.data.wallet);
    }).catch(error => {
      console.error('Failed to get wallet for deposit:', error)
    })
  }, []);

  useEffect(() => {
    const connect = new TonConnectUI(tonConnectConfig);

    if (!user?.wallet)
      console.log(connect.connector.connected ? 'Wallet is already connected': 'Wallet is not connected');

    connect.onStatusChange(async (status: ConnectedWallet | null) => {
      console.log(status);

      if (!status?.account)
        return;

      const transport = new ServiceTransport();

      try {
        await transport.request('/transactions/connect_wallet', status.account, "post")
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        await connect.connector.disconnect();
      }
    });

    connect.onSingleWalletModalStateChange(() => {
      setWallet(connect.wallet)
    });

    setTonConnect(connect);

  }, [])

  return (
    <ShadowContainer>
      <div id="deposit-form" className="form">
        <div className="method">
          <ReactSVG src={TonIcon} className="icon" />
          <span className="title">TON</span>
        </div>
        {user?.wallet && wallet ? (
          <div className="inputs">
            <input
              className="dollar"
              type="number" min="0.01" max="1000000"
              placeholder="Number of coins"
              defaultValue={depositValue}
              onChange={(e) => setDepositValue(Number(e.target.value))}
            />
            <div className="button"
              onClick={() => onSendTransactionClick(depositValue, depositWallet, tonConnect)}
            >
              { t('wallet.deposit.deposit') }
            </div>
          </div>
        ) : (
          <div className="inputs">
            <div className="button"
              onClick={() => onConnectWalletClick(tonConnect)}
            >
              { t('wallet.deposit.connect_wallet') }
            </div>
          </div>
        )}
      </div>
    </ShadowContainer>
);
}
