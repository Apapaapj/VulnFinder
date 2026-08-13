/**
 * =========================================
 * STATISTICS DASHBOARD COMPONENT
 * Display global vulnerability statistics
 * =========================================
 */

import React from 'react';

export default function StatsDashboard({ stats }) {
  if (!stats) return null;

  const topVulns = stats.topVulnerabilities || [
    { name: 'XSS', count: 456, percentage: 35 },
    { name: 'Missing Headers', count: 234, percentage: 18 },
    { name: 'SQL Injection', count: 189, percentage: 15 },
    { name: 'CSRF', count: 145, percentage: 11 },
  ];

  const scanTrend = stats.scanTrend || [
    { day: 'Monday', scans: 145 },
    { day: 'Tuesday', scans: 156 },
    { day: 'Wednesday', scans: 162 },
    { day: 'Thursday', scans: 189 },
    { day: 'Friday', scans: 201 },
    { day: 'Saturday', scans: 134 },
    { day: 'Sunday', scans: 145 },
  ];

  const maxScans = Math.max(...scanTrend.map(d => d.scans));

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-text">Global Statistics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-text-secondary text-sm mb-2">Total Scans</p>
          <p className="text-4xl font-bold text-primary">{stats.totalScans || 0}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-text-secondary text-sm mb-2">Websites Scanned</p>
          <p className="text-4xl font-bold text-secondary">{stats.uniqueWebsites || 0}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-text-secondary text-sm mb-2">Total Vulnerabilities</p>
          <p className="text-4xl font-bold text-danger">{stats.totalVulnerabilities || 0}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-text-secondary text-sm mb-2">Average Score</p>
          <p className="text-4xl font-bold text-warning">{(stats.averageScore || 0).toFixed(1)}/10</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Vulnerabilities */}
        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
          <h3 className="text-xl font-bold text-text mb-6">Top Vulnerabilities</h3>
          <div className="space-y-4">
            {topVulns.map((vuln, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-text">{idx + 1}. {vuln.name}</p>
                  <span className="text-sm text-text-secondary">{vuln.percentage}%</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all"
                    style={{ width: `${vuln.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-text-secondary mt-1">{vuln.count} occurrences</p>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
          <h3 className="text-xl font-bold text-text mb-6">Severity Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <p className="flex-1 text-text">Critical</p>
              <p className="font-bold text-text">{stats.criticalCount || 0}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <p className="flex-1 text-text">High</p>
              <p className="font-bold text-text">{stats.highCount || 0}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <p className="flex-1 text-text">Medium</p>
              <p className="font-bold text-text">{stats.mediumCount || 0}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <p className="flex-1 text-text">Low</p>
              <p className="font-bold text-text">{stats.lowCount || 0}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <p className="flex-1 text-text">Info</p>
              <p className="font-bold text-text">{stats.infoCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Trend */}
      <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
        <h3 className="text-xl font-bold text-text mb-6">Scan Trend (Last 7 Days)</h3>
        <div className="space-y-4">
          {scanTrend.map((day, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-text">{day.day}</p>
                <span className="text-sm text-text-secondary">{day.scans} scans</span>
              </div>
              <div className="h-3 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                  style={{ width: `${(day.scans / maxScans) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
