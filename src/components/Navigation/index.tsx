import {useNavigate, useLocation, To} from "react-router-dom";
import { ReactSVG } from "react-svg";
import { useTranslation } from "react-i18next";

import goalIcon from "@/assets/images/navigation/goal.svg";
import frensIcon from "@/assets/images/navigation/frens.svg";
import rewardIcon from "@/assets/images/navigation/reward.svg";
import progressIcon from "@/assets/images/navigation/progress.svg";
import reminderIcon from "@/assets/images/navigation/reminder.svg";

const Navigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const routes = [
    { path: "/", title: t("navigation.goals"), icon: goalIcon, iconClass: "stroke" },
    { path: "/rewards", title: t("navigation.rewards"), icon: rewardIcon },
    { path: "/progress", title: t("navigation.progress"), icon: progressIcon },
    { path: "/reminders", title: t("navigation.reminders"), icon: reminderIcon },
    { path: "/frens", title: t("navigation.frens"), icon: frensIcon },
  ];

  const onClick = (path: To) => {
    Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    navigate(path);
  };

  return (
    <div className="
      flex w-full justify-around
      h-[45px] text-[8px] font-extrabold uppercase
      text-primary my-2
    ">
      {routes.map(route => {
        const isActive = pathname === route.path;

        return (
          <div
            key={route.path}
            onClick={() => onClick(route.path)}
            className={`
              cursor-pointer flex flex-col items-center justify-center 
              flex-1 mx-1 rounded-lg border-2 
              transition
              ${isActive
              ? "bg-primary text-background border-primary"
              : "border-primary text-primary"
            }
            `}
          >
            {route.icon && (
              <ReactSVG
                src={route.icon}
                className={`
                  h-[17px] aspect-square flex items-center
                  ${route.iconClass === "stroke" ? "stroke-current" : "fill-current"}
                  ${isActive ? "text-background" : "text-primary"}
                `}
              />
            )}

            <span className='text-center'>{route.title}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Navigation;
