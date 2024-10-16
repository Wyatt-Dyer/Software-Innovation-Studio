import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import BookmarkScreen from './screens/BookmarkScreen';
import ScanScreen from './screens/ScanScreen';
import CampfireScreen from './screens/CampfireScreen';
import MushroomDetail from './screens/MushroomDetail';
import UserScreen from './screens/UserScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CampfireStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Campfire Home"  // Changed from "Campfire" to "CampfireMain"
        component={CampfireScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MushroomDetail"
        component={MushroomDetail}
        options={{ title: 'Mushroom Details' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
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
              default:
                iconName = 'help-outline';
            }
            if (route.name === 'Scan') {
              return (
                <View className="w-20 h-20 mb-10 rounded-full bg-green-500 items-center justify-center">
                  <Icon name={iconName} size={size} color='white' />
                </View>
              );
            }
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
        <Tab.Screen name="Campfire" component={CampfireStack} />
        <Tab.Screen name="User" component={UserScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}