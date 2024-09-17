import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library


// Example data for the feed
const posts = [
  {
    id: '1',
    user: 'Alice',
    mushroom: 'Fly Agaric',
    description: 'Found this beautiful Fly Agaric in the forest today!',
    image: 'https://cdn.pixabay.com/photo/2023/08/15/11/47/mushroom-8191823_1280.jpg', // Replace with actual image URLs
  },
  {
    id: '2',
    user: 'Bob',
    mushroom: 'Chanterelle',
    description: 'Chanterelles are my favorite! Found them growing near oak trees.',
    image: 'https://cdn.pixabay.com/photo/2024/01/02/06/28/mushroom-8482641_1280.jpg',
  },
  // Add more posts as needed
];

export default function HomeScreen() {
  const renderItem = ({ item }) => (
    <View className="bg-white p-4 mb-4 rounded-lg shadow-md">
      <Text className="text-lg font-semibold">{item.user}</Text>
      <Text className="text-sm text-gray-600">{item.mushroom}</Text>
      <Image
        source={{ uri: item.image }}
        className="w-full h-48 rounded-lg my-2"
      />
      <Text className="text-gray-800">{item.description}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-8 pt-16 bg-neutral-200 flex justify-between">

      <View className="flex-row items-center">
        <Icon name="fire" size={30} color="#FF6F61" className="mr-2" />
        <Text className="text-2xl font-bold text-slate-800">Camprisma</Text>
    </View>
        <Text className="text-zinc-500 text-md font-bold self-end">Welcome, Opera</Text>
    </View>

    <View>
        <Text className="text-zinc-500 text-lg font-thin p-4">Recently Viewed</Text>
    </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
      />
    </View>
  );
}
