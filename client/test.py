import tensorflow as tf
from tensorflow.keras.applications.efficientnet import EfficientNetB3, preprocess_input
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import os
import random

# Load the pre-trained model
model = tf.keras.models.load_model('/Software-Innovation-Studio/server/model/model.keras')

feature_extractor = EfficientNetB3(include_top=False, weights='imagenet', pooling='avg')

class_names = ['Agaricus', 'Amanita', 'Boletus', 
               'Cortinarius', 'Entoloma', 'Hygrocybe', 'Lactarius', 'Russula', 'Suillus']

def preprocess_image(image_path):
    img = Image.open(image_path).convert('RGB').resize((300, 300))
    img_array = np.array(img)
    img_array = preprocess_input(img_array)  # Use the preprocess function from EfficientNet
    return np.expand_dims(img_array, axis=0)

print(model.summary())

def extract_features(image_path):
    """Extracts features from the input image using EfficientNetB3."""
    img_array = preprocess_image(image_path)
    features = feature_extractor.predict(img_array)  # Shape: (1, 1536)
    return features

def predict(image_path):
    """Make predictions using extracted features."""
    features = extract_features(image_path)  # Extract features (1, 1536)

    # Predict using the trained model
    prediction = model.predict(features)

    # Display raw prediction probabilities for inspection
    print(f"Prediction (Raw Probabilities): {prediction[0]}")

    # Display top predictions
    top_indices = np.argsort(prediction[0])[-3:][::-1]
    print("Top 3 Predictions:")
    for idx in top_indices:
        print(f"{class_names[idx]}: {prediction[0][idx]:.4f}")

    # Get the predicted class
    predicted_class = top_indices[0]
    print(f'\nPredicted Class Label: {class_names[predicted_class]}')

def get_random_image_paths(base_directory, n=10):
    """Get n random image paths from the base directory."""
    all_image_paths = []

    # Collect all image paths from subdirectories
    for root, _, files in os.walk(base_directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                all_image_paths.append(os.path.join(root, file))

    # Check if we have fewer images than requested
    if len(all_image_paths) < n:
        print(f"Only {len(all_image_paths)} images available. Returning all of them.")
        return all_image_paths

    # Randomly sample the requested number of images
    return random.sample(all_image_paths, n)

# Example usage
base_directory = 'D:\\datasets\\Mushroom-test'

# Get 10 random image paths from the dataset
random_image_paths = get_random_image_paths(base_directory, n=10)

print(f"Selected {len(random_image_paths)} random images:")
for path in random_image_paths:
    print(path)

# Make predictions on the 10 random images
for i, image_path in enumerate(random_image_paths):
    print(f"\nPrediction for Image {i + 1}: {image_path}")
    predict(image_path)