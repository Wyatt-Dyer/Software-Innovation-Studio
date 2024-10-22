from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import io

app = Flask(__name__)
CORS(app)

# Load the mushroom classifier model
model = tf.keras.models.load_model('D:\\Software-Innovation-Studio\\server\\model\\mushroom_classifier.h5')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'no image uploaded'}), 400
    
    img_file = request.files['image']
    
    # Load the image
    img = Image.open(io.BytesIO(img_file.read()))
    img = img.resize((128, 128))  # Resize image to (128, 128) as expected by the model
    
    # Convert the image to an array and normalize
    img_array = img_to_array(img) / 255.0  # Normalize the image
    img_array = np.expand_dims(img_array, axis=0)  # Expand dims to (1, 128, 128, 3)
    
    # Predict using the mushroom classifier model
    preds = model.predict(img_array)  # Input directly to the main model
    
    # Get the predicted class
    predicted_class = np.argmax(preds, axis=1)[0]  # Get the predicted class
    
    return jsonify({'predicted_class': int(predicted_class)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)