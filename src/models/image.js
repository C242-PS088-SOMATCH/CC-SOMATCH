const dbPool = require("../config/database.js");

const myCatalog = (userId, imageUrl) => {
  const SQLQuery = `INSERT INTO mycatalog (user_id, image_url) VALUES (?, ?)`;

  return dbPool.execute(SQLQuery, [userId, imageUrl]);
};

const getAllMyCatalog = (userId) => {
  const SQLQuery = `SELECT * FROM mycatalog WHERE user_id=?`;

  return dbPool.execute(SQLQuery, [userId]);
};

module.exports = {
  myCatalog,
  getAllMyCatalog,
};
