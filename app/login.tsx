import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { authApi } from './api/api';
import { AuthContext } from './context/AuthContext';
import { InputsDemo } from '@/components/InputsDemo';
import { useToastController } from '@tamagui/toast';
import CurrentToast from '@/components/CurrentToast';
import SpinnerComponent from '@/components/Spinner';





const LoginForm = () => {
  const router = useRouter();
  const authObj = useContext(AuthContext)
  const [loading,setLoading] = useState(false)

  const toast = useToastController();

  
  const [formData, setFormData] = useState({
    username: '',

    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
   
    password: '',
  });

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };


  const handleSubmit = async () => {
    setLoading(true)
    const newErrors = { username: '', password: '' };

    if (formData.username.trim() === '') {
      newErrors.username = 'Username is required';
    }

  

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (newErrors.username || newErrors.password) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({ username: '', password: '' });
     
     
    }
    try{
 
    const response = await authApi.login({username: formData.username,password: formData.password})
    
    const {accessToken,refreshToken} = response.data
    
   
    authObj?.login({accessToken,refreshToken})
    
    setLoading(false)
    router.push('/budget')
    }
    
    catch(e) {
      setLoading(false)
      console.error("error",e)
      toast.show('Failed', {
        message: "Login failed, try again",
        native:false,
        customData: {
          color:'red'
        }
      
      })
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.login}>Login Form</Text>
        <Text style={styles.label}>Username</Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          
          style={styles.input}
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
        />
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          
          style={styles.input}
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <Button title="Submit" onPress={handleSubmit} color="#6200ea" disabled={loading} />
        <SpinnerComponent show={loading}/>

        <Link href="/signup" style={styles.linkText}>
          Go to signup
        </Link>
      </View>
      <CurrentToast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    elevation: 5, 
  },
  input: {
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444',
    padding: 10,
    marginVertical: 10,
  },
  login: {
    textAlign: 'center',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  linkText: {
    marginTop: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  label: {
    color: '#ffffff',
    marginVertical:5
  }
});

export default LoginForm;

