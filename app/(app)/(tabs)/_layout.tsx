import { Tabs, usePathname } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Button, Modal, View, Text, TouchableOpacity } from 'react-native';
import { useContext, useState } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import { getStorageValue } from "@/app/storage/storage";
export default function TabLayout() {
  const authContext = useContext(AuthContext)
  const username = getStorageValue("username")
  
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
        name="index"
        options={{
          headerShown:false,
          href: null,
        }}
      />
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
        name="transaction"
        
        options={{
          headerShown:false,
          title: "Transactions",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name="money-bill-transfer" size={24} color="white" />
          ),
        }}
      />

<Tabs.Screen
        name="recurringTransaction"
        
        options={{
          headerShown:false,
          title: "Recurring Transactions",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name="money-bill-transfer" size={24} color="white" />
          ),
        }}
      />
      
      <Tabs.Screen
      
        name="budgets/[id]"
        options={{
          headerShown:false,
          href: null,
        }}
      />
      <Tabs.Screen
      
      name="accounts/[id]"
      options={{
        headerShown:false,
        href: null,
      }}
    />
    <Tabs.Screen
      
      name="transactions/[id]"
      options={{
        headerShown:false,
        href: null,
      }}
    />

<Tabs.Screen
      
      name="recurringTransactions/[id]"
      options={{
        headerShown:false,
        href: null,
      }}
    />


<Tabs.Screen
      
      name="user"
      options={{
        headerShown:false,
        title: `${username}`,
        tabBarIcon: ({ color, focused }) => (
          <FontAwesome6 name="user" size={24} color="white" />
        ),
      }}
    />


    </Tabs>
  );
}