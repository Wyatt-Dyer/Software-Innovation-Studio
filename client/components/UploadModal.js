import React, { useEffect, useState } from 'react';
import { View, Image, Platform, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

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

        if (!result.canceled) {
          const imageUri = result.assets[0].uri;
          setImage(imageUri);
          uploadImage(imageUri);
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

        if (!result.canceled) {
          const imageUri = result.assets[0].uri;
          setImage(imageUri);
          uploadImage(imageUri);
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      // create form data to hold image data
      const formData = new FormData();
      const fileName = imageUri.split('/').pop();
      const fileType = fileName.split('.').pop();
      formData.append('image', {
        uri: imageUri,
        name: fileName,
        type: `image/${fileType}`,
      });

      // Make the POST request to upload the image
      const response = await axios.post('http://192.168.0.110:8080/upload', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from client: ', response);
      if (response.status === 201) {
        alert('Image uploaded successfully!');
      }
    } catch (error) {
      console.log('Error from formData: ' + error);
    }
  }

  return (
    <View className="flex-1 items-center justify-center gap-y-12">
      <View className="flex min-h-[200px] bg-white-200 justify-center items-center">
        {image ? (
            <Image source={{ uri: image }} className="w-50 h-50 mt-5" />
          ) : (
            <Image source={require('../assets/placeholder.png')} className="w-50 h-50 mt-5" />
          )
        }
      </View>

      <TouchableOpacity onPress={pickImage} className="bg-green-500 min-h-18 w-[200px] p-5 rounded-lg items-center">
          <View className="flex-row gap-x-5">
              <MaterialCommunityIcons name="image-outline" size={30} color="#fff"/>
              <Text className="text-white text-lg">Upload image</Text>
          </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={scanImage} className="bg-green-500 min-h-18 w-[200px] p-5 rounded-lg items-center">
          <View className="flex-row gap-x-5">
              <MaterialCommunityIcons name="camera-outline" size={30} color="#fff"/>
              <Text className="text-white text-lg">Scan image</Text>
          </View>
      </TouchableOpacity>
    </View>
  );
};

export default UploadModal;
