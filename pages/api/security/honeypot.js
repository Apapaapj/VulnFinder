/**
 * =========================================
 * HONEYPOT ENDPOINTS
 * Trap for malicious users
 * =========================================
 */

import {
  logHoneypotAccess,
  getClientIP,
  setCORSHeaders,
  setSecurityHeaders,
  generateToken,
} from '../../../src/utils/security';

// ── FAKE DATABASE ENDPOINT ────────────────────────────────
// Accessed by attackers trying to steal database
export async function handleFakeDatabase(req, res) {
  const clientIP = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'Unknown';

  // Log the attack
  logHoneypotAccess(clientIP, '/api/database', userAgent);

  // Send fake database data
  const fakeData = {
    status: 'success',
    message: 'Database backup retrieved',
    database_info: {
      name: 'prod_database_2026',
      size: '2.5GB',
      version: '8.0.36',
      encrypted: false,
    },
    users: [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: 'CORRUPTED_MALWARE_PAYLOAD_DETECTED',
        role: 'administrator',
      },
      {
        id: 2,
        username: 'user',
        email: 'user@example.com',
        password: 'INVALID_DATA_FORMAT',
        role: 'user',
      },
    ],
    download_url: 'database_backup_2026_CORRUPTED.zip',
    download_size: '2.1GB',
    checksum: 'MALFORMED_HASH',
    created_at: '2026-08-13T12:00:00Z',
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="database_backup.json"');
  return res.status(200).json(fakeData);
}

// ── FAKE ADMIN LOGIN ──────────────────────────────────────
// Accessed by attackers trying brute force login
export async function handleFakeAdmin(req, res) {
  const clientIP = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'Unknown';

  // Log every access
  logHoneypotAccess(clientIP, '/api/admin/login', userAgent);

  // Return "successful" login with fake token
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token: generateToken(64),
    user: {
      id: 1,
      username: 'admin',
      email: 'admin@corrupted.local',
      role: 'administrator',
      permissions: ['INVALID', 'REVOKED', 'MALICIOUS'],
    },
    session_id: 'CORRUPTED_SESSION_' + generateToken(16),
    expires_in: 3600,
  });
}

// ── FAKE CONFIG ENDPOINT ──────────────────────────────────
// Accessed by attackers trying to get configuration
export async function handleFakeConfig(req, res) {
  const clientIP = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'Unknown';

  logHoneypotAccess(clientIP, '/api/config', userAgent);

  return res.status(200).json({
    database: {
      host: 'CORRUPTED_HOST',
      port: 5432,
      username: 'INVALID_USER',
      password: 'MALWARE_EMBEDDED_HERE',
      database: 'prod_db_TRAP',
    },
    api_keys: {
      stripe: 'FAKE_API_KEY_MALICIOUS',
      sendgrid: 'INVALID_KEY_DETECTED',
      aws: 'CORRUPTED_AWS_CREDENTIALS',
    },
    secrets: {
      jwt_secret: 'MALFORMED_SECRET_TRAP',
      encryption_key: 'INVALID_ENCRYPTION_PAYLOAD',
    },
  });
}

// ── FAKE USERS LIST ───────────────────────────────────────
// Accessed by attackers trying to enumerate users
export async function handleFakeUsers(req, res) {
  const clientIP = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'Unknown';

  logHoneypotAccess(clientIP, '/api/users', userAgent);

  return res.status(200).json({
    data: [
      { id: 1, username: 'admin', email: 'admin@corrupted.local', role: 'admin' },
      { id: 2, username: 'moderator', email: 'mod@trap.local', role: 'moderator' },
      { id: 3, username: 'user', email: 'user@malware.local', role: 'user' },
      { id: 4, username: 'guest', email: 'guest@honeypot.local', role: 'guest' },
    ],
    total: 4,
    page: 1,
    per_page: 100,
  });
}

// ── FAKE BACKUP ENDPOINT ──────────────────────────────────
// Accessed by attackers trying to download backups
export async function handleFakeBackup(req, res) {
  const clientIP = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'Unknown';

  logHoneypotAccess(clientIP, '/api/backup/download', userAgent);

  // Create corrupted backup file
  const backupContent = Buffer.from(
    'CORRUPTED_BACKUP_FILE\n' +
    'MALWARE_PAYLOAD_DETECTED\n' +
    'THIS_IS_A_HONEYPOT_TRAP\n' +
    'IP_' + clientIP + '_HAS_BEEN_LOGGED_AND_BANNED\n' +
    'BACKUP_DATA_ENCRYPTED_AND_INVALID\n',
    'utf-8'
  );

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', 'attachment; filename="backup_2026_CORRUPTED.sql"');
  res.setHeader('Content-Length', backupContent.length);

  return res.status(200).send(backupContent);
}

// ── ROUTER FOR HONEYPOT ENDPOINTS ────────────────────────
export default function handler(req, res) {
  setSecurityHeaders(res);
  setCORSHeaders(res);

  // Get which honeypot endpoint is being accessed
  const path = req.url;

  if (path.includes('database')) {
    return handleFakeDatabase(req, res);
  } else if (path.includes('admin')) {
    return handleFakeAdmin(req, res);
  } else if (path.includes('config')) {
    return handleFakeConfig(req, res);
  } else if (path.includes('users')) {
    return handleFakeUsers(req, res);
  } else if (path.includes('backup')) {
    return handleFakeBackup(req, res);
  }

  // Default honeypot response
  const clientIP = getClientIP(req);
  logHoneypotAccess(clientIP, path, req.headers['user-agent'] || 'Unknown');

  return res.status(404).json({
    error: 'Not found',
    message: 'This endpoint does not exist',
  });
}
