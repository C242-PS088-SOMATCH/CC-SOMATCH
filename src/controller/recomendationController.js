const tf = require("@tensorflow/tfjs-node");
const Jimp = require("jimp");
const db = require("../models/image");
const { KMeans } = require("ml-kmeans");
const { rgb2hsv } = require("color-convert");
const sharp = require("sharp");
const axios = require("axios");
const loadRecommendationModel = require("../config/tensorFlow");
const classNames = ["Athleisure", "Business Casual", "Formal", "Gothic", "Minimalist", "Preppy", "Punk", "Streetwear", "Vintage"];

const extractStyleFeatures = async (imagePath) => {
  // Load the image using a suitable Node.js image library (e.g., sharp, Jimp)
  const image = await sharp(imagePath).resize(224, 224).toBuffer(); // Assuming sharp for resizing and conversion

  // Preprocess the image (normalize, add batch dimension)
  const imgArray = tensorflow.image.decodeJpeg(image, 3); // Assuming 3 channels (RGB)
  const normalized = tensorflow.div(imgArray, 255.0);
  const batched = tensorflow.expandDims(normalized, 0);

  // Predict using the loaded style model
  const model = await loadStyleModel("style.h5"); // Replace with your model loading logic
  const predictions = model.predict(batched);
  const predictedLabelIndex = tensorflow.argMax(predictions, (axis = 1)).dataSync()[0];
  const predictedStyle = classNames[predictedLabelIndex];
  return predictedStyle;
};

const extractDominantColor = (imagePath, k = 5) => {
  // Load the image using a suitable Node.js image library (e.g., sharp, Jimp)
  const image = require("sharp")(imagePath).resize(150, 150).toBuffer(); // Assuming sharp for resizing and conversion

  console.log(image);
  // Convert image data to a flattened RGB array
  const imageData = image.data.slice(); // Assuming data is a Uint8Array for RGB values
  const imgArray = new Float32Array(imageData.length / 4); // Create Float32Array for KMeans
  for (let i = 0; i < imgArray.length; i++) {
    imgArray[i] = imageData[i * 4] / 255.0; // Convert RGB values to [0, 1] range
  }

  // Cluster colors using K-Means (consider using a KMeans library for performance)
  const kmeans = new KMeans(k, { randomState: 42, nInit: 10 }); // Assuming implementing basic KMeans for simplicity
  kmeans.fit(imgArray);
  const colors = kmeans.centroids;
  const counts = {};
  for (let label of kmeans.labels) {
    counts[label] = (counts[label] || 0) + 1;
  }

  // Sort colors based on frequency
  const sortedColors = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const dominantColor = colors[sortedColors[0][0]];
  return dominantColor;
};

function rgbToHsv(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, v;

  v = max;

  if (max === 0) {
    s = 0;
  } else {
    s = (max - min) / max;
  }

  if (max === min) {
    h = 0; // achromatic (gray)
  } else {
    if (max === r) {
      h = (g - b) / (max - min);
    } else if (max === g) {
      h = 2 + (b - r) / (max - min);
    } else if (max === b) {
      h = 4 + (r - g) / (max - min);
    }

    h *= 60;

    if (h < 0) {
      h += 360;
    }
  }

  return [h, s, v];
}

function assignColorGroup(dominantColor) {
  const [h, s, v] = rgbToHsv(dominantColor);

  if (s < 0.2 && v > 0.8) {
    return "Neutral";
  } else if (s < 0.3 && v < 0.5) {
    return "Dark";
  } else if (s < 0.4) {
    return "Pastel";
  } else if (0.1 <= h && h <= 0.2 && s > 0.3) {
    return "Earth Tone";
  } else if (s > 0.7 && v > 0.5) {
    return "Bright/Vivid";
  } else if ((0.9 <= h && h <= 1) || (0 <= h && h <= 0.1)) {
    return "Warm";
  } else if (0.5 <= h && h <= 0.75) {
    return "Cool";
  } else {
    return "Other";
  }
}

const matchOutfitsWithColorAndStyle = async (inputIds) => {
  const inputCatalogs = [];
  // Mengiterasi inputIds untuk mengambil data dari setiap ID
  for (const inputId of inputIds) {
    const catalog = await db.getImageRecomendation(inputId);
    inputCatalogs.push(catalog[0]); // Asumsikan db.getImageRecomendation mengembalikan array, ambil elemen pertama
  }

  const inputFeatures = [];

  // Proses setiap katalog
  for (const catalog of inputCatalogs) {
    let { style, color_group, image_url, category, id } = catalog;
    console.log(image_url);

    if (!style || !color_group) {
      style = await extractStyleFeatures(image_url);
      const dominantColor = await extractDominantColor(image_url);
      color_group = assignColorGroup(dominantColor);
      const name = `${dominantColor} + " " + ${style} + " " + ${category}`;

      // Update database untuk katalog ini
      await db.updateMyCatalog(id, style, color_group, dominantColor, name);
    }

    inputFeatures.push({ style, color_group });
  }

  const categoryInput = [];
  for (const id of inputIds) {
    const data = await db.getImageRecomendation(id);
    categoryInput.push(data[0].category); // Ambil category dari data yang dikembalikan
  }

  const allCatalogs = await db.getAllMyCatalog();
  const matchingOutfits = {};

  // Mencocokkan fitur berdasarkan kategori, style, dan color_group
  for (const catalog of allCatalogs) {
    const { id, category, style, color_group } = catalog;
    if (categoryInput.includes(category)) continue;

    inputFeatures.forEach((catalog) => {
      if (style === catalog.style && color_group === catalog.color_group) {
        if (!matchingOutfits[category]) matchingOutfits[category] = [];
        matchingOutfits[category].push(catalog);
      }
    });
  }

  const recommendedOutfits = {};
  for (const category in matchingOutfits) {
    const outfits = matchingOutfits[category];
    if (outfits.length > 0) {
      const randomIndex = Math.floor(Math.random() * outfits.length);
      recommendedOutfits[category] = outfits[randomIndex];
    }
  }

  return recommendedOutfits;
};

module.exports = {
  recommendOutfits: async (req, res) => {
    try {
      const { inputIds } = req.body;

      if (!inputIds || !Array.isArray(inputIds)) {
        return res.status(400).json({
          message: "Recommendation failed",
          error: "Invalid input_ids",
        });
      }

      const recommendedOutfits = await matchOutfitsWithColorAndStyle(inputIds);

      if (Object.keys(recommendedOutfits).length === 0) {
        return res.status(404).json({
          message: "Recommendation failed",
          error: "No matching outfits found",
        });
      }

      return res.status(200).json({
        message: "Recommendation is success",
        input_id: inputIds,
        recommendedOutfits_id: recommendedOutfits,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Recommendation is failed",
        error: error.message,
      });
    }
  },
};
