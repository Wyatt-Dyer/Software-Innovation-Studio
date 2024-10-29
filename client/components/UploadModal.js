import React, { useEffect, useState } from 'react';
import { View, Image, Platform, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const UploadModal = () => {
  const navigation = useNavigation();

  const [image, setImage] = useState('');
  const [havePermissions, setHavePermissions] = useState(false)
  // const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // const loadModel = async () => {
    //   try {
    //   await tf.ready();

    //   const modelJsonPath = `../assets/model/model.json`;
    //   const model = await tf.loadLayersModel(modelJsonPath);
    //   setModel(model);
    //   } catch (error) {
    //     console.error('Error loading model: ', error);
    //   }
    // };
    // loadModel();

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
        // Open the camera and take a photo
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.5,
        });

        // Check if the user didn't cancel
        if (!result.canceled) {
          const imageUri = result.assets[0].uri;
          setImage(imageUri);
          await uploadImage(imageUri);
        }
      } else {
        Alert.alert("Permissions not granted", "Please allow camera access.");
      }
    } catch (error) {
      console.log("Error in scanImage:", error.message); // Limited log output
      Alert.alert("Error capturing image. Please try again.");
    }
  };

  const uploadImage = async (imageUri) => {
    setLoading(true); // Start loading
    try {
      const formData = new FormData();
      const fileName = imageUri.split('/').pop();
      const fileType = fileName.split('.').pop();
      formData.append('image', {
        uri: imageUri,
        name: fileName,
        type: `image/${fileType}`,
      });

      console.log('FormData contents:', formData);

      // Make the POST request to upload the image
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response from server: ', response.data);
      if (response.data && response.data.predicted_class !== undefined) {
        Alert.alert('Prediction', `Predicted Class: ${response.data.predicted_class}`, [{ text: 'OK' }]);
        setPrediction(`Predicted Class: ${response.data.predicted_class}`);
      } else {
        console.log('No predicted class found in response');
      }

      console.log('Response from client: ', response);
      if (response.status === 201) {
        Alert.alert(
          "Success",
          "Image uploaded successfully!",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate('Home', { scrollToBottom: true, refresh: true }),
            }
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.log('Error from formData: ' + error);
      Alert.alert('There was a problem. Please try again later')
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-y-12">
      <View className="flex min-h-[200px] bg-white-200 justify-center items-center">
        {image ? (
          <Image source={{ uri: image }} className="w-50 h-50 mt-5" />
        ) : (
          <Image source={require('../assets/placeholder.png')} className="w-50 h-50 mt-5" />
        )}
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

      {loading ? ( // Show loading indicator when uploading
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        prediction ? (
          <Text className="text-lg mt-4">{prediction}</Text>
        ) : null
      )}
    </View>
  );
};

export default UploadModal;
