import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { authApi } from './api/api';
import { setStorageValue } from './storage/storage';
const SignupForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Basic email validation
  const validateEmail = async (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async() => {
    const newErrors = { username: '', email: '', password: '', confirmPassword: '' };

    if (formData.username.trim() === '') {
      newErrors.username = 'Username is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (newErrors.username || newErrors.email || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
    } else {
      setErrors({ username: '', email: '', password: '', confirmPassword: '' });


     
     
      Alert.alert('Sign Up Successful', `Welcome ${formData.username}`);
      router.push('/login'); 
    }
    try{
    const response = await authApi.signup({email:formData.email,username: formData.username, password: formData.password})
    const {refreshToken, accessToken} = response.data
    setStorageValue("refreshToken",refreshToken)
    setStorageValue("accessToken",accessToken)
    router.push('/budgetPage')

    }
    catch(e) {
      debugger
      console.error("error",e)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.login}>Sign Up Form</Text>
        <Text style={styles.label}>Username</Text>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          style={styles.input}
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
        />
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
        <Text style={styles.label}>Email</Text>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        <Text style={styles.label}>Password</Text>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          style={styles.input}
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          style={styles.input}
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        />
        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

        <Button title="Submit" onPress={handleSubmit} color="#6200ea" />

        {/* Link to Login Page */}
        <Link href="/login" style={styles.linkText}>
          Already have an account? Go to Login
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
    color: 'white',
    textAlign: 'center',
  },
  label: {
    color: '#ffffff',
    marginVertical:5
  }
});

export default SignupForm;
