import {Items} from '@/components/Items/index.tsx';

import './index.css';
import {useTranslation} from "react-i18next";

export default function Index() {
  const { t } = useTranslation();

  return (
    <div id='items-view'>
      <span className="title">{ t('items.your_collection') }</span>
      <Items></Items>
    </div>
  );
}
