import { AppButton } from "@/components/AppButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from "@/constants/design";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Tab = "login" | "register" | "recover";

export default function LoginScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Recover state
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverLoading, setRecoverLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace("/(drawer)/(tabs)/home");
    }
  }, [session]);

  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      Alert.alert("Error", "Por favor ingresa email y contraseña");
      return;
    }
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });
    setLoginLoading(false);
    if (error) {
      Alert.alert("Error al iniciar sesión", error.message);
    }
  };

  const handleRegister = async () => {
    if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (regPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setRegLoading(true);
    const { error } = await supabase.auth.signUp({
      email: regEmail.trim(),
      password: regPassword,
      options: {
        data: { username: regUsername.trim() },
      },
    });
    setRegLoading(false);
    if (error) {
      Alert.alert("Error al registrarse", error.message);
    } else {
      Alert.alert(
        "Cuenta creada",
        "Revisa tu correo para confirmar tu cuenta.",
        [{ text: "OK", onPress: () => setActiveTab("login") }],
      );
    }
  };

  const handleRecover = async () => {
    if (!recoverEmail.trim()) {
      Alert.alert("Error", "Por favor ingresa tu correo");
      return;
    }
    setRecoverLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(
      recoverEmail.trim(),
    );
    setRecoverLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Correo enviado",
        "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        [{ text: "OK", onPress: () => setActiveTab("login") }],
      );
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "login", label: "Iniciar sesión" },
    { key: "register", label: "Registrarse" },
    { key: "recover", label: "Recuperar" },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenContainer style={styles.container} padded>
        <View style={styles.topSection}>
          <Text style={styles.appName}>Hey!i</Text>
          <Text style={styles.tagline}>Tu asistente financiero personal</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.key && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Login */}
          {activeTab === "login" && (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry
                />
              </View>
              <AppButton
                label="Iniciar sesión"
                onPress={handleLogin}
                loading={loginLoading}
                style={styles.button}
              />
              <Pressable onPress={() => setActiveTab("recover")}>
                <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
              </Pressable>
            </View>
          )}

          {/* Register */}
          {activeTab === "register" && (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Nombre de usuario</Text>
                <TextInput
                  style={styles.input}
                  value={regUsername}
                  onChangeText={setRegUsername}
                  placeholder="tú_nombre"
                  placeholderTextColor={colors.placeholder}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={regEmail}
                  onChangeText={setRegEmail}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  value={regPassword}
                  onChangeText={setRegPassword}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry
                />
              </View>
              <AppButton
                label="Crear cuenta"
                onPress={handleRegister}
                loading={regLoading}
                style={styles.button}
              />
            </View>
          )}

          {/* Recover */}
          {activeTab === "recover" && (
            <View style={styles.form}>
              <Text style={styles.recoverHint}>
                Ingresa tu correo y te enviaremos un enlace para restablecer tu
                contraseña.
              </Text>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={recoverEmail}
                  onChangeText={setRecoverEmail}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <AppButton
                label="Enviar enlace"
                onPress={handleRecover}
                loading={recoverLoading}
                style={styles.button}
              />
              <Pressable onPress={() => setActiveTab("login")}>
                <Text style={styles.link}>Volver a iniciar sesión</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  topSection: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  appName: {
    fontSize: 56,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    letterSpacing: -2,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginBottom: -1.5,
  },
  tabActive: {
    borderBottomColor: colors.foreground,
  },
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.muted,
  },
  tabLabelActive: {
    color: colors.foreground,
    fontWeight: fontWeight.semibold,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.md,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  button: {
    marginTop: spacing.sm,
  },
  link: {
    fontSize: fontSize.sm,
    color: colors.muted,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: spacing.xs,
  },
  recoverHint: {
    fontSize: fontSize.sm,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
});
