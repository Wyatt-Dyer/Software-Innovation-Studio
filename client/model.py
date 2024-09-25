import numpy as np
import os
import shutil
import tensorflow as tf
from keras._tf_keras.keras.preprocessing.image import ImageDataGenerator
from keras._tf_keras.keras.applications import EfficientNetB3
from keras import layers, models
from keras._tf_keras.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils.class_weight import compute_class_weight
import seaborn as sns
import matplotlib.pyplot as plt
from imblearn.over_sampling import SMOTE
from keras._tf_keras.keras.preprocessing.image import load_img, img_to_array
from imblearn.over_sampling import RandomOverSampler
from sklearn.preprocessing import LabelEncoder
import keras

base_model = EfficientNetB3(include_top=False, weights='imagenet', pooling='avg')

ros = RandomOverSampler(random_state=42)


from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

data_directory = '/Software-Innovation-Studio/Mushrooms'
writable_directory = '/Software-Innovation-Studio/temp/Mushrooms'
validation_directory = '/Software-Innovation-Studio/temp/validation'
training_directory = '/Software-Innovation-Studio/temp/training'

def count_images(directory):
    class_counts = {}
    for class_name in os.listdir(directory):
        class_directory = os.path.join(directory, class_name)
        if os.path.isdir(class_directory):
            class_counts[class_name] = len(os.listdir(class_directory))
    return class_counts

def load_and_process_image(image_path, target_size=(300, 300)):
    img = load_img(image_path, target_size=target_size)
    img_array = img_to_array(img)
    return img_array.flatten()

if os.path.exists(writable_directory):
    shutil.rmtree(writable_directory)
os.makedirs(writable_directory, exist_ok=True)

for class_name in os.listdir(data_directory):
    class_directory = os.path.join(data_directory, class_name)
    writable_class_directory = os.path.join(writable_directory, class_name)
    os.makedirs(writable_class_directory, exist_ok=True)
    
    for image in os.listdir(class_directory):
        src_path = os.path.join(class_directory, image)
        dest_path = os.path.join(writable_class_directory, image)
        shutil.copy(src_path, dest_path)
        
print("Class counts before oversampling:")
class_counts_before = count_images(writable_directory)
for class_name, count in class_counts_before.items():
    print(f"{class_name}: {count}")

class_counts = class_counts_before
max_count = max(class_counts.values())

X = []
y = []
for class_name, count in class_counts.items():
    class_directory = os.path.join(writable_directory, class_name)
    images = os.listdir(class_directory)

    for image in images:
        image_path = os.path.join(class_directory, image)
        img = load_img(image_path, target_size=(300, 300))
        img_array = img_to_array(img)
        
        X.append(img_array)
        y.append(class_name)

X = np.array(X)
X = base_model.predict(X.reshape(X.shape[0], 300, 300, 3), verbose=0)
y = np.array(y)

num_samples, img_size = X.shape[0], np.prod(X.shape[1:])
X = X.reshape(num_samples, img_size)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

unique_elements, counts = np.unique(y, return_counts=True)
print(unique_elements)
print(counts)
print(X_train.shape)

input_shape = (300, 300, 3)
num_classes = len(class_counts_before)  
batch_size = 64  

base_model = EfficientNetB3(input_shape=input_shape, include_top=False, weights='imagenet')

unique_elements, counts = np.unique(y_train, return_counts=True)
print(unique_elements)
print(counts)
print(X_train.shape)

le = LabelEncoder()
y = le.fit_transform(y_train)
y = keras.utils.to_categorical(y, num_classes=9)

y_test = le.fit_transform(y_test)
y_test = keras.utils.to_categorical(y_test, num_classes=9)

le = LabelEncoder()
y_train = le.fit_transform(y_train)
y_train = keras.utils.to_categorical(y_train, num_classes=9)

print(X_train.shape)
input_shape = (1536,)
inputs = tf.keras.Input(shape=input_shape)


# x = tf.keras.layers.Dense(2048, activation='relu')(inputs)
# x = tf.keras.layers.Dropout(0.5)(x)
x = tf.keras.layers.Dense(1024, activation='relu')(inputs)
x = tf.keras.layers.Dropout(0.2)(x)
outputs = tf.keras.layers.Dense(num_classes, activation='softmax')(x)
model = tf.keras.Model(inputs, outputs)

model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

datagen = ImageDataGenerator (
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

history_fine = model.fit(
    x=X_train,
    y=y_train,
    batch_size=batch_size,
    epochs=50,
    validation_data=(X_test, y_test)
)

val_loss, val_accuracy = model.evaluate(X_test, y_test)
print(f"Validation Accuracy: {val_accuracy}")
predictions = model.predict(X_test)

predicted_classes = np.argmax(predictions, axis=1)
true_classes = np.argmax(y_test, axis=1)

print(classification_report(true_classes, predicted_classes))

# Initialise confusion matrix
cm = confusion_matrix(true_classes, predicted_classes)

# Heatmap
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.xlabel('Predicted Labels')
plt.ylabel('True Labels')
plt.title('Confusion Matrix')
plt.show()

model.save('/Software-Innovation-Studio/model.h5')