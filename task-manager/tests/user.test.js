const request = require("supertest");
const app = require("./../src/app");
const User = require("./../src/models/user.js");
const {
  userExists,
  userExistsId,
  userNotExists,
  setupDatabase,
} = require("./fixtures/db.js");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Tugba Zeki",
      email: "aziz.coktu@boun.edu.tr",
      password: "ayten0203!",
    })
    .expect(201);
});

test("Should login an existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userExists.email,
      password: userExists.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  expect(user.tokens[1].token).toBe(response.body.token);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userNotExists.email,
      password: userNotExists.password,
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userExists.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for authenticated user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userExists.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userExistsId);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userExists.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/robot.webp")
    .expect(200);

  const user = await User.findById(userExistsId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userExists.tokens[0].token}`)
    .send({ name: "Jonathan" })
    .expect(200);
  const user = await User.findById(userExistsId);
  expect(user.name === "Jonathan");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userExists.tokens[0].token}`)
    .send({ location: "Adana" })
    .expect(400);
});
