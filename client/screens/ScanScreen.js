import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ScanScreen() {
  return (
    <View className="flex-1 ">
      <View className="p-8 pt-16 bg-neutral-200 flex justify-between">
        <View className="flex-row items-center">
          <Icon name="fire" size={30} color="#FF6F61" className="mr-2" />
          <Text className="text-2xl font-bold text-slate-800">Camprisma</Text>
        </View>
        <Text className="text-zinc-500 text-md font-bold self-end">AI Scanner</Text>
      </View>

      <View className="flex-1 justify-center items-center">
        <Text>Scan</Text>
      </View>
    </View>
  );
}
