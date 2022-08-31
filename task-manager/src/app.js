const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/userRouter.js");
const taskRouter = require("./routers/taskRouter.js");

const app = express();

/* // Middleware code for maintanance mode.
app.use((req, res, next) => {
  res.status(503).send("The site is under maintanance. Please try again soon!");
});
 */

app.use(express.json());

app.use(userRouter);

app.use(taskRouter);

module.exports = app;
