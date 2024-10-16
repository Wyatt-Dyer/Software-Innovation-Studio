import React, {useState} from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import Disclaimer from '../components/LegalDisclaimer';
import Markdown from 'react-native-markdown-display';

// Sample mushroom details data
const mushroomDetails = {
  '1': {
    name: 'Agaricus',
    description: 'Commonly known as the common mushroom. It is a popular edible mushroom and can be found in various dishes.',
    image: 'https://cdn.pixabay.com/photo/2015/12/08/23/54/mushroom-1084023_1280.jpg',
  },
  '2': {
    name: 'Amanita',
    description: 'Known for its distinctive appearance, some species are highly poisonous. Handle with caution.',
    image: 'https://cdn.pixabay.com/photo/2018/10/15/21/08/mushroom-3750008_1280.jpg',
  },
  '3': {
    name: 'Boletus',
    description: 'Valued for its taste and texture in cooking, especially in soups and stews.',
    image: 'https://cdn.pixabay.com/photo/2018/09/28/08/48/chestnut-bolete-3708755_1280.jpg',
  },
  '4': {
    name: 'Cortinarius',
    description: 'Includes many species, some of which are edible. They can be found in woodland areas.',
    image: 'https://cdn.pixabay.com/photo/2014/10/01/16/10/mushrooms-468751_1280.jpg',
  },
  '5': {
    name: 'Entoloma',
    description: 'Typically found in grasslands and forests, some species are edible while others are toxic.',
    image: 'https://cdn.pixabay.com/photo/2023/09/06/17/37/pearl-fungus-8237670_1280.jpg',
  },
  '6': {
    name: 'Hygrocybe',
    description: 'Known as waxcap mushrooms, often brightly colored, making them visually striking.',
    image: 'https://cdn.pixabay.com/photo/2014/02/26/01/32/red-waxcap-fungi-274716_1280.jpg',
  },
  '7': {
    name: 'Lactarius',
    description: 'Milk mushrooms that produce a latex when cut, often used in various culinary dishes.',
    image: 'https://cdn.pixabay.com/photo/2022/01/01/14/30/saffron-milk-cap-6907604_1280.jpg',
  },
  '8': {
    name: 'Russula',
    description: 'A diverse genus of mushrooms, often with a crunchy texture and a variety of colors.',
    image: 'https://cdn.pixabay.com/photo/2019/08/15/13/14/mushroom-4408014_1280.jpg',
  },
  '9': {
    name: 'Suilus',
    description: 'Known for their association with certain trees and can be quite delicious when prepared correctly.',
    image: 'https://cdn.pixabay.com/photo/2020/04/23/20/58/forest-5084061_1280.jpg',
  },
};

const MushroomDetail = ({ route, navigation }) => {
  const { mushroomId, item } = route.params;

  let mushroom;
  if (mushroomId) {
    mushroom = mushroomDetails[mushroomId];
  } else {
    // debugging: console.log('Item details: ', item)
    mushroom = { ...item };
    mushroom.name = 'Oyster mushroom'; // hard-coding until cv model is integrated
    mushroom.image = item.imageUrl;
    mushroom.description = 'Description';
  }
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleChatPrompt = async (prompt) => {
    setLoading(true); // Start loading when the button is pressed
    setResponse(''); // Clear previous response

    try {
      const res = await axios.post('http://192.168.0.110:8080/chat', { prompt });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error fetching response:', error);
      Alert.alert('Error', error.response?.data || 'Could not fetch response');
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  return (
    <ScrollView className="flex-1 p-4  bg-gray-100">
      <TouchableOpacity
      className='flex-row mt-2 mb-2 gap-2 items-center'
      onPress={() => navigation.navigate('Campfire Home')}
      >
        <Icon name='arrow-back' size={20} />
        <Text className='text-lg font-semibold'>Return to database</Text>
      </TouchableOpacity>
      <Image
          source={{ uri: mushroom.image }}
          className="w-full h-48 rounded-xl mb-4"
          resizeMode="cover"
      />
      <Text className="text-2xl font-bold">{mushroom.name}</Text>
      <Text className="text-lg text-gray-700 mt-2">{mushroom.description}</Text>

      <View className="flex-row justify-between mt-4 space-x-2">
        <TouchableOpacity
        onPress={() => handleChatPrompt('recipes for ' + mushroom.name)}
        className="flex-row items-center bg-emerald-300 p-4 border-2 rounded-full"
        >
          <Icon name="restaurant-menu" size={20} color="#22A365" />
          <Text className="text-slate-800 ml-2">Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleChatPrompt('info about ' + mushroom.name)}
          className="flex-row items-center bg-cyan-100 p-4 border-2 rounded-full"
        >
          <Icon name="info" size={20} color="#22A6F2" />
          <Text className="text-slate-800 ml-2">Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleChatPrompt('where to find ' + mushroom.name)}
          className="flex-row items-center bg-rose-100 p-4 border-2 rounded-full"
        >
          <Icon name="location-on" size={20} color="#FF7E70" />
          <Text className="text-slate-800 ml-2">Locations</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        // Display the loading spinner while the request is being processed
        <View className="mt-4 flex items-center">
          <ActivityIndicator size="large" color="#FF6F61" />
          <Text className="text-gray-600 mt-2">Loading...</Text>
        </View>
      ) : (
        response ? (
          <>
            <Markdown className="mt-4 pb-12">{response}</Markdown>
            <Disclaimer />
          </>
        ) : null
      )}
    </ScrollView>
  );
};

export default MushroomDetail;
