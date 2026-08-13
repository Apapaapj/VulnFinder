/**
 * =========================================
 * RESULTS PANEL COMPONENT
 * Display vulnerability scan results
 * =========================================
 */

import React, { useState } from 'react';
import axios from 'axios';

const SeverityColors = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#3b82f6',
  Info: '#06b6d4',
};

const SeverityEmoji = {
  Critical: '🔴',
  High: '🟠',
  Medium: '🟡',
  Low: '🔵',
  Info: '⚪',
};

export default function ResultsPanel({ results, onExport }) {
  const [expandedUrl, setExpandedUrl] = useState(null);
  const [exportFormat, setExportFormat] = useState('json');

  const handleExport = async () => {
    try {
      await onExport(results.results, exportFormat);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    if (score >= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-text-secondary text-sm mb-2">Total Scans</p>
          <p className="text-3xl font-bold text-text">{results.stats.totalScans}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-text-secondary text-sm mb-2">Total Vulnerabilities</p>
          <p className="text-3xl font-bold text-danger">{results.stats.totalVulnerabilities}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-text-secondary text-sm mb-2">Average Score</p>
          <p className={`text-3xl font-bold ${getScoreColor(results.stats.averageScore)}`}>
            {results.stats.averageScore.toFixed(1)}/10
          </p>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-text-secondary text-sm mb-2">Critical Issues</p>
          <p className="text-3xl font-bold text-critical">{results.stats.criticalCount}</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
        <h3 className="text-xl font-bold text-text mb-4">Export Results</h3>
        <div className="flex gap-4 flex-wrap">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background border border-border text-text focus:outline-none focus:border-primary"
          >
            <option value="json">📄 JSON</option>
            <option value="pdf">📕 PDF Report</option>
          </select>
          <button
            onClick={handleExport}
            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition font-medium"
          >
            📥 Download {exportFormat.toUpperCase()}
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(results, null, 2));
              alert('Copied to clipboard!');
            }}
            className="px-6 py-2 rounded-lg bg-secondary text-white hover:bg-secondary-dark transition font-medium"
          >
            📋 Copy JSON
          </button>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-text">Scan Results</h3>

        {results.results.map((result, idx) => (
          <div key={idx} className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Result Header */}
            <div
              onClick={() => setExpandedUrl(expandedUrl === idx ? null : idx)}
              className="p-6 cursor-pointer hover:bg-background-secondary transition"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-text break-all">{result.url}</h4>
                  <p className="text-sm text-text-secondary mt-1">Scanned: {new Date(result.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right ml-4">
                  <p className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score ? result.score.toFixed(1) : 'N/A'}
                  </p>
                  <p className="text-sm text-text-secondary">/10</p>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="bg-critical bg-opacity-10 rounded p-2">
                  <p className="text-xs text-text-secondary">Critical</p>
                  <p className="text-lg font-bold text-critical">{result.summary?.critical || 0}</p>
                </div>
                <div className="bg-danger bg-opacity-10 rounded p-2">
                  <p className="text-xs text-text-secondary">High</p>
                  <p className="text-lg font-bold text-danger">{result.summary?.high || 0}</p>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-2">
                  <p className="text-xs text-text-secondary">Medium</p>
                  <p className="text-lg font-bold text-warning">{result.summary?.medium || 0}</p>
                </div>
                <div className="bg-info bg-opacity-10 rounded p-2">
                  <p className="text-xs text-text-secondary">Low</p>
                  <p className="text-lg font-bold text-info">{result.summary?.low || 0}</p>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-2">
                  <p className="text-xs text-text-secondary">Total</p>
                  <p className="text-lg font-bold text-success">{result.summary?.total || 0}</p>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedUrl === idx && result.allVulnerabilities && (
              <div className="border-t border-border p-6 bg-background-secondary">
                <h5 className="font-bold text-text mb-4">Detailed Vulnerabilities</h5>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {result.allVulnerabilities.map((vuln, vidx) => (
                    <div
                      key={vidx}
                      className="bg-card border border-border rounded p-3"
                      style={{ borderLeftColor: SeverityColors[vuln.severity], borderLeftWidth: '4px' }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl mt-1">{SeverityEmoji[vuln.severity]}</span>
                        <div className="flex-1">
                          <p className="font-bold text-text">{vuln.type}</p>
                          <p className="text-sm text-text-secondary mt-1">{vuln.description}</p>
                          <p className="text-xs text-primary mt-2 break-all">
                            <strong>Location:</strong> {vuln.location}
                          </p>
                          <p className="text-xs text-text-secondary mt-1">
                            <strong>Fix:</strong> {vuln.remediation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
