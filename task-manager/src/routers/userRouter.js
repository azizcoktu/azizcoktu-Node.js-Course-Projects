const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("./../models/user.js");
const auth = require("./../middleware/auth.js");
const {
  sendWelcomeEmail,
  sendCancelationEmail,
} = require("./../emails/account.js");

const MAX_AVATAR_SIZE = 2 * 1000000;

const userRouter = new express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  dest: "avatars",
  limits: {
    fileSize: MAX_AVATAR_SIZE,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(webp|jpeg|png|jpg)$/))
      return cb(new Error("Please upload an image."));
    cb(undefined, true);
  },
  storage,
});

userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

userRouter.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredientials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

/* userRouter.post("/users/logoutAllUsers", auth, async (req, res) => {
  try {
    await User.updateMany({}, { tokens: [] });
    res.send();
  } catch (error) {
    res.status(500).send();
  }
}); */

userRouter.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

userRouter.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

userRouter.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

userRouter.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error();
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

userRouter.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates!" });

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    sendCancelationEmail(req.user.email, req.user.name);
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

userRouter.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await user.save();
  res.send();
});

module.exports = userRouter;
