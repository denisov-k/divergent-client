import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useAppBootstrap } from "@/app/useAppBootstrap";
import NativePreviewPage from "@/app/web/NativePreviewPage";
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

function renderProtected(component: React.ReactNode) {
  return (
    <ProtectedRoute>
      <Layout header={<Header />} footer={<Footer />}>
        {component}
      </Layout>
    </ProtectedRoute>
  );
}

function renderProtectedNativePreview(component: React.ReactNode) {
  return <ProtectedRoute>{component}</ProtectedRoute>;
}

export default function WebAppRoot() {
  useAppBootstrap();

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
        <Route path="/native" element={renderProtectedNativePreview(<NativePreviewPage />)} />
      </Routes>
    </Router>
  );
}
