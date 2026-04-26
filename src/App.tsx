// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/protected-route';

import Layout from '@/layout';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';

import SignInView from '@/views/auth/sign-in';
import SignUpView from '@/views/auth/sign-up';
import ResetPasswordView from '@/views/auth/reset';

import IndexView from '@/views/index';
import FrensView from '@/views/frens';
import GoalsView from '@/views/goals-screen';
import ChallengesView from '@/views/challenges';
import SettingsView from '@/views/settings';
import RewardsView from '@/views/rewards';
import RemindersView from '@/views/reminders-screen';
import ProgressView from '@/views/progress';

import { useAppStore } from '@/stores/useAppStore';
import i18n from './i18n';

function AppRoot() {
  const { initialize, initialized, loading, user } = useAppStore();

  // Установка языка при смене пользователя
  useEffect(() => {
    if (user?.language) {
      i18n.changeLanguage(user.language);
    }
  }, [user?.language]);

  // Инициализация приложения
  useEffect(() => {
    if (!initialized && !loading) {
      initialize();
    }
  }, [initialized, loading]);

  const renderProtected = (component: React.ReactNode) => (
    <ProtectedRoute>
      <Layout header={<Header />} footer={<Footer />}>
        {component}
      </Layout>
    </ProtectedRoute>
  );

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInView />} />
        <Route path="/signup" element={<SignUpView />} />
        <Route path="/reset" element={<ResetPasswordView />} />

        <Route path="/" element={renderProtected(<IndexView />)} />
        <Route path="/frens" element={renderProtected(<FrensView />)} />
        <Route path="/goals" element={renderProtected(<GoalsView />)} />
        <Route path="/challenges" element={renderProtected(<ChallengesView />)} />
        <Route path="/settings" element={renderProtected(<SettingsView />)} />
        <Route path="/rewards" element={renderProtected(<RewardsView />)} />
        <Route path="/reminders" element={renderProtected(<RemindersView />)} />
        <Route path="/progress" element={renderProtected(<ProgressView />)} />
      </Routes>
    </Router>
  );
}

export default AppRoot;
