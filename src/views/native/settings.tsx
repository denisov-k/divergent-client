import { ScrollView, View } from "react-native";

import { ScreenHeader } from "@/components/native/ScreenHeader";
import {
  CredentialsSection,
  handleSettingsSubmit,
  LanguageSection,
  ProfileSection,
  SignOutSection,
  TimeZoneSection,
} from "@/components/native/settings-screen/Sections";
import { useSettingsScreen } from "@/shared/screens/settings/useSettingsScreen";
import { appPalette } from "@/theme/palette";

export default function NativeSettingsScreen() {
  const {
    user,
    formData,
    error,
    success,
    isSubmitting,
    isSavingProfile,
    hasPassword,
    credentialsTitle,
    deviceTimeZone,
    language,
    timeZone,
    setField,
    submitCredentials,
    changeLanguage,
    changeTimeZone,
    signOut,
  } = useSettingsScreen();

  if (!user) return null;

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <ScreenHeader title="Настройки" subtitle="Профиль, язык, часовой пояс и вход." />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}>
        <ProfileSection user={user} />
        <LanguageSection
          language={language}
          isSavingProfile={isSavingProfile}
          onChangeLanguage={(nextLanguage) => {
            void changeLanguage(nextLanguage);
          }}
        />
        <TimeZoneSection
          timeZone={timeZone}
          deviceTimeZone={deviceTimeZone}
          onUseDeviceTimeZone={() => {
            void changeTimeZone(deviceTimeZone);
          }}
        />
        <CredentialsSection
          title={credentialsTitle}
          formData={formData}
          hasPassword={hasPassword}
          error={error}
          success={success}
          isSubmitting={isSubmitting}
          onSetField={setField}
          onSubmit={() => handleSettingsSubmit(submitCredentials, hasPassword)}
        />
        <SignOutSection
          onSignOut={async () => {
            await signOut();
          }}
        />
      </ScrollView>
    </View>
  );
}
