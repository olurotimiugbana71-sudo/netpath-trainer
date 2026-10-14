// src/components/Footer.tsx

import './Footer.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__builder">
            Built &amp; Designed by{' '}
            <strong>ApexDynamics Solutions</strong>
          </span>
          <span className="site-footer__designer">
            Designer / Developer: <strong>Rotimi Ugbana</strong>
          </span>
        </div>

        <div className="site-footer__links">
          <a
            href="https://t.me/RotimiUgbana"
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer__link"
          >
            Telegram: Rotimi Ugbana
          </a>
          <a
            href="https://t.me/apexdynamics_solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer__link"
          >
            Channel: ApexDynamics Solutions
          </a>
          <a
            href="tel:+2348065209323"
            className="site-footer__link"
          >
            +234 806 520 9323
          </a>
        </div>

        <div className="site-footer__copy">
          © {year} ApexDynamics Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
}