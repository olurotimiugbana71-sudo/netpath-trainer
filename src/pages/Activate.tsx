// src/pages/Activate.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLicense } from '../hooks/useLicense';
import './Activate.css';

export function Activate() {
  const [input, setInput] = useState('');
  const [success, setSuccess] = useState(false);
  const { activate, error, validating, license, deactivate } = useLicense();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await activate(input.trim());
    if (ok) {
      setSuccess(true);
      setInput('');
      setTimeout(() => navigate('/'), 1500);
    }
  };

  const handleDeactivate = () => {
    if (window.confirm('Remove your license from this device?')) {
      deactivate();
      setSuccess(false);
    }
  };

  // 🔒 Logged-in view (License Active)
  if (license) {
    return (
      <div className="page page--narrow">
        <Link to="/" className="back-link">
          ← Back to scenarios
        </Link>

        <header className="page-header" style={{ marginTop: '1.5rem' }}>
          <h1 className="page-title">License Active</h1>
          <p className="page-tagline">
            Premium scenarios are unlocked on this device.
          </p>
        </header>

        <div className="license-info">
          <div className="license-info__row">
            <span className="license-info__label">Customer</span>
            <span className="license-info__value">{license.customerId}</span>
          </div>
          <div className="license-info__row">
            <span className="license-info__label">Tier</span>
            <span className="license-info__value">
              {license.tier === 'team' ? 'Team' : 'Premium'}
            </span>
          </div>
          <div className="license-info__row">
            <span className="license-info__label">Activated</span>
            <span className="license-info__value">
              {new Date(license.activatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <Link to="/" className="btn btn--primary">
            Browse Premium Scenarios
          </Link>
          <button
            type="button"
            className="btn btn--danger"
            onClick={handleDeactivate}
          >
            Deactivate License
          </button>
        </div>
      </div>
    );
  }

  // 🔓 Activation view (License Entry)
  return (
    <div className="page page--narrow">
      <Link to="/" className="back-link">
        ← Back to scenarios
      </Link>

      <header className="page-header" style={{ marginTop: '1.5rem' }}>
        <h1 className="page-title">Activate Premium</h1>
        <p className="page-tagline">
          Enter your license key to unlock all 30 troubleshooting scenarios.
        </p>
      </header>

      <form className="activate-form" onSubmit={handleSubmit}>
        <label className="activate-form__label" htmlFor="license-key">
          License Key
        </label>
        <input
          id="license-key"
          type="text"
          className="activate-form__input"
          placeholder="NPT-XXXXXXXXX-XXXXXXXXXXXXXX"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={validating}
          autoComplete="off"
          spellCheck={false}
        />

        <button
          type="submit"
          className="btn btn--primary"
          disabled={validating || input.trim().length === 0}
        >
          {validating ? 'Validating...' : 'Activate License'}
        </button>
      </form>

      {error && <div className="activate-error">{error}</div>}

      {success && (
        <div className="activate-success">
          ✓ License activated. Redirecting to scenarios...
        </div>
      )}

      {/* 🎯 Purchase Block */}
      <div className="activate-help">
        <h2 className="activate-help__title">Need a license?</h2>
        <p className="activate-help__body">
          Unlock all 30 scenarios instantly.
        </p>
        <Link
          to="/purchase"
          className="btn btn--primary"
          style={{ marginTop: '10px', display: 'inline-block' }}
        >
          Buy Premium License
        </Link>
        <p style={{ marginTop: '15px', fontSize: '0.875rem', color: '#78350f' }}>
          Or contact us: <a href="tel:+2348065209323">+234 806 520 9323</a>
        </p>
      </div>
    </div>
  );
}