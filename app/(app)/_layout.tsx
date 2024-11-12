
import { Redirect, Stack, Tabs } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';




export default function AppLayout() {
  const authObj = useContext(AuthContext)


  console.log("rerender")
  
  console.log(authObj)
  if (!authObj?.isAuthenicated) {
    
   
    return <Redirect href={"/login"}></Redirect>
  }

  

  
  return <GestureHandlerRootView>
    <StatusBar style="light"></StatusBar>
    <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name="(tabs)"/>
    <Stack.Screen
        name="accountFormModal"
        options={{
          presentation: 'modal',
        }}
      />

    <Stack.Screen
        name="budgetFormModal"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="transactionFormModal"
        options={{
          presentation: 'modal',
        }}
      />
  </Stack>
  </GestureHandlerRootView>;
}
