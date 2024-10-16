const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node'); // Import TensorFlow.js for Node.js
const Jimp = require('jimp'); // Use Jimp for image processing
const model = require("model.json"); // Replace with your actual model import


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint to save photo while offline
app.post('/upload', upload.single('photo'), (req, res) => {
    const filePath = req.file.path;

    // Optionally, save file metadata in a database or a temporary storage
    fs.appendFileSync('offline_photos.txt', filePath + '\n');

    res.status(200).json({ message: 'Photo saved for processing' });
});

// Endpoint to process photos after reconnecting
app.post('/process-photos', (req, res) => {
    // Read saved photos from temporary storage
    const photoPaths = fs.readFileSync('offline_photos.txt', 'utf-8').split('\n').filter(Boolean);

    // Process each photo with your model
    photoPaths.forEach((photoPath) => {
        // Replace with your model processing logic
        processPhoto(photoPath);
    });

    // Optionally clear the temporary storage after processing
    fs.writeFileSync('offline_photos.txt', '');

    res.status(200).json({ message: 'Photos processed successfully' });
});

async function processPhoto(photoPath) {
    try {
        // Ensure photo is loaded correctly
        const image = await Jimp.read(photoPath);
        
        // Manipulate photo data type/shape to ensure it fits the model's input shape
        const resizedImage = image.resize(224, 224); // Resize to model input size (e.g., 224x224)
        const imageData = new Uint8Array(resizedImage.bitmap.data); // Get raw image data

        // Convert image data to a tensor
        const inputTensor = tf.tensor3d(imageData, [224, 224, 4]).slice([0, 0, 0], [224, 224, 3]); // Slice to RGB

        // Normalize the input tensor (if necessary)
        const normalizedTensor = inputTensor.div(tf.scalar(255));

        // Model goes here, being provided the photo for prediction
        const prediction = model.predict(normalizedTensor.expandDims(0)); // Add batch dimension

        // Retrieve model results
        const output = await prediction.array(); // Convert tensor to array
        const results = output[0]; // Assuming the model returns an array of predictions

        // Optionally, match the output with a database or specific mushroom information
        const mushroomInfo = getMushroomInfo(results); // Implement this function based on your needs

        console.log(`Processed photo: ${photoPath}, Results: ${mushroomInfo}`);

    } catch (error) {
        console.error(`Error processing photo ${photoPath}:`, error);
    }
}

app.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    try {
        fs.appendFileSync('offline_photos.txt', filePath + '\n');
        res.status(200).json({ message: 'Photo saved for processing' });
    } catch (error) {
        console.error('Error saving file path:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
