import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Sample data for the mushrooms, including image sources
const mushrooms = [
  { id: '1', name: 'Agaricus', image: 'https://cdn.pixabay.com/photo/2015/12/08/23/54/mushroom-1084023_1280.jpg' },
  { id: '2', name: 'Amanita', image: 'https://cdn.pixabay.com/photo/2018/10/15/21/08/mushroom-3750008_1280.jpg' },
  { id: '3', name: 'Boletus', image: 'https://cdn.pixabay.com/photo/2018/09/28/08/48/chestnut-bolete-3708755_1280.jpg' },
  { id: '4', name: 'Cortinarius', image: 'https://cdn.pixabay.com/photo/2014/10/01/16/10/mushrooms-468751_1280.jpg' },
  { id: '5', name: 'Entoloma', image: 'https://cdn.pixabay.com/photo/2023/09/06/17/37/pearl-fungus-8237670_1280.jpg' },
  { id: '6', name: 'Hygrocybe', image: 'https://cdn.pixabay.com/photo/2014/02/26/01/32/red-waxcap-fungi-274716_1280.jpg' },
  { id: '7', name: 'Lactarius', image: 'https://cdn.pixabay.com/photo/2022/01/01/14/30/saffron-milk-cap-6907604_1280.jpg' },
  { id: '8', name: 'Russula', image: 'https://cdn.pixabay.com/photo/2019/08/15/13/14/mushroom-4408014_1280.jpg' },
  { id: '9', name: 'Suilus', image: 'https://cdn.pixabay.com/photo/2020/04/23/20/58/forest-5084061_1280.jpg' },
];

export default function CampfireScreen({ navigation }) {
  const renderMushroomCard = ({ item }) => (
    <TouchableOpacity
      className="flex-1 m-2 p-2 bg-gray-200 rounded-xl shadow-lg items-center justify-center h-44" // Adjust height as needed
      onPress={() => navigation.navigate('MushroomDetail', { mushroomId: item.id })}>
      <Image
        source={{ uri: item.image }} // Image source from the data
        className="w-full h-32 rounded-xl mb-2" // Image styling
        resizeMode="cover" // Adjusts how the image fits the space
      />
      <Text className="text-lg font-bold">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray">
      <View className="p-8 pt-16 bg-neutral-200 flex justify-between">
        <View className="flex-row items-center">
          <Icon name="fire" size={30} color="#FF6F61" className="mr-2" />
          <Text className="text-2xl font-bold text-slate-800">Camprisma</Text>
        </View>
        <Text className="text-zinc-500 text-md font-bold self-end">Mushroom Database</Text>
        <Text className="text-lg font-bold">Watch this space for new mushroom updates as our database and learning model grows!</Text>
      </View>
      <FlatList 
        data={mushrooms}
        renderItem={renderMushroomCard}
        keyExtractor={(item) => item.id}
        numColumns={3} // Adjust the number of columns as needed
        contentContainerStyle="justify-center"
      />
    </View>
  );
}
