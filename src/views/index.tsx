import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getTelegramStartParam } from "@/platform/telegram";

export default function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const startapp = getTelegramStartParam();

    if (startapp?.startsWith("challenge-")) {
      const challengeId = startapp.replace("challenge-", "");
      navigate(`/challenges?id=${challengeId}`, { replace: true });
    } else {
      navigate("/goals", { replace: true });
    }
  }, [navigate]);

  return null;
}
