import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';

import { useAppStore } from '@/stores/useAppStore';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import TimezoneSelector from "@/components/TimezoneSelector.tsx";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Settings() {
  const { t } = useTranslation();
  const { signOut, setCredentials, user } = useAppStore();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasPassword = Boolean(user?.hasPassword);
  const credentialsTitle = useMemo(
    () => (hasPassword ? t('settings.credentials_change_title') : t('settings.credentials_add_title')),
    [hasPassword]
  );

  if (!user) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleCredentialsSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setError('Email is required.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (hasPassword && !formData.currentPassword) {
      setError('Current password is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      await setCredentials(formData.password, formData.email.trim(), formData.currentPassword || undefined);
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        password: '',
        confirmPassword: '',
      }));
      setSuccess(hasPassword ? 'Password updated.' : 'Email and password added to your account.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update credentials.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4 py-2">
      <Card className="border-border/80 bg-card/95">
        <CardHeader>
          <CardTitle>{t('settings.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">{t('settings.id')}</label>
              <Input className="mt-1 bg-gray-50" value={user.id} readOnly />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">{t('settings.role')}</label>
              <Input className="mt-1 bg-gray-50" value={user.role || 'user'} readOnly />
            </div>
          </div>
          <LanguageSwitcher />
          <TimezoneSelector />
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card/95">
        <CardHeader>
          <CardTitle>{credentialsTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="h-11"
              />
            </div>

            {hasPassword && (
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
                  {t('common.current_password')}
                </label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder={t('common.current_password')}
                  className="h-11"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                  {hasPassword ? t('common.new_password') : t('common.password')}
                </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                  placeholder={hasPassword ? t('auth.new_password_placeholder') : t('auth.password_create_placeholder')}
                  className="h-11"
                />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                {t('common.confirm_password')}
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                  placeholder={t('auth.confirm_password_placeholder')}
                  className="h-11"
                />
            </div>

            {error && (
              <p className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
                {success}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : hasPassword ? 'Update password' : 'Save credentials'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={signOut} variant="destructive">
          {t('settings.sign_out')}
        </Button>
      </div>
    </div>
  );
}
