import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../src/app";
import User from "../src/models/User";

let mongoServer: MongoMemoryServer;

let ownerToken: string;
let adminToken: string;
let memberToken: string;
let viewerToken: string;
let outsiderToken: string;

let teamId: string;

let adminUserId: string;
let memberUserId: string;
let viewerUserId: string;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret";

  mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);

  // -----------------------------------------
  // CREATE TEST USERS
  // -----------------------------------------

  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
    });

  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
    });

  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Member",
      email: "member@example.com",
      password: "password123",
    });

  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Viewer",
      email: "viewer@example.com",
      password: "password123",
    });

  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Outsider",
      email: "outsider@example.com",
      password: "password123",
    });

  // -----------------------------------------
  // GET ACTUAL USER IDs FROM DATABASE
  // -----------------------------------------

  const adminUser = await User.findOne({
    email: "admin@example.com",
  });

  const memberUser = await User.findOne({
    email: "member@example.com",
  });

  const viewerUser = await User.findOne({
    email: "viewer@example.com",
  });

  if (
    !adminUser ||
    !memberUser ||
    !viewerUser
  ) {
    throw new Error(
      "Failed to find test users"
    );
  }

  adminUserId = adminUser._id.toString();
  memberUserId = memberUser._id.toString();
  viewerUserId = viewerUser._id.toString();

  // -----------------------------------------
  // LOGIN OWNER
  // -----------------------------------------

  const ownerLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: "owner@example.com",
      password: "password123",
    });

  if (ownerLogin.status !== 200) {
    throw new Error(
      `Owner login failed: ${JSON.stringify(
        ownerLogin.body
      )}`
    );
  }

  ownerToken = ownerLogin.body.token;

  // -----------------------------------------
  // LOGIN ADMIN
  // -----------------------------------------

  const adminLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: "admin@example.com",
      password: "password123",
    });

  if (adminLogin.status !== 200) {
    throw new Error(
      `Admin login failed: ${JSON.stringify(
        adminLogin.body
      )}`
    );
  }

  adminToken = adminLogin.body.token;

  // -----------------------------------------
  // LOGIN MEMBER
  // -----------------------------------------

  const memberLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: "member@example.com",
      password: "password123",
    });

  if (memberLogin.status !== 200) {
    throw new Error(
      `Member login failed: ${JSON.stringify(
        memberLogin.body
      )}`
    );
  }

  memberToken = memberLogin.body.token;

  // -----------------------------------------
  // LOGIN VIEWER
  // -----------------------------------------

  const viewerLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: "viewer@example.com",
      password: "password123",
    });

  if (viewerLogin.status !== 200) {
    throw new Error(
      `Viewer login failed: ${JSON.stringify(
        viewerLogin.body
      )}`
    );
  }

  viewerToken = viewerLogin.body.token;

  // -----------------------------------------
  // LOGIN OUTSIDER
  // -----------------------------------------

  const outsiderLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: "outsider@example.com",
      password: "password123",
    });

  if (outsiderLogin.status !== 200) {
    throw new Error(
      `Outsider login failed: ${JSON.stringify(
        outsiderLogin.body
      )}`
    );
  }

  outsiderToken = outsiderLogin.body.token;

  // -----------------------------------------
  // CREATE TEAM
  // -----------------------------------------

  const teamResponse = await request(app)
    .post("/api/teams")
    .set(
      "Authorization",
      `Bearer ${ownerToken}`
    )
    .send({
      name: "DevForge Team",
    });

  if (teamResponse.status !== 201) {
    throw new Error(
      `Failed to create team: ${JSON.stringify(
        teamResponse.body
      )}`
    );
  }

  teamId = teamResponse.body._id;

  // -----------------------------------------
  // ADD ADMIN
  // -----------------------------------------

  const adminResponse = await request(app)
    .post(`/api/teams/${teamId}/members`)
    .set(
      "Authorization",
      `Bearer ${ownerToken}`
    )
    .send({
      userId: adminUserId,
      role: "admin",
    });

  if (adminResponse.status !== 201) {
    throw new Error(
      `Failed to add admin: ${JSON.stringify(
        adminResponse.body
      )}`
    );
  }

  // -----------------------------------------
  // ADD MEMBER
  // -----------------------------------------

  const memberResponse = await request(app)
    .post(`/api/teams/${teamId}/members`)
    .set(
      "Authorization",
      `Bearer ${ownerToken}`
    )
    .send({
      userId: memberUserId,
      role: "member",
    });

  if (memberResponse.status !== 201) {
    throw new Error(
      `Failed to add member: ${JSON.stringify(
        memberResponse.body
      )}`
    );
  }

  // -----------------------------------------
  // ADD VIEWER
  // -----------------------------------------

  const viewerResponse = await request(app)
    .post(`/api/teams/${teamId}/members`)
    .set(
      "Authorization",
      `Bearer ${ownerToken}`
    )
    .send({
      userId: viewerUserId,
      role: "viewer",
    });

  if (viewerResponse.status !== 201) {
    throw new Error(
      `Failed to add viewer: ${JSON.stringify(
        viewerResponse.body
      )}`
    );
  }
});

afterAll(async () => {
  await mongoose.connection.db?.dropDatabase();

  await mongoose.disconnect();

  await mongoServer.stop();
});

describe("Team RBAC", () => {
  // -----------------------------------------
  // ACCESS
  // -----------------------------------------

  it("should allow the owner to access the team", async () => {
    const response = await request(app)
      .get(`/api/teams/${teamId}`)
      .set(
        "Authorization",
        `Bearer ${ownerToken}`
      );

    expect(response.status).toBe(200);

    expect(response.body.team.name).toBe(
      "DevForge Team"
    );

    expect(response.body.role).toBe("owner");
  });

  it("should allow an admin to add a member", async () => {
    const response = await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set(
        "Authorization",
        `Bearer ${adminToken}`
      )
      .send({
        userId: adminUserId,
        role: "member",
      });

    expect(response.status).toBe(409);
  });

  it("should reject a member from adding members", async () => {
    const response = await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set(
        "Authorization",
        `Bearer ${memberToken}`
      )
      .send({
        userId: adminUserId,
        role: "member",
      });

    expect(response.status).toBe(403);

    expect(response.body.message).toBe(
      "Insufficient permissions"
    );
  });

  it("should reject a viewer from adding members", async () => {
    const response = await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set(
        "Authorization",
        `Bearer ${viewerToken}`
      )
      .send({
        userId: adminUserId,
        role: "member",
      });

    expect(response.status).toBe(403);

    expect(response.body.message).toBe(
      "Insufficient permissions"
    );
  });

  it("should reject a non-member from accessing the team", async () => {
    const response = await request(app)
      .get(`/api/teams/${teamId}`)
      .set(
        "Authorization",
        `Bearer ${outsiderToken}`
      );

    expect(response.status).toBe(404);
  });

  // -----------------------------------------
  // ROLE MANAGEMENT
  // -----------------------------------------

  it("should allow an admin to update a member role", async () => {
    const response = await request(app)
      .put(
        `/api/teams/${teamId}/members/${memberUserId}`
      )
      .set(
        "Authorization",
        `Bearer ${adminToken}`
      )
      .send({
        role: "viewer",
      });

    expect(response.status).toBe(200);

    expect(response.body.role).toBe(
      "viewer"
    );
  });

  it("should reject a member from updating roles", async () => {
    const response = await request(app)
      .put(
        `/api/teams/${teamId}/members/${viewerUserId}`
      )
      .set(
        "Authorization",
        `Bearer ${memberToken}`
      )
      .send({
        role: "admin",
      });

    expect(response.status).toBe(403);
  });

  it("should reject a viewer from removing members", async () => {
    const response = await request(app)
      .delete(
        `/api/teams/${teamId}/members/${memberUserId}`
      )
      .set(
        "Authorization",
        `Bearer ${viewerToken}`
      );

    expect(response.status).toBe(403);
  });

  it("should allow the owner to remove a member", async () => {
    const response = await request(app)
      .delete(
        `/api/teams/${teamId}/members/${memberUserId}`
      )
      .set(
        "Authorization",
        `Bearer ${ownerToken}`
      );

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Member removed successfully"
    );
  });

  // -----------------------------------------
  // ZOD VALIDATION
  // -----------------------------------------

  it("should reject an empty team name", async () => {
    const response = await request(app)
      .post("/api/teams")
      .set(
        "Authorization",
        `Bearer ${ownerToken}`
      )
      .send({
        name: "",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Validation failed"
    );
  });

  it("should reject a team name longer than 100 characters", async () => {
    const response = await request(app)
      .post("/api/teams")
      .set(
        "Authorization",
        `Bearer ${ownerToken}`
      )
      .send({
        name: "A".repeat(101),
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Validation failed"
    );
  });

  it("should reject an invalid user ID when adding a member", async () => {
    const response = await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set(
        "Authorization",
        `Bearer ${ownerToken}`
      )
      .send({
        userId: "not-a-valid-object-id",
        role: "member",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Validation failed"
    );
  });

  it("should reject an invalid role when adding a member", async () => {
    const response = await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set(
        "Authorization",
        `Bearer ${ownerToken}`
      )
      .send({
        userId: adminUserId,
        role: "superadmin",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Validation failed"
    );
  });

  it("should reject an invalid role when updating a member", async () => {
    const response = await request(app)
      .put(
        `/api/teams/${teamId}/members/${adminUserId}`
      )
      .set(
        "Authorization",
        `Bearer ${ownerToken}`
      )
      .send({
        role: "superadmin",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Validation failed"
    );
  });
});