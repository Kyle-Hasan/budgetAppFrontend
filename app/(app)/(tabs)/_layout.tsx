import { Tabs } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="budget"
        
        options={{
          headerShown:false,
          title: "Budgets",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name="money-check-dollar" size={24} color="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        
        options={{
          headerShown:false,
          title: "Accounts",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name="piggy-bank" size={24} color="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="CreateBudgetForm"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
      
        name="budgets/[id]"
        options={{
          headerShown:false,
          href: null,
        }}
      />
    </Tabs>
  );
}