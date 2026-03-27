import Header from "@/components/Header";
import PricingCard from "@/components/PricingCard";
import WaitlistForm from "@/components/WaitlistForm";
import Icon from "@/components/Icon";

export default function Home() {
  return (
    <>
      <Header />

      {/* ===== Hero ===== */}
      <section className="hero container">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <Icon name="zap" size={16} /> Production-Ready SaaS Boilerplate
        </div>
        <h1>
          Ship Your
          <br />
          <span className="gradient-text">SaaS Product</span>
          <br />
          In Days
        </h1>
        <p className="hero-description">
          Stop building auth, payments, and infrastructure from scratch.
          This starter kit gives you everything you need — just add your
          business logic and launch.
        </p>
        <div className="hero-actions">
          <a href="#pricing" className="btn btn-primary btn-large">
            Get Started →
          </a>
          <a href="#features" className="btn btn-secondary btn-large">
            See What&apos;s Included
          </a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value gradient-text">6</div>
            <div className="hero-stat-label">Core Modules</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value gradient-text">1-Click</div>
            <div className="hero-stat-label">Vercel Deploy</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value gradient-text">$0</div>
            <div className="hero-stat-label">Infrastructure Cost</div>
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title">
            Everything <span className="gradient-text">Wired Up</span> & Ready
          </h2>
          <p className="section-subtitle">
            Six production-ready modules that handle the boring parts,
            so you can focus on what makes your SaaS unique.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Icon name="lock" size={28} /></div>
            <h3>Authentication</h3>
            <p>
              NextAuth v5 with email/password credentials, JWT sessions,
              protected routes, and a beautiful login/register flow.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icon name="zap" size={28} /></div>
            <h3>Payments</h3>
            <p>
              Creem integration with checkout sessions, webhook verification,
              subscription management, and plan-based access control.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icon name="chart" size={28} /></div>
            <h3>Database</h3>
            <p>
              Neon serverless PostgreSQL with user management, data models,
              and migration-ready schema. Zero server maintenance.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icon name="clock" size={28} /></div>
            <h3>Cron Jobs</h3>
            <p>
              Vercel Cron for automated background tasks — monitoring,
              data syncing, cleanup, or any scheduled work you need.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icon name="mail" size={28} /></div>
            <h3>Email Alerts</h3>
            <p>
              Resend integration with HTML email templates for transactional
              notifications, alerts, and user communications.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icon name="shield" size={28} /></div>
            <h3>Security</h3>
            <p>
              Rate limiting, webhook signature verification, bcrypt password
              hashing, and environment-based configuration.
            </p>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2 className="section-title">
            Launch in <span className="gradient-text">3 Steps</span>
          </h2>
          <p className="section-subtitle">
            Clone, configure, deploy. Your SaaS is live in under 10 minutes.
          </p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Clone & Configure</h3>
            <p>
              Clone the repo, copy .env.example to .env.local,
              and fill in your API keys for Neon, Creem, and Resend.
            </p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Add Your Logic</h3>
            <p>
              Replace the example data source in dataSource.js with
              your own business logic. The monitoring framework handles the rest.
            </p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Deploy to Vercel</h3>
            <p>
              Push to GitHub and deploy on Vercel with one click.
              Cron jobs, serverless functions, and database — all included.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Tech Stack ===== */}
      <section className="social-proof">
        <div className="container">
          <h2 className="section-title">
            Built With <span className="gradient-text">Modern Stack</span>
          </h2>
          <p className="section-subtitle">
            Battle-tested technologies that scale from zero to millions.
          </p>
        </div>
        <div className="proof-grid">
          <div className="proof-card">
            <div className="proof-stars"><Icon name="globe" size={24} /></div>
            <p className="proof-text">
              &ldquo;Next.js 16 with App Router — the foundation for
              server components, API routes, and edge functions.&rdquo;
            </p>
            <div className="proof-author">
              <div className="proof-avatar">N</div>
              <div>
                <div className="proof-name">Next.js 16</div>
                <div className="proof-role">React framework</div>
              </div>
            </div>
          </div>
          <div className="proof-card">
            <div className="proof-stars"><Icon name="chart" size={24} /></div>
            <p className="proof-text">
              &ldquo;Neon serverless PostgreSQL — scales to zero when idle,
              instant branching, and no server to manage.&rdquo;
            </p>
            <div className="proof-author">
              <div className="proof-avatar">N</div>
              <div>
                <div className="proof-name">Neon Database</div>
                <div className="proof-role">Serverless PostgreSQL</div>
              </div>
            </div>
          </div>
          <div className="proof-card">
            <div className="proof-stars"><Icon name="zap" size={24} /></div>
            <p className="proof-text">
              &ldquo;Creem payments — simple API for checkout sessions,
              subscriptions, and webhook-based lifecycle management.&rdquo;
            </p>
            <div className="proof-author">
              <div className="proof-avatar">C</div>
              <div>
                <div className="proof-name">Creem + Resend</div>
                <div className="proof-role">Payments & Email</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section className="pricing" id="pricing">
        <div className="container">
          <h2 className="section-title">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="section-subtitle">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>
        <PricingCard />
      </section>

      {/* ===== CTA ===== */}
      <section className="cta" id="waitlist">
        <div className="container">
          <WaitlistForm />
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 SaaS Starter Kit. Built with ❤️ and AI.</p>
          <div className="footer-links">
            <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
            <a href="mailto:hello@example.com">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
