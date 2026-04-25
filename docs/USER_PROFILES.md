# Sistema de Perfiles de Usuario

Este documento explica cómo funciona el sistema de perfiles de usuario en la aplicación.

## Estructura de Datos

La tabla `user_profiles` en Supabase contiene información detallada de cada usuario:

- **Demografía**: edad, sexo, estado, ciudad, nivel_educativo, ocupacion
- **Finanzas**: ingreso_mensual_mxn, score_buro, nomina_domiciliada
- **Productos**: es_hey_pro, num_productos_activos, tiene_seguro
- **Comportamiento**: antiguedad_dias, dias_desde_ultimo_login, patron_uso_atipico
- **Preferencias**: preferencia_canal, idioma_preferido, satisfaccion_1_10
- **Servicios**: recibe_remesas, usa_hey_shop

## Archivos Creados

### 1. Tipos TypeScript

**Archivo**: [`types/userProfile.ts`](types/userProfile.ts)

Define los tipos para trabajar con perfiles:

- `UserProfile`: Tipo completo del perfil
- `UserProfileInput`: Para insertar/crear perfiles
- `UserProfileUpdate`: Para actualizaciones parciales

### 2. Servicio de Perfiles

**Archivo**: [`services/userProfileService.ts`](services/userProfileService.ts)

Funciones para interactuar con Supabase:

- `getUserProfile(userId)`: Obtener perfil de un usuario
- `createUserProfile(profile)`: Crear nuevo perfil
- `updateUserProfile(userId, updates)`: Actualizar perfil
- `upsertUserProfile(profile)`: Crear o actualizar
- `deleteUserProfile(userId)`: Eliminar perfil
- `hasUserProfile(userId)`: Verificar si existe

### 3. Contexto de Autenticación

**Archivo**: [`context/AuthContext.tsx`](context/AuthContext.tsx)

Actualizado para incluir:

- `userProfile`: Perfil del usuario actual
- `profileLoading`: Estado de carga del perfil
- `refreshProfile()`: Función para recargar el perfil

El perfil se carga automáticamente al iniciar sesión.

### 4. Hooks Personalizados

**Archivo**: [`hooks/useUserProfile.ts`](hooks/useUserProfile.ts)

Hooks para facilitar el acceso al perfil:

- `useUserProfile()`: Hook principal para acceder al perfil
- `useIsHeyPro()`: Verificar si es usuario Hey Pro
- `useProfileInfo()`: Obtener información básica

## Ejemplos de Uso

### 1. Obtener el perfil en un componente

```tsx
import { useUserProfile } from "@/hooks/useUserProfile";

function MyComponent() {
  const { profile, loading, hasProfile, refreshProfile } = useUserProfile();

  if (loading) return <Text>Cargando...</Text>;
  if (!hasProfile) return <Text>Perfil no configurado</Text>;

  return (
    <View>
      <Text>Edad: {profile.edad}</Text>
      <Text>Ciudad: {profile.ciudad}</Text>
      <Text>Hey Pro: {profile.es_hey_pro ? "Sí" : "No"}</Text>
      <Button title="Actualizar" onPress={refreshProfile} />
    </View>
  );
}
```

### 2. Verificar si es usuario Hey Pro

```tsx
import { useIsHeyPro } from "@/hooks/useUserProfile";

function PremiumFeature() {
  const isHeyPro = useIsHeyPro();

  if (!isHeyPro) {
    return <Text>Esta función es solo para usuarios Hey Pro</Text>;
  }

  return <PremiumContent />;
}
```

### 3. Actualizar el perfil

```tsx
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/services/userProfileService";

function EditProfile() {
  const { user, refreshProfile } = useAuth();

  const handleSave = async (edad: number, ciudad: string) => {
    try {
      await updateUserProfile(user.id, {
        edad,
        ciudad,
      });
      await refreshProfile();
      Alert.alert("Éxito", "Perfil actualizado");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return <ProfileForm onSave={handleSave} />;
}
```

### 4. Crear perfil al registrarse

```tsx
import { createUserProfile } from "@/services/userProfileService";

async function onSignUp(userId: string, email: string) {
  await createUserProfile({
    user_id: userId,
    idioma_preferido: "es",
    canal_apertura: "mobile_app",
  });
}
```

## Seguridad

La tabla `user_profiles` tiene Row Level Security (RLS) habilitado:

- ✅ Los usuarios solo pueden ver su propio perfil
- ✅ Los usuarios solo pueden crear su propio perfil
- ✅ Los usuarios solo pueden actualizar su propio perfil
- ✅ Los usuarios solo pueden eliminar su propio perfil

Todas las operaciones están protegidas automáticamente por Supabase.

## Integración con el Backend Lambda

El backend Lambda ya tiene acceso al `user_id` autenticado desde el JWT. Este `user_id` se puede usar para:

1. Consultar el perfil del usuario desde las tools de MCP
2. Personalizar las respuestas del chatbot según el perfil
3. Hacer recomendaciones basadas en los datos del usuario

### Ejemplo en FastMCP:

```python
@mcp.tool()
async def get_user_info(user_id: str) -> str:
    """Obtiene información del perfil del usuario"""

    # Consultar Supabase
    response = supabase.from_("user_profiles").select("*").eq("user_id", user_id).single().execute()

    if response.data:
        profile = response.data
        return f"Usuario: {profile['edad']} años, de {profile['ciudad']}, Hey Pro: {profile['es_hey_pro']}"

    return "Perfil no encontrado"
```

## Próximos Pasos

1. ✅ Crear pantalla de edición de perfil
2. ✅ Implementar onboarding para nuevos usuarios
3. ✅ Agregar validaciones en el formulario
4. ✅ Conectar tools del MCP para usar datos del perfil
5. ✅ Agregar analytics basado en segmentación de perfiles
