/**
 * =========================================
 * API: /api/export
 * Export scan results as PDF or JSON
 * =========================================
 */

import { jsPDF } from 'jspdf';
import {
  getClientIP,
  checkRateLimit,
  isIPBanned,
  setCORSHeaders,
  setSecurityHeaders,
} from '../../src/utils/security';

export default async function handler(req, res) {
  setSecurityHeaders(res);
  setCORSHeaders(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientIP = getClientIP(req);

    // Check if IP is banned
    if (isIPBanned(clientIP)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(clientIP, 50, 900000);
    if (!rateLimit.allowed) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    const { results, format = 'json' } = req.body;

    if (!results) {
      return res.status(400).json({ error: 'No results provided' });
    }

    if (format === 'json') {
      return exportJSON(results, res);
    } else if (format === 'pdf') {
      return exportPDF(results, res);
    } else {
      return res.status(400).json({ error: 'Invalid format' });
    }

  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: 'Export failed' });
  }
}

// ── EXPORT AS JSON ────────────────────────────────────────
function exportJSON(results, res) {
  const json = {
    exportedAt: new Date().toISOString(),
    format: 'JSON',
    results: results,
    summary: {
      totalScans: results.length,
      totalVulnerabilities: results.reduce((sum, r) => sum + (r.summary?.total || 0), 0),
      averageScore: (results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length).toFixed(1),
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="scan-results.json"');
  return res.status(200).json(json);
}

// ── EXPORT AS PDF ─────────────────────────────────────────
function exportPDF(results, res) {
  try {
    const doc = new jsPDF();
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.text('Website Vulnerability Scan Report', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setTextColor(128);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
    yPosition += 15;

    // Summary
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text('Summary', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    const totalVulns = results.reduce((sum, r) => sum + (r.summary?.total || 0), 0);
    const avgScore = (results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length).toFixed(1);

    doc.text(`Total Scans: ${results.length}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Total Vulnerabilities Found: ${totalVulns}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Average Security Score: ${avgScore}/10`, 20, yPosition);
    yPosition += 15;

    // Detailed Results
    doc.setFontSize(14);
    doc.text('Detailed Results', 20, yPosition);
    yPosition += 10;

    for (const result of results) {
      // URL
      doc.setFontSize(11);
      doc.setTextColor(0, 102, 204);
      doc.text(`Website: ${result.url}`, 20, yPosition);
      yPosition += 8;

      // Score
      doc.setTextColor(0);
      doc.setFontSize(10);
      doc.text(`Security Score: ${result.score || 0}/10`, 20, yPosition);
      yPosition += 6;

      // Vulnerabilities
      if (result.summary) {
        doc.text(
          `Vulnerabilities: Critical(${result.summary.critical}), High(${result.summary.high}), Medium(${result.summary.medium}), Low(${result.summary.low})`,
          20,
          yPosition
        );
      }
      yPosition += 8;

      // Page break if needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
    }

    // Footer
    doc.setTextColor(128);
    doc.setFontSize(8);
    doc.text(
      'This report contains confidential vulnerability information. Treat with care.',
      20,
      doc.internal.pageSize.height - 10
    );

    // Send PDF
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="scan-results.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({ error: 'PDF generation failed' });
  }
}
