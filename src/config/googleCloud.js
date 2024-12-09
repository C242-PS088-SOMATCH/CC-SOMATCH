const { Storage } = require("@google-cloud/storage");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const fs = require("fs");
const path = require("path");

// Membuat klien untuk Secret Manager
const secretManagerClient = new SecretManagerServiceClient();

// Fungsi untuk mengambil kredensial dari Secret Manager
async function getGoogleCredentials() {
  try {
    const secretName = process.env.GOOGLE_APPLICATION_CREDENTIALS; // Nama secret di Secret Manager
    const [version] = await secretManagerClient.accessSecretVersion({ name: secretName });
    const credentials = version.payload.data.toString();

    // Simpan kredensial ke file sementara di /tmp
    const tempCredentialsPath = path.join("/tmp", "gcp-credentials.json");
    fs.writeFileSync(tempCredentialsPath, credentials);

    return tempCredentialsPath;
  } catch (error) {
    console.error("Error accessing secret:", error);
    throw error;
  }
}

// Inisialisasi Google Cloud Storage dan kembalikan bucket
async function initializeStorage() {
  try {
    const credentialsPath = await getGoogleCredentials(); // Mendapatkan kredensial dari Secret Manager

    const storage = new Storage({
      keyFilename: credentialsPath, // Menggunakan file sementara kredensial
      projectId: process.env.GCLOUD_PROJECT_ID,
    });

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
