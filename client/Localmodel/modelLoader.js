// modelLoader.js
import * as tf from '@tensorflow/tfjs';
import modelJson from './Localmodel/model.json'; // Adjust the path according to your structure

export const loadModel = async () => {
    try {
        const model = await tf.loadLayersModel(modelJson);
        console.log("Model loaded successfully");
        return model;
    } catch (error) {
        console.error("Error loading the model", error);
    }
};

