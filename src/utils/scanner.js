/**
 * =========================================
 * WEBSITE VULNERABILITY SCANNER ENGINE
 * Deep Scanning for Multiple Vulnerabilities
 * =========================================
 */

import axios from 'axios';
import { parse } from 'url';

const vulnerabilities = {
  xss: [],
  sqlInjection: [],
  csrf: [],
  missingHeaders: [],
  sslIssues: [],
  exposedInfo: [],
  outdatedLibs: [],
  cookieIssues: [],
  subdomainIssues: [],
  responseHeaders: [],
};

// ── XSS DETECTION ─────────────────────────────────────────
async function detectXSS(url) {
  const xssPatterns = [
    { pattern: /<script[^>]*>.*?<\/script>/gi, type: 'Script Tag XSS' },
    { pattern: /javascript:/gi, type: 'JavaScript Protocol XSS' },
    { pattern: /on\w+\s*=/gi, type: 'Event Handler XSS' },
    { pattern: /<iframe[^>]*>/gi, type: 'Iframe XSS' },
    { pattern: /<img[^>]*onerror/gi, type: 'Image Event XSS' },
    { pattern: /<svg[^>]*onload/gi, type: 'SVG Event XSS' },
  ];

  const results = [];
  const testPayloads = [
    `${url}?search=<script>alert('xss')</script>`,
    `${url}?id=1' <img src=x onerror=alert('xss')>`,
    `${url}?q="><script>alert('xss')</script>`,
  ];

  for (const payload of testPayloads) {
    try {
      const response = await axios.get(payload, { timeout: 5000, validateStatus: () => true });
      const content = response.data;

      for (const { pattern, type } of xssPatterns) {
        if (pattern.test(content)) {
          results.push({
            type: type,
            severity: 'Critical',
            location: payload,
            description: 'XSS vulnerability detected in response',
            remediation: 'Implement input validation and output encoding'
          });
        }
      }
    } catch (e) {
      // Ignore timeout/connection errors
    }
  }

  return results;
}

// ── SQL INJECTION DETECTION ───────────────────────────────
async function detectSQLInjection(url) {
  const sqlPatterns = [
    { pattern: /SQL syntax/gi, type: 'SQL Error' },
    { pattern: /mysql_fetch/gi, type: 'MySQL Error' },
    { pattern: /ORA-\d+/gi, type: 'Oracle Error' },
    { pattern: /PostgreSQL/gi, type: 'PostgreSQL Error' },
    { pattern: /unexpected end of SQL/gi, type: 'SQL Syntax Error' },
  ];

  const results = [];
  const sqlPayloads = [
    `${url}?id=1' OR '1'='1`,
    `${url}?search=1 UNION SELECT NULL`,
    `${url}?user=admin' --`,
    `${url}?id=1; DROP TABLE users--`,
  ];

  for (const payload of sqlPayloads) {
    try {
      const response = await axios.get(payload, { timeout: 5000, validateStatus: () => true });
      const content = response.data;

      for (const { pattern, type } of sqlPatterns) {
        if (pattern.test(content)) {
          results.push({
            type: type,
            severity: 'Critical',
            location: payload,
            description: 'SQL Injection vulnerability detected',
            remediation: 'Use prepared statements and parameterized queries'
          });
        }
      }
    } catch (e) {
      // Ignore errors
    }
  }

  return results;
}

// ── SECURITY HEADERS ANALYSIS ─────────────────────────────
async function analyzeSecurityHeaders(url) {
  const requiredHeaders = {
    'content-security-policy': { severity: 'High', description: 'CSP header missing' },
    'x-frame-options': { severity: 'High', description: 'X-Frame-Options header missing (Clickjacking risk)' },
    'x-content-type-options': { severity: 'Medium', description: 'X-Content-Type-Options header missing' },
    'x-xss-protection': { severity: 'Medium', description: 'X-XSS-Protection header missing' },
    'strict-transport-security': { severity: 'High', description: 'HSTS header missing (HTTPS only)' },
    'referrer-policy': { severity: 'Low', description: 'Referrer-Policy header missing' },
    'permissions-policy': { severity: 'Low', description: 'Permissions-Policy header missing' },
  };

  const results = [];

  try {
    const response = await axios.head(url, { timeout: 10000 });
    const headers = response.headers;

    for (const [headerName, { severity, description }] of Object.entries(requiredHeaders)) {
      if (!headers[headerName]) {
        results.push({
          type: `Missing ${headerName}`,
          severity: severity,
          location: url,
          description: description,
          remediation: `Add ${headerName} header to your server configuration`
        });
      }
    }
  } catch (e) {
    results.push({
      type: 'Header Analysis Failed',
      severity: 'Low',
      location: url,
      description: 'Could not analyze headers',
      remediation: 'Ensure server is accessible'
    });
  }

  return results;
}

// ── SSL/TLS CERTIFICATE CHECK ─────────────────────────────
async function checkSSLCertificate(url) {
  const results = [];
  const parsedUrl = parse(url);

  if (parsedUrl.protocol !== 'https:') {
    results.push({
      type: 'No HTTPS',
      severity: 'Critical',
      location: url,
      description: 'Website does not use HTTPS/SSL',
      remediation: 'Implement SSL/TLS certificate and force HTTPS'
    });
    return results;
  }

  try {
    const response = await axios.get(url, { timeout: 10000 });
    // If we can access, SSL is valid
    results.push({
      type: 'SSL Valid',
      severity: 'Info',
      location: url,
      description: 'HTTPS/SSL certificate is valid',
      remediation: 'OK'
    });
  } catch (e) {
    if (e.code === 'CERT_HAS_EXPIRED') {
      results.push({
        type: 'SSL Certificate Expired',
        severity: 'Critical',
        location: url,
        description: 'SSL certificate has expired',
        remediation: 'Renew your SSL certificate immediately'
      });
    } else if (e.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
      results.push({
        type: 'Invalid SSL Certificate',
        severity: 'Critical',
        location: url,
        description: 'SSL certificate is invalid',
        remediation: 'Install valid SSL certificate from trusted CA'
      });
    }
  }

  return results;
}

// ── EXPOSED INFORMATION DETECTION ─────────────────────────
async function detectExposedInfo(url) {
  const results = [];
  const exposedPaths = [
    '/.git/config',
    '/.env',
    '/config.php',
    '/web.config',
    '/.aws/credentials',
    '/backup.sql',
    '/.DS_Store',
    '/README.md',
    '/package.json',
  ];

  for (const path of exposedPaths) {
    try {
      const response = await axios.get(url + path, { timeout: 5000, validateStatus: () => true });
      if (response.status === 200) {
        results.push({
          type: 'Exposed File',
          severity: 'High',
          location: url + path,
          description: `Sensitive file exposed: ${path}`,
          remediation: 'Restrict access to sensitive files'
        });
      }
    } catch (e) {
      // File not found, which is good
    }
  }

  return results;
}

// ── OUTDATED LIBRARY DETECTION ────────────────────────────
async function detectOutdatedLibs(url) {
  const outdatedLibraries = [
    { name: 'jQuery 1.x', pattern: /jquery\/1\./gi, severity: 'High' },
    { name: 'Bootstrap 2.x', pattern: /bootstrap\/2\./gi, severity: 'High' },
    { name: 'AngularJS', pattern: /angularjs/gi, severity: 'Medium' },
    { name: 'Flash', pattern: /<object.*?flash/gi, severity: 'Critical' },
  ];

  const results = [];

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const content = response.data;

    for (const { name, pattern, severity } of outdatedLibraries) {
      if (pattern.test(content)) {
        results.push({
          type: 'Outdated Library',
          severity: severity,
          location: url,
          description: `Outdated ${name} detected`,
          remediation: `Update to latest version of ${name}`
        });
      }
    }
  } catch (e) {
    // Ignore
  }

  return results;
}

// ── CSRF DETECTION ────────────────────────────────────────
async function detectCSRF(url) {
  const results = [];

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const content = response.data;

    // Check for CSRF token in forms
    const csrfTokenRegex = /csrf|_token|nonce/gi;
    if (!csrfTokenRegex.test(content)) {
      results.push({
        type: 'Missing CSRF Protection',
        severity: 'High',
        location: url,
        description: 'No CSRF token found in forms',
        remediation: 'Implement CSRF token validation for all state-changing requests'
      });
    }
  } catch (e) {
    // Ignore
  }

  return results;
}

// ── COOKIE SECURITY CHECK ─────────────────────────────────
async function checkCookieSecurity(url) {
  const results = [];

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const setCookieHeaders = response.headers['set-cookie'] || [];

    for (const cookie of setCookieHeaders) {
      if (!cookie.includes('HttpOnly')) {
        results.push({
          type: 'Cookie Missing HttpOnly',
          severity: 'Medium',
          location: url,
          description: 'Cookie without HttpOnly flag - vulnerable to XSS theft',
          remediation: 'Add HttpOnly flag to sensitive cookies'
        });
      }

      if (url.startsWith('https') && !cookie.includes('Secure')) {
        results.push({
          type: 'Cookie Missing Secure Flag',
          severity: 'High',
          location: url,
          description: 'Cookie without Secure flag on HTTPS - can be transmitted over HTTP',
          remediation: 'Add Secure flag to cookies'
        });
      }
    }
  } catch (e) {
    // Ignore
  }

  return results;
}

// ── MAIN SCANNER FUNCTION ─────────────────────────────────
export async function runDeepScan(url) {
  // Validate URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const results = {
    url: url,
    timestamp: new Date().toISOString(),
    vulnerabilities: {},
    summary: {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    },
    score: 10.0,
  };

  try {
    // Run all scans in parallel
    const [xss, sql, headers, ssl, exposed, outdated, csrf, cookies] = await Promise.all([
      detectXSS(url),
      detectSQLInjection(url),
      analyzeSecurityHeaders(url),
      checkSSLCertificate(url),
      detectExposedInfo(url),
      detectOutdatedLibs(url),
      detectCSRF(url),
      checkCookieSecurity(url),
    ]);

    // Combine results
    const allVulnerabilities = [
      ...xss,
      ...sql,
      ...headers,
      ...ssl,
      ...exposed,
      ...outdated,
      ...csrf,
      ...cookies,
    ];

    // Categorize vulnerabilities
    results.vulnerabilities = {
      xss: xss.length,
      sqlInjection: sql.length,
      csrf: csrf.length,
      missingHeaders: headers.length,
      sslIssues: ssl.length,
      exposedInfo: exposed.length,
      outdatedLibs: outdated.length,
      cookieIssues: cookies.length,
    };

    // Count by severity
    for (const vuln of allVulnerabilities) {
      results.summary[vuln.severity.toLowerCase()] = (results.summary[vuln.severity.toLowerCase()] || 0) + 1;
      results.summary.total++;
    }

    // Calculate security score (0-10)
    let score = 10.0;
    score -= results.summary.critical * 2;
    score -= results.summary.high * 1.5;
    score -= results.summary.medium * 1;
    score -= results.summary.low * 0.5;
    results.score = Math.max(0, Math.round(score * 10) / 10);

    results.allVulnerabilities = allVulnerabilities;

  } catch (error) {
    results.error = error.message;
  }

  return results;
}

export default runDeepScan;
