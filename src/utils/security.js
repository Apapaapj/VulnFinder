/**
 * =========================================
 * SECURITY UTILITIES
 * Input validation, IP banning, encryption
 * =========================================
 */

import CryptoJS from 'crypto-js';

// ── IP BLACKLIST (IN-MEMORY) ──────────────────────────────
const ipBlacklist = new Set();
const honeypotAccessLog = [];

// ── VALIDATE URL INPUT ────────────────────────────────────
export function validateURL(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  url = url.trim();

  // Check for malicious patterns
  const maliciousPatterns = [
    /javascript:/i,
    /<script/i,
    /onclick/i,
    /%253c/i, // Double-encoded <
    /'\s*or\s*'/i,
    /"\s*or\s*"/i,
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(url)) {
      return { valid: false, error: 'Malicious input detected' };
    }
  }

  // Validate URL format
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return { valid: true, url: urlObj.href };
  } catch (e) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

// ── CHECK IF IP IS BANNED ─────────────────────────────────
export function isIPBanned(ip) {
  return ipBlacklist.has(ip);
}

// ── BAN IP ADDRESS ───────────────────────────────────────
export function banIP(ip, duration = 86400000) { // 24 hours default
  ipBlacklist.add(ip);

  // Auto-unban after duration
  if (duration > 0) {
    setTimeout(() => {
      ipBlacklist.delete(ip);
    }, duration);
  }

  return { success: true, message: `IP ${ip} banned for ${duration}ms` };
}

// ── LOG HONEYPOT ACCESS ───────────────────────────────────
export function logHoneypotAccess(ip, endpoint, userAgent) {
  const log = {
    timestamp: new Date().toISOString(),
    ip: ip,
    endpoint: endpoint,
    userAgent: userAgent,
    threat_level: 'HIGH',
    action: 'AUTO_BAN',
  };

  honeypotAccessLog.push(log);

  // Auto-ban the IP
  banIP(ip, 86400000); // Ban for 24 hours

  // Trigger email alert (in production)
  if (process.env.ALERT_EMAIL) {
    sendHoneypotAlert(log);
  }

  return log;
}

// ── GET HONEYPOT LOGS ─────────────────────────────────────
export function getHoneypotLogs() {
  return honeypotAccessLog;
}

// ── SEND ALERT EMAIL ─────────────────────────────────────
async function sendHoneypotAlert(log) {
  if (!process.env.RESEND_API_KEY && !process.env.DISCORD_WEBHOOK_URL) {
    console.log('Alert: No email/webhook configured');
    return;
  }

  const message = `
🚨 HONEYPOT ALERT - POTENTIAL ATTACK DETECTED

Timestamp: ${log.timestamp}
Source IP: ${log.ip}
Endpoint: ${log.endpoint}
User Agent: ${log.userAgent}
Threat Level: ${log.threat_level}
Action Taken: ${log.action}

IP has been automatically banned for 24 hours.
  `;

  // Try Discord webhook first
  if (process.env.DISCORD_WEBHOOK_URL) {
    try {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Security Alert',
          avatar_url: 'https://cdn.discordapp.com/emojis/1087324933778579466.png',
          embeds: [{
            color: 0xFF0000,
            title: '🚨 Honeypot Alert',
            fields: [
              { name: 'Timestamp', value: log.timestamp, inline: true },
              { name: 'Source IP', value: log.ip, inline: true },
              { name: 'Endpoint', value: log.endpoint, inline: false },
              { name: 'User Agent', value: log.userAgent.substring(0, 100), inline: false },
              { name: 'Threat Level', value: log.threat_level, inline: true },
              { name: 'Action', value: log.action, inline: true },
            ]
          }]
        })
      });
    } catch (e) {
      console.error('Discord alert failed:', e);
    }
  }

  // Email backup
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'security@scanner.local',
          to: process.env.ALERT_EMAIL,
          subject: '🚨 Honeypot Alert - Potential Attack Detected',
          html: `<pre>${message}</pre>`,
        }),
      });
    } catch (e) {
      console.error('Email alert failed:', e);
    }
  }
}

// ── ENCRYPTION UTILITIES ──────────────────────────────────
export function encryptData(data, key = process.env.ENCRYPTION_KEY) {
  if (!key) return data;
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  } catch (e) {
    return data;
  }
}

export function decryptData(encrypted, key = process.env.ENCRYPTION_KEY) {
  if (!key) return encrypted;
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    return encrypted;
  }
}

// ── GENERATE SECURE RANDOM TOKEN ──────────────────────────
export function generateToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// ── HASH DATA ─────────────────────────────────────────────
export function hashData(data) {
  return CryptoJS.SHA256(data).toString();
}

// ── GET CLIENT IP ─────────────────────────────────────────
export function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || '0.0.0.0';
}

// ── RATE LIMITING ─────────────────────────────────────────
const requestCounts = new Map();

export function checkRateLimit(ip, maxRequests = 100, windowMs = 900000) {
  const now = Date.now();
  const key = `${ip}:${Math.floor(now / windowMs)}`;

  if (!requestCounts.has(key)) {
    requestCounts.set(key, 0);
  }

  const count = requestCounts.get(key) + 1;
  requestCounts.set(key, count);

  // Cleanup old entries
  if (requestCounts.size > 10000) {
    const olderKey = `${ip}:${Math.floor((now - windowMs * 2) / windowMs)}`;
    requestCounts.delete(olderKey);
  }

  return {
    allowed: count <= maxRequests,
    count: count,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - count),
  };
}

// ── SANITIZE INPUT ───────────────────────────────────────
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, (char) => char === '<' ? '&lt;' : '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ── CORS HELPER ───────────────────────────────────────────
export function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

// ── SECURITY HEADERS ──────────────────────────────────────
export function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'");
}

export default {
  validateURL,
  isIPBanned,
  banIP,
  logHoneypotAccess,
  getHoneypotLogs,
  encryptData,
  decryptData,
  generateToken,
  hashData,
  getClientIP,
  checkRateLimit,
  sanitizeInput,
  setCORSHeaders,
  setSecurityHeaders,
};
