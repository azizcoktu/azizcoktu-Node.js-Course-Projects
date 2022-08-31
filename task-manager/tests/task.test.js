const request = require("supertest");
const app = require("./../src/app");
const Task = require("../src/models/task.js");
const {
  userExists,
  userExistsId,
  setupDatabase,
  userExists2,
  taskOne,
} = require("./fixtures/db.js");

const taskDescription = "Insert this test task!";
const completedDefault = false;

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userExists.tokens[0].token}`)
    .send({
      description: taskDescription,
    })
    .expect(201);
  const task = await Task.find({ owner: userExistsId });
  expect(task.description === taskDescription);
  expect(task.completed === completedDefault);
});

test("Should fetch all tasks for existing user 1", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userExists.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length === 2);
});

test("Should not delete tasks of other users", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userExists2.tokens[0].token}`)
    .send()
    .expect(404);

  const task_one = Task.findById(taskOne._id);
  expect(task_one).not.toBeNull();
});
