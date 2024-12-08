const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCLOUD_PROJECT_ID,
});
const bucketName = process.env.GCLOUD_BUCKET_NAME;

const bucket = storage.bucket(bucketName);

module.exports = bucket;
