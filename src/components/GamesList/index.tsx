import { useState, useEffect } from 'react';

import './index.css';
import {useNavigate} from "react-router-dom";

import Service from '@/services/Games.ts';

import crashIcon from '@/assets/images/games/crash.jpg';
import capsIcon from '@/assets/images/games/caps.png';
import ticTacToeIcon from '@/assets/images/games/tic-tac-toe.webp';
import auctionIcon from '@/assets/images/games/auction.webp';
import playIcon from "@/assets/images/games/play.svg";
import {ReactSVG} from "react-svg";

const gamesIcons = [
  crashIcon,
  auctionIcon,
  ticTacToeIcon,
  capsIcon
]


const GamesList = () => {
  const navigate = useNavigate();

  const [gamesList, setGamesList] = useState<any>([]);

  useEffect( () => {
    const fetchData = async () => {
      const list = await Service.getList();
      setGamesList(list);
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  const startGame = function (id: number) {
    navigate({ pathname: 'game', search: '?id=' + id });
  }

  return (
    <div id="games-list">
      {gamesList.map((game: any, index: number) => (
        <div className="item" key={index} onClick={() => startGame(game.id)}>
          <div className="preview">
            <img src={gamesIcons[index]}  alt={game.name}/>
          </div>
          <div className="captions">
            <span className="name">{game.name}</span>
            <span className="description">{game.description}</span>
          </div>
          <div className="button start">
            <ReactSVG
              src={playIcon}
              className="icon"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GamesList;
