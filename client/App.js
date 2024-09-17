import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text } from 'react-native';


// Import Screens
import HomeScreen from './screens/HomeScreen';
import BookmarkScreen from './screens/BookmarkScreen';
import ScanScreen from './screens/ScanScreen';
import CampfireScreen from './screens/CampfireScreen';
import UserScreen from './screens/UserScreen';

// Bottom Tab Navigation
const Tab = createBottomTabNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;


              // Icon mapping for other tabs
              switch (route.name) {
                case 'Home':
                  iconName = 'home-outline';
                  break;
                case 'Bookmarks':
                  iconName = 'bookmark-outline';
                  break;
                case 'Scan':
                  iconName = 'scan-outline';
                  break;
                case 'Campfire':
                  iconName = 'flame-outline';
                  break;
                case 'User':
                  iconName = 'person-outline';
                  break;
              }
              if (route.name === 'Scan') {
                // Return the circular green button for Scan
                return (
                  <View className="w-20 h-20 mb-10 rounded-full bg-green-500 items-center justify-center">
                    <Icon name={iconName} size={size} color='white' />
                  </View>
                );
              }
              // Return regular icon for non-Scan screens
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            tabBarStyle: { paddingBottom: 50, height: 150 },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Bookmarks" component={BookmarkScreen} />
          <Tab.Screen name="Scan" component={ScanScreen} />
          <Tab.Screen name="Campfire" component={CampfireScreen} />
          <Tab.Screen name="User" component={UserScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    
  );
}
