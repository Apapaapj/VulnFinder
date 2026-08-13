# 🚀 Deployment Guide

Complete guide for deploying Website Vulnerability Scanner to different platforms.

## Table of Contents
1. [Vercel (Recommended)](#vercel)
2. [Netlify](#netlify)
3. [GitHub Pages](#github-pages)
4. [Self-Hosted (VPS/Dedicated)](#self-hosted)
5. [Docker](#docker)
6. [Environment Variables Setup](#environment-setup)

---

## Vercel

Vercel is the creator of Next.js and offers the best integration.

### Step 1: Prepare Repository

```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
# - Link to GitHub repo: Yes
# - Set project name
# - Select framework: Next.js
# - Set root directory: ./
```

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your repository
5. Click "Import"
6. Vercel will auto-detect Next.js
7. Click "Deploy"

### Step 3: Configure Environment Variables

1. Go to Project Settings
2. Click "Environment Variables"
3. Add variables from `.env.example`:

```
RESEND_API_KEY = re_xxxxx
DISCORD_WEBHOOK_URL = https://discord.com/api/webhooks/xxxxx
ALERT_EMAIL = alzzxdancowwnoface@gmail.com
ENCRYPTION_KEY = your-32-char-key
```

4. Deploy → "Redeploy" for changes to take effect

### Step 4: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Follow DNS configuration steps
4. Wait for verification (usually 5-10 minutes)

### Deployment Complete! ✅

Your site is now live at: `https://yourdomain.vercel.app`

---

## Netlify

Alternative platform with great Next.js support.

### Step 1: Connect Repository

1. Go to https://netlify.com
2. Click "New site from Git"
3. Select GitHub
4. Authorize Netlify
5. Select your repository

### Step 2: Configure Build Settings

Leave defaults as Netlify will auto-detect:
- Build command: `npm run build`
- Publish directory: `.next`

### Step 3: Set Environment Variables

1. Site Settings → Build & Deploy → Environment
2. Click "Edit variables"
3. Add your environment variables:

```
RESEND_API_KEY=re_xxxxx
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxx
ALERT_EMAIL=alzzxdancowwnoface@gmail.com
ENCRYPTION_KEY=your-32-char-key
```

4. Click "Deploy site"

### Step 4: Configure Custom Domain

1. Site Settings → Domain Management
2. Click "Add custom domain"
3. Follow DNS instructions

### Deployment Complete! ✅

Your site is live at: `https://yoursitename.netlify.app`

---

## GitHub Pages

For static export version (limited functionality).

### Step 1: Enable Pages

1. Go to Repository Settings
2. Scroll to "GitHub Pages"
3. Source: Deploy from a branch
4. Branch: main, folder: /docs
5. Save

### Step 2: Add GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - run: npm ci
      - run: npm run build
      - run: npm run export

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

### Step 3: Update next.config.js

```javascript
const nextConfig = {
  output: 'export',
  basePath: '/website-vulnerability-scanner',
  // ... rest of config
};
```

### Deployment Complete! ✅

Your site is at: `https://yourusername.github.io/website-vulnerability-scanner`

---

## Self-Hosted

Deploy to your own VPS or dedicated server.

### Prerequisites

- Ubuntu 20.04+ LTS
- Node.js 18+
- Nginx (reverse proxy)
- PM2 (process manager)
- SSL certificate (Let's Encrypt)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

### Step 2: Clone and Deploy

```bash
# Create app directory
sudo mkdir -p /var/www/scanner
cd /var/www/scanner

# Clone repository
sudo git clone https://github.com/yourusername/website-vulnerability-scanner.git .

# Install dependencies
sudo npm install

# Build application
npm run build

# Create .env.local
sudo nano .env.local
# Add your configuration
```

### Step 3: Configure PM2

```bash
# Start application
pm2 start npm --name "scanner" -- start

# Save PM2 config
pm2 save

# Make PM2 auto-start on reboot
pm2 startup systemd -u $USER --hp /home/$USER
```

### Step 4: Configure Nginx

Create `/etc/nginx/sites-available/scanner`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    location / {
        proxy_pass http://localhost:3000;
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
```

### Step 5: Enable and Setup SSL

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/scanner /etc/nginx/sites-enabled/scanner

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Reload Nginx
sudo systemctl reload nginx

# Enable Nginx auto-start
sudo systemctl enable nginx
```

### Deployment Complete! ✅

Your site is live at: `https://yourdomain.com`

---

## Docker

Deploy using Docker containers.

### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app files
COPY . .

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
```

### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  scanner:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      RESEND_API_KEY: ${RESEND_API_KEY}
      DISCORD_WEBHOOK_URL: ${DISCORD_WEBHOOK_URL}
      ALERT_EMAIL: ${ALERT_EMAIL}
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Step 3: Build and Run

```bash
# Build image
docker build -t website-scanner .

# Run container
docker run -p 3000:3000 \
  -e RESEND_API_KEY=xxxxx \
  -e DISCORD_WEBHOOK_URL=xxxxx \
  -e ALERT_EMAIL=xxxxx \
  -e ENCRYPTION_KEY=xxxxx \
  website-scanner

# Or with docker-compose
docker-compose up -d
```

### Deployment Complete! ✅

---

## Environment Setup

### Email Alerts (Resend)

1. Go to https://resend.com
2. Sign up for free account
3. Verify email domain
4. Get API key
5. Add to environment:

```env
RESEND_API_KEY=re_xxxxx
ALERT_EMAIL=alzzxdancowwnoface@gmail.com
```

### Discord Alerts (Webhook)

1. Create Discord Server
2. Create #alerts channel
3. Server Settings → Webhooks → Create Webhook
4. Copy webhook URL
5. Add to environment:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxx/xxxxx
```

### Generate Encryption Key

```bash
# Generate 32+ character random key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to environment:
```env
ENCRYPTION_KEY=your-generated-key
```

---

## Monitoring

### Vercel Dashboard
- Automatic monitoring
- Build logs
- Performance metrics
- Error tracking

### Self-Hosted Monitoring

```bash
# Install Nginx monitoring
sudo apt install -y nginx-module-geoip

# Check PM2 logs
pm2 logs scanner

# Monitor system resources
pm2 monit

# View PM2 status
pm2 status
pm2 describe scanner
```

---

## Troubleshooting

### Build Fails on Vercel
- Check Node.js version compatibility
- Verify environment variables set
- Check build logs in Vercel dashboard

### App Crashes
```bash
# Check logs
pm2 logs

# Restart app
pm2 restart scanner

# View recent errors
pm2 describe scanner
```

### DNS Not Working
- Wait 24-48 hours for DNS propagation
- Clear browser cache
- Use online DNS checker: https://dnschecker.org

### SSL Certificate Issues
```bash
# Verify certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal
```

---

## Performance Tips

1. **Enable Compression**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json;
   ```

2. **Cache Control**
   - Set cache headers for static assets
   - Use CDN for assets

3. **Database Optimization**
   - Use appropriate indexes
   - Monitor query performance

4. **Monitor Resources**
   - Track CPU usage
   - Monitor memory consumption
   - Set up alerts

---

## Security Checklist

- [ ] Update all dependencies
- [ ] Set strong encryption key
- [ ] Configure environment variables
- [ ] Enable HTTPS/SSL
- [ ] Set security headers
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup logging and monitoring
- [ ] Regular backups
- [ ] Firewall configuration

---

**Need help? Check troubleshooting or create an issue on GitHub!**
