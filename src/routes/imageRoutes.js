const express = require("express");
const multer = require("multer");
const imageController = require("../controller/imageController");
const verifyToken = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = express.Router();

router.post("/upload", verifyToken, upload.single("image"), imageController.uploadImage);
router.get("/", verifyToken, imageController.getAllMyCatalog);

module.exports = router;
