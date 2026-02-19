import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { useAppStore } from "@/stores/useAppStore";
import {Loader2} from "lucide-react";

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading, login, initialize } = useAppStore();

  const redirect = searchParams.get("redirect");
  const isTelegramClient = !!WebApp;

  useEffect(() => {
    if (loading) return;
    if (user) {
      if (redirect) window.location.replace(redirect);
      else navigate("/");
    }
  }, [user, loading, navigate, redirect]);

  useEffect(() => {
    if (isTelegramClient && !user) {
      const autoLogin = async () => {
        try {
          const data = WebApp.initData;
          await login(data);
          await initialize();
        } catch (err) {
          console.error("Telegram auto-auth failed", err);
        }
      };
      autoLogin();
    }
  }, [isTelegramClient, user, login, initialize]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {loading ? <Loader2 className="h-12 w-12 animate-spin text-primary" /> : "Error" }
    </div>
  );
}
