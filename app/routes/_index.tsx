// Home/Landing Page
import { Link } from 'react-router';

export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">
            Making <span className="text-gradient">Computation</span> Beautiful
          </h1>
          <p className="hero-subtitle">
            A reference tool for people who design and build software.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/basic" className="hero-cta">
              Start Calculating
              <svg className="squiggly-hero" width="100%" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0,6 Q5,0 10,6 T20,6 T30,6 T40,6 T50,6 T60,6 T70,6 T80,6 T90,6 T100,6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Calculator Cards */}
        <section className="cards-section">
          <Link to="/basic" className="calc-card">
            <div className="card-icon">🔢</div>
            <h3 className="card-title">Basic Calculator</h3>
            <p className="card-description">
              Essential arithmetic operations for everyday calculations. Simple, clean, and fast.
            </p>
            <div className="card-arrow">→</div>
          </Link>

          <Link to="/scientific" className="calc-card">
            <div className="card-icon">🔬</div>
            <h3 className="card-title">Scientific</h3>
            <p className="card-description">
              Advanced mathematical functions including trigonometry, logarithms, and constants.
            </p>
            <div className="card-arrow">→</div>
          </Link>

          <Link to="/ip" className="calc-card">
            <div className="card-icon">🌐</div>
            <h3 className="card-title">IP Calculator</h3>
            <p className="card-description">
              Subnet calculations, CIDR notation, and network planning tools for engineers.
            </p>
            <div className="card-arrow">→</div>
          </Link>

          <Link to="/financial" className="calc-card">
            <div className="card-icon">💰</div>
            <h3 className="card-title">Financial</h3>
            <p className="card-description">
              Smart budget planning with expert rules like 50/30/20. Plan your allocations instantly.
            </p>
            <div className="card-arrow">→</div>
          </Link>

          <Link to="/salary-calc" className="calc-card">
            <div className="card-icon">🧾</div>
            <h3 className="card-title">Salary Calculator</h3>
            <p className="card-description">
              Indonesian net salary calculator with PPh 21 tax, BPJS deductions, and regional cost-of-living score.
            </p>
            <div className="card-arrow">→</div>
          </Link>
        </section>

        {/* Footer */}
        <footer className="home-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="brand-text">calc</span>
            </div>
            <div className="footer-links">
              <Link to="/basic">Basic</Link>
              <Link to="/scientific">Scientific</Link>
              <Link to="/ip">IP & Subnet</Link>
              <Link to="/financial">Financial</Link>
              <Link to="/salary-calc">Salary</Link>
            </div>
            <div className="footer-copyright">
              © 2026 Calculator App
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        .home-wrapper {
          min-height: calc(100vh - 80px);
          padding: var(--spacing-2xl) var(--spacing-md);
          animation: fadeIn 0.6s ease-out;
        }

        .hero-section {
          text-align: center;
          padding: var(--spacing-xl) 0;
          margin-bottom: var(--spacing-2xl);
          max-width: 760px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-title {
          font-size: 56px;
          font-family: var(--font-display);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          letter-spacing: -0.28px;
          line-height: 1.07;
          color: var(--color-text-primary);
          max-width: 11ch;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-subtitle {
          font-size: 1.125rem;
          color: var(--color-ink-muted-48);
          margin-bottom: var(--spacing-lg);
          font-weight: 400;
          line-height: 1.5;
          max-width: 40rem;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta {
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-primary);
          text-decoration: none;
          display: inline-block;
          position: relative;
          padding-bottom: 6px;
          border-bottom: 1px solid transparent;
        }

        .hero-cta:hover {
          border-color: var(--color-primary);
        }

        .squiggly-hero {
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 8px;
          color: var(--color-primary);
          overflow: visible;
        }

        .cards-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-2xl);
        }

        .calc-card {
}

/* Dark mode overrides */
.dark .calc-card {
  background: var(--color-bg-surface);
  border-color: var(--color-border);
}

.dark .calc-card:hover {
  background: var(--color-bg-elevated);
  border-color: var(--color-primary);
}
/* removed duplicate calc-card styles */
        }

        .calc-card:hover {
          border-color: var(--color-primary);
          background: var(--color-surface-pearl);
        }

        .card-icon {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-md);
        }

        .card-title {
          font-size: 1.25rem;
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-sm);
        }

        /* Dark mode title color */
        .dark .card-title {
          color: var(--color-text-primary);
        }

        .card-description {
          color: var(--color-ink-muted-48);
          margin-bottom: var(--spacing-lg);
          line-height: 1.65;
          font-size: 0.95rem;
          flex-grow: 1;
        }

        .card-arrow {
          font-size: 1.5rem;
          color: var(--color-primary);
          align-self: flex-end;
          transition: transform var(--transition-fast);
        }

        .calc-card:hover .card-arrow {
          transform: translateX(4px);
        }

        .home-footer {
          margin-top: var(--spacing-2xl);
          padding-top: var(--spacing-xl);
          border-top: 1px solid var(--color-divider-soft);
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .footer-brand .brand-text {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.25rem;
          color: var(--color-text-primary);
        }

        .footer-links {
          display: flex;
          gap: var(--spacing-lg);
        }

        .footer-links a {
          color: var(--color-ink-muted-48);
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: var(--color-text-primary);
        }

        .footer-copyright {
          color: var(--color-text-muted);
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.75rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .cards-section {
            grid-template-columns: 1fr;
          }

          .footer-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
