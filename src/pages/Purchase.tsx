// src/pages/Purchase.tsx

import { useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import { Link } from 'react-router-dom';
import './Purchase.css';

const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_YOUR_PUBLIC_KEY';

export function Purchase() {
  const [email, setEmail] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [price, setPrice] = useState(15000); // Default Price in NGN

  // 🎯 DISCOUNT LOGIC
  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'FOUNDER10') {
      setPrice(10000);
      setIsDiscountApplied(true);
    } else {
      alert(
        'Invalid discount code. Try FOUNDER10 for the first 10 customers.'
      );
    }
  };

  // 🎯 PAYSTACK V2 POPUP
  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert('Please enter your email address so we can send your key.');
      return;
    }

    const popup = new PaystackPop();

    popup.newTransaction({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: price * 100, // Paystack expects amount in kobo (100 kobo = ₦1)
      onSuccess: (transaction: any) => {
        // This is just the frontend success. The real key is sent via webhook.
        alert(
          `Payment successful! Reference: ${transaction.reference}. Check your email for your license key.`
        );
        window.location.href = '/';
      },
      onCancel: () => {
        alert('Payment cancelled.');
      },
    });
  };

  return (
    <div className="page page--narrow">
      <Link to="/" className="back-link">
        ← Back to scenarios
      </Link>

      <header className="page-header" style={{ marginTop: '1.5rem' }}>
        <h1 className="page-title">Unlock Premium Access</h1>
        <p className="page-tagline">
          Get instant access to all 30 troubleshooting scenarios.
        </p>
      </header>

      <div className="purchase-card">
        <div className="price-display">
          <span className="currency">₦</span>
          <span className="amount">{price.toLocaleString()}</span>
          {isDiscountApplied && (
            <span className="original-price">₦15,000</span>
          )}
          <span className="period">one-time</span>
        </div>

        <form onSubmit={handlePay} className="purchase-form">
          <div className="form-group">
            <label>Email Address (for your license key)</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group discount-group">
            <label>Discount Code (Optional)</label>
            <div className="discount-input-row">
              <input
                type="text"
                placeholder="FOUNDER10"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                disabled={isDiscountApplied}
              />
              <button
                type="button"
                onClick={handleApplyDiscount}
                disabled={isDiscountApplied}
              >
                {isDiscountApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--full">
            Pay ₦{price.toLocaleString()}
          </button>
        </form>
      </div>
    </div>
  );
}