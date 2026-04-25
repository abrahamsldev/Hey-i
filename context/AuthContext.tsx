import { supabase } from "@/lib/supabase";
import { getUserProfile } from "@/services/userProfileService";
import { UserProfile } from "@/types/userProfile";
import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userProfile: null,
  loading: true,
  profileLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadUserProfile = async (userId: string) => {
    setProfileLoading(true);
    try {
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      if (session?.user?.id) {
        loadUserProfile(session.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        if (session?.user?.id) {
          loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (session?.user?.id) {
      await loadUserProfile(session.user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        userProfile,
        loading,
        profileLoading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
