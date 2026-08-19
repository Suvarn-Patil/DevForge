import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../src/app";

let mongoServer: MongoMemoryServer;

let userAToken: string;
let userBToken: string;

let projectId: string;

let taskId: string;
let highPriorityTaskId: string;
let lowPriorityTaskId: string;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret";

  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri());

  await request(app)
    .post("/api/auth/register")
    .send({
      name: "User A",
      email: "usera@example.com",
      password: "password123",
    });

  await request(app)
    .post("/api/auth/register")
    .send({
      name: "User B",
      email: "userb@example.com",
      password: "password123",
    });

  const loginA = await request(app)
    .post("/api/auth/login")
    .send({
      email: "usera@example.com",
      password: "password123",
    });

  expect(loginA.status).toBe(200);

  userAToken = loginA.body.token;

  const loginB = await request(app)
    .post("/api/auth/login")
    .send({
      email: "userb@example.com",
      password: "password123",
    });

  expect(loginB.status).toBe(200);

  userBToken = loginB.body.token;
});

afterAll(async () => {
  await mongoose.connection.db?.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Project and Task Integration Tests", () => {
  // =========================================
  // PROJECTS
  // =========================================

  it("should allow User A to create a project", async () => {
    const response = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        name: "User A Project",
        description: "Project owned by User A",
      });

    expect(response.status).toBe(201);

    expect(response.body.name).toBe("User A Project");

    projectId = response.body._id;

    expect(projectId).toBeDefined();
  });

  it("should allow User A to fetch their projects", async () => {
    const response = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveLength(1);

    expect(response.body[0].name).toBe("User A Project");
  });

  it("should NOT allow User B to access User A's project", async () => {
    const response = await request(app)
      .get(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${userBToken}`);

    expect(response.status).toBe(404);
  });

  it("should NOT allow User B to update User A's project", async () => {
    const response = await request(app)
      .put(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${userBToken}`)
      .send({
        name: "Hacked Project",
      });

    expect(response.status).toBe(404);
  });

  // =========================================
  // CREATE TASKS
  // =========================================

  it("should allow User A to create a task in their project", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        title: "Build authentication",
        description: "Implement JWT authentication",
        project: projectId,
        priority: "high",
      });

    expect(response.status).toBe(201);

    expect(response.body.title).toBe("Build authentication");

    expect(response.body.project).toBe(projectId);

    taskId = response.body._id;

    expect(taskId).toBeDefined();
  });

  it("should create a high priority task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        title: "Fix production bug",
        description: "Fix critical production issue",
        project: projectId,
        priority: "high",
      });

    expect(response.status).toBe(201);

    highPriorityTaskId = response.body._id;

    expect(highPriorityTaskId).toBeDefined();
  });

  it("should create a low priority task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        title: "Update documentation",
        description: "Improve project documentation",
        project: projectId,
        priority: "low",
      });

    expect(response.status).toBe(201);

    lowPriorityTaskId = response.body._id;

    expect(lowPriorityTaskId).toBeDefined();
  });

  it("should NOT allow User B to create a task in User A's project", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userBToken}`)
      .send({
        title: "Unauthorized task",
        description: "This should not be allowed",
        project: projectId,
        priority: "high",
      });

    expect(response.status).toBe(404);
  });

  // =========================================
  // TASK CREATION VALIDATION
  // =========================================

  it("should reject task creation without a title", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        description: "Task without title",
        project: projectId,
        priority: "medium",
      });

    expect(response.status).toBe(400);
  });

  it("should reject task creation without a project", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        title: "Task without project",
        description: "Missing project",
        priority: "medium",
      });

    expect(response.status).toBe(400);
  });

  it("should reject an invalid task priority", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        title: "Invalid priority task",
        description: "Invalid priority",
        project: projectId,
        priority: "urgent",
      });

    expect(response.status).toBe(400);
  });

  it("should reject an invalid task status", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        title: "Invalid status task",
        description: "Invalid status",
        project: projectId,
        priority: "medium",
        status: "invalid",
      });

    expect(response.status).toBe(400);
  });

  // =========================================
  // FETCH TASKS
  // =========================================

  it("should allow User A to fetch their tasks", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(3);

    expect(response.body.pagination).toBeDefined();

    expect(response.body.pagination.page).toBe(1);

    expect(response.body.pagination.limit).toBe(10);

    expect(response.body.pagination.total).toBe(3);

    expect(response.body.pagination.totalPages).toBe(1);
  });

  // =========================================
  // PAGINATION
  // =========================================

  it("should paginate tasks on page 1", async () => {
    const response = await request(app)
      .get("/api/tasks?page=1&limit=2")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(2);

    expect(response.body.pagination.page).toBe(1);

    expect(response.body.pagination.limit).toBe(2);

    expect(response.body.pagination.total).toBe(3);

    expect(response.body.pagination.totalPages).toBe(2);
  });

  it("should paginate tasks on page 2", async () => {
    const response = await request(app)
      .get("/api/tasks?page=2&limit=2")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(1);

    expect(response.body.pagination.page).toBe(2);

    expect(response.body.pagination.limit).toBe(2);

    expect(response.body.pagination.total).toBe(3);

    expect(response.body.pagination.totalPages).toBe(2);
  });

  it("should reject invalid pagination values", async () => {
    const pageResponse = await request(app)
      .get("/api/tasks?page=0")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(pageResponse.status).toBe(400);

    const limitResponse = await request(app)
      .get("/api/tasks?limit=101")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(limitResponse.status).toBe(400);
  });

  // =========================================
  // STATUS FILTER
  // =========================================

  it("should filter tasks by status", async () => {
    const updateResponse = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        status: "inprogress",
      });

    expect(updateResponse.status).toBe(200);

    const response = await request(app)
      .get("/api/tasks?status=inprogress")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(1);

    expect(response.body.tasks[0]._id).toBe(taskId);

    expect(response.body.tasks[0].status).toBe("inprogress");

    expect(response.body.pagination.total).toBe(1);
  });

  it("should return only todo tasks", async () => {
    const response = await request(app)
      .get("/api/tasks?status=todo")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(2);

    response.body.tasks.forEach((task: any) => {
      expect(task.status).toBe("todo");
    });
  });

  // =========================================
  // PRIORITY FILTER
  // =========================================

  it("should filter tasks by high priority", async () => {
    const response = await request(app)
      .get("/api/tasks?priority=high")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(2);

    response.body.tasks.forEach((task: any) => {
      expect(task.priority).toBe("high");
    });
  });

  it("should filter tasks by low priority", async () => {
    const response = await request(app)
      .get("/api/tasks?priority=low")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(1);

    expect(response.body.tasks[0]._id).toBe(
      lowPriorityTaskId
    );

    expect(response.body.tasks[0].priority).toBe("low");
  });

  // =========================================
  // COMBINED FILTER
  // =========================================

  it("should filter by status and priority together", async () => {
    const response = await request(app)
      .get("/api/tasks?status=todo&priority=high")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(1);

    expect(response.body.tasks[0]._id).toBe(
      highPriorityTaskId
    );

    expect(response.body.tasks[0].status).toBe("todo");

    expect(response.body.tasks[0].priority).toBe("high");
  });

  // =========================================
  // SORTING
  // =========================================

  it("should sort tasks by newest", async () => {
    const response = await request(app)
      .get("/api/tasks?sort=newest")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(3);

    expect(response.body.sort).toBe("newest");

    const dates = response.body.tasks.map(
      (task: any) =>
        new Date(task.createdAt).getTime()
    );

    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(
        dates[i + 1]
      );
    }
  });

  it("should sort tasks by oldest", async () => {
    const response = await request(app)
      .get("/api/tasks?sort=oldest")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(3);

    expect(response.body.sort).toBe("oldest");

    const dates = response.body.tasks.map(
      (task: any) =>
        new Date(task.createdAt).getTime()
    );

    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeLessThanOrEqual(
        dates[i + 1]
      );
    }
  });

  it("should sort tasks by priority", async () => {
    const response = await request(app)
      .get("/api/tasks?sort=priority")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(3);

    expect(response.body.sort).toBe("priority");

    const priorities = response.body.tasks.map(
      (task: any) => task.priority
    );

    const priorityValues: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    for (
      let i = 0;
      i < priorities.length - 1;
      i++
    ) {
      expect(
        priorityValues[priorities[i]]
      ).toBeGreaterThanOrEqual(
        priorityValues[priorities[i + 1]]
      );
    }
  });

  it("should reject an invalid sort value", async () => {
    const response = await request(app)
      .get("/api/tasks?sort=random")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(400);
  });

  // =========================================
  // SEARCH
  // =========================================

  it("should search tasks by title", async () => {
    const response = await request(app)
      .get("/api/tasks?search=authentication")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(1);

    expect(response.body.tasks[0].title).toBe(
      "Build authentication"
    );

    expect(response.body.pagination.total).toBe(1);

    expect(response.body.search).toBe(
      "authentication"
    );
  });

  it("should search tasks by description", async () => {
    const response = await request(app)
      .get("/api/tasks?search=production")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(1);

    expect(response.body.tasks[0].title).toBe(
      "Fix production bug"
    );

    expect(response.body.pagination.total).toBe(1);
  });

  it("should search tasks case-insensitively", async () => {
    const response = await request(app)
      .get("/api/tasks?search=AUTHENTICATION")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(1);

    expect(response.body.tasks[0].title).toBe(
      "Build authentication"
    );
  });

  it("should return no tasks when search has no match", async () => {
    const response = await request(app)
      .get("/api/tasks?search=doesnotexist")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(0);

    expect(response.body.pagination.total).toBe(0);

    expect(response.body.pagination.totalPages).toBe(0);
  });

  it("should combine search with priority filter", async () => {
    const response = await request(app)
      .get("/api/tasks?search=bug&priority=high")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(1);

    expect(response.body.tasks[0].title).toBe(
      "Fix production bug"
    );

    expect(response.body.tasks[0].priority).toBe(
      "high"
    );
  });

  it("should combine search with status filter", async () => {
    const response = await request(app)
      .get(
        "/api/tasks?search=authentication&status=inprogress"
      )
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(1);

    expect(response.body.tasks[0].title).toBe(
      "Build authentication"
    );

    expect(response.body.tasks[0].status).toBe(
      "inprogress"
    );
  });

  it("should combine search with pagination and sorting", async () => {
    const response = await request(app)
      .get(
        "/api/tasks?search=fix&page=1&limit=1&sort=newest"
      )
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.tasks).toHaveLength(1);

    expect(response.body.tasks[0].title).toBe(
      "Fix production bug"
    );

    expect(response.body.pagination.page).toBe(1);

    expect(response.body.pagination.limit).toBe(1);

    expect(response.body.pagination.total).toBe(1);

    expect(response.body.sort).toBe("newest");
  });

  // =========================================
  // UPDATE TASK
  // =========================================

  it("should allow User A to update their task", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        status: "done",
      });

    expect(response.status).toBe(200);

    expect(response.body.status).toBe("done");
  });

  it("should NOT allow User B to update User A's task", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set("Authorization", `Bearer ${userBToken}`)
      .send({
        status: "done",
      });

    expect(response.status).toBe(404);
  });

  // =========================================
  // DELETE TASK
  // =========================================

  it("should NOT allow User B to delete User A's task", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${userBToken}`);

    expect(response.status).toBe(404);
  });

  it("should allow User A to delete their task", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Task deleted successfully"
    );
  });
});