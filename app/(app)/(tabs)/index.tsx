import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';

export default function index() {
  const router = useRouter();
  console.log("hit index")

  useEffect(() => {
   
    router.push("/budget")
  }, []);

  return (
    <View></View>
  );
}