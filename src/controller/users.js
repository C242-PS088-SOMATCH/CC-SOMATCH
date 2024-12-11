const bcrypt = require("bcrypt");
const UserModel = require("../models/users.js");

const getAllUsers = async (req, res) => {
  try {
    const [data] = await UserModel.getAllUsers();
    res.json({
      message: "GET all users success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const [data] = await UserModel.getUser(userId);
    res.json({
      message: "GET all users success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const createNewUser = async (req, res) => {
  const { body } = req;
  try {
    await UserModel.createNewUser(body);
    res.status(201).json({
      message: "CREATE new user success",
      data: body,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const idUser = req.user.id;
  const { body } = req;
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    await UserModel.updateUser(body, idUser, hashedPassword);
    res.status(201).json({
      message: "UPDATE user success",
      data: {
        id: idUser,
        ...body,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const idUser = req.user.id;
  try {
    await UserModel.deleteUser(idUser);
    res.json({
      message: "DELETE user success",
      data: null,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUser,
};
