import { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { useAppStore } from "@/stores/useAppStore";

export function useSettingsScreen() {
  const { i18n } = useTranslation();
  const { signOut, setCredentials, updateUser, user } = useAppStore();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const hasPassword = Boolean(user?.hasPassword);
  const credentialsTitle = useMemo(
    () => (hasPassword ? "Change password" : "Add email and password"),
    [hasPassword]
  );
  const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const setField = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const submitCredentials = async () => {
    if (!formData.email.trim()) {
      setError("Email is required.");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (hasPassword && !formData.currentPassword) {
      setError("Current password is required.");
      return false;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      await setCredentials(formData.password, formData.email.trim(), formData.currentPassword || undefined);
      setFormData((prev) => ({
        ...prev,
        email: formData.email.trim(),
        currentPassword: "",
        password: "",
        confirmPassword: "",
      }));
      setSuccess(hasPassword ? "Password updated." : "Email and password added to your account.");
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update credentials.";
      setError(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeLanguage = async (language: string) => {
    try {
      setIsSavingProfile(true);
      await i18n.changeLanguage(language);
      await updateUser({ language });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const changeTimeZone = async (timeZone: string) => {
    try {
      setIsSavingProfile(true);
      await updateUser({ timeZone });
    } finally {
      setIsSavingProfile(false);
    }
  };

  return {
    user,
    formData,
    error,
    success,
    isSubmitting,
    isSavingProfile,
    hasPassword,
    credentialsTitle,
    deviceTimeZone,
    language: user?.language || i18n.language,
    timeZone: user?.timeZone || deviceTimeZone,
    setField,
    submitCredentials,
    changeLanguage,
    changeTimeZone,
    signOut,
  };
}
