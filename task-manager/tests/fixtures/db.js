// importing dependencies
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./../../src/models/user.js");
const Task = require("./../../src/models/task.js");

// Ids for users
const userExistsId = new mongoose.Types.ObjectId();
const userExistsId2 = new mongoose.Types.ObjectId();

// Users for tests
const userExists = {
  _id: userExistsId,
  name: "Mike",
  email: "mike@example.com",
  password: "65what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userExistsId }, process.env.JWT_SECRET),
    },
  ],
};
const userExists2 = {
  _id: userExistsId2,
  name: "John",
  email: "john@example.com",
  password: "65what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userExistsId2 }, process.env.JWT_SECRET),
    },
  ],
};
const userNotExists = {
  name: "Murat",
  email: "mct@mct.com",
  password: "56that??",
};

// Tasks for tests belonging to first existing user
const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First Task",
  completed: false,
  owner: userExistsId,
};
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second Task",
  completed: true,
  owner: userExistsId,
};

// Task for tests belonging to second existing user
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third Task",
  completed: true,
  owner: userExistsId2,
};

// Function that sets state of database before each test.
const setupDatabase = async function () {
  await User.deleteMany();
  await new User(userExists).save();
  await new User(userExists2).save();
  await Task.deleteMany();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

// exporting the variables.
module.exports = {
  userExists,
  userExistsId,
  userExists2,
  userExistsId2,
  userNotExists,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
};
