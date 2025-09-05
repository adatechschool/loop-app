const request = require("supertest");
const express = require("express");
const bcrypt = require("bcryptjs");
const { userData } = require("../../fixture");

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

const { signup } = require("../../controllers/authController");

const app = express();
app.use(express.json());
app.post("/signup", signup);

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /signup - signup", () => {
    it("should create a new user successfully", async () => {
      const hashedPassword = "hashedPassword123";
      const createdUser = {
        id: "user-id",
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: "user",
        profilePicture: userData.profilePicture,
      };

      mockPrisma.user.findUnique.mockResolvedValue(null); // No existing user
      bcrypt.hash.mockResolvedValue(hashedPassword);
      mockPrisma.user.create.mockResolvedValue(createdUser);

      const response = await request(app).post("/signup").send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created successfully");
      expect(response.body.user).toEqual({
        id: "user-id",
        name: userData.name,
        username: userData.username,
        email: userData.email,
        role: "user",
        profilePicture: userData.profilePicture,
      });
      expect(response.body.user.password).toBeUndefined();

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: "user",
          profilePicture: userData.profilePicture,
        },
      });
    });

    it('should use default role "user" when role is not provided', async () => {
      // Arrange
      const userData = {
        name: "Jane Doe",
        username: "janedoe",
        email: "jane@example.com",
        password: "password123",
      };

      const hashedPassword = "hashedPassword123";
      const createdUser = {
        id: "user-id",
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: "user",
        profilePicture: undefined,
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      mockPrisma.user.create.mockResolvedValue(createdUser);

      // Act
      const response = await request(app).post("/signup").send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: "user", // Default role
          profilePicture: undefined,
        },
      });
    });

    it("should return 400 when user already exists", async () => {
      // Arrange
      const userData = {
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
      };

      const existingUser = {
        id: "existing-id",
        email: userData.email,
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);

      // Act
      const response = await request(app).post("/signup").send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "User already exists!" });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it("should return 500 when database error occurs", async () => {
      // Arrange
      const userData = {
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
      };

      const error = new Error("Database connection failed");
      mockPrisma.user.findUnique.mockRejectedValue(error);

      // Spy on console.error to suppress error logging during tests
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Act
      const response = await request(app).post("/signup").send(userData);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Error during signup",
        error: "Database connection failed",
      });
      expect(consoleSpy).toHaveBeenCalledWith("Signup error:", error);

      // Restore console.error
      consoleSpy.mockRestore();
    });

    it("should return 500 when bcrypt hash fails", async () => {
      // Arrange
      const userData = {
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
      };

      const error = new Error("Hashing failed");
      mockPrisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockRejectedValue(error);

      // Spy on console.error to suppress error logging during tests
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Act
      const response = await request(app).post("/signup").send(userData);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Error during signup",
        error: "Hashing failed",
      });
      expect(consoleSpy).toHaveBeenCalledWith("Signup error:", error);

      // Restore console.error
      consoleSpy.mockRestore();
    });

    it("should handle custom role when provided", async () => {
      // Arrange
      const userData = {
        name: "Admin User",
        username: "admin",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      };

      const hashedPassword = "hashedPassword123";
      const createdUser = {
        id: "user-id",
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        profilePicture: undefined,
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      mockPrisma.user.create.mockResolvedValue(createdUser);

      // Act
      const response = await request(app).post("/signup").send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.user.role).toBe("admin");
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: "admin",
          profilePicture: undefined,
        },
      });
    });
  });
});
