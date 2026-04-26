import { DrawerContent } from "@/components/DrawerContent";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        drawerStyle: {
          width: "75%",
        },
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
      <Drawer.Screen name="simulator" options={{ title: "Simulador" }} />
    </Drawer>
  );
}
