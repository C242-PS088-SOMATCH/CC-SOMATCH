const dbPool = require("../config/database.js");

const myCatalog = (userId, imageUrl, type) => {
  const SQLQuery = `INSERT INTO mycatalog (user_id, image_url, category) VALUES (?, ?, ?)`;

  return dbPool.execute(SQLQuery, [userId, imageUrl, type]);
};

const getAllMyCatalog = (userId) => {
  const SQLQuery = `SELECT * FROM mycatalog WHERE user_id=?`;

  return dbPool.execute(SQLQuery, [userId]);
};

const getRandMyCatalog = () => {
  const SQLQuery = `SELECT * FROM mycatalog ORDER BY RAND() LIMIT 6`;

  return dbPool.execute(SQLQuery, [userId]);
};

// Fungsi untuk mengambil URL gambar berdasarkan id katalog
const getImagePrediction = async (upperware, bottomware) => {
  const SQLQuery = `SELECT id, image_url FROM mycatalog WHERE id IN (?, ?)`;
  const [rows] = await dbPool.execute(SQLQuery, [upperware, bottomware]);
  return rows;
};

const getImageRecomendation = async (id) => {
  const SQLQuery = `SELECT * FROM mycatalog WHERE id=?`;
  const [rows] = await dbPool.execute(SQLQuery, [id]);
  return rows;
};

const updateMyCatalog = (id, style, color_group, dominant_color, name) => {
  const SQLQuery = `UPDATE mycatalog SET style='${style}', color_group='${color_group}', dominant_color='${dominant_color}', name='${name} WHERE id='${id}''`;

  return dbPool.execute(SQLQuery);
};

module.exports = {
  myCatalog,
  getAllMyCatalog,
  getImagePrediction,
  getImageRecomendation,
  updateMyCatalog,
  getRandMyCatalog,
};
