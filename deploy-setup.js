#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SmartHome-NyumbaniConnect Vercel Deployment Setup');
console.log('================================================\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('📦 Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel');
    process.exit(1);
  }
}

// Check environment variables
const envExample = path.join(process.cwd(), '.env.example');
const envFile = path.join(process.cwd(), '.env');

if (fs.existsSync(envExample)) {
  console.log('✅ .env.example found');
  
  if (!fs.existsSync(envFile)) {
    console.log('📝 Creating .env file from .env.example...');
    fs.copyFileSync(envExample, envFile);
    console.log('⚠️  Please update .env with your actual values before deploying');
  } else {
    console.log('✅ .env file exists');
  }
} else {
  console.log('⚠️  .env.example not found');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed');
} catch (error) {
  console.error('❌ Failed to install root dependencies');
  process.exit(1);
}

try {
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Test build
console.log('\n🔨 Testing build process...');
try {
  execSync('cd frontend && npm run build', { stdio: 'inherit' });
  console.log('✅ Frontend build successful');
} catch (error) {
  console.error('❌ Frontend build failed');
  process.exit(1);
}

console.log('\n🎉 Setup complete! Next steps:');
console.log('===============================');
console.log('1. Update .env with your MongoDB URI and JWT secret');
console.log('2. Commit and push your code to GitHub');
console.log('3. Deploy to Vercel:');
console.log('   - Option A: Run `vercel` command');
console.log('   - Option B: Import from GitHub at vercel.com');
console.log('4. Configure environment variables in Vercel dashboard');
console.log('5. Test your deployment');
console.log('\n📚 See VERCEL_DEPLOYMENT.md for detailed instructions');
