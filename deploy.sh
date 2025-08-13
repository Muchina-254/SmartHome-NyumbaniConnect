#!/bin/bash

# 🚀 Quick Deployment Script for DigitalOcean
# Run this on your DigitalOcean droplet

echo "🚀 Starting NyumbaniConnect Backend Deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install MongoDB
echo "📦 Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/nyumbaniconnect
cd /var/www/nyumbaniconnect

echo "✅ Server setup complete!"
echo "📝 Next steps:"
echo "1. Upload your backend code to /var/www/nyumbaniconnect"
echo "2. Run 'npm install' in the backend directory"
echo "3. Configure your .env file"
echo "4. Start the app with 'pm2 start server.js --name nyumbani-backend'"
echo "5. Configure Nginx (see DEPLOYMENT.md)"
echo ""
echo "🌐 Your server is ready for deployment!"
