# ⚡ Quick Start Guide

Get the Website Vulnerability Scanner running in 5 minutes!

## 🚀 Local Development (Fastest)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Start development server
npm run dev

# 4. Open browser
# Visit http://localhost:3000
```

Done! The scanner is ready to use locally.

## 🌍 Deploy to Vercel (30 seconds)

### Option A: Using GitHub

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Add New" → "Project"
4. Select your GitHub repository
5. Click "Deploy"
6. Set environment variables in Vercel dashboard
7. Done! 🎉

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
```

## 📦 Deploy to Netlify (1 minute)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod --dir=.next --functions=pages/api

# 3. Set environment variables in Netlify dashboard
```

## 🐳 Deploy with Docker (2 minutes)

```bash
# 1. Build image
docker build -t scanner .

# 2. Run container
docker run -p 3000:3000 scanner

# 3. Visit http://localhost:3000
```

## 🔧 Configuration (Quick)

### Email Alerts

1. Go to https://resend.com
2. Sign up (free)
3. Verify your email
4. Copy API key
5. Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxx
ALERT_EMAIL=your-email@example.com
```

### Discord Alerts (Easier)

1. Create Discord server
2. Create #alerts channel
3. Get webhook URL
4. Add to `.env.local`:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxx
```

## 📊 First Scan

1. Go to http://localhost:3000 (or your deployed URL)
2. Enter a website: `https://example.com`
3. Click "Start Deep Scan"
4. Wait 30-60 seconds
5. View detailed results!

## 🎨 Change Theme

Click the theme toggle (🎨) in top right:
- 🌙 Dark
- ☀️ Light
- 🧡 Orange
- 🎮 Cybersecurity
- 🌊 Ocean

## 📥 Export Results

After scanning:
1. Click "Export Results"
2. Choose format: JSON or PDF
3. Download or copy to clipboard

## 🔐 Security

The app includes:
- ✅ Honeypot system (traps attackers)
- ✅ Auto IP banning
- ✅ Rate limiting
- ✅ Email/Discord alerts
- ✅ Data encryption
- ✅ CORS protection

All attackers are automatically detected and banned! 🛡️

## 🐛 Common Issues

### Port 3000 already in use?
```bash
PORT=3001 npm run dev
```

### Build fails?
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Theme not changing?
- Hard refresh browser (Ctrl+Shift+R)
- Clear localStorage: `localStorage.clear()`

### Alerts not working?
- Verify API key in `.env.local`
- Check Discord webhook URL
- Restart server

## 📚 Next Steps

- Read [README.md](./README.md) for full features
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for advanced deployment
- Review [SECURITY.md](./SECURITY.md) for security details

## 💡 Tips

1. **Test honeypot**: Visit `/api/database` → your IP gets banned!
2. **Check stats**: Global vulnerability statistics update real-time
3. **Share results**: Export as JSON and share anywhere
4. **Multiple URLs**: Scan up to unlimited websites at once

## 🆘 Need Help?

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Create GitHub issue
- Email support

---

**That's it! You're ready to scan!** 🎉

Happy scanning! 🔍
