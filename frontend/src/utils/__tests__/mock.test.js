import { mockUsers, mockPlaces } from '../mock';

describe('Mock data', () => {
  test('should export mockUsers array', () => {
    expect(Array.isArray(mockUsers)).toBe(true);
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  test('should have valid user structure', () => {
    mockUsers.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('profilePicture');
      expect(user).toHaveProperty('geo');
      expect(user.geo).toHaveProperty('lat');
      expect(user.geo).toHaveProperty('lng');
    });
  });

  test('should export mockPlaces array', () => {
    expect(Array.isArray(mockPlaces)).toBe(true);
    expect(mockPlaces.length).toBeGreaterThan(0);
  });

  test('should have valid place structure', () => {
    mockPlaces.forEach(place => {
      expect(place).toHaveProperty('id');
      expect(place).toHaveProperty('name');
      expect(place).toHaveProperty('description');
      expect(place).toHaveProperty('address');
      expect(place).toHaveProperty('geo');
      expect(place).toHaveProperty('author');
      expect(place).toHaveProperty('accessibility');
      expect(place).toHaveProperty('image');
      
      expect(place.geo).toHaveProperty('lat');
      expect(place.geo).toHaveProperty('lng');
      expect(typeof place.accessibility).toBe('boolean');
    });
  });

  test('should have unique user IDs', () => {
    const userIds = mockUsers.map(user => user.id);
    const uniqueIds = new Set(userIds);
    
    expect(uniqueIds.size).toBe(userIds.length);
  });

  test('should have unique place IDs', () => {
    const placeIds = mockPlaces.map(place => place.id);
    const uniqueIds = new Set(placeIds);
    
    expect(uniqueIds.size).toBe(placeIds.length);
  });

  test('should have valid email formats in users', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    mockUsers.forEach(user => {
      expect(emailRegex.test(user.email)).toBe(true);
    });
  });

  test('should have valid geographic coordinates', () => {
    const allGeoObjects = [...mockUsers, ...mockPlaces];
    
    allGeoObjects.forEach(item => {
      expect(typeof item.geo.lat).toBe('number');
      expect(typeof item.geo.lng).toBe('number');
      expect(item.geo.lat).toBeGreaterThan(-90);
      expect(item.geo.lat).toBeLessThan(90);
      expect(item.geo.lng).toBeGreaterThan(-180);
      expect(item.geo.lng).toBeLessThan(180);
    });
  });
});