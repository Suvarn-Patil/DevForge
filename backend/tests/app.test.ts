import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../src/app";
import User from "../src/models/User";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret";

  mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("DevForge API", () => {
  it("should return API running message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "DevForge API Running",
    });
  });
});

describe("Authentication", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      message: "User created",
    });
  });

  it("should reject duplicate registration", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "test@example.com",
        password: "password123",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "User already exists",
    });
  });

  it("should login with valid credentials", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "login@example.com",
        password: "password123",
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);

    expect(response.body.token).toBeDefined();

    expect(typeof response.body.token).toBe(
      "string"
    );
  });

  it("should reject invalid login credentials", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "invalid@example.com",
        password: "password123",
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "invalid@example.com",
        password: "wrongpassword",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Invalid credentials",
    });
  });

  it("should reject access to /me without a token", async () => {
    const response = await request(app)
      .get("/api/auth/me");

    expect(response.status).toBe(401);
  });

  it("should return current user with a valid token", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Current User",
        email: "current@example.com",
        password: "password123",
      });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "current@example.com",
        password: "password123",
      });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/api/auth/me")
      .set(
        "Authorization",
        `Bearer ${token}`
      );

    expect(response.status).toBe(200);

    expect(response.body.name).toBe(
      "Current User"
    );

    expect(response.body.email).toBe(
      "current@example.com"
    );

    expect(response.body.password).toBeUndefined();
  });
});