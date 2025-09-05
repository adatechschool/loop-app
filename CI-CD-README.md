# Loop App CI/CD

This repository now includes a comprehensive CI/CD pipeline using GitHub Actions.

## 🚀 CI/CD Features

### Frontend Pipeline
- **Node.js Matrix Testing**: Tests on Node.js 18.x and 20.x
- **Automated Testing**: Jest unit tests with coverage reporting
- **ESLint**: Code quality and style checks
- **Build Verification**: Production build testing
- **Coverage Reports**: Uploaded to Codecov
- **Artifact Storage**: Build artifacts saved for deployment

### Backend Pipeline
- **Node.js Matrix Testing**: Tests on Node.js 18.x and 20.x
- **Database Testing**: PostgreSQL 15 service for integration tests
- **Prisma Validation**: Schema validation and migration checks
- **Dependency Installation**: Automated package management

### Security Pipeline
- **Dependency Auditing**: Automated security vulnerability scanning
- **Frontend & Backend**: Separate security audits for both applications

### Deployment Pipeline
- **Conditional Deployment**: Only runs on main branch pushes
- **Artifact-based**: Uses previously built frontend assets
- **Environment Ready**: Prepared for staging/production deployment

## 🧪 Test Coverage

The pipeline specifically validates the comprehensive Jest test suite for custom hooks:

- ✅ `useQueryPlaces` (4 tests)
- ✅ `useQueryUser` (7 tests)  
- ✅ `useGeolocation` (6 tests)
- ✅ `useGetPlace` (7 tests)

**Total: 24 tests with 100% coverage on all custom hooks**

## 🔧 Local Development

### Frontend
```bash
cd frontend
npm install
npm test                # Run tests
npm run test:coverage   # Run tests with coverage
npm run lint            # Run ESLint
npm run build           # Production build
```

### Backend
```bash
cd backend
npm install
npx prisma generate     # Generate Prisma client
npx prisma db push      # Update database schema
npm test               # Run tests (when available)
```

## 📋 Pipeline Configuration

The workflow runs on:
- 🔀 Pull requests to `main` and `develop`
- 📤 Pushes to `main` and `develop`

### Workflow Jobs

1. **Frontend**: Testing, linting, building
2. **Backend**: Testing, Prisma validation
3. **Security**: Dependency auditing
4. **Deploy**: Conditional deployment (main branch only)

## 🛠️ Customization

### Adding New Tests
- Frontend tests: Add `.test.tsx` files in `frontend/src/`
- Backend tests: Add test scripts to `backend/package.json`

### Deployment Configuration
- Update the `deploy` job in `.github/workflows/ci-cd.yml`
- Add your deployment scripts and credentials
- Configure target environment variables

### Security Configuration
- Adjust audit levels in the security job
- Add additional security scanning tools
- Configure dependency vulnerability alerts

## 📊 Monitoring

The pipeline provides:
- ✅ Test results and coverage reports
- 🔍 Code quality metrics via ESLint
- 🔒 Security vulnerability reports
- 📦 Build artifacts for deployment
- 📈 Performance metrics and build times

For questions or issues with the CI/CD pipeline, please create an issue in the repository.