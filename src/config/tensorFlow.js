const tf = require("@tensorflow/tfjs-node");

// Path ke model untuk fitur 1
const predictionModelPath = "/usr/src/app/src/predicModel/model.json";

// Path ke model untuk fitur 2
const recommendationModelPath = "/usr/src/app/src/recomendationModel/model.json";

// Memuat model untuk fitur 1
const loadPredictionModel = async () => {
  const model = await tf.loadGraphModel(`file://${predictionModelPath}`);
  console.log("Prediction model loaded");
  return model;
};

// Memuat model untuk fitur 2
const loadRecommendationModel = async () => {
  const model = await tf.loadGraphModel(`file://${recommendationModelPath}`);
  console.log("Recommendation model loaded");
  return model;
};

// Gunakan fungsi loadModel untuk memuat model sesuai kebutuhan fitur
loadPredictionModel();
loadRecommendationModel();
