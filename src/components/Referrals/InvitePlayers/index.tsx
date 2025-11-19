import { FC } from 'react';

import { CreateLink } from '../CreateLink';

import './index.css';
import {useTranslation} from "react-i18next";
import {ShadowContainer} from "@/ui/shadow-container";
import {Links} from "@/components/Referrals/Links";

type InviteAgentsType = object

export const InvitePlayers: FC<InviteAgentsType> = () => {
  const { t } = useTranslation();

  return (
    <>
      <ShadowContainer>
        <div id="invite-players">
          <p>{ t('frens.invite_players.description') }</p>

          <CreateLink isAgent={false}></CreateLink>
        </div>
      </ShadowContainer>
      <ShadowContainer>
        <Links isSuperAgent={false}></Links>
      </ShadowContainer>
    </>
  );
};
