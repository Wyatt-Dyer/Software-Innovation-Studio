import React, { useEffect, useState } from 'react';
import { View, Image, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UploadModal = () => {
    const [image, setImage] = useState(null);

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
        }
      })();
    }, []);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
            <View style={styles.buttonTextContainer}>
                <MaterialCommunityIcons name='image-outline' size={30} color="#fff"/>
                <Text style={styles.buttonText}>Upload image</Text>
            </View>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.button} onPress={pickImage}>
            <View style={styles.buttonTextContainer}>
                <MaterialCommunityIcons name='camera-outline' size={30} color="#fff"/>
                <Text style={styles.buttonText}>Scan image</Text>
            </View>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
    );
  };

  export default UploadModal;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 50,
    },
    image: {
      width: 200,
      height: 200,
      marginTop: 20,
    },
    button: {
        backgroundColor: '#48bb78',
        minHeight: 70,
        minWidth: '90%',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonTextContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: 20,
    },
  });