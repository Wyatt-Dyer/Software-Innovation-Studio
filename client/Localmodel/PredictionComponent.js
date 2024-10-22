// PredictionComponent.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { loadModel } from './modelLoader';
import { Image } from 'react-native';
import * as FileSystem from 'react-native-fs';
import * as tf from '@tensorflow/tfjs';
import * as tfjs from '@tensorflow/tfjs-react-native';

const PredictionComponent = () => {
    const [model, setModel] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [imageUri, setImageUri] = useState(''); // Set this to your image path

    useEffect(() => {
        const initializeModel = async () => {
            const loadedModel = await loadModel();
            setModel(loadedModel);
        };
        initializeModel();
    }, []);

    const predict = async () => {
        if (!model) {
            console.log("Model not loaded yet");
            return;
        }

        // Load and preprocess the image here
        const img = await loadImage(imageUri); // Implement loadImage to process your image
        const inputTensor = tf.browser.fromPixels(img).expandDims(0);

        const result = model.predict(inputTensor);
        const predictionResult = await result.data(); // Adjust based on your model output
        setPrediction(predictionResult);
    };

    return (
        <View>
            <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
            <Button title="Predict" onPress={predict} />
            {prediction && <Text>Prediction: {prediction}</Text>}
        </View>
    );
};

export default PredictionComponent;

// Function to load and preprocess the image
const loadImage = async (uri) => {
    // Load the image file
    const response = await FileSystem.readFile(uri, 'base64');
    
    // Create an Image instance
    const imgElement = new Image();
    imgElement.src = `data:image/jpeg;base64,${response}`; // Assuming JPEG format; adjust if needed

    return new Promise((resolve) => {
        imgElement.onload = async () => {
            // Convert the image to a tensor
            const tensor = tf.browser.fromPixels(imgElement);
            
            // Resize and normalize the image tensor
            const resizedTensor = tf.image.resizeBilinear(tensor, [224, 224]); // Adjust size based on your model's input
            const normalizedTensor = resizedTensor.div(tf.scalar(255.0)); // Normalize to [0, 1]
            resolve(normalizedTensor);
        };
    });
};