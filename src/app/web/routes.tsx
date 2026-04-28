import type { ReactNode } from "react";
import { Route } from "react-router-dom";

import { ProtectedRoute } from "@/components/protected-route";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import Layout from "@/layout";
import ResetPasswordView from "@/views/auth/reset";
import SignInView from "@/views/auth/sign-in";
import SignUpView from "@/views/auth/sign-up";
import ChallengesView from "@/views/web/challenges";
import FrensView from "@/views/web/frens";
import GoalsView from "@/views/web/goals";
import IndexView from "@/views/web/index";
import ProgressView from "@/views/web/progress";
import RemindersView from "@/views/web/reminders";
import RewardsView from "@/views/web/rewards";
import SettingsView from "@/views/web/settings";
import NativePreviewPage from "@/app/web/NativePreviewPage";

function renderProtectedWeb(component: ReactNode) {
  return (
    <ProtectedRoute>
      <Layout header={<Header />} footer={<Footer />}>
        {component}
      </Layout>
    </ProtectedRoute>
  );
}

function renderProtectedNativePreview(component: ReactNode) {
  return <ProtectedRoute>{component}</ProtectedRoute>;
}

export function renderAuthRoutes() {
  return (
    <>
      <Route path="/signin" element={<SignInView />} />
      <Route path="/signup" element={<SignUpView />} />
      <Route path="/reset" element={<ResetPasswordView />} />
    </>
  );
}

export function renderProductWebRoutes() {
  return (
    <>
      <Route path="/" element={renderProtectedWeb(<IndexView />)} />
      <Route path="/frens" element={renderProtectedWeb(<FrensView />)} />
      <Route path="/goals" element={renderProtectedWeb(<GoalsView />)} />
      <Route path="/challenges" element={renderProtectedWeb(<ChallengesView />)} />
      <Route path="/settings" element={renderProtectedWeb(<SettingsView />)} />
      <Route path="/rewards" element={renderProtectedWeb(<RewardsView />)} />
      <Route path="/reminders" element={renderProtectedWeb(<RemindersView />)} />
      <Route path="/progress" element={renderProtectedWeb(<ProgressView />)} />
    </>
  );
}

export function renderNativePreviewRoutes() {
  return <Route path="/native" element={renderProtectedNativePreview(<NativePreviewPage />)} />;
}
