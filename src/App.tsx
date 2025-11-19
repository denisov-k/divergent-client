import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/protected-route'

import Layout from '@/layout/'
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';

import SignInView from '@/views/auth/sign-in'
import SignUpView from '@/views/auth/sign-up'
import ResetPasswordView from '@/views/auth/reset'
import HomeView from '@/views/home/'
import FrensView from '@/views/frens'
import PromoView from '@/views/promo'
import ProfileView from '@/views/profile/'
import RewardsView from '@/views/rewards/'
import {useEffect} from "react";

function AppRoot() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    setInterval(checkAuth, 5000);
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInView />} />
        <Route path="/signup" element={<SignUpView />} />
        <Route path="/reset" element={<ResetPasswordView />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout header={<Header></Header>} footer={<Footer></Footer>}>
                <HomeView />
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
          path="/goals"
          element={
            <ProtectedRoute>
              <Layout header={<Header></Header>} footer={<Footer></Footer>}>
                <PromoView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout header={<Header></Header>} footer={<Footer></Footer>}>
                <ProfileView />
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
      </Routes>
    </Router>
  )
}

export default AppRoot
