/**
 * Tipos para la tabla user_profiles de Supabase
 */

export interface UserProfile {
  id: string;
  user_id: string;
  edad: number | null;
  sexo: string | null;
  estado: string | null;
  ciudad: string | null;
  nivel_educativo: string | null;
  ocupacion: string | null;
  ingreso_mensual_mxn: number | null;
  antiguedad_dias: number;
  es_hey_pro: boolean;
  nomina_domiciliada: boolean;
  canal_apertura: string | null;
  score_buro: number | null;
  dias_desde_ultimo_login: number;
  preferencia_canal: string | null;
  satisfaccion_1_10: number | null;
  recibe_remesas: boolean;
  usa_hey_shop: boolean;
  idioma_preferido: string;
  tiene_seguro: boolean;
  num_productos_activos: number;
  patron_uso_atipico: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Tipo para insertar/actualizar perfil (sin campos auto-generados)
 */
export interface UserProfileInput {
  user_id: string;
  edad?: number;
  sexo?: string;
  estado?: string;
  ciudad?: string;
  nivel_educativo?: string;
  ocupacion?: string;
  ingreso_mensual_mxn?: number;
  antiguedad_dias?: number;
  es_hey_pro?: boolean;
  nomina_domiciliada?: boolean;
  canal_apertura?: string;
  score_buro?: number;
  dias_desde_ultimo_login?: number;
  preferencia_canal?: string;
  satisfaccion_1_10?: number;
  recibe_remesas?: boolean;
  usa_hey_shop?: boolean;
  idioma_preferido?: string;
  tiene_seguro?: boolean;
  num_productos_activos?: number;
  patron_uso_atipico?: boolean;
}

/**
 * Tipo parcial para actualizaciones
 */
export type UserProfileUpdate = Partial<Omit<UserProfileInput, "user_id">>;
