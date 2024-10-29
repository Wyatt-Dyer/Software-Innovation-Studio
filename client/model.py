import numpy as np
import os
import shutil
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications import EfficientNetB3
from tensorflow.keras import layers, models
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils.class_weight import compute_class_weight
from imblearn.over_sampling import SMOTE
from sklearn.preprocessing import LabelEncoder
from collections import Counter
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, TensorBoard
import seaborn as sns
import matplotlib.pyplot as plt

# Set base model
base_model = EfficientNetB3(include_top=False, weights='imagenet', pooling='avg')

# Directory setup
data_directory = 'D:\\datasets\\Mushrooms'
writable_directory = 'D:\\datasets\\temp\\Mushrooms'

if os.path.exists(writable_directory):
    shutil.rmtree(writable_directory)
os.makedirs(writable_directory, exist_ok=True)

# Copy images to a new directory
for class_name in os.listdir(data_directory):
    class_directory = os.path.join(data_directory, class_name)
    writable_class_directory = os.path.join(writable_directory, class_name)
    os.makedirs(writable_class_directory, exist_ok=True)

    for image in os.listdir(class_directory):
        src_path = os.path.join(class_directory, image)
        dest_path = os.path.join(writable_class_directory, image)
        shutil.copy(src_path, dest_path)

# Load images and labels
X = []
y = []
for class_name in os.listdir(writable_directory):
    class_directory = os.path.join(writable_directory, class_name)
    images = os.listdir(class_directory)

    for image in images:
        image_path = os.path.join(class_directory, image)
        img = load_img(image_path, target_size=(300, 300))
        img_array = img_to_array(img)
        
        X.append(img_array)
        y.append(class_name)

X = np.array(X)
y = np.array(y)

# Split the dataset into train, validation, and test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, shuffle=True)
X_train, X_val, y_train, y_val = train_test_split(X_train, y_train, test_size=0.2, random_state=42, shuffle=True)

# Oversample only the training dataset
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train.reshape(X_train.shape[0], -1), y_train)
X_train_resampled = X_train_resampled.reshape(-1, 300, 300, 3)

# Encode labels
le = LabelEncoder()
y_train_encoded = le.fit_transform(y_train_resampled)
y_val_encoded = le.transform(y_val)
y_test_encoded = le.transform(y_test)

# Compute class weights
class_names = le.classes_
class_weights = compute_class_weight('balanced', classes=np.arange(len(le.classes_)), y=y_train_encoded)
class_weight_dict = {i: class_weights[i] for i in range(len(class_weights))}

# Convert labels to one-hot encoded format
y_train_one_hot = to_categorical(y_train_encoded, num_classes=len(le.classes_))
y_val_one_hot = to_categorical(y_val_encoded, num_classes=len(le.classes_))
y_test_one_hot = to_categorical(y_test_encoded, num_classes=len(le.classes_))

# Extract features with EfficientNetB3
X_train_features = base_model.predict(X_train_resampled)
X_val_features = base_model.predict(X_val)
X_test_features = base_model.predict(X_test)

# Unfreeze the last 100 layers of EfficientNetB3
for layer in base_model.layers[-100:]:
    layer.trainable = True

# Define the final model
input_shape = (1536,)
inputs = tf.keras.Input(shape=input_shape)

x = layers.Dense(1024, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01))(inputs)
x = layers.BatchNormalization(trainable=True)(x)
x = layers.Dropout(0.2)(x)

x = layers.Dense(512, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01))(x)
x = layers.BatchNormalization(trainable=True)(x)
x = layers.Dropout(0.2)(x)

x = layers.Dense(256, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01))(x)
x = layers.BatchNormalization(trainable=True)(x)
x = layers.Dropout(0.2)(x)

x = layers.Dense(128, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01))(x)
x = layers.BatchNormalization(trainable=True)(x)
x = layers.Dropout(0.2)(x)

outputs = layers.Dense(len(class_names), activation='softmax')(x)
model = tf.keras.Model(inputs, outputs)

# Compile the model
optimizer = Adam(learning_rate=1e-4)
loss = tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.05)
model.compile(optimizer=optimizer, loss=loss, metrics=['accuracy'])

# Callbacks
early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True, verbose=1)
lr_scheduler = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1, min_lr=1e-6)
tensorboard_callback = TensorBoard(log_dir='./logs', histogram_freq=1, update_freq='epoch')

# Train the model
history_fine = model.fit(
    x=X_train_features,
    y=y_train_one_hot,
    batch_size=16,
    epochs=50,
    validation_data=(X_val_features, y_val_one_hot),
    class_weight=class_weight_dict,
    callbacks=[early_stopping, lr_scheduler, tensorboard_callback]
)

# Evaluate the model
val_loss, val_accuracy = model.evaluate(X_val_features, y_val_one_hot)
print(f"Validation Accuracy: {val_accuracy}")

test_loss, test_accuracy = model.evaluate(X_test_features, y_test_one_hot)
print(f"Test Accuracy: {test_accuracy}")

# Generate predictions and classification report
predictions = model.predict(X_test_features)
predicted_classes = np.argmax(predictions, axis=1)
print(classification_report(y_test_encoded, predicted_classes))

# Confusion matrix
cm = confusion_matrix(y_test_encoded, predicted_classes)
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, cmap='Blues', fmt='d', xticklabels=le.classes_, yticklabels=le.classes_)
plt.xlabel('Predicted Labels')
plt.ylabel('True Labels')
plt.title('Confusion Matrix')
plt.show()

# Save the model
model.save('/Software-Innovation-Studio/model.keras')
