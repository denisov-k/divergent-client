import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";

export default function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Если есть параметр challengeId, редирект на челендж
    const startapp = WebApp.initDataUnsafe?.start_param;

    console.log(startapp);

    if (startapp?.startsWith("challenge-")) {
      const challengeId = startapp.replace("challenge-", "");
      navigate(`/challenges?challengeId=${challengeId}`, { replace: true });
    } else {
      // Иначе на главную / GoalsView
      navigate(`/goals`, { replace: true });
    }
  }, [navigate]);

  return null; // ничего не рендерим
}
