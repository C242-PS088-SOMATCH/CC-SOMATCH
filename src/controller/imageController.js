const path = require("path");
const initializeStorage = require("../config/googleCloud"); // Mengimpor konfigurasi bucket
const image = require("../models/image"); // Model untuk mengelola data gambar

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Inisialisasi bucket dengan memanggil fungsi dari googleCloud.js
    const bucket = await initializeStorage();

    const blob = bucket.file(Date.now() + path.extname(req.file.originalname)); // Penamaan file
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Menangani error dalam blob stream
    blobStream.on("error", (err) => {
      console.error("Blob stream error:", err); // Menambahkan log error untuk debugging
      return res.status(500).json({
        message: "Error uploading file",
        error: err, // Kirimkan error yang lebih lengkap
      });
    });

    // Menangani kesuksesan upload
    blobStream.on("finish", async () => {
      // Mendapatkan URL gambar setelah berhasil diupload
      const imageUrl = `https://storage.cloud.google.com/${bucket.name}/myCatalog/${blob.name}`;

      try {
        const userId = req.user.id; // Mengambil ID pengguna dari JWT yang didekodekan
        console.log("Saving to database:", { userId, imageUrl });
        await image.myCatalog(userId, imageUrl); // Simpan URL ke database

        res.status(200).json({
          message: "Image uploaded successfully",
          imageUrl: imageUrl,
        });
      } catch (err) {
        console.error("Database save error:", err);
        res.status(500).json({ message: "Failed to save image URL in database" });
      }
    });

    blobStream.end(req.file.buffer); // Mengakhiri upload file
  } catch (error) {
    console.error("Error during image upload:", error);
    res.status(500).json({ message: "Error during image upload" });
  }
};

// Fungsi untuk mendapatkan semua katalog gambar pengguna
const getAllMyCatalog = async (req, res) => {
  const userId = req.user.id;
  try {
    const [data] = await image.getAllMyCatalog(userId);
    res.json({
      message: "GET all users success",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching catalog:", error);
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
