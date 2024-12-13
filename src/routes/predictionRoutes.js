const express = require("express");
const router = express.Router();
const { predict } = require("../controller/predictionController");
const { recommendOutfits } = require("../controller/recomendationController");
const verifyToken = require("../middleware/auth");

// Route untuk prediksi
router.post("/predict", verifyToken, predict);

router.post("/recommend", verifyToken, recommendOutfits);

module.exports = router;
