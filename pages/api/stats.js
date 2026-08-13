/**
 * =========================================
 * API: /api/stats
 * Global statistics endpoint
 * =========================================
 */

import {
  getClientIP,
  checkRateLimit,
  isIPBanned,
  setCORSHeaders,
  setSecurityHeaders,
} from '../../src/utils/security';

// In-memory stats store (in production, use database)
let globalStats = {
  totalScans: 1234,
  uniqueWebsites: 456,
  totalVulnerabilities: 3890,
  averageScore: 6.8,
  criticalCount: 123,
  highCount: 456,
  mediumCount: 345,
  lowCount: 276,
  infoCount: 34,

  vulnerabilityBreakdown: {
    xss: 456,
    sqlInjection: 189,
    missingHeaders: 234,
    csrf: 145,
    sslIssues: 98,
    exposedInfo: 78,
    outdatedLibs: 167,
    cookieIssues: 98,
  },

  scanTrend: [
    { day: 'Monday', scans: 145 },
    { day: 'Tuesday', scans: 156 },
    { day: 'Wednesday', scans: 162 },
    { day: 'Thursday', scans: 189 },
    { day: 'Friday', scans: 201 },
    { day: 'Saturday', scans: 134 },
    { day: 'Sunday', scans: 145 },
  ],

  topVulnerabilities: [
    { name: 'XSS', count: 456, percentage: 35 },
    { name: 'Missing Security Headers', count: 234, percentage: 18 },
    { name: 'SQL Injection', count: 189, percentage: 15 },
    { name: 'CSRF', count: 145, percentage: 11 },
    { name: 'SSL/TLS Issues', count: 98, percentage: 8 },
    { name: 'Cookie Security', count: 78, percentage: 6 },
    { name: 'Information Leakage', count: 45, percentage: 3 },
    { name: 'Subdomain Issues', count: 34, percentage: 4 },
  ],

  scoreDistribution: {
    critical: 123,
    high: 456,
    medium: 345,
    low: 276,
    info: 34,
  },

  recentScans: [
    {
      url: 'example1.com',
      scanTime: new Date(Date.now() - 3600000).toISOString(),
      score: 5.2,
      vulnerabilities: 12,
    },
    {
      url: 'example2.com',
      scanTime: new Date(Date.now() - 7200000).toISOString(),
      score: 7.8,
      vulnerabilities: 5,
    },
    {
      url: 'example3.com',
      scanTime: new Date(Date.now() - 10800000).toISOString(),
      score: 4.1,
      vulnerabilities: 18,
    },
  ],
};

export default async function handler(req, res) {
  setSecurityHeaders(res);
  setCORSHeaders(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientIP = getClientIP(req);

    // Check if IP is banned
    if (isIPBanned(clientIP)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(clientIP, 200, 900000); // More lenient for stats
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);

    if (!rateLimit.allowed) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Get filter from query params
    const { filter } = req.query;

    if (filter === 'summary') {
      return res.status(200).json({
        totalScans: globalStats.totalScans,
        uniqueWebsites: globalStats.uniqueWebsites,
        totalVulnerabilities: globalStats.totalVulnerabilities,
        averageScore: globalStats.averageScore,
      });
    }

    if (filter === 'severity') {
      return res.status(200).json({
        critical: globalStats.criticalCount,
        high: globalStats.highCount,
        medium: globalStats.mediumCount,
        low: globalStats.lowCount,
        info: globalStats.infoCount,
      });
    }

    if (filter === 'breakdown') {
      return res.status(200).json(globalStats.vulnerabilityBreakdown);
    }

    if (filter === 'trend') {
      return res.status(200).json(globalStats.scanTrend);
    }

    if (filter === 'recent') {
      return res.status(200).json(globalStats.recentScans);
    }

    if (filter === 'top') {
      return res.status(200).json(globalStats.topVulnerabilities);
    }

    // Return all stats if no filter
    return res.status(200).json({
      timestamp: new Date().toISOString(),
      stats: globalStats,
    });

  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}

// Export for updating stats
export function updateStats(newStats) {
  globalStats = { ...globalStats, ...newStats };
}
