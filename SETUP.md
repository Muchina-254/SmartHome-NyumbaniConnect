# SmartHome-NyumbaniConnect - Setup Guide

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   copy .env.example .env
   ```
   Then edit `.env` with your actual values.

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

### Database Setup

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Update** `MONGODB_URI` in your `.env` file

## 📁 Project Structure

```
SmartHome-NyumbaniConnect/
├── backend/                 # Node.js/Express API
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── src/               # React source code
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
├── mobile/                # React Native (future)
└── docs/                  # Market research & documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (auth required)
- `PUT /api/properties/:id` - Update property (owner only)
- `DELETE /api/properties/:id` - Delete property (owner only)

### Users
- `GET /api/users/landlords` - Get verified landlords
- `GET /api/users/agents` - Get verified agents

## 🎯 Current Features

✅ **Completed:**
- User authentication (register/login)
- Property CRUD operations
- User roles (tenant, landlord, agent, developer)
- Property search and filtering
- Basic security middleware

🚧 **In Development:**
- Frontend React components
- Image upload functionality
- M-Pesa payment integration
- Email notifications
- Property booking system

## 🔑 Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smarthome
JWT_SECRET=your_jwt_secret_here
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📱 Mobile App (Future)

The mobile directory is prepared for React Native development in future phases.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Next Steps

1. **Set up development environment** following this guide
2. **Test API endpoints** using Postman or similar
3. **Start frontend development** with React components
4. **Implement image upload** with Cloudinary
5. **Add M-Pesa integration** for payments

---

**Need help?** Check the [project documentation](./docs/) or contact the team.
