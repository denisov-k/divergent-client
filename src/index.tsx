// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoot from './App.tsx';
import WebApp from '@twa-dev/sdk';
import './index.css';
import Config from './services/Config';
import './i18n';

// Инициализация WebApp
WebApp.ready();

if (WebApp.version !== '6.0') {
  WebApp.requestFullscreen();
  WebApp.disableVerticalSwipes();
  WebApp.setBackgroundColor('#0d0d10');
}

// Инициализация конфигурации приложения
Config.init().then(() => {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AppRoot />
    </React.StrictMode>
  );
});
