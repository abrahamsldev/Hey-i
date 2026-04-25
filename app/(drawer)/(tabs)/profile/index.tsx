import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { ScreenContainer } from "@/components/ScreenContainer";
import { colors, fontSize, fontWeight, spacing } from "@/constants/design";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
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
  const { profile, loading: profileLoading, hasProfile } = useUserProfile();

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
            {profile?.es_hey_pro && (
              <View style={styles.proBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.proText}>Hey Pro</Text>
              </View>
            )}
          </View>
        </View>

        {hasProfile && profile && (
          <>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            <AppCard style={styles.infoCard} animateIn>
              {profile.edad && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Edad</Text>
                  <Text style={styles.infoValue}>{profile.edad} años</Text>
                </View>
              )}
              {profile.ciudad && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ubicación</Text>
                    <Text style={styles.infoValue}>
                      {profile.ciudad}
                      {profile.estado && `, ${profile.estado}`}
                    </Text>
                  </View>
                </>
              )}
              {profile.ocupacion && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ocupación</Text>
                    <Text style={styles.infoValue}>{profile.ocupacion}</Text>
                  </View>
                </>
              )}
              {profile.num_productos_activos > 0 && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Productos activos</Text>
                    <Text style={styles.infoValue}>
                      {profile.num_productos_activos}
                    </Text>
                  </View>
                </>
              )}
            </AppCard>
          </>
        )}

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
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  proText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: "#FFD700",
  },
  infoCard: {
    padding: 0,
    overflow: "hidden",
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.muted,
  },
  infoValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
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
