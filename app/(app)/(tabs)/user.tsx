import api from '@/app/api/api';
import { AuthContext } from '@/app/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function UserScreen() {
  const router = useRouter()
  const authContext = useContext(AuthContext)
  const handleLogout = async() => {

    await api.post("/users/logout")
    authContext?.logout();
    router.push("/login")
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Settings</Text>
      <Button title="Logout" onPress={handleLogout} color="#6200ea" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
      padding: 20,
      justifyContent: 'center', 
      alignItems: 'center'
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    heading: {
      color: '#fff',
      fontSize: 18,
    },
    buttonText: {
      color: '#fff',
      fontSize: 24,
    },
    details: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 20,
    },
  });
  