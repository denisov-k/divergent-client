import { FC } from 'react';

import { CreateLink } from '../CreateLink';

import './index.css';
import {useTranslation} from "react-i18next";
import {ShadowContainer} from "@/ui/shadow-container";
import {Links} from "@/components/Referrals/Links";

type InviteAgentsType = object

export const InviteAgents: FC<InviteAgentsType> = () => {
  const { t } = useTranslation();

  return (
    <>
      <ShadowContainer>
        <div id="invite-agents">
          <p>{ t('frens.invite_agents.description') }</p>

          <CreateLink isAgent={true}></CreateLink>
        </div>
      </ShadowContainer>
      <ShadowContainer>
        <Links isSuperAgent={true}></Links>
      </ShadowContainer>
    </>
  );
};
