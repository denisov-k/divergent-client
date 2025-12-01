import { useAppStore } from '@/stores/useAppStore';

import './index.css';
import LanguageSwitcher from "./LanguageSwitcher";
import {useTranslation} from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();

  const { signOut, user } = useAppStore();

  return (
    <div id='profile'>
      <div className='user-info'>
        <div>
          <label>{ t('profile.id') }</label>
          <input defaultValue={user?.id} readOnly/>
        </div>
        <div>
          <label>{ t('profile.role') }</label>
          <input defaultValue={user?.role} readOnly/>
        </div>
        <LanguageSwitcher></LanguageSwitcher>
      </div>
      <div className='button' onClick={signOut}>
        { t('profile.sign_out') }
      </div>
    </div>
  );
}
