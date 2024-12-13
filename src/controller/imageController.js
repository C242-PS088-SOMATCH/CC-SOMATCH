const path = require("path");
const bucket = require("../config/googleCloud");
const image = require("../models/image");

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { type } = req.body; // Mengambil type dari body request

  if (!type) {
    return res.status(400).json({ message: "Type is required" });
  }

  const blob = bucket.file(Date.now() + path.extname(req.file.originalname));
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobStream.on("error", (err) => {
    return res.status(500).json({ message: "Error uploading file", error: err });
  });

  blobStream.on("finish", async () => {
    // Mendapatkan URL gambar setelah berhasil diupload
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    try {
      const userId = req.user.id; // Mengambil ID pengguna dari JWT yang didekodekan

      // Simpan data gambar ke database
      const [result] = await image.myCatalog(userId, imageUrl, type);

      res.status(200).json({
        message: "Image uploaded successfully",
        imageId: result.insertId, // ID gambar dari hasil insert
        imageUrl: imageUrl,
        type: type,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save image in database" });
    }
  });

  blobStream.end(req.file.buffer);
};

const getAllMyCatalog = async (req, res) => {
  const userId = req.user.id;
  try {
    const [data] = await image.getAllMyCatalog(userId);
    res.json({
      message: "GET all images success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getRandMyCatalog = async (req, res) => {
  // const userId = req.user.id;
  try {
    const [data] = await image.getRandMyCatalog();
    res.json({
      message: "GET all images success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};
module.exports = {
  uploadImage,
  getAllMyCatalog,
  getRandMyCatalog,
};
