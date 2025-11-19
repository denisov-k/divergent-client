import {FC, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import { ReactSVG } from 'react-svg';

import Config from "@/services/Config.ts";
import ServiceTransport from "@/services/Transport.ts";

import copyIcon from '@/assets/images/referrals/copy.svg';
import shareIcon from '@/assets/images/referrals/share.svg';
import deleteIcon from '@/assets/images/referrals/delete.svg';

import './index.css';

type LinksProps = {
  isSuperAgent: boolean;
}

interface LinkType {
  id: string;
  rakeback: number;
  commission: number;
  reusable: boolean;
  created_at: string;
}

async function getLinks(isSuperAgent: boolean) {
  const transport = new ServiceTransport();

  try {
    return (await transport.request('/refs/links', { type: isSuperAgent ? 'agent' : 'player' }, "get")).data;
  } catch (error) {
    console.error('Failed to get history:', error)
    return [];
  }
}

export const Links: FC<LinksProps> = ({ isSuperAgent }) => {
  const { t } = useTranslation();

  const baseUrl = Config.data?.api.telegram.twaURL;

  const [linksList, setLinksList] = useState<LinkType[]>([]);
  const [urlsList, setUrlsList] = useState<string[]>([]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Copied to clipboard!');
  };
  const handleShare = (url: string) => {
    const text = "";

    Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=' + url + '&text=' + text);
  };
  const handleDelete = (index: number)=> {
    const urlsResult = [...urlsList.slice(0, index), ...urlsList.slice(index + 1)];
    setUrlsList(urlsResult);

    const linksResult = [...linksList.slice(0, index), ...linksList.slice(index + 1)];
    setLinksList(linksResult);
  }

  const createUrl = (linkId: string) => {
    return `${baseUrl}?startapp=x${linkId}`;
  };

  useEffect(() => {
    getLinks(isSuperAgent).then((list: []) => {
      setLinksList(list);

      const urlsList = list.map((link: LinkType) => createUrl(link.id));
      setUrlsList(urlsList);
    })
  }, []);

  return (
    <div className="links-table">
      <div className="header row">
        <div>{ t('frens.links.created_at') }</div>
        { !isSuperAgent ? <div>{ t('frens.links.rakeback') }</div> : null }
        { isSuperAgent ? <div>{ t('frens.links.commission') }</div> : null }
        { !isSuperAgent ? <div>{ t('frens.links.reusable') }</div> : null }
        <div className="actions"></div>
      </div>
      {
        linksList.length && linksList.map((link: LinkType, index: number) => (
          <div className="row" key={index}>
            <div>
              { (new Date(link.created_at)).toLocaleString() }
            </div>
            { !isSuperAgent ? <div>{link.rakeback}</div> : null }
            { isSuperAgent ? <div>{link.commission}</div> : null }
            { !isSuperAgent ? <div>{link.reusable ? 'Да' : 'Нет'}</div> : null }
            <div className="actions">
              <ReactSVG className="action" src={deleteIcon} onClick={() => handleDelete(index)}></ReactSVG>
              <ReactSVG className="action" src={shareIcon} onClick={() => handleShare(urlsList[index])}></ReactSVG>
              <ReactSVG className="action" src={copyIcon} onClick={() => handleCopy(urlsList[index])}></ReactSVG>
            </div>
          </div>
        )) || <span className="empty">{ t('frens.links.empty') }</span>
      }
    </div>
  );
};
