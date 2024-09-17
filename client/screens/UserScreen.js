import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function UserScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.50.169:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        Alert.alert('Login Successful');
        navigation.navigate('Home');
      } else {
        Alert.alert('Login Failed', data.message || 'Unknown error occurred');
      }
    } catch (err) {
      Alert.alert('Error', `Server error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.50.169:8080/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        Alert.alert('Sign Up Successful', 'You can now log in');
      } else {
        const data = await response.json();
        Alert.alert('Sign Up Failed', data.message || 'Unknown error occurred');
      }
    } catch (err) {
      Alert.alert('Error', `Server error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <View className="flex-1 items-center justify-center bg-green-100">
        <Text className="text-4xl">✔</Text>
        <Text className="text-lg mt-2">Logged In Successfully</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-2xl font-bold text-center mb-6">User Login</Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="bg-white p-3 rounded-md mb-4"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="bg-white p-3 rounded-md mb-6"
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        className="mb-4"
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#ffffff" /> : 'Login'}
      </Button>
      
      <Button
        mode="outlined"
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#000000" /> : 'Create Account'}
      </Button>
    </View>
  );
}
