# 🚀 NyumbaniConnect Deployment Guide

## Architecture
- **Frontend**: React app deployed on Vercel
- **Backend**: Node.js API deployed on DigitalOcean Droplet
- **Database**: MongoDB (Local or MongoDB Atlas)

---

## 🎯 Part 1: Deploy Backend to DigitalOcean

### Step 1: Create DigitalOcean Droplet
1. Go to [DigitalOcean](https://www.digitalocean.com/)
2. Create a new Droplet:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($6/month minimum)
   - **CPU**: Regular Intel (1GB RAM, 1 vCPU)
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH Keys (recommended) or Password

### Step 2: Setup Server
```bash
# Connect to your droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 (Process Manager)
npm install -g pm2

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Install Nginx (Web Server)
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### Step 3: Deploy Backend Code
```bash
# Clone your repository or upload files
git clone https://github.com/your-username/nyumbaniconnect.git
cd nyumbaniconnect/backend

# Install dependencies
npm install

# Create production environment file
cp .env.production .env
nano .env  # Edit with your actual values

# Start application with PM2
pm2 start server.js --name "nyumbani-backend"
pm2 startup
pm2 save
```

### Step 4: Configure Nginx
```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/nyumbaniconnect

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
ln -s /etc/nginx/sites-available/nyumbaniconnect /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 5: Setup SSL (Optional but Recommended)
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com
```

---

## 🎯 Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend
1. Update API URLs in your React app to point to your DigitalOcean backend
2. Update `.env.production` with your actual backend URL

### Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your frontend repository
5. Configure:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variables:
   - `REACT_APP_API_URL`: `https://your-backend-domain.com`
7. Click "Deploy"

### Step 3: Update Backend CORS
After getting your Vercel URL, update your backend `.env`:
```
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app
```

---

## 🎯 Part 3: Database Options

### Option A: Local MongoDB (On DigitalOcean)
- Already installed in Step 2
- Connection string: `mongodb://localhost:27017/nyumbaniconnect`

### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Update backend `.env`: `MONGODB_URI=your-atlas-connection-string`

---

## ✅ Testing Deployment

1. **Backend**: Visit `https://your-backend-domain.com/health`
2. **Frontend**: Visit your Vercel URL
3. **Full App**: Test registration, login, property listing, etc.

---

## 🔧 Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=your-mongodb-connection-string
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_APP_NAME=NyumbaniConnect
```

---

## 🚨 Important Notes

1. **Domain**: You'll need a domain name for your backend (or use DigitalOcean IP)
2. **SSL**: Highly recommended for production
3. **MongoDB**: Atlas is easier but local gives you more control
4. **PM2**: Keeps your backend running even if it crashes
5. **Nginx**: Acts as reverse proxy and can serve static files

---

## 💰 Estimated Monthly Costs

- **DigitalOcean Droplet**: $6-12/month
- **Domain Name**: $10-15/year
- **MongoDB Atlas**: Free tier (512MB) or $9/month
- **Vercel**: Free tier (sufficient for most apps)

**Total**: ~$6-25/month depending on your choices

---

## 🆘 Need Help?

1. Check DigitalOcean tutorials
2. Vercel documentation
3. PM2 process management
4. Nginx configuration guides
