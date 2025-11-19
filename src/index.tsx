import ReactDOM from 'react-dom/client';
import AppRoot from './App.tsx';
import WebApp from '@twa-dev/sdk';
import './index.css';
import Config from './services/Config';
import './i18n';

import { AuthProvider } from '@/hooks/use-auth';

WebApp.ready();

console.log(WebApp)
if (WebApp.version !== '6.0') {
  WebApp.requestFullscreen();
  WebApp.disableVerticalSwipes();
  WebApp.setBackgroundColor("#0d0d10");
}

Config.init().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  );
});
