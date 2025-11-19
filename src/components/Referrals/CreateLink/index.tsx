import { useState, FC } from 'react';
import { RadioButton } from '@//ui/radiobutton/';

import './index.css';
import {useTranslation} from "react-i18next";
import ServiceTransport from "@/services/Transport.ts";

interface IInviteRakeback {
  isAgent?: boolean;
  onCreated?: () => void;
}

async function createLink(reusable: boolean, value: number, type: string) {
  const transport = new ServiceTransport();

  const params = {
    type,
    reusable,
    commission: type === 'agent' ? value : null,
    rakeback: type === 'player' ? value : null,
  }

  try {
    return (await transport.request('/refs/create', params, "post")).data;
  } catch (error) {
    console.error('Failed to create link:', error)
    return [];
  }
}

export const CreateLink: FC<IInviteRakeback> = ({ isAgent = false, onCreated }) => {
  const { t } = useTranslation();

  const [rakeback] = useState<number>(0);
  const [isReusable, setIsReusable] = useState<boolean>(false);
  const [agentCommission] = useState<number>(0);


  const handleRadioChange = (value: boolean) => {
    setIsReusable(value);
  };

  const handleCreate = async () => {
    try {
      await createLink(isReusable, isAgent ? agentCommission : rakeback, isAgent ? 'agent' : 'player');
      onCreated?.();
    } catch (e) {
      console.error('create link error', e);
    }
  };

  return (
    <div className="create-link">
      {!isAgent &&
        <>
          <div className="option">
            <label>{ t('frens.create_link.rakeback_limit') }</label>
            <input defaultValue={rakeback} readOnly/>
          </div>
          <div className="option">
            <label>{ t('frens.create_link.rakeback') }</label>
            <input defaultValue={rakeback}/>
          </div>
        </>
      }
      {isAgent &&
        <>
          <div className="option">
            <label>{ t('frens.create_link.commission_limit') }</label>
            <input defaultValue={50} readOnly/>
          </div>
          <div className="option">
            <label>{ t('frens.create_link.commission') }</label>
            <input defaultValue={agentCommission}/>
          </div>
        </>
      }

      {!isAgent && (
        <div className="link-type">
          <span className={`${!isReusable ? 'selected' : ''}`}>{ t('frens.create_link.onetime') }</span>
          <RadioButton value={isReusable} onClick={() => handleRadioChange(!isReusable)} />
          <span className={`${isReusable ? 'selected' : ''}`}>{ t('frens.create_link.reusable') }</span>
        </div>
      )}
      <div className='button' onClick={handleCreate}>
        { t('frens.create_link.create') }
      </div>
    </div>
  );
};
