import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import matplotlib.pyplot as plt
import os
from PIL import Image, ImageFile

data_dir = "D:\\datasets\\Mushrooms"  # Path to the main mushroom dataset directory
ImageFile.LOAD_TRUNCATED_IMAGES = True

def load_data(data_dir):
    images = []
    labels = []
    class_names = sorted(os.listdir(data_dir))  # Ensure consistent labeling
    class_map = {name: i for i, name in enumerate(class_names)}

    for class_name in class_names:
        class_path = os.path.join(data_dir, class_name)
        if os.path.isdir(class_path):
            for img_name in os.listdir(class_path):
                img_path = os.path.join(class_path, img_name)
                try:
                    img = tf.keras.utils.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
                    img = tf.keras.utils.img_to_array(img) / 255.0  # Normalize to [0, 1]
                    images.append(img)
                    labels.append(class_map[class_name])
                except Exception as e:
                    print(f'Error loading image {img_path}: {e}')

    return np.array(images), np.array(labels), class_names

# Hyperparameters
IMG_SIZE = 128  # Image size (128x128)
BATCH_SIZE = 32
EPOCHS = 20
NUM_CLASSES = 9  # 9 mushroom categories

# Load the dataset and split into training and testing
def convert_images_to_jpg(data_dir):
    for class_name in os.listdir(data_dir):
        class_path = os.path.join(data_dir, class_name)
        if os.path.isdir(class_path):
            for img_name in os.listdir(class_path):
                img_path = os.path.join(class_path, img_name)
                try:
                    img = Image.open(img_path)
                    # Convert and save as JPEG
                    img = img.convert("RGB")  # Ensure it's in RGB mode
                    new_img_name = os.path.splitext(img_name)[0] + '.jpg'
                    new_path = os.path.join(class_path, new_img_name)
                    img.save(new_path, "JPEG")
                except Exception as e:
                    print(f'Error converting {img_path}: {e}')

convert_images_to_jpg(data_dir)

# Create training (80%) and validation (20%) datasets
# Define the ImageDataGenerator with augmentation
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255.0,  # Normalize to [0, 1]
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2  # Use this for validation split
)

# Load training dataset
train_ds = train_datagen.flow_from_directory(
    data_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='sparse',  # Use sparse for integer labels
    subset='training',     # Set as training data
    seed=42
)

# Load validation dataset
val_datagen = ImageDataGenerator(rescale=1.0 / 255.0)  # Just normalize for validation
val_ds = val_datagen.flow_from_directory(
    data_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='sparse',  # Use sparse for integer labels
    subset='validation',   # Set as validation data
    seed=42
)

print(f'Training samples: {train_ds.samples}')
print(f'Validation samples: {val_ds.samples}')

# Retrieve class names from the training dataset
class_names = train_ds.class_indices  # Get class indices
print("Class labels:", class_names)  # Verify correct class labels

# Build the CNN model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(IMG_SIZE, IMG_SIZE, 3)),
    BatchNormalization(),
    MaxPooling2D((2, 2)),

    Conv2D(64, (3, 3), activation='relu'),
    BatchNormalization(),
    MaxPooling2D((2, 2)),

    Conv2D(128, (3, 3), activation='relu'),
    BatchNormalization(),
    MaxPooling2D((2, 2)),

    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(NUM_CLASSES, activation='softmax')  # Output layer with 9 categories
])

# Compile the model
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS
)

# Evaluate the model on validation data
val_loss, val_acc = model.evaluate(val_ds, verbose=2)
print(f"Validation Accuracy: {val_acc * 100:.2f}%")

# Save the model as .h5
model.save("mushroom_classifier.h5")
print("Model saved as mushroom_classifier.h5")