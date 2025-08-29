# Loop App

A location-based social application for discovering and sharing interesting places. Users can add, view, and manage places on an interactive map, complete with descriptions, images, and accessibility information.

## 🌟 Features

- **Interactive Map**: View places on a dynamic map interface with geolocation support
- **Place Management**: Add, edit, and delete places with detailed information
- **User Authentication**: Secure registration and login system
- **Image Upload**: Upload and manage multiple images for places
- **Search Functionality**: Find places by name, description, or location
- **User Profiles**: Manage personal information and view created places
- **Responsive Design**: Mobile-friendly interface with PWA support
- **Accessibility**: Built with accessibility features in mind

## 🏗️ Architecture

The application is built using a modern full-stack architecture:

- **Frontend**: React 18 with TypeScript, Chakra UI, React Router, Leaflet Maps
- **Backend**: Node.js with Express, Prisma ORM, PostgreSQL
- **Authentication**: JWT-based authentication with secure token management
- **Image Storage**: Cloudinary integration for image uploads
- **Maps**: Leaflet with OpenStreetMap tiles

## 📁 Project Structure

```
loop-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages/routes
│   │   ├── contexts/       # React contexts for state management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions and helpers
│   │   └── assets/         # Static assets
│   ├── cypress/            # E2E and component tests
│   └── public/             # Public assets
├── backend/                 # Node.js backend API
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route definitions
│   ├── prisma/             # Database schema and migrations
│   └── services/           # Business logic services
├── .github/                # GitHub Actions workflows
└── docs/                   # Additional documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd loop-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Setup**

   Backend `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/loop_db"
   JWT_SECRET="your-secret-key"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   PORT=5000
   ```

   Frontend `.env`:
   ```env
   REACT_APP_LOOP_API_URL=http://localhost:5000
   ```

5. **Database Setup**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Start the applications**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🧪 Testing

The Loop application includes comprehensive testing with Cypress for end-to-end and component testing.

### Test Coverage

- ✅ **Authentication Flow** - Registration, login, logout, session management
- ✅ **Place Management** - CRUD operations, image uploads, validation
- ✅ **User Profiles** - Settings, profile updates, account management
- ✅ **Navigation** - Map interactions, search, responsive design
- ✅ **Error Handling** - Network errors, validation, edge cases
- ✅ **Integration** - Complete user journeys and workflows

### Running Tests

**Interactive Mode (Development):**
```bash
cd frontend
npm run test:e2e:dev
```

**Headless Mode (CI/CD):**
```bash
cd frontend
npm run test:e2e
```

**Component Tests:**
```bash
cd frontend
npm run test:component:dev  # Interactive
npm run test:component      # Headless
```

### Test Documentation

For detailed testing information, see:
- [Testing Documentation](./TESTING.md) - Complete testing strategy and guidelines
- [Cypress Tests README](./frontend/cypress/README.md) - Detailed Cypress test documentation

## 📋 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `GET /api/user` - Get user profile

### Places
- `GET /api/places` - Get all places
- `POST /api/places` - Create new place
- `GET /api/places/:id` - Get place by ID
- `PUT /api/places/:id` - Update place
- `DELETE /api/places/:id` - Delete place

### User Management
- `PUT /api/user` - Update user profile
- `DELETE /api/user` - Delete user account

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run unit tests
npm run test:e2e   # Run Cypress E2E tests
```

**Backend:**
```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
```

### Code Style and Linting

The project uses ESLint and Prettier for code formatting and linting. Configuration files are included for consistent code style across the project.

### Database Migrations

When making database schema changes:

```bash
cd backend
npx prisma migrate dev --name your-migration-name
npx prisma generate
```

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder to your hosting provider
3. Set environment variables in your deployment platform

### Backend Deployment (Heroku/Railway)
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations: `npx prisma migrate deploy`
4. Deploy the backend application

### Environment Variables for Production

Ensure all environment variables are properly configured in your production environment:
- Database connection strings
- JWT secrets
- API keys for external services
- CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Create a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Write comprehensive tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Leaflet](https://leafletjs.com/) for interactive maps
- [Chakra UI](https://chakra-ui.com/) for the component library
- [Prisma](https://www.prisma.io/) for database management
- [Cloudinary](https://cloudinary.com/) for image storage
- [Cypress](https://www.cypress.io/) for end-to-end testing

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [Testing Documentation](./TESTING.md) for testing-related questions
- Review the [API documentation](#-api-endpoints) for backend integration