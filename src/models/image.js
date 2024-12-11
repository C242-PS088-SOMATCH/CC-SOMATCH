const dbPool = require("../config/database.js");

const myCatalog = (userId, imageUrl) => {
  const SQLQuery = `INSERT INTO mycatalog (user_id, image_url) VALUES (?, ?)`;

  return dbPool.execute(SQLQuery, [userId, imageUrl]);
};

const getAllMyCatalog = (userId) => {
  const SQLQuery = `SELECT * FROM mycatalog WHERE user_id=?`;

  return dbPool.execute(SQLQuery, [userId]);
};

const getImageRecomendation = (accessories, bottomwear, footwear, onePiece, upperware) => {
  const SQLQuery = `SELECT id, image_url FROM myCatalog WHERE id IN (?, ?, ?, ?, ?)`;

  return dbPool.execute(SQLQuery, [accessories, bottomwear, footwear, onePiece, upperware]);
};

const getImagePrediction = (bottomwearupperware) => {
  const SQLQuery = `SELECT id, image_url FROM myCatalog WHERE id IN (?, ?)`;

  return dbPool.execute(SQLQuery, [bottomwear, upperware]);
};
module.exports = {
  myCatalog,
  getAllMyCatalog,
  getImageRecomendation,
  getImagePrediction,
};
