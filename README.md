# 🍽️ DinnersReady AI - Fridge-Scanning Recipe App

A full-stack application that uses AI to identify ingredients from fridge photos and suggests recipes you can make with what you have.

## 🚀 Features

- **AI-Powered Ingredient Detection**: Upload a photo of your fridge and get instant ingredient recognition
- **Smart Recipe Suggestions**: Get personalized recipe recommendations based on detected ingredients
- **User Authentication**: Secure JWT-based authentication with role-based access control
- **User Roles**: Admin, User, and Guest modes
- **Recipe Management**: Save favorite recipes and view your saved collection
- **Admin Panel**: Manage users and view system statistics
- **Modern UI**: Beautiful, responsive design built with React and Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MySQL** database
- **Prisma** ORM for database management
- **JWT** for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API calls

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd DinnersReady
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="mysql://username:password@localhost:3306/dinnersready"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
PORT=5000
NODE_ENV=development
```

Create a `.env` file in the `frontend` directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Set up the database

1. Create a MySQL database:

```sql
CREATE DATABASE dinnersready;
```

2. The database will be automatically initialized when you start the backend server. Prisma migrations will run automatically.

### 5. Seed sample recipes (optional)

```bash
cd backend
node src/utils/seedRecipes.js
```

## 🚀 Running the Application

### Development Mode

#### Option 1: Run both servers together (from root)

```bash
npm run dev
```

#### Option 2: Run servers separately

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The backend will run on `http://localhost:5000`
The frontend will run on `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
DinnersReady/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth and validation middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (AI service, etc.)
│   │   ├── utils/           # Utilities (DB, JWT, init scripts)
│   │   └── app.js           # Express app entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── uploads/             # Uploaded images
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand stores
│   │   ├── utils/           # Utilities (API client, etc.)
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
└── README.md
```

## 🗄️ Database Schema

### Models

- **User**: User accounts with roles (admin, user, guest)
- **Image**: Uploaded fridge images
- **Ingredient**: Available ingredients
- **ImageIngredient**: Links images to detected ingredients with confidence scores
- **Recipe**: Recipe information
- **RecipeIngredient**: Links recipes to required ingredients
- **UserSavedRecipe**: User's saved recipes

## 🔐 Authentication

### Default Admin Account

On first run, a default admin account is created:
- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Change this password immediately in production!**

### User Roles

- **admin**: Full access including user management and system logs
- **user**: Can upload images, view recipes, and save favorites
- **guest**: Limited access, no saved data

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Upload
- `POST /api/upload/fridge-image` - Upload fridge image

### AI
- `POST /api/ai/scan` - Scan image for ingredients

### Recipes
- `GET /api/recipes/suggestions?ingredients=egg,milk` - Get recipe suggestions
- `POST /api/recipes/save` - Save a recipe
- `GET /api/recipes/saved` - Get saved recipes

### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/user/:id` - Delete user
- `GET /api/admin/logs` - Get system statistics

## 🤖 AI Integration

The AI service is currently a stub implementation in `backend/src/services/aiService.js`. To integrate a real AI service:

1. Update the `scanImageForIngredients` function
2. Add your AI service API key to environment variables
3. Implement the actual API call to your AI service (OpenAI Vision, custom model, etc.)

Example structure:
```javascript
async function scanImageForIngredients(imagePath) {
  // Call your AI service here
  const response = await yourAIService.analyze(imagePath);
  return response.ingredients;
}
```

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | Required |
| `JWT_SECRET` | Secret for access tokens | Required |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000/api |

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Verify DATABASE_URL in `.env` is correct
- Check database credentials

### Migration Issues
- Run `npx prisma migrate dev` manually in the backend directory
- Check Prisma schema for errors

### Image Upload Issues
- Ensure `backend/uploads` directory exists and is writable
- Check file size limits (max 10MB)
- Verify file types (JPEG, PNG, WebP only)

## 🔒 Security Notes

- Change default admin credentials in production
- Use strong JWT secrets
- Implement rate limiting for production
- Add CORS restrictions for production
- Use HTTPS in production
- Store images in cloud storage (S3) for production

## 🚧 Future Enhancements

- [ ] Google OAuth integration
- [ ] Cloud image storage (S3)
- [ ] Real AI integration (OpenAI Vision or custom model)
- [ ] Recipe search and filtering
- [ ] User recipe creation
- [ ] Shopping list generation
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Recipe ratings and reviews

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using React, Express, and MySQL

