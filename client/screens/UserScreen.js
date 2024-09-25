import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Fontawesome

export default function UserScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(''); // State for username

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
        const extractedUsername = email.split('@')[0]; // Extract username from email
        setUsername(extractedUsername); // Update state with username
        Alert.alert('Login Successful');
        
        // Navigate to Home, passing the extracted username directly
        navigation.navigate('Home', { username: extractedUsername.toUpperCase() });
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

  // Correctly place the return statement
  return (
    
    <View className="flex-1 justify-center p-0 bg-gray-100">
      
      {isLoggedIn ? (
        <View className="flex-1 items-center justify-center bg-cyan-500">
          <Icon name="user" size={60} color="#000" />
          <Text className="text-lg mt-2">Logged In Successfully as {username.toUpperCase()}</Text>
        </View>
      ) : (
        <View className="flex flex-col items-center">
          <Text className="text-2xl font-bold text-center mb-6">User Login</Text>
          
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="bg-white p-3 w-80 rounded-md mb-4"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="bg-white p-3 w-80 rounded-md mb-6"
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            className="mb-4 w-40"
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#ffffff" /> : 'Login'}
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleSignUp}
            className=" w-40"
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#000000" /> : 'Create Account'}
          </Button>
        </View>
      )}
    </View>
  );
}
