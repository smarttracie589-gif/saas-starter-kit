"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for trying things out",
    features: [
      "1 monitor",
      "Automated checks",
      "Email alerts",
      "7-day history",
    ],
    cta: "Start Free",
    href: "/login",
    popular: false,
    isCheckout: false,
  },
  {
    name: "Pro",
    price: "9.99",
    originalPrice: "19.99",
    description: "For serious users — launch price",
    features: [
      "Up to 10 monitors",
      "Automated checks",
      "Instant email alerts",
      "Unlimited history",
      "Priority support",
    ],
    cta: "Get Pro — $9.99/mo →",
    popular: true,
    isCheckout: true,
  },
];

export default function PricingCard() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Checkout temporarily unavailable. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pricing-grid">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`pricing-card ${plan.popular ? "popular" : ""}`}
        >
          <div className="pricing-plan-name">{plan.name}</div>
          <div className="pricing-price">
            <span className="currency">$</span>
            <span className="amount">{plan.price}</span>
            <span className="period">/mo</span>
          </div>
          {plan.originalPrice && (
            <div className="price-original">
              was ${plan.originalPrice}/mo
            </div>
          )}
          <div className="pricing-description">{plan.description}</div>
          <ul className="pricing-features">
            {plan.features.map((feature, i) => (
              <li key={i}>
                <span className="check">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          {plan.isCheckout ? (
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary btn-large"
            >
              {loading ? "Loading checkout..." : plan.cta}
            </button>
          ) : (
            <a
              href={plan.href}
              className="btn btn-secondary btn-large"
            >
              {plan.cta}
            </a>
          )}
          {plan.popular && (
            <p className="pricing-lock-note">
              <Icon name="lock" size={14} /> Launch price. Cancel anytime.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
