/**
 * =========================================
 * SCANNER COMPONENT
 * Input form for scanning websites
 * =========================================
 */

import React, { useState } from 'react';

export default function Scanner({ onScan, loading }) {
  const [urls, setUrls] = useState(['']);

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlInput = () => {
    setUrls([...urls, '']);
  };

  const removeUrlInput = (index) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleScan = () => {
    const validUrls = urls.filter(url => url.trim());
    if (validUrls.length === 0) {
      alert('Please enter at least one URL');
      return;
    }
    onScan(validUrls);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
      <h2 className="text-3xl font-bold text-text mb-2">Scan Your Website</h2>
      <p className="text-text-secondary mb-6">Enter one or multiple URLs to scan for vulnerabilities</p>

      <div className="space-y-4 mb-6">
        {urls.map((url, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-text placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            />
            {urls.length > 1 && (
              <button
                onClick={() => removeUrlInput(index)}
                className="px-4 py-3 rounded-lg bg-danger text-white hover:bg-danger-dark transition"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={addUrlInput}
          className="px-6 py-3 rounded-lg bg-secondary text-white hover:bg-secondary-dark transition font-medium"
        >
          + Add URL
        </button>
      </div>

      <div className="bg-info-light bg-opacity-10 border border-info border-opacity-30 rounded-lg p-4 mb-6">
        <p className="text-sm text-info">
          <strong>💡 Tip:</strong> You can scan up to unlimited websites at once. Deep scan includes XSS, SQL Injection, 
          Security Headers, SSL/TLS, CSRF, and more.
        </p>
      </div>

      <button
        onClick={handleScan}
        disabled={loading}
        className={`w-full py-4 rounded-lg font-bold text-lg transition ${
          loading
            ? 'bg-primary-dark opacity-50 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary hover:shadow-opacity-50'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⚙️</span>
            Scanning... (This may take a few moments)
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            🔍 Start Deep Scan
          </span>
        )}
      </button>

      {loading && (
        <div className="mt-4 space-y-2">
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-dark animate-pulse"></div>
          </div>
          <p className="text-sm text-text-secondary text-center">Analyzing vulnerabilities...</p>
        </div>
      )}
    </div>
  );
}
