import {useNavigate, useLocation} from "react-router-dom";
import { ReactSVG } from 'react-svg';
import './index.css';

import goalIcon from '@/assets/images/navigation/goal.svg';
import frensIcon from '@/assets/images/navigation/frens.svg';
import rewardIcon from '@/assets/images/navigation/reward.svg';
import progressIcon from '@/assets/images/navigation/progress.svg';
import {useTranslation} from "react-i18next";


const Navigation = () => {
  const { t } = useTranslation();

  const navigate = useNavigate()
  const location = useLocation();
  const { pathname } = location;

  const routes = [
    { path: '/', title: t('navigation.progress'), icon: progressIcon },
    { path: '/goals', title: t('navigation.goals'), icon: goalIcon, iconClass: 'stroke' },
    { path: '/rewards', title: t('navigation.rewards'), icon: rewardIcon },
    { path: '/frens', title: t('navigation.frens'), icon: frensIcon },
  ]

  const onClick = (path: string) => {
    //Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    navigate(path);
  }

  return (
    <div id="navigation">
      {routes.map(route => (
        <div key={route.path}
             onClick={() => onClick(route.path)}
             className={pathname === route.path ? 'selected' : ''}>
          { route.icon &&
            <ReactSVG src={route.icon} className={route.iconClass} />
          }
          <span>{route.title}</span>
        </div>
      ))}
    </div>
  );
}

export default Navigation;
