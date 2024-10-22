import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';

const LoginForm = () => {
  const router = useRouter();

  
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


  const handleSubmit = () => {
    const newErrors = { username: '', password: '' };

    if (formData.username.trim() === '') {
      newErrors.username = 'Username is required';
    }

  

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (newErrors.username || newErrors.password) {
      setErrors(newErrors);
    } else {
      setErrors({ username: '', password: '' });
     
      Alert.alert('Login Successful', `Welcome ${formData.username}`);
     
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.login}>Login Form</Text>

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
        />
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}


        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <Button title="Submit" onPress={handleSubmit} color="#6200ea" />

        <Link href="/signup" style={styles.linkText}>
          Go to signup
        </Link>
      </View>
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
    color: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444',
    padding: 10,
    marginVertical: 10,
  },
  login: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  linkText: {
    marginTop: 20,
    color: '#6200ea',
    textAlign: 'center',
  },
});

export default LoginForm;
