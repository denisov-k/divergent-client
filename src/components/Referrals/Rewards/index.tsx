import {FC, useMemo, useState, useEffect} from 'react';

import './index.css';

import {useTranslation} from "react-i18next";
import ServiceTransport from "@/services/Transport.ts";
import {ShadowContainer} from "@/ui/shadow-container";

async function getFriends() {
  const transport = new ServiceTransport();

  try {
    return (await transport.request('/refs/referrals', {}, "get")).data;
  } catch (error) {
    console.error('Failed to get history:', error)
    return [];
  }
}

async function collectProfit() {
  const transport = new ServiceTransport();

  try {
    return (await transport.request('/refs/collect', {}, "post")).data;
  } catch (error) {
    console.error('Failed to get history:', error)
    return [];
  }
}

interface FriendRow {
  id: string | number;
  name: string;
  earnings: string;
}

export const InviteStats: FC = () => {
  const { t } = useTranslation();

  const uncollectedTotal = 0;
  const lastCollection = '-';

  const date = useMemo(() => new Date().toLocaleTimeString(), []);

  const [friendsList, setFriendsList] = useState<FriendRow[]>([]);

  useEffect(() => {
    getFriends().then((list: FriendRow[]) => {
      setFriendsList(list);
    })
  }, []);

  const handleCollect = async () => {
    await collectProfit();
  }

  // const [isLoading, setLoadingTable] = useState(false);

  return (
    <ShadowContainer>
      <div id="frens-collecting">
        <div className="table">
          <div className="header row">
            <div>{ t('frens.rewards.id') }</div>
            <div>{ t('frens.rewards.name') }</div>
            <div>{ t('frens.rewards.earnings') }</div>
          </div>
          {
            friendsList.length && friendsList.map((friend: FriendRow, index: number) => (
            <div className="row" key={index}>
              <div>{friend.id}</div>
              <div>{friend.name}</div>
              <div>{friend.earnings}</div>
            </div>
            )) || <span className="empty">{ t('frens.rewards.empty') }</span>
          }
        </div>
        <div className='captions'>
          <span className='updated'>{ t('frens.rewards.date') } {date}</span>
          <span className='last-collection'>{ t('frens.rewards.last_collect') } {lastCollection}</span>
          <span className='total'>{ t('frens.rewards.total') } ${uncollectedTotal.toFixed(2)}</span>
        </div>
        <div className='button' onClick={handleCollect}>
          <span>{ t('frens.rewards.collect') }</span>
        </div>
      </div>
    </ShadowContainer>
  );
};

export default InviteStats;
