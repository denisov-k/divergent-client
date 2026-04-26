import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/goals", { replace: true });
  }, [navigate]);

  return null;
}
