import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useRoute
import axios from 'axios';

// Example data for the feed
const posts = [
  {
    id: '1',
    user: 'Alice',
    name: 'Fly Agaric',
    description: 'Found this beautiful Fly Agaric in the forest today!',
    imageUrl: 'https://cdn.pixabay.com/photo/2023/08/15/11/47/mushroom-8191823_1280.jpg',
  },
  {
    id: '2',
    user: 'Bob',
    name: 'Chanterelle',
    description: 'Chanterelles are my favorite! Found them growing near oak trees.',
    imageUrl: 'https://cdn.pixabay.com/photo/2024/01/02/06/28/mushroom-8482641_1280.jpg',
  },
  // Add more posts as needed
];

export default function HomeScreen() {
  const route = useRoute(); // Get the route object
  const { username } = route.params || {}; // Extract username from params

  const navigation = useNavigation(); // Get the navigation object

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://192.168.0.13:8081/posts');
        if (posts.length > 2) {
          posts.splice(2); // remove all except mocked data before re-fetching posts
        }
        for (let i = 0; i < response.data.length; i++) {
          const newPost = response.data[i];
          posts.push(newPost);
        }
        // debugging: console.log('All posts: ', posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const timer = setTimeout(() => {
      fetchPosts();
    }, 4000); // wait 4s for posts to be fetched

    return () => clearTimeout(timer);
    // currently function only runs once when component mounts, so requires a hot reload
    // need to be tied to the upload event to update the DOM
  }, [route.params?.scrollToBottom]);

  const renderItem = ({ item }) => (
    <TouchableOpacity className="bg-white p-4 mb-4 rounded-lg shadow-md" onPress={() => navigation.navigate('Campfire', {
      screen: 'MushroomDetail',   // MushroomDetail is nested in Campfire screen
      params: { id: '', item },  // Hard-coding id as an empty string, so that mocked data still renders
    })}>
      <Text className="text-lg font-semibold">{item.user || 'Guest'}</Text>
      <Text className="text-sm text-gray-600">{item.name}</Text>
      <Image
        source={{ uri: item.imageUrl }}
        className="w-full h-48 rounded-lg my-2"
      />
      <Text className="text-gray-800">{item.description || 'Add description'}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-8 pt-16 bg-neutral-200 flex justify-between">
        <View className="flex-row items-center">
          <Icon name="fire" size={30} color="#FF6F61" className="mr-2" />
          <Text className="text-2xl font-bold text-slate-800">Camprisma</Text>
        </View>
        <Text className="text-zinc-500 text-md font-bold self-end">Welcome, {username || 'Guest'}</Text>
      </View>

      <View>
        <Text className="text-zinc-500 text-lg font-thin p-4">Recently Viewed</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.name}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
      />
    </View>
  );
}
