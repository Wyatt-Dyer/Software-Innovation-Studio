import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Disclaimer = () => {
  return (
    <View className='flex-1 bg-gray-100 pt-5 pb-10'>
        <View className='flex-row gap-2'>
            <MaterialCommunityIcons name='gavel' size={30} color="brown" />
            <Text className='text-2xl font-bold mb-5'>
                Legal Disclaimer
            </Text>
        </View>

        <Text className='text-base leading-6 mb-4'>
            Even experts get it wrong sometimes. All the information we provide is as well researched as it can be, but we use image recognition technology, and it can make mistakes. Make sure to rely on your own judgement.
        </Text>

        <Text className='text-base leading-6 mb-4'>
            Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the app or reliance on any information provided. Your use of the app and your reliance on any information on the app is solely at your own risk.
        </Text>

        <Text className='text-base font-bold text-center mt-5'>
            By using this app, you agree to the terms of this disclaimer.
        </Text>
    </View>
  );
};

export default Disclaimer;
