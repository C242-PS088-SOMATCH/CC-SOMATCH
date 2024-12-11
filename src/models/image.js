const dbPool = require("../config/database.js");

const myCatalog = (userId, imageUrl, type) => {
  const SQLQuery = `INSERT INTO mycatalog (user_id, image_url, type) VALUES (?, ?, ?)`;

  return dbPool.execute(SQLQuery, [userId, imageUrl, type]);
};

const getAllMyCatalog = (userId) => {
  const SQLQuery = `SELECT * FROM mycatalog WHERE user_id=?`;

  return dbPool.execute(SQLQuery, [userId]);
};

module.exports = {
  myCatalog,
  getAllMyCatalog,
};
