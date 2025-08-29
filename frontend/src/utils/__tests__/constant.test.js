import PORT, { TAG_TYPE_PLACES_COLORS } from '../constant';

describe('Constants', () => {
  test('should export correct PORT value', () => {
    expect(PORT).toBe(5001);
  });

  test('should export TAG_TYPE_PLACES_COLORS with all place types', () => {
    expect(TAG_TYPE_PLACES_COLORS).toHaveLength(5);
    
    const expectedTypes = [
      { name: "Parc", color: "green", key: "park_id" },
      { name: "Street art", color: "pink", key: "street_id" },
      { name: "Rue piétonne", color: "orange", key: "pedestrian_id" },
      { name: "Monument", color: "blue", key: "monument_id" },
      { name: "Architecture", color: "teal", key: "architecture_id" },
    ];

    expect(TAG_TYPE_PLACES_COLORS).toEqual(expectedTypes);
  });

  test('should have unique keys for each place type', () => {
    const keys = TAG_TYPE_PLACES_COLORS.map(type => type.key);
    const uniqueKeys = new Set(keys);
    
    expect(uniqueKeys.size).toBe(keys.length);
  });

  test('should have valid color names', () => {
    const validColors = ['green', 'pink', 'orange', 'blue', 'teal'];
    
    TAG_TYPE_PLACES_COLORS.forEach(type => {
      expect(validColors).toContain(type.color);
    });
  });

  test('should have non-empty names', () => {
    TAG_TYPE_PLACES_COLORS.forEach(type => {
      expect(type.name).toBeTruthy();
      expect(typeof type.name).toBe('string');
    });
  });
});