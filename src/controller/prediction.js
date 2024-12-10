// Import TensorFlow.js
import * as tf from "@tensorflow/tfjs";

// Load the TensorFlow.js model
async function loadModel() {
  const model = await tf.loadLayersModel("/content/tfjs_model/model.json");
  console.log("Model loaded successfully");
  return model;
}

// Preprocess input images
async function prepareInput(imagePathUpper, imagePathBottom) {
  const imageUpper = tf.browser.fromPixels(imagePathUpper).resizeBilinear([224, 224]).toFloat().div(255.0).expandDims(0);

  const imageBottom = tf.browser.fromPixels(imagePathBottom).resizeBilinear([224, 224]).toFloat().div(255.0).expandDims(0);

  return { image1_input: imageUpper, image2_input: imageBottom };
}

// Main function to predict
async function predictCompatibility(imagePathUpper, imagePathBottom) {
  const model = await loadModel();
  const inputs = await prepareInput(imagePathUpper, imagePathBottom);

  const predictions = model.predict(inputs);
  const predictedClass = predictions.dataSync()[0] >= 0.5 ? 1 : 0;

  console.log("Predictions:", predictions.dataSync());
  if (predictedClass === 1) {
    console.log("Compatible");
  } else {
    console.log("Not Compatible");
  }
}

// Example usage
const imagePathUpper = document.getElementById("upper-image"); // Replace with image element or URL
const imagePathBottom = document.getElementById("bottom-image"); // Replace with image element or URL

predictCompatibility(imagePathUpper, imagePathBottom);
