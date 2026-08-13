/**
 * =========================================
 * HOME PAGE - VULNERABILITY SCANNER
 * =========================================
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Scanner from '../src/components/Scanner';
import StatsDashboard from '../src/components/StatsDashboard';
import ThemeToggle from '../src/components/ThemeToggle';
import ResultsPanel from '../src/components/ResultsPanel';
import '../src/styles/globals.css';
import '../src/styles/themes.css';

export default function Home() {
  const [theme, setTheme] = useState('dark');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(true);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage?.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Fetch statistics
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage?.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleScan = async (urls) => {
    setLoading(true);
    setShowStats(false);

    try {
      const response = await axios.post('/api/scan', {
        urls: urls.map(url => url.trim()).filter(Boolean),
      });

      setResults(response.data);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (error) {
      console.error('Scan error:', error);
      alert('Scan failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Website Vulnerability Scanner - Professional Security Tool</title>
        <meta name="description" content="Advanced website vulnerability scanner for security analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary">
        {/* Navigation */}
        <nav className="border-b border-border sticky top-0 z-50 bg-background bg-opacity-95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔍</span>
              </div>
              <h1 className="text-2xl font-bold text-primary">Security Scanner</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-4 py-2 rounded-lg bg-primary-light text-primary hover:bg-primary-lighter transition"
              >
                {showStats ? 'Hide' : 'Show'} Stats
              </button>
              <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Scanner Section */}
          <div className="mb-12">
            <Scanner onScan={handleScan} loading={loading} />
          </div>

          {/* Stats Section */}
          {showStats && stats && (
            <div className="mb-12">
              <StatsDashboard stats={stats} />
            </div>
          )}

          {/* Results Section */}
          {results && (
            <div>
              <ResultsPanel results={results} onExport={handleExport} />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary text-sm">
            <p>🔐 Website Vulnerability Scanner - Professional Security Analysis Tool</p>
            <p className="mt-2">Made with ❤️ for Security</p>
          </div>
        </footer>
      </div>
    </>
  );
}

async function handleExport(results, format) {
  try {
    const response = await axios.post('/api/export', {
      results: results,
      format: format,
    }, {
      responseType: format === 'pdf' ? 'arraybuffer' : 'json',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `scan-results.${format === 'pdf' ? 'pdf' : 'json'}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    alert('Export failed: ' + error.message);
  }
}
