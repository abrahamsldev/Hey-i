import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) return null;

  if (session) {
    return <Redirect href="/(drawer)/(tabs)/home" />;
  }

  return <Redirect href="/login" />;
}
