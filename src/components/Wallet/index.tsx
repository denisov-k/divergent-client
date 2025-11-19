import { useTranslation } from 'react-i18next';

import './index.css';

import depositIcon from '@/assets/images/wallet/deposit.svg';
import transferIcon from '@/assets/images/wallet/send.svg';
import withdrawIcon from '@/assets/images/wallet/withdraw.svg';
import historyIcon from '@/assets/images/wallet/history.svg';

import {TransactionsHistory} from "@/components/Wallet/TransactionsHistory/";
import {DepositForm} from "@/components/Wallet/DepositForm/";
import {WithdrawForm} from "@/components/Wallet/WithdrawForm/";
import {TransferForm} from "@/components/Wallet/TransferForm/";
import {Tabs} from "@/ui/tabs";

const Wallet = () => {
  const { t } = useTranslation();

  const routes = [
    {
      title: t('wallet.navigation.deposit'),
      content: <DepositForm />,
      icon: depositIcon,
      isAvailable: true,
    },
    {
      title: t('wallet.navigation.withdraw'),
      content: <WithdrawForm />,
      icon: withdrawIcon,
      isAvailable: true,
    },
    {
      title: t('wallet.navigation.transfer'),
      content: <TransferForm />,
      icon: transferIcon,
      isAvailable: true,
    },
    {
      title: t('wallet.navigation.history'),
      content: <TransactionsHistory />,
      icon: historyIcon,
      isAvailable: true,
    },
  ]

  return (
    <div id="wallet">
      <Tabs items={routes} defaultIndex={0} />
    </div>
  );
}

export default Wallet;
