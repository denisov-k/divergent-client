import {useEffect, useState} from 'react';
import './index.css';

import ServiceTransport from '@/services/Transport'
import {ReactSVG} from "react-svg";

import arrowLeftIcon from "@/assets/images/items/arrow-left.svg";
import arrowRightIcon from "@/assets/images/items/arrow-right.svg";

interface Item {
  name: string
  rarity: string
  createdAt: string
}

async function getItems() {

  const transport = new ServiceTransport();

  try {
    return (await transport.request('/items/list', {}, "get")).data;
  } catch (error) {
    console.error('Failed to get history:', error)
    return [];
  }
}

export function Items() {

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    getItems().then((list: Item[]) => {
      setItems(list);
    })
  }, []);

  return (
    <div className="items">
      <div className="grid">
       {[...Array(9)].map((_item: Item, index) =>
          (
            <div key={index} className="cell">
              {
                items[index] && (
                  <div className="item">
                    <div>{items[index].name}</div>
                    <div>{items[index].rarity}</div>
                    <div>{(new Date(items[index].createdAt)).toLocaleString()}</div>
                  </div>
                )
              }
            </div>
          )
        )}
      </div>
      <div className="navigator">
        <ReactSVG src={arrowLeftIcon} className="button" title="Предыдущая страница" />
        <ReactSVG src={arrowRightIcon} className="button" title="Следующая страница" />
      </div>
    </div>
  );
}
