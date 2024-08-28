import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "Montserrat_500Medium",
        },
        tabBarStyle: { backgroundColor: "#fff", paddingBottom: 5 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={25} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-projects"
        options={{
          title: "My Projects",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="briefcase" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-project"
        options={{
          title: "New Project",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="plus" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={25} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
