# VandalHub Deployment Guide

This guide covers various deployment options for VandalHub platform.

## 🚀 Quick Deploy Options

### 1. Local Development
```bash
# Clone repository
git clone https://github.com/vandalhub/vandalhub-platform.git
cd vandalhub-platform

# Install dependencies
npm run install:all

# Setup environment
npm run setup:env

# Start development servers
npm run dev
```

### 2. Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Production Deployment
```bash
# Build for production
npm run build

# Start production servers
npm run start
```

## 🐳 Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: vandalhub-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: vandalhub
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro

  backend:
    build:
      context: ./backend-main
      dockerfile: Dockerfile
    container_name: vandalhub-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/vandalhub?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    volumes:
      - ./backend-main:/app
      - /app/node_modules

  frontend:
    build:
      context: ./frontend-main
      dockerfile: Dockerfile
    container_name: vandalhub-frontend
    restart: unless-stopped
    environment:
      VITE_API_URL: http://localhost:3000
    ports:
      - "5173:5173"
    depends_on:
      - backend
    volumes:
      - ./frontend-main:/app
      - /app/node_modules

  nginx:
    image: nginx:alpine
    container_name: vandalhub-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend

volumes:
  mongodb_data:
```

### Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. EC2 Instance Setup
```bash
# Launch EC2 instance (Ubuntu 20.04 LTS)
# Security groups: HTTP (80), HTTPS (443), SSH (22), Custom (3000, 5173)

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Clone and setup project
git clone https://github.com/vandalhub/vandalhub-platform.git
cd vandalhub-platform
npm run install:all
npm run build

# Setup environment variables
cp backend-main/.env.example backend-main/.env
# Edit .env with production values

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 2. RDS MongoDB Atlas
```javascript
// backend-main/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vandalhub?retryWrites=true&w=majority
```

#### 3. S3 for File Storage
```javascript
// backend-main/config/aws-config.js
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
```

### Heroku Deployment

#### 1. Backend Deployment
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create vandalhub-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git subtree push --prefix backend-main heroku main
```

#### 2. Frontend Deployment
```bash
# Create frontend app
heroku create vandalhub-frontend

# Set build pack
heroku buildpacks:set https://github.com/mars/create-react-app-buildpack.git

# Set environment variables
heroku config:set VITE_API_URL=https://vandalhub-backend.herokuapp.com

# Deploy
git subtree push --prefix frontend-main heroku main
```

### Vercel Deployment

#### 1. Frontend on Vercel
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend-main/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend-main/$1"
    }
  ],
  "env": {
    "VITE_API_URL": "https://your-backend-url.com"
  }
}
```

#### 2. Backend on Railway/Render
```yaml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[[services]]
name = "backend"
source = "backend-main"

[services.variables]
NODE_ENV = "production"
PORT = "3000"
```

## 🔧 Environment Configuration

### Production Environment Variables

#### Backend (.env)
```bash
# Server Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
MONGODB_URI=mongodb://localhost:27017/vandalhub
MONGODB_OPTIONS=retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=https://yourdomain.com
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/uploads

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AWS (Optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=vandalhub-uploads

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
```

#### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com

# App Configuration
VITE_APP_NAME=VandalHub
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Modern GitHub-like platform

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true

# Analytics (Optional)
VITE_GA_TRACKING_ID=GA-XXXXXXXXX
VITE_HOTJAR_ID=your-hotjar-id

# Error Tracking
VITE_SENTRY_DSN=your-frontend-sentry-dsn
```

## 🔒 Security Configuration

### SSL/TLS Setup
```nginx
# nginx.conf
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    location / {
        proxy_pass http://frontend:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Firewall Configuration
```bash
# UFW setup
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 3000
sudo ufw deny 27017
```

## 📊 Monitoring & Logging

### PM2 Ecosystem
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'vandalhub-backend',
      script: 'backend-main/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
    }
  ]
};
```

### Health Checks
```javascript
// backend-main/routes/health.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm run install:all
      - run: npm run test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /var/www/vandalhub-platform
            git pull origin main
            npm run install:all
            npm run build
            pm2 restart ecosystem.config.js
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Restart MongoDB
   sudo systemctl restart mongod
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port
   sudo lsof -i :3000
   
   # Kill process
   sudo kill -9 <PID>
   ```

3. **Permission Denied**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER /var/www/vandalhub-platform
   chmod -R 755 /var/www/vandalhub-platform
   ```

4. **Out of Memory**
   ```bash
   # Increase swap space
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

### Logs and Debugging
```bash
# PM2 logs
pm2 logs vandalhub-backend

# System logs
sudo journalctl -u mongod
sudo tail -f /var/log/nginx/error.log

# Application logs
tail -f backend-main/logs/app.log
```

---

For additional support, visit our [documentation](https://docs.vandalhub.com) or contact [support@vandalhub.com](mailto:support@vandalhub.com).
