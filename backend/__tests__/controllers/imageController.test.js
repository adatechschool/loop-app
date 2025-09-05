const request = require('supertest');
const express = require('express');

// Mock the image service
jest.mock('../../services/image.service.js', () => ({
  createImageService: jest.fn()
}));

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({}))
}));

const { createImage } = require('../../controllers/imageController');
const { createImageService } = require('../../services/image.service.js');

// Create Express app for testing
const app = express();
app.use(express.json());
app.post('/images', createImage);

describe('Image Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /images - createImage', () => {
    it('should create an image successfully', async () => {
      // Arrange
      const url = 'https://example.com/image.jpg';
      const mockResponse = { image_id: 'test-image-id' };
      createImageService.mockResolvedValue(mockResponse);

      // Act
      const response = await request(app)
        .post('/images')
        .send({ url });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(createImageService).toHaveBeenCalledWith(url);
    });

    it('should return 400 when URL is missing', async () => {
      // Act
      const response = await request(app)
        .post('/images')
        .send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'URL manquante' });
      expect(createImageService).not.toHaveBeenCalled();
    });

    it('should return 400 when URL is empty string', async () => {
      // Act
      const response = await request(app)
        .post('/images')
        .send({ url: '' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'URL manquante' });
      expect(createImageService).not.toHaveBeenCalled();
    });

    it('should return 500 when service throws an error', async () => {
      // Arrange
      const url = 'https://example.com/image.jpg';
      const error = new Error('Service error');
      createImageService.mockRejectedValue(error);

      // Spy on console.error to suppress error logging during tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      const response = await request(app)
        .post('/images')
        .send({ url });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Erreur serveur' });
      expect(createImageService).toHaveBeenCalledWith(url);
      expect(consoleSpy).toHaveBeenCalledWith('Erreur création image :', error);

      // Restore console.error
      consoleSpy.mockRestore();
    });

    it('should handle null URL', async () => {
      // Act
      const response = await request(app)
        .post('/images')
        .send({ url: null });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'URL manquante' });
      expect(createImageService).not.toHaveBeenCalled();
    });
  });
});