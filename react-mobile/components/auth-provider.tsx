import { Slot } from "expo-router";
import { AuthProvider } from "@/contexts/auth-context";

export default function ProviderLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
