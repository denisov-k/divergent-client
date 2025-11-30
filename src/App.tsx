import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/protected-route'

import Layout from '@/layout/'
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';

import SignInView from '@/views/auth/sign-in'
import SignUpView from '@/views/auth/sign-up'
import ResetPasswordView from '@/views/auth/reset'

import FrensView from '@/views/frens'
import GoalsView from '@/views/goals'
import SettingsView from '@/views/settings/'
import RewardsView from '@/views/rewards'
import RemindersView from '@/views/reminders'
import ProgressView from '@/views/progress'

import {useAppStore} from "@/stores/useAppStore.ts";
import {useEffect} from "react";

function AppRoot() {

  const {initialize} = useAppStore();


  useEffect(() => {
    initialize();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInView />} />
        <Route path="/signup" element={<SignUpView />} />
        <Route path="/reset" element={<ResetPasswordView />} />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Layout header={<Header></Header>} footer={<Footer></Footer>}>
                <ProgressView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/frens"
          element={
            <ProtectedRoute>
              <Layout header={<Header></Header>} footer={<Footer></Footer>}>
                <FrensView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout header={<Header></Header>} footer={<Footer></Footer>}>
                <GoalsView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout header={<Header></Header>} footer={<Footer></Footer>}>
                <SettingsView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <Layout header={<Header></Header>} footer={<Footer></Footer>}>
                <RewardsView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Layout header={<Header></Header>} footer={<Footer></Footer>}>
                <RemindersView />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default AppRoot
