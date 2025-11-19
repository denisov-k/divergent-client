import './index.css';
import {ReactSVG} from "react-svg";

import logoIcon from "@/assets/images/games/logo.svg"


export default function Index() {
  return (

    <div id='home-view'>
      <div className="greetings">
        <div className="logo">
          <ReactSVG
            src={logoIcon}
            className="icon"
          />
          <span className="title">Divergent</span>
        </div>
      </div>
    </div>
  )
}
