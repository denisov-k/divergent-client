import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";

export default function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Если есть параметр challengeId, редирект на челлендж
    const startapp = WebApp.initDataUnsafe?.start_param;

    if (startapp?.startsWith("challenge-")) {
      const challengeId = startapp.replace("challenge-", "");
      navigate(`/challenges?challengeId=${challengeId}`, { replace: true });
    } else {
      // Иначе на главную / GoalsView
      navigate(`/`, { replace: true });
    }
  }, [navigate]);

  return null; // ничего не рендерим
}
