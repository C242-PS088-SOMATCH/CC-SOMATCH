const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
});
const bucketName = process.env.GCLOUD_BUCKET_NAME;

const bucket = storage.bucket(bucketName);

module.exports = bucket;
