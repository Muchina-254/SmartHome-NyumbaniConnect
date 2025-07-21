# SmartHome-NyumbaniConnect - Vercel Deployment Guide

## 🚀 Deploying to Vercel

This guide will help you deploy the SmartHome-NyumbaniConnect application to Vercel.

### Prerequisites

1. **MongoDB Atlas Account**: Set up a MongoDB Atlas cluster
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Push your code to GitHub

### Step 1: Prepare MongoDB Atlas

1. Create a MongoDB Atlas account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a new cluster (free tier is sufficient for testing)
3. Create a database user with read/write permissions
4. Whitelist IP addresses (use `0.0.0.0/0` for all IPs during development)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/build`

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory:
   ```bash
   cd SmartHome-NyumbaniConnect
   ```

3. Deploy:
   ```bash
   vercel
   ```

### Step 3: Configure Environment Variables

In your Vercel dashboard, go to your project settings and add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-32-char-secret` | A secure random string (32+ characters) |
| `JWT_EXPIRES_IN` | `7d` | JWT token expiration time |
| `NODE_ENV` | `production` | Environment identifier |

#### Required Environment Variables:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smarthome?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### Step 4: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Test the API health endpoint: `https://your-app.vercel.app/api/health`
3. Try logging in with sample credentials:
   - **Landlord**: mary.wanjiku@gmail.com / password123
   - **Agent**: peter.mwangi@realtor.com / password123
   - **Tenant**: ann.wanjiru@student.uon.ac.ke / password123

### Step 5: Seed Your Database (Optional)

To populate your database with sample data:

1. Create a temporary serverless function or run locally:
   ```javascript
   // Run the seeding script once
   const { connectToDatabase } = require('./api/utils/database');
   const User = require('./api/models/User');
   const Property = require('./api/models/Property');
   // ... include seeding logic
   ```

2. Or manually add data through the frontend registration forms

### 🛠 Troubleshooting

#### Common Issues:

1. **MongoDB Connection Errors**:
   - Verify your connection string
   - Check network access in MongoDB Atlas
   - Ensure the database user has proper permissions

2. **JWT Errors**:
   - Make sure JWT_SECRET is set and long enough
   - Verify all environment variables are configured

3. **Build Errors**:
   - Check that all dependencies are listed in package.json
   - Verify the build command runs locally

4. **API Route Issues**:
   - Check Vercel function logs in the dashboard
   - Verify API routes are properly structured

### 📁 Project Structure

```
SmartHome-NyumbaniConnect/
├── api/                    # Vercel serverless functions
│   ├── auth/
│   │   ├── login.js
│   │   └── register.js
│   ├── properties/
│   │   ├── index.js
│   │   └── [id].js
│   ├── users/
│   │   └── [type].js
│   ├── models/
│   │   ├── User.js
│   │   └── Property.js
│   ├── utils/
│   │   ├── database.js
│   │   └── auth.js
│   └── health.js
├── frontend/               # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── vercel.json            # Vercel configuration
├── package.json           # Root package.json
└── .env.example          # Environment variables template
```

### 🔧 Custom Domain (Optional)

1. Purchase a domain name
2. In Vercel dashboard, go to Project Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed by Vercel

### 📊 Monitoring

- Check Vercel dashboard for:
  - Function logs
  - Performance metrics
  - Error tracking
  - Usage statistics

### 🔄 Updates

To deploy updates:
1. Push changes to your GitHub repository
2. Vercel will automatically redeploy
3. Monitor the deployment in your Vercel dashboard

## 🎉 Success!

Your SmartHome-NyumbaniConnect application should now be live on Vercel! 

**Next Steps:**
- Test all functionality
- Set up monitoring and error tracking
- Configure custom domain
- Add real property data
- Implement additional features (payments, notifications, etc.)

For support, check the Vercel documentation or create an issue in the repository.
