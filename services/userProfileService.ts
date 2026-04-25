import { supabase } from "@/lib/supabase";
import {
    UserProfile,
    UserProfileInput,
    UserProfileUpdate,
} from "@/types/userProfile";

/**
 * Obtiene el perfil del usuario actual
 */
export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No se encontró el perfil
      return null;
    }
    throw new Error(`Error al obtener perfil: ${error.message}`);
  }

  return data;
}

/**
 * Crea un nuevo perfil de usuario
 */
export async function createUserProfile(
  profile: UserProfileInput,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .insert(profile)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear perfil: ${error.message}`);
  }

  return data;
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdate,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar perfil: ${error.message}`);
  }

  return data;
}

/**
 * Crea o actualiza el perfil del usuario (upsert)
 */
export async function upsertUserProfile(
  profile: UserProfileInput,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(profile, {
      onConflict: "user_id",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error al guardar perfil: ${error.message}`);
  }

  return data;
}

/**
 * Elimina el perfil del usuario
 */
export async function deleteUserProfile(userId: string): Promise<void> {
  const { error } = await supabase
    .from("user_profiles")
    .delete()
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Error al eliminar perfil: ${error.message}`);
  }
}

/**
 * Verifica si el usuario tiene un perfil
 */
export async function hasUserProfile(userId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Error al verificar perfil: ${error.message}`);
  }

  return (count ?? 0) > 0;
}
