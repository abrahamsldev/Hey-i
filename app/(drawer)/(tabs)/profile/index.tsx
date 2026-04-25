import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
    colors,
    fontSize,
    fontWeight,
    spacing
} from "@/constants/design";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const SettingRow = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) => (
  <Pressable style={styles.settingRow} onPress={onPress}>
    <Ionicons name={icon as any} size={20} color={colors.foreground} />
    <Text style={styles.settingLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={16} color={colors.placeholder} />
  </Pressable>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const name =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Usuario";
  const email = user?.email ?? "";

  const handleSignOut = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Cerrar sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <AppHeader title="Mi Perfil" />
      <ScreenContainer scrollable padded>
        <View style={styles.avatarSection}>
          <ProfileAvatar name={name} size={80} />
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Configuración</Text>
        <AppCard style={styles.settingsCard} animateIn>
          <SettingRow
            icon="person-outline"
            label="Editar perfil"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="settings-outline"
            label="Ajustes"
            onPress={() => router.push("/(drawer)/(tabs)/profile/settings")}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="notifications-outline"
            label="Notificaciones"
            onPress={() => {}}
          />
        </AppCard>

        <AppButton
          label="Cerrar sesión"
          variant="secondary"
          onPress={handleSignOut}
          style={styles.signOutBtn}
        />
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.muted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  settingsCard: {
    padding: 0,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg + 20 + spacing.md,
  },
  signOutBtn: {
    marginTop: spacing.xl,
  },
});
