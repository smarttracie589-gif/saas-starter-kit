"use client";

import Icon from "@/components/Icon";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="/" className="logo">
          <div className="logo-icon"><Icon name="zap" size={20} /></div>
          SaaS Starter
        </a>
        <nav>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="/login" className="btn btn-primary">Get Started</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
