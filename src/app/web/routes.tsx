import { Suspense, lazy, type ReactNode } from "react";
import { Route } from "react-router-dom";

import { ProtectedRoute } from "@/components/protected-route";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import Layout from "@/layout";

const ResetPasswordView = lazy(() => import("@/views/auth/reset"));
const SignInView = lazy(() => import("@/views/auth/sign-in"));
const SignUpView = lazy(() => import("@/views/auth/sign-up"));
const ChallengesView = lazy(() => import("@/views/web/challenges"));
const FrensView = lazy(() => import("@/views/web/frens"));
const GoalsView = lazy(() => import("@/views/web/goals"));
const IndexView = lazy(() => import("@/views/web/index"));
const ProgressView = lazy(() => import("@/views/web/progress"));
const RemindersView = lazy(() => import("@/views/web/reminders"));
const RewardsView = lazy(() => import("@/views/web/rewards"));
const SettingsView = lazy(() => import("@/views/web/settings"));

function RouteFallback() {
  return <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">Loading...</div>;
}

function withSuspense(component: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{component}</Suspense>;
}

function renderProtectedWeb(component: ReactNode) {
  return (
    <ProtectedRoute>
      <Layout header={<Header />} footer={<Footer />}>
        {withSuspense(component)}
      </Layout>
    </ProtectedRoute>
  );
}

export function renderAuthRoutes() {
  return (
    <>
      <Route path="/signin" element={withSuspense(<SignInView />)} />
      <Route path="/signup" element={withSuspense(<SignUpView />)} />
      <Route path="/reset" element={withSuspense(<ResetPasswordView />)} />
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
