import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from "@/constants/design";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export function DrawerContent(props: any) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleHome = () => {
    Haptics.selectionAsync();
    props.navigation?.navigate("(tabs)");
    props.navigation?.closeDrawer?.();
  };

  const handleSignOut = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.appNameRow}>
          <Text style={styles.appName}>Hey!i</Text>
        </View>
        {user?.email && (
          <Text style={styles.email} numberOfLines={1}>
            {user.email}
          </Text>
        )}
      </View>

      <View style={styles.divider} />

      <Pressable style={styles.item} onPress={handleHome}>
        <Ionicons name="home-outline" size={22} color={colors.foreground} />
        <Text style={styles.itemLabel}>Home</Text>
      </Pressable>

      <View style={styles.spacer} />
      <View style={styles.divider} />

      <Pressable
        style={[styles.item, styles.signOutItem]}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={22} color={colors.foreground} />
        <Text style={styles.itemLabel}>Cerrar sesión</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  appNameRow: {
    marginBottom: spacing.xs,
  },
  appName: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    letterSpacing: -1,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginHorizontal: spacing.sm,
    marginVertical: spacing.xs,
  },
  signOutItem: {},
  itemLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },
  spacer: {
    flex: 1,
  },
});
