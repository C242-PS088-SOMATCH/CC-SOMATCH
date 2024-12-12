const { getImagePrediction } = require("../models/image");
const { loadPredictionModel } = require("../config/tensorFlow");
const axios = require("axios");
const tf = require("@tensorflow/tfjs-node");

// Fungsi untuk memproses gambar dari URL
async function processImageFromUrl(imageUrl) {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const imageBuffer = Buffer.from(response.data, "binary");
  const tensor = tf.node.decodeImage(imageBuffer, 3).resizeBilinear([224, 224]).div(255.0).expandDims();
  return tensor;
}

// Fungsi untuk menangani prediksi
async function predict(req, res) {
  const { bottomwear, upperware } = req.body;

  if (!upperware || !bottomwear) {
    return res.status(400).send({ error: "upper_id dan bottom_id diperlukan" });
  }

  try {
    const rows = await getImagePrediction(bottomwear, upperware);

    if (rows.length < 2) {
      return res.status(404).send({ error: "Gambar tidak ditemukan di database" });
    }

    const upperImageUrl = rows.find((row) => row.id == upperware)?.image_url;
    const bottomImageUrl = rows.find((row) => row.id == bottomwear)?.image_url;

    if (!upperImageUrl || !bottomImageUrl) {
      return res.status(404).send({ error: "URL gambar tidak ditemukan" });
    }

    const upperTensor = await processImageFromUrl(upperImageUrl);
    const bottomTensor = await processImageFromUrl(bottomImageUrl);

    // Muat model prediksi
    const model = await loadPredictionModel();
    const inputTensor = { image1_input: upperTensor, image2_input: bottomTensor };
    const predictions = model.predict(inputTensor);
    const result = predictions.dataSync()[0];
    const predictedClass = result >= 0.5 ? "Compatible" : "Not Compatible";

    return res.json({ predictions: result, compatibility: predictedClass });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ error: "Terjadi kesalahan dalam memproses prediksi" });
  }
}

module.exports = { predict };
