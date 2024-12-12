const dbPool = require("../config/database.js");

const myCatalog = (userId, imageUrl, type) => {
  const SQLQuery = `INSERT INTO mycatalog (user_id, image_url, type) VALUES (?, ?, ?)`;

  return dbPool.execute(SQLQuery, [userId, imageUrl, type]);
};

const getAllMyCatalog = (userId) => {
  const SQLQuery = `SELECT * FROM mycatalog WHERE user_id=?`;

  return dbPool.execute(SQLQuery, [userId]);
};

// Fungsi untuk mengambil URL gambar berdasarkan id katalog
const getImagePrediction = async (upperware, bottomware) => {
  const SQLQuery = `SELECT id, image_url FROM mycatalog WHERE id IN (?, ?)`;
  const [rows] = await dbPool.execute(SQLQuery, [upperware, bottomware]);
  return rows;
};

module.exports = {
  myCatalog,
  getAllMyCatalog,
  getImagePrediction,
};
