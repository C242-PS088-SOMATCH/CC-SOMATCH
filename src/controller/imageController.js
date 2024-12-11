const path = require("path");
const bucket = require("../config/googleCloud");
const image = require("../models/image");

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
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
    const imageUrl = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;

    // Simpan URL ke database MySQL
    try {
      const userId = req.user.id; // Mengambil ID pengguna dari JWT yang didekodekan
      console.log("Saving to database:", { userId, imageUrl }); // Tambahkan log
      await image.myCatalog(userId, imageUrl);

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: imageUrl,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save image URL in database" });
    }
  });

  blobStream.end(req.file.buffer);
};

const getAllMyCatalog = async (req, res) => {
  const userId = req.user.id;
  try {
    const [data] = await image.getAllMyCatalog(userId);
    res.json({
      message: "GET all users success",
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
};
