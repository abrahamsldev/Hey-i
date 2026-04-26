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
import { updateUserProfile } from "@/services/userProfileService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function StyledInput({
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  maxLength,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  maxLength?: number;
}) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      keyboardType={keyboardType}
      maxLength={maxLength}
      autoCorrect={false}
    />
  );
}

function OptionPicker({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.optionRow}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          style={[
            styles.optionChip,
            value === opt.value && styles.optionChipSelected,
          ]}
          onPress={() => onChange(opt.value)}
        >
          <Text
            style={[
              styles.optionLabel,
              value === opt.value && styles.optionLabelSelected,
            ]}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ─── Opciones ─────────────────────────────────────────────────────────────────

const SEXO_OPTIONS = [
  { label: "Hombre", value: "hombre" },
  { label: "Mujer", value: "mujer" },
  { label: "Otro", value: "otro" },
];

const SATISFACCION_OPTIONS = [
  { label: "😞 1-3", value: "2" },
  { label: "😐 4-6", value: "5" },
  { label: "😊 7-8", value: "7" },
  { label: "🤩 9-10", value: "9" },
];

// ─── Pantalla ─────────────────────────────────────────────────────────────────

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, userProfile, refreshProfile } = useAuth();

  const [saving, setSaving] = useState(false);

  // Campos editables
  const [edad, setEdad] = useState(String(userProfile?.edad ?? ""));
  const [sexo, setSexo] = useState(userProfile?.sexo ?? "");
  const [ciudad, setCiudad] = useState(userProfile?.ciudad ?? "");
  const [estado, setEstado] = useState(userProfile?.estado ?? "");
  const [ocupacion, setOcupacion] = useState(userProfile?.ocupacion ?? "");
  const [ingresoMensual, setIngresoMensual] = useState(
    String(userProfile?.ingreso_mensual_mxn ?? ""),
  );
  const [preferenciaCanal, setPreferenciaCanal] = useState(
    userProfile?.preferencia_canal ?? "",
  );
  const [satisfaccion, setSatisfaccion] = useState(
    String(userProfile?.satisfaccion_1_10 ?? ""),
  );

  const handleSave = async () => {
    if (!user?.id) return;

    const edadNum = parseInt(edad, 10);
    if (edad && (isNaN(edadNum) || edadNum < 18 || edadNum > 100)) {
      Alert.alert("Edad inválida", "Ingresa una edad entre 18 y 100 años.");
      return;
    }

    const ingresoNum = parseFloat(ingresoMensual);
    if (ingresoMensual && (isNaN(ingresoNum) || ingresoNum < 0)) {
      Alert.alert("Ingreso inválido", "Ingresa un monto positivo.");
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile(user.id, {
        ...(edad ? { edad: edadNum } : {}),
        ...(sexo ? { sexo } : {}),
        ...(ciudad ? { ciudad } : {}),
        ...(estado ? { estado } : {}),
        ...(ocupacion ? { ocupacion } : {}),
        ...(ingresoMensual ? { ingreso_mensual_mxn: ingresoNum } : {}),
        ...(preferenciaCanal ? { preferencia_canal: preferenciaCanal } : {}),
        ...(satisfaccion
          ? { satisfaccion_1_10: parseInt(satisfaccion, 10) }
          : {}),
      });
      await refreshProfile();
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "No se pudo guardar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Editar perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScreenContainer scrollable padded>
        {/* Datos personales */}
        <Text style={styles.section}>Datos personales</Text>

        <Field label="Edad">
          <StyledInput
            value={edad}
            onChangeText={setEdad}
            placeholder="Ej. 28"
            keyboardType="numeric"
            maxLength={3}
          />
        </Field>

        <Field label="Sexo">
          <OptionPicker
            options={SEXO_OPTIONS}
            value={sexo}
            onChange={setSexo}
          />
        </Field>

        <Field label="Ciudad">
          <StyledInput
            value={ciudad}
            onChangeText={setCiudad}
            placeholder="Ej. Monterrey"
            maxLength={100}
          />
        </Field>

        <Field label="Estado">
          <StyledInput
            value={estado}
            onChangeText={setEstado}
            placeholder="Ej. Nuevo León"
            maxLength={100}
          />
        </Field>

        <Field label="Ocupación">
          <StyledInput
            value={ocupacion}
            onChangeText={setOcupacion}
            placeholder="Ej. Ingeniero de software"
            maxLength={150}
          />
        </Field>

        {/* Finanzas */}
        <Text style={[styles.section, { marginTop: spacing.xl }]}>
          Finanzas
        </Text>

        <Field label="Ingreso mensual (MXN)">
          <StyledInput
            value={ingresoMensual}
            onChangeText={setIngresoMensual}
            placeholder="Ej. 25000"
            keyboardType="decimal-pad"
          />
        </Field>

        {/* Preferencias */}
        <Text style={[styles.section, { marginTop: spacing.xl }]}>
          Preferencias
        </Text>

        <Field label="¿Cómo calificarías tu experiencia?">
          <OptionPicker
            options={SATISFACCION_OPTIONS}
            value={satisfaccion}
            onChange={setSatisfaccion}
          />
        </Field>

        <AppButton
          label="Guardar cambios"
          onPress={handleSave}
          loading={saving}
          style={styles.saveBtn}
        />
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  section: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: fontSize.md,
    color: colors.foreground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  optionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
  },
  optionChipSelected: {
    backgroundColor: colors.foreground,
    borderColor: colors.foreground,
  },
  optionLabel: {
    fontSize: fontSize.sm,
    color: colors.muted,
    fontWeight: fontWeight.medium,
  },
  optionLabelSelected: {
    color: colors.background,
  },
  saveBtn: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});
