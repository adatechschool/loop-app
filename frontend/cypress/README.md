# Cypress End-to-End Testing for Loop App

This directory contains comprehensive end-to-end tests for the Loop application using Cypress.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database set up and running
- Environment variables configured (.env files)

### ⚠️ IMPORTANT: Start Servers Before Testing

**You must have both servers running before starting Cypress tests:**

1. **Start Backend Server** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   ✅ Backend running on http://localhost:5000

2. **Start Frontend Server** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```
   ✅ Frontend running on http://localhost:3000

3. **Verify servers are running:**
   ```bash
   cd frontend
   npm run check:servers
   ```
   This script will check if both servers are running and provide helpful instructions.

### Installation
```bash
cd frontend
npm install
```

### Running Tests

**⚠️ Make sure both servers are running first (see above)**

#### Quick Server Check
```bash
cd frontend
npm run check:servers
```
This will verify both servers are running before you start testing.

#### Interactive Mode (Development)
```bash
npm run test:e2e:dev
# or
npm run cypress:open
```

#### Headless Mode (CI/CD)
```bash
npm run test:e2e
# or
npm run cypress:run:headless
```

#### Component Tests
```bash
npm run test:component:dev  # Interactive
npm run test:component      # Headless
```

## 📁 Test Structure

```
cypress/
├── e2e/                           # End-to-end tests
│   ├── auth/                      # Authentication tests
│   │   └── authentication.cy.js  # Login, signup, logout
│   ├── places/                    # Place management tests
│   │   └── place-management.cy.js # CRUD operations
│   ├── user/                      # User profile tests
│   │   └── user-profile.cy.js    # Profile, settings
│   ├── navigation/                # Navigation tests
│   │   └── app-navigation.cy.js  # Map, navigation, search
│   ├── error-handling/            # Error scenario tests
│   │   └── error-scenarios.cy.js # Network errors, edge cases
│   └── integration/               # Full user journey tests
│       └── complete-user-journey.cy.js # End-to-end workflows
├── fixtures/                      # Test data
│   ├── users.json                # User test data
│   ├── places.json              # Place test data
│   └── test-image.jpg           # Test image file
├── support/                      # Support files
│   ├── commands.js              # Custom Cypress commands
│   ├── e2e.js                  # E2E support file
│   └── component.js            # Component testing support
└── component/                   # Component tests (future)
```

## 🧪 Test Categories

### 1. Authentication Tests (`auth/authentication.cy.js`)
- User registration with various data combinations
- Login/logout functionality
- Password visibility toggle
- Form validation
- Protected route access
- Session management

### 2. Place Management Tests (`places/place-management.cy.js`)
- Adding new places with different configurations
- Viewing place details and image carousels
- Editing existing places
- Deleting places with confirmation
- Place list view navigation
- Image upload handling
- Form validation and error handling

### 3. User Profile Tests (`user/user-profile.cy.js`)
- Profile page display
- Settings page functionality
- User data updates (username, email, profile picture)
- Account deletion
- PWA installation prompts
- Form validation
- Responsive design testing

### 4. Navigation Tests (`navigation/app-navigation.cy.js`)
- Main navigation between pages
- Map interactions (zoom, drag, markers)
- Search functionality
- Mobile navigation
- Breadcrumb navigation
- Deep linking
- Performance testing

### 5. Error Handling Tests (`error-handling/error-scenarios.cy.js`)
- Network error handling
- API server errors (500, 404, 401)
- Form validation errors
- File upload failures
- Authentication edge cases
- Data integrity issues
- Browser compatibility
- Security vulnerabilities
- Offline scenarios

### 6. Integration Tests (`integration/complete-user-journey.cy.js`)
- Complete user workflows from registration to deletion
- Multi-step user journeys
- Performance testing with rapid navigation
- Cross-feature integration testing

## 🛠️ Custom Cypress Commands

### Authentication Commands
```javascript
cy.login(username, password)           // Login user with session management
cy.signup(userData)                    // Register new user
cy.createTestUser()                    // Create and return test user data
cy.shouldBeAuthenticated()             // Assert user is logged in
cy.shouldNotBeAuthenticated()          // Assert user is logged out
```

### Place Management Commands
```javascript
cy.addPlace(placeData)                 // Add a new place
cy.cleanupTestData()                   // Clean up test data
```

### API and Network Commands
```javascript
cy.interceptAPI(method, url, alias, response) // Mock API responses
```

### Map and UI Commands
```javascript
cy.waitForMap()                        // Wait for map to load
cy.setMobileViewport()                 // Set mobile viewport
cy.setDesktopViewport()                // Set desktop viewport
```

## 📊 Test Data Management

### Fixtures
Test data is stored in JSON fixtures:
- `users.json`: Contains various user profiles for testing
- `places.json`: Contains place data with different configurations
- `test-image.jpg`: Test image file for upload testing

### Dynamic Test Data
Most tests generate unique data using timestamps to avoid conflicts:
```javascript
const testUser = {
  username: `testuser${Date.now()}`,
  email: `test${Date.now()}@example.com`,
  // ...
}
```

## 🔧 Configuration

### Cypress Configuration (`cypress.config.js`)
```javascript
{
  baseUrl: 'http://localhost:3000',
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 10000,
  env: {
    apiUrl: 'http://localhost:5000/api'
  }
}
```

### Environment Variables
- `CYPRESS_baseUrl`: Frontend application URL
- `CYPRESS_apiUrl`: Backend API URL

## 🚦 Running in CI/CD

### GitHub Actions Example
```yaml
- name: Run Cypress Tests
  run: |
    npm run build
    npm run test:e2e
  env:
    CYPRESS_baseUrl: http://localhost:3000
    CYPRESS_apiUrl: http://localhost:5000/api
```

### Test Reports
Cypress generates:
- Screenshots on test failures
- Video recordings (disabled by default)
- JSON test results
- HTML reports (with plugins)

## 🐛 Debugging Tests

### Interactive Debugging
```bash
npm run cypress:open
```

### Debug Mode
```javascript
cy.debug()          // Pause test execution
cy.pause()          // Pause with controls
```

### Logging
```javascript
cy.log('Custom message')     // Add custom log
```

## 📈 Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use `context` for sub-groupings
- Use descriptive test names

### 2. Data Management
- Use fixtures for static test data
- Generate dynamic data to avoid conflicts
- Clean up test data after each test

### 3. Assertions
- Use appropriate Cypress assertions
- Combine multiple assertions logically
- Test both positive and negative cases

### 4. Error Handling
- Test error scenarios explicitly
- Mock network failures
- Validate error messages

### 5. Performance
- Use sessions for authentication
- Minimize unnecessary waiting
- Use efficient selectors

## 🔍 Test Coverage

The test suite covers:
- ✅ User authentication (login/signup/logout)
- ✅ Place CRUD operations
- ✅ Map interactions and geolocation
- ✅ Search functionality
- ✅ User profile management
- ✅ Navigation and routing
- ✅ Form validation
- ✅ Image upload
- ✅ Error handling
- ✅ Mobile responsiveness
- ✅ Security scenarios
- ✅ Performance testing
- ✅ Cross-browser compatibility

## 📝 Writing New Tests

### 1. Create Test File
```bash
touch cypress/e2e/feature/new-feature.cy.js
```

### 2. Basic Test Structure
```javascript
describe('New Feature', () => {
  beforeEach(() => {
    cy.cleanupTestData()
    // Setup code
  })

  it('should perform specific action', () => {
    // Test code
    cy.visit('/page')
    cy.get('[data-testid="element"]').click()
    cy.contains('Expected text').should('be.visible')
  })
})
```

### 3. Use Custom Commands
```javascript
it('should test with authentication', () => {
  cy.createTestUser().then(user => {
    cy.login(user.email, user.password)
    // Test authenticated functionality
  })
})
```

## 🤝 Contributing

1. Follow existing test patterns
2. Use meaningful test descriptions
3. Add proper cleanup in `beforeEach`/`afterEach`
4. Update documentation for new features
5. Ensure tests pass in both interactive and headless modes

## 📞 Support

For issues with tests:
1. Check Cypress documentation
2. Review existing test patterns
3. Use `cy.debug()` for debugging
4. Check browser console for errors
5. Verify application is running correctly