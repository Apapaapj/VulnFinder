/**
 * =========================================
 * API: /api/scan
 * Main scanning endpoint
 * =========================================
 */

import { runDeepScan } from '../../src/utils/scanner';
import {
  validateURL,
  isIPBanned,
  checkRateLimit,
  getClientIP,
  setCORSHeaders,
  setSecurityHeaders,
} from '../../src/utils/security';

export default async function handler(req, res) {
  // Set security headers
  setSecurityHeaders(res);
  setCORSHeaders(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientIP = getClientIP(req);

    // Check if IP is banned
    if (isIPBanned(clientIP)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Your IP has been blocked due to suspicious activity',
      });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(clientIP, 100, 900000); // 100 requests per 15 min
    res.setHeader('X-RateLimit-Limit', rateLimit.limit);
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + 900000).toISOString());

    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: 900,
      });
    }

    // Get URLs from request body
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Please provide an array of URLs to scan',
      });
    }

    // Validate URLs
    const validUrls = [];
    for (const url of urls) {
      const validation = validateURL(url);
      if (validation.valid) {
        validUrls.push(validation.url);
      }
    }

    if (validUrls.length === 0) {
      return res.status(400).json({
        error: 'No valid URLs',
        message: 'All provided URLs are invalid',
      });
    }

    // Run scans
    const results = [];
    for (const url of validUrls) {
      try {
        const scanResult = await runDeepScan(url);
        results.push(scanResult);
      } catch (error) {
        results.push({
          url: url,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Calculate overall statistics
    const stats = {
      totalScans: results.length,
      totalVulnerabilities: 0,
      averageScore: 0,
      criticalCount: 0,
      highCount: 0,
    };

    let totalScore = 0;
    for (const result of results) {
      if (result.summary) {
        stats.totalVulnerabilities += result.summary.total || 0;
        stats.criticalCount += result.summary.critical || 0;
        stats.highCount += result.summary.high || 0;
        totalScore += result.score || 0;
      }
    }

    stats.averageScore = totalScore / results.length;

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: stats,
      results: results,
    });

  } catch (error) {
    console.error('Scan error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during scanning',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
