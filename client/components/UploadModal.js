import React, { useEffect, useState } from 'react';
import { View, Image, Platform, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UploadModal = () => {
  const [image, setImage] = useState('');
  const [havePermissions, setHavePermissions] = useState(false)

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryStatus.status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }

        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== 'granted') {
          alert('Sorry, we need camera permissions to make this work!');
        }

        if (cameraStatus.status === 'granted' && libraryStatus.status === 'granted') {
          // debugging: alert('Perfect, all permissions set!');
          setHavePermissions(true)
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      if (havePermissions) {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
          setImage(result.assets[0].uri);
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const scanImage = async () => {
    try {
      if (havePermissions) {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
          cameraType: ImagePicker.CameraType.back,
        });

        console.log(result);

        if (!result.cancelled) {
          setImage(result.assets[0].uri);
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-y-12">
      {image && <Image source={{ uri: image }} className="w-50 h-50 mt-5" />}

      <TouchableOpacity onPress={pickImage} className="bg-green-500 min-h-18 min-w-9/10 p-5 rounded-lg items-center">
          <View className="flex-row gap-x-5">
              <MaterialCommunityIcons name="image-outline" size={30} color="#fff"/>
              <Text className="text-white text-lg">Upload image</Text>
          </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={scanImage} className="bg-green-500 min-h-18 min-w-9/10 p-5 rounded-lg items-center">
          <View className="flex-row gap-x-5">
              <MaterialCommunityIcons name="camera-outline" size={30} color="#fff"/>
              <Text className="text-white text-lg">Scan image</Text>
          </View>
      </TouchableOpacity>
    </View>
  );
};

export default UploadModal;
