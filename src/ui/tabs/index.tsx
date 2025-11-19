import { FC, ReactNode, useState } from 'react';
import {ReactSVG} from "react-svg";

import './index.css';

export interface TabItem {
  title: string;
  content: ReactNode;
  icon?: string;
  isAvailable?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  onClick?: (index: number) => void;
}

const Tabs: FC<TabsProps> = ({ items, defaultIndex = 0, onClick }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);


  const handleTabClick = (index: number) => {
    // @ts-ignore
    // Telegram.WebApp.hapticFeedback.impactOccurred('light');

    setActiveIndex(index);
    if (onClick) {
      onClick(index);
    }
  };

  const tabs = items.filter(item => item.isAvailable === true);

  return (
    <div className="tabs-with-container">
      <div className="tabs">
        {tabs.map((tab, index) => (
          <div key={index}
               onClick={() => handleTabClick(index)}
               className={activeIndex === index ? 'selected' : ''}>
            {tab.icon &&
              <ReactSVG src={tab.icon}/>
            }
            <span>{tab.title}</span>
          </div>
        ))}
      </div>
      {tabs[activeIndex]?.content ? <div className='container'>
        <div className="inner">
          {tabs[activeIndex]?.content}
        </div>
      </div> : null}
    </div>
  );
};

export {Tabs};
