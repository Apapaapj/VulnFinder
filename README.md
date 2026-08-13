# 🔍 Website Vulnerability Scanner

Professional, production-ready website vulnerability scanner with advanced security features, honeypot system, and beautiful UI.

## ✨ Features

- **Deep Vulnerability Scanning**: Detects XSS, SQL Injection, CSRF, Missing Security Headers, SSL/TLS issues, and more
- **Multiple Theme Support**: Dark, Light, Orange (Claude), Cybersecurity, Ocean themes
- **Real-time Statistics**: Global vulnerability statistics and trends
- **Export Functionality**: Download results as PDF or JSON
- **Unlimited URLs**: Scan multiple websites simultaneously
- **Honeypot System**: Auto-detect and ban malicious users
- **Email Alerts**: Receive notifications on Discord or Email
- **Rate Limiting**: Built-in protection against abuse
- **IP Banning**: Automatic banning of suspicious IPs
- **Encryption**: Sensitive data encrypted at rest
- **Share Results**: Generate shareable report links with expiration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/website-vulnerability-scanner.git
cd website-vulnerability-scanner

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Configure your environment variables
# Edit .env.local with your settings
```

### Local Development

```bash
npm run dev
# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

## 🔧 Configuration

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://yourdomain.com
API_TIMEOUT=30000

# Email/Alert Service (Choose one)
RESEND_API_KEY=re_xxxxx  # For email alerts
# OR
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxx  # For Discord alerts

ALERT_EMAIL=your-email@example.com

# Security
ENCRYPTION_KEY=your-32-character-minimum-secret-key
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_HONEYPOT_MAX=5

# Honeypot
HONEYPOT_AUTO_BAN_DURATION=86400000
HONEYPOT_ALERT_ENABLED=true
HONEYPOT_LOG_IPS=true

# Feature Flags
FEATURE_PDF_EXPORT=true
FEATURE_JSON_EXPORT=true
FEATURE_SHARE_LINKS=true
FEATURE_STATISTICS=true
FEATURE_HONEYPOT=true
FEATURE_EMAIL_ALERTS=true

# Scanning
MAX_CONCURRENT_SCANS=5
SCAN_TIMEOUT_SECONDS=60
DEEP_SCAN_ENABLED=true
```

## 📋 API Endpoints

### POST /api/scan
Scan one or multiple URLs for vulnerabilities

```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://example.com", "https://example2.com"]
  }'
```

### GET /api/stats
Get global vulnerability statistics

```bash
curl http://localhost:3000/api/stats
```

### POST /api/export
Export scan results

```bash
curl -X POST http://localhost:3000/api/export \
  -H "Content-Type: application/json" \
  -d '{
    "results": [...],
    "format": "pdf"
  }'
```

## 🎨 Themes

Switch between themes by clicking the theme toggle in the navigation:
- 🌙 **Dark** - Default dark theme
- ☀️ **Light** - Clean light theme
- 🧡 **Orange** - Claude AI inspired
- 🎮 **Cybersecurity** - Hacker vibes
- 🌊 **Ocean** - Cool blue theme

Theme preference is saved to localStorage.

## 🛡️ Security Features

### Honeypot System
- Detects and traps malicious users
- Auto-bans suspicious IPs
- Sends alerts via email/Discord
- Fake endpoints for social engineering protection

### Input Validation
- URL format validation
- Malicious pattern detection
- SQL/XSS injection prevention
- Rate limiting per IP

### Encryption
- AES encryption for sensitive data
- Secure token generation
- Hash functions for data verification

### Security Headers
- CSP (Content Security Policy)
- X-Frame-Options
- X-Content-Type-Options
- CORS protection

## 📊 Vulnerabilities Detected

1. **XSS (Cross-Site Scripting)** - Reflected and stored XSS
2. **SQL Injection** - Database injection attacks
3. **CSRF (Cross-Site Request Forgery)** - Missing CSRF tokens
4. **Security Headers** - Missing critical HTTP headers
5. **SSL/TLS Issues** - Invalid or expired certificates
6. **Exposed Information** - Sensitive files and configs
7. **Outdated Libraries** - Known vulnerable dependencies
8. **Cookie Security** - Missing HttpOnly/Secure flags
9. **Subdomain Issues** - Misconfigured subdomains
10. **Information Leakage** - Server info disclosure

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.next
```

### Deploy to Self-Hosted Server

```bash
# Build
npm run build

# Start production server
npm start

# Or use PM2
npm install -g pm2
pm2 start npm --name "scanner" -- start
pm2 save
```

### Deploy to Docker

```bash
# Build Docker image
docker build -t website-scanner .

# Run container
docker run -p 3000:3000 website-scanner
```

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [SECURITY.md](./SECURITY.md) - Security features documentation
- [API.md](./API.md) - Complete API reference
- [THEMES.md](./THEMES.md) - Theme customization guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment variables not working
```bash
# Make sure .env.local is in root directory
# Restart dev server after changes
```

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚠️ Legal Disclaimer

This tool is designed for authorized security testing only. Users are responsible for:
- Obtaining proper authorization before scanning websites
- Following all applicable laws and regulations
- Respecting website owners' rights
- Using this tool ethically and legally

Unauthorized scanning may be illegal. Always get permission!

## 📧 Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/website-vulnerability-scanner/issues
- Email: support@yourdomain.com
- Discord: [Your Discord Server]

## 🙏 Acknowledgments

Built with:
- Next.js
- React
- Axios
- jsPDF
- Tailwind CSS

---

**Made with ❤️ for Security**

*Last Updated: August 13, 2026*
