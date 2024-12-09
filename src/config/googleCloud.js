const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const bucketName = process.env.GCLOUD_BUCKET_NAME;

const bucket = storage.bucket(bucketName);

module.exports = bucket;
