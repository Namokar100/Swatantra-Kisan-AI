import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# Load the saved model
model_path = model_path = '../models/soil_classifier_model.keras'  # Path to the model
model = tf.keras.models.load_model(model_path)

# Print model summary to verify loading
model.summary()

# Path to the test image
image_path = '../images/Black1.jpg'  # Replace with the actual image name

# Preprocess the image
img_size = (224, 224)  # Input size for the model
image = load_img(image_path, target_size=img_size)  # Load and resize the image
image_array = img_to_array(image)  # Convert image to array
image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
image_array = image_array / 255.0  # Normalize pixel values

# Predict the class of the image
predictions = model.predict(image_array)
predicted_class = np.argmax(predictions, axis=1)

# Get class labels (assuming the model was trained with categorical labels)
class_labels = ['Alluvial', 'Black', 'Clay', 'Laterite', 'Red', 'Sandy']  # Sorted alphabetically

# Print the prediction
print(f"Predicted Class: {class_labels[predicted_class[0]]}")