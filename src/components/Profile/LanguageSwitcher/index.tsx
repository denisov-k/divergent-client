import { useTranslation } from "react-i18next";
import {ChangeEvent, ChangeEventHandler} from "react";

import './index.css';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const loadedLanguages = Object.keys(i18n.services.resourceStore.data);
  const currentLanguage = i18n.language;

  const changeLanguage: ChangeEventHandler = (event: ChangeEvent) => {
    const target = event.target as HTMLTextAreaElement;
    const lng = target.value;

    i18n.changeLanguage(lng); // Changes the language dynamically
  };

  return (
    <div className="language-switcher">
      <label>{ t('profile.language') }</label>
      <select onChange={changeLanguage} defaultValue={currentLanguage}>
        {
          loadedLanguages.map((lang, index) => (
            <option value={lang} key={index}>{lang}</option>
          ))
        }
      </select>
    </div>
  );
};

export default LanguageSwitcher;
