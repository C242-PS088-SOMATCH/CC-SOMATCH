const dbPool = require("../config/database.js");

const getAllUsers = () => {
  const SQLQuery = "SELECT * FROM users";

  return dbPool.execute(SQLQuery);
};

const findByEmail = (body) => {
  const SQLQuery = `'SELECT * FROM users WHERE email = ?'`;

  // Use parameterized query to prevent SQL injection
  return dbPool.execute(SQLQuery, body.email);
};

const createNewUser = (body) => {
  const SQLQuery = `INSERT INTO users (name, email, address) VALUES (?, ?, ?)`;

  // Use parameterized query to prevent SQL injection
  return dbPool.execute(SQLQuery, [body.name, body.email, body.address]);
};

const updateUser = (body, idUser) => {
  const SQLQuery = `UPDATE users 
                    SET name='${body.name}', email='${body.email}', address='${body.address}' 
                    WHERE id=${idUser}`;
  return dbPool.execute(SQLQuery);
};

const deleteUser = (idUsers) => {
  const SQLQuery = `DELETE FROM users WHERE id=${idUsers}`;

  return dbPool.execute(SQLQuery);
};
module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  findByEmail,
};
