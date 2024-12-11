const dbPool = require("../config/database.js");

const getAllUsers = () => {
  const SQLQuery = "SELECT * FROM users WHERE delete_at = 0";

  return dbPool.execute(SQLQuery);
};

const getUser = (userId) => {
  console.log(userId);
  const SQLQuery = `SELECT * FROM users WHERE id=?`;

  return dbPool.execute(SQLQuery, [userId]);
};

const registerUser = (body, hashedPassword) => {
  const SQLQuery = `INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)`;

  return dbPool.execute(SQLQuery, [body.name, body.email, body.username, hashedPassword]);
};

const loginUser = (body) => {
  const SQLQuery = `SELECT * FROM users WHERE (email = ? OR username = ?) AND delete_at = 0`;
  return dbPool.execute(SQLQuery, [body.email, body.email]);
};

const findByEmail = (body) => {
  const SQLQuery = `'SELECT * FROM users WHERE email = ?'`;

  // Use parameterized query to prevent SQL injection
  return dbPool.execute(SQLQuery, body.email);
};

const createNewUser = (body) => {
  const SQLQuery = `INSERT INTO users (name, email, username, address) VALUES (?, ?, ?, ?)`;

  // Use parameterized query to prevent SQL injection
  return dbPool.execute(SQLQuery, [body.name, body.email, body.username, body.address]);
};

const updateUser = (body, idUser) => {
  const SQLQuery = `UPDATE users 
                    SET name='${body.name}', email='${body.email}', username='${body.username}' 
                    WHERE id=${idUser}`;
  return dbPool.execute(SQLQuery);
};

// const deleteUser = (idUsers) => {
//   const SQLQuery = `DELETE FROM users WHERE id=${idUsers}`;

//   return dbPool.execute(SQLQuery);
// };

const deleteUser = (idUser) => {
  const SQLQuery = `UPDATE users SET delete_at = 1 WHERE id = ?`;
  return dbPool.execute(SQLQuery, [idUser]);
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  findByEmail,
  registerUser,
  loginUser,
  getUser,
};
