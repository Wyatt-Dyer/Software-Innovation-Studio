from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.efficientnet import EfficientNetB3, preprocess_input
from PIL import Image
import numpy as np
import io
import os
import base64

app = Flask(__name__)
CORS(app)

# Load the mushroom classifier model
model = tf.keras.models.load_model('/server/model/model.keras')

base_model = EfficientNetB3(include_top=False, weights='imagenet', pooling='avg')

class_names = ['Agaricus', 'Amanita', 'Boletus', 
               'Cortinarius', 'Entoloma', 'Hygrocybe', 'Lactarius', 'Russula', 'Suillus']

print(model.summary())

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        print("No image found in request files")
        return jsonify({'error': 'no image uploaded'}), 400
    
    img_file = request.files['image']
    print(f"Received file: {img_file.filename}")  # Log received filename
    
    # Load the image
    img = Image.open(io.BytesIO(img_file.read())).convert('RGB')
    img = img.resize((300, 300))   # Resize image to (128, 128) as expected by the model
    # img.show()
    
    # Convert the image to an array and normalize
    img_array = np.array(img)
    img_array = preprocess_input(img_array)  # Apply EfficientNet's preprocess function
    img_array = np.expand_dims(img_array, axis=0)

    features = base_model.predict(img_array)

    # Predict using the mushroom classifier model
    preds = model.predict(features)  # Input directly to the main model
    predicted_class = np.argmax(preds, axis=1)[0]  # Get the predicted class
    predicted_class_name = class_names[predicted_class]
    
    return jsonify({'predicted_class': predicted_class_name})

def convert_image_to_base64(image):
    """Convert a PIL Image to a Base64 string."""
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))