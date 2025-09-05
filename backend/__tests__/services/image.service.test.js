// Mock Prisma Client first
const mockPrisma = {
  image: {
    create: jest.fn()
  }
};

// Mock the PrismaClient module
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma)
}));

const { createImageService } = require('../../services/image.service');

describe('Image Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createImageService', () => {
    it('should create an image successfully and return image_id', async () => {
      // Arrange
      const url = 'https://example.com/image.jpg';
      const mockImage = { id: 'test-image-id' };
      mockPrisma.image.create.mockResolvedValue(mockImage);

      // Act
      const result = await createImageService(url);

      // Assert
      expect(mockPrisma.image.create).toHaveBeenCalledWith({
        data: { url }
      });
      expect(result).toEqual({ image_id: 'test-image-id' });
    });

    it('should throw an error when database operation fails', async () => {
      // Arrange
      const url = 'https://example.com/image.jpg';
      const error = new Error('Database connection failed');
      mockPrisma.image.create.mockRejectedValue(error);

      // Act & Assert
      await expect(createImageService(url)).rejects.toThrow('Database connection failed');
      expect(mockPrisma.image.create).toHaveBeenCalledWith({
        data: { url }
      });
    });

    it('should handle empty URL', async () => {
      // Arrange
      const url = '';
      const mockImage = { id: 'test-image-id' };
      mockPrisma.image.create.mockResolvedValue(mockImage);

      // Act
      const result = await createImageService(url);

      // Assert
      expect(mockPrisma.image.create).toHaveBeenCalledWith({
        data: { url: '' }
      });
      expect(result).toEqual({ image_id: 'test-image-id' });
    });
  });
});