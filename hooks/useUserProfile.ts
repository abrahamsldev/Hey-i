import { useAuth } from "@/context/AuthContext";

/**
 * Hook personalizado para acceder al perfil del usuario
 */
export function useUserProfile() {
  const { userProfile, profileLoading, refreshProfile } = useAuth();

  return {
    profile: userProfile,
    loading: profileLoading,
    refreshProfile,
    hasProfile: userProfile !== null,
  };
}

/**
 * Hook para verificar si el usuario es Hey Pro
 */
export function useIsHeyPro(): boolean {
  const { profile } = useUserProfile();
  return profile?.es_hey_pro ?? false;
}

/**
 * Hook para obtener información básica del perfil
 */
export function useProfileInfo() {
  const { profile } = useUserProfile();

  return {
    edad: profile?.edad,
    ciudad: profile?.ciudad,
    estado: profile?.estado,
    ocupacion: profile?.ocupacion,
    isHeyPro: profile?.es_hey_pro ?? false,
    productosActivos: profile?.num_productos_activos ?? 0,
  };
}
