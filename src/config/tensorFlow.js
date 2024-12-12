const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");

// Path ke model untuk fitur 1
const predictionModelPath = "https://storage.googleapis.com/somatch/model/Prediksi/model.json";

// // Path ke model untuk fitur 2
// const recommendationModelPath = "D:/BANGKIT2024/SoMatch/src/recomendationModelmodel.json";

// Memuat model untuk fitur 1
const loadPredictionModel = async () => {
  const model = await tf.loadLayersModel(`${predictionModelPath}`);
  if (!fs.existsSync(predictionModelPath)) {
    console.log("Model file not found:", predictionModelPath);
  }
  console.log("Prediction model loaded");
  return model;
};

// // Memuat model untuk fitur 2
// const loadRecommendationModel = async () => {
//   const model = await tf.loadModel(`file://${recommendationModelPath}`);
//   console.log("Recommendation model loaded");
//   return model;
// };

// Gunakan fungsi loadModel untuk memuat model sesuai kebutuhan fitur
module.exports = { loadPredictionModel };
