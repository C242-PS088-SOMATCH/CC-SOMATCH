const { Storage } = require("@google-cloud/storage");
const path = require("path");

// Inisialisasi Google Cloud Storage dan kembalikan bucket
async function initializeStorage() {
  try {
    const storage = new Storage(); // Google Cloud SDK akan menggunakan kredensial default di Cloud Run
    const bucketName = process.env.GCLOUD_BUCKET_NAME;
    const bucket = storage.bucket(bucketName);

    return bucket;
  } catch (error) {
    console.error("Error initializing Google Cloud Storage:", error);
    throw error;
  }
}

// Ekspor fungsi inisialisasi bucket untuk digunakan di controller lain
module.exports = initializeStorage;
