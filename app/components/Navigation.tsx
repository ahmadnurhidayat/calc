// Navigation Component
import { Link, useLocation } from 'react-router';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/basic', label: 'Basic' },
    { path: '/scientific', label: 'Scientific' },
    { path: '/ip', label: 'IP Calc' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-text">calc</span>
        </Link>

        <div className="nav-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <Link to="/basic" className="nav-cta">
            Start Calculating
            <svg className="squiggly" width="100%" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
              <path d="M0,5 Q5,0 10,5 T20,5 T30,5 T40,5 T50,5 T60,5 T70,5 T80,5 T90,5 T100,5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        .navigation {
          background: rgba(248, 250, 252, 0.95);
          backdrop-filter: blur(10px);
          padding: var(--spacing-lg) 0;
          position: sticky;
          top: 0;
          z-index: var(--z-dropdown);
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s;
        }

        .navigation.scrolled {
          border-color: var(--color-border);
        }
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .nav-brand {
          font-family: var(--font-sans);
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--color-primary-dark);
          text-decoration: none;
          letter-spacing: -0.03em;
        }
        
        .nav-center {
          display: flex;
          gap: var(--spacing-2xl);
        }
        
        .nav-link {
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        
        .nav-link:hover {
          color: var(--color-text-primary);
        }
        
        .nav-link.active {
          color: var(--color-text-primary);
          font-weight: 600;
        }

        .nav-right {
          display: flex;
          align-items: center;
        }

        .nav-cta {
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-primary);
          text-decoration: none;
          position: relative;
          padding-bottom: 8px;
        }

        .squiggly {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 6px;
          color: var(--color-text-primary);
          overflow: visible;
        }
        
        @media (max-width: 768px) {
          .nav-center {
            display: none;
          }

          .nav-cta {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
