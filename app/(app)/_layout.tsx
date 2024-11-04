import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';



export default function AppLayout() {
  const authObj = useContext(AuthContext)


  console.log("rerender")
  
  console.log(authObj)
  if (!authObj?.isAuthenicated) {
    
   
    return <Redirect href={"/login"}></Redirect>
  }

  

  
  return <Stack screenOptions={{headerShown:false}}>
    <StatusBar hidden={true} backgroundColor="transparent" translucent={true} />
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
  </Stack>;
}
