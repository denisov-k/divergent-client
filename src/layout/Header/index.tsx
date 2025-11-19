import './index.css';
import Avatar from "@/components/Avatar";
import {ReactSVG} from "react-svg";
import { useState } from 'react';

import Arrow from '@/assets/images/arrow.svg';

const Index = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggle = async () => {
	setIsCollapsed(!isCollapsed);
  }

  return (
    <div id="header" className={isCollapsed ? "collapsed" : ""}>
		<div className="header-inner">
		  <Avatar></Avatar>
		</div>
	  <div className="toggle" onClick={toggle}>
			<ReactSVG src={Arrow}></ReactSVG>
	  </div>
    </div>
  );
}

export default Index;
