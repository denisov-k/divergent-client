import { FC, useMemo, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';

import copyIcon from '@/assets/images/referrals/copy.svg';
import telegramIcon from '@/assets/images/referrals/share.svg';

import Config from "@/services/Config.ts";

import './index.css';
import {ShadowContainer} from "@/ui/shadow-container";

interface InviteClipboardProps {
  id?: number;
}

export const InviteFriends: FC<InviteClipboardProps> = () => {
  const { t } = useTranslation();
  const { user } = useAuth();


  const [copied, setCopied] = useState(false);
  const baseUrl = Config.data?.api.telegram.twaURL;
  const referralUrl = useMemo(() => `${baseUrl}?startapp=${user?.id}`, [baseUrl, user?.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };
  const handleShare = () => {
    const text = "";
    // @ts-ignore
    Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=' + referralUrl + '&text=' + text);
  };

  return (
    <ShadowContainer>
      <div id="invite-friends">
        <p>{ t('frens.invite_friends.description') }</p>
        <div onClick={handleCopy}>
          <input readOnly value={referralUrl} />
        </div>
        <div className="actions">
          <div onClick={handleShare} className='button share'>
            <ReactSVG src={telegramIcon} className="icon" />
            <span>{ t('frens.invite_friends.share') }</span>
          </div>
          <div onClick={handleCopy} className='button copy'>
            <ReactSVG src={copyIcon} className="icon" />
            <span>{ copied ? t('frens.invite_friends.copied') : t('frens.invite_friends.copy') }</span>
          </div>
        </div>
      </div>
    </ShadowContainer>
  );
};
