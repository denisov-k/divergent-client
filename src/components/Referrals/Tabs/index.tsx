import { Tabs, TabItem } from '@//ui/tabs/';

import { InviteFriends } from '../InviteFriends';
import { InviteStats } from '../Rewards';

import {useTranslation} from "react-i18next";

export default function RefTabs() {
  const { t } = useTranslation();


  const tabs: TabItem[] = [
    {
      title: t('frens.navigation.progress'),
      content: <InviteStats />,
      isAvailable: true,
    },
    {
      title: t('frens.navigation.invite_friends'),
      content: <InviteFriends />,
      icon: '',
      isAvailable: true
    },
  ];

  return (
    <Tabs items={tabs} defaultIndex={0} />
  );
}
