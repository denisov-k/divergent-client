import { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { getSystemLanguage } from "@/shared/i18n/getSystemLanguage";
import { useAppStore } from "@/stores/useAppStore";

export function useSettingsScreen() {
  const { i18n, t } = useTranslation();
  const { signOut, deleteAccount, setCredentials, updateUser, user } = useAppStore();
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
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const hasPassword = Boolean(user?.hasPassword);
  const systemLanguage = getSystemLanguage();
  const credentialsTitle = useMemo(
    () => (hasPassword ? t("settings.credentials_change_title") : t("settings.credentials_add_title")),
    [hasPassword, t]
  );
  const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const setField = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const submitCredentials = async () => {
    if (!formData.email.trim()) {
      setError(t("settings.email_required"));
      return false;
    }

    if (formData.password.length < 8) {
      setError(t("settings.password_min"));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("settings.passwords_no_match"));
      return false;
    }

    if (hasPassword && !formData.currentPassword) {
      setError(t("settings.current_password_required"));
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
      setSuccess(hasPassword ? t("settings.password_updated") : t("settings.email_and_password_added"));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : t("settings.credentials_update_failed");
      setError(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeLanguage = async (language: string | null) => {
    try {
      setIsSavingProfile(true);
      await i18n.changeLanguage(language ?? systemLanguage);
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

  const removeAccount = async () => {
    try {
      setIsDeletingAccount(true);
      setError(null);
      setSuccess(null);
      await deleteAccount();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : t("settings.delete_account_failed");
      setError(message);
      return false;
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return {
    user,
    formData,
    error,
    success,
    isSubmitting,
    isSavingProfile,
    isDeletingAccount,
    hasPassword,
    credentialsTitle,
    deviceTimeZone,
    language: user?.language,
    timeZone: user?.timeZone || deviceTimeZone,
    setField,
    submitCredentials,
    changeLanguage,
    changeTimeZone,
    removeAccount,
    signOut,
  };
}
