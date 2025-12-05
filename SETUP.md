# Quick Setup Guide

## Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# From project root
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Create MySQL Database

```sql
CREATE DATABASE dinnersready;
```

### 3. Configure Environment

**Backend** (`backend/.env`):
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/dinnersready"
JWT_SECRET="dev-secret-key-123"
JWT_REFRESH_SECRET="dev-refresh-secret-key-123"
PORT=5000
NODE_ENV=development
```

**Frontend** (`frontend/.env` - optional):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Application

**Option A: Run both servers together**
```bash
# From project root
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 5. Seed Sample Recipes (Optional)

```bash
cd backend
node src/utils/seedRecipes.js
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Default Admin Account

- Username: `admin`
- Password: `admin123`

**⚠️ Change this immediately in production!**

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check DATABASE_URL in `.env`
- Ensure database `dinnersready` exists

### Port Already in Use
- Change PORT in backend `.env`
- Update VITE_API_URL in frontend `.env` accordingly

### Migration Errors
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## Next Steps

1. Change default admin password
2. Integrate real AI service (see `backend/src/services/aiService.js`)
3. Configure production environment variables
4. Set up cloud storage for images (S3, etc.)

