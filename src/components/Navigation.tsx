import { useLocation, useNavigate, To } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BarChart2, Bell, Gift, Swords, Target } from "lucide-react";

const Navigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const routes = [
    { path: "/goals", title: t("navigation.goals"), icon: Target },
    { path: "/challenges", title: t("navigation.challenges"), icon: Swords },
    { path: "/rewards", title: t("navigation.rewards"), icon: Gift },
    { path: "/progress", title: t("navigation.progress"), icon: BarChart2 },
    { path: "/reminders", title: t("navigation.reminders"), icon: Bell },
  ];

  const onClick = (path: To) => {
    navigate(path);
  };

  return (
    <div
      className="
      flex w-full
      h-[45px] text-[8px] font-extrabold uppercase
      text-primary my-2
    "
    >
      {routes.map((route) => {
        const isActive = pathname === route.path;
        const Icon = route.icon;

        return (
          <div
            key={route.path}
            onClick={() => onClick(route.path)}
            className={`
              cursor-pointer flex flex-col items-center justify-center 
              flex-1 min-w-0 mx-1 rounded-lg border-2 px-2
              transition
              ${
                isActive
                  ? "bg-primary text-background border-primary"
                  : "border-primary text-primary"
              }
            `}
          >
            <Icon
              className={`
                h-[17px] aspect-square
                ${isActive ? "text-background" : "text-primary"}
              `}
              strokeWidth={2.5}
            />

            <span className="text-center whitespace-normal break-all leading-none mt-0.5">
              {route.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Navigation;
