import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';



export default function AppLayout() {
  const authObj = useContext(AuthContext)


  console.log("rerender")
  
  console.log(authObj)
  if (!authObj?.isAuthenicated) {
    
   
    return <Redirect href={"/login"}></Redirect>
  }

  

  
  return <Stack />;
}
