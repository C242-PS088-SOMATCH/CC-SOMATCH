const tf = require("@tensorflow/tfjs-node");

// Memuat model prediction TensorFlow.js
let model1;

async function loadModel1() {
  model1 = await tf.loadLayersModel("../tfjs_model/model.json");
  console.log("Model berhasil dimuat!");
}

function getModel1() {
  if (!model1) {
    throw new Error("Model belum dimuat");
  }
  return model1;
}

module.exports = { loadModel1, getModel1 };
