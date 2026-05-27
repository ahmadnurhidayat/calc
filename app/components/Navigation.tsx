// Navigation Component
import { Link, useLocation } from 'react-router';
import { useState } from 'react';
import { useTheme } from '~/theme';

export default function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { themeMode, setThemeMode } = useTheme();

  const navItems = [
    { path: '/basic', label: 'Basic' },
    { path: '/scientific', label: 'Scientific' },
    { path: '/ip', label: 'IP Calc' },
    { path: '/financial', label: 'Financial' },
    { path: '/salary-calc', label: 'Salary' },
  ];

  // Dynamic active title for sub-nav
  const getSubNavTitle = () => {
    switch (location.pathname) {
      case '/basic':
        return 'Basic Calculator';
      case '/scientific':
        return 'Scientific Mode';
      case '/ip':
        return 'IP Subnet Planner';
      case '/financial':
        return 'Budget Planner';
      case '/salary-calc':
        return 'Salary Calculator';
      case '/':
        return 'CALC Suite';
      default:
        return 'Calculator';
    }
  };

  const isCalcPage = ['/basic', '/scientific', '/ip', '/financial', '/salary-calc'].includes(location.pathname);

  const handleCtaClick = () => {
    if (isCalcPage) {
      // Dispatch a custom event to notify calculators to reset
      window.dispatchEvent(new CustomEvent('calc-reset'));
    }
  };

  return (
    <div className="nav-wrapper">
      {/* Tier 1: Pinned global-nav (true-black) */}
      <nav className="global-nav">
        <div className="global-nav-container">
          <Link to="/" className="global-nav-brand">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ display: 'inline-block', verticalAlign: 'middle' }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="2" />
              <line x1="15" y1="3" x2="15" y2="21" stroke="currentColor" strokeWidth="2" />
              <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2" />
              <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>calc</span>
          </Link>

          <div className="global-nav-right">
            <label className="theme-picker-global" htmlFor="theme-select-global">
              <span className="sr-only">Theme mode</span>
              <select
                id="theme-select-global"
                className="theme-select-global"
                value={themeMode}
                onChange={(event) => setThemeMode(event.target.value as 'system' | 'light' | 'dark')}
                aria-label="Choose theme mode"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>
        </div>
      </nav>

      {/* Tier 2: Sticky sub-nav-frosted */}
      <nav className="sub-nav-frosted">
        <div className="sub-nav-container">
          <span className="sub-nav-title">{getSubNavTitle()}</span>

          <div className="sub-nav-links">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sub-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isCalcPage ? (
              <button onClick={handleCtaClick} className="sub-nav-cta">
                Reset
              </button>
            ) : (
              <Link to="/basic" className="sub-nav-cta" style={{ textDecoration: 'none' }}>
                Start Calculating
              </Link>
            )}

            <button
              className="hamburger-global"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="hamburger-global-line" style={{ transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <span className="hamburger-global-line" style={{ opacity: menuOpen ? 0 : 1 }} />
              <span className="hamburger-global-line" style={{ transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {menuOpen && (
          <div className="mobile-menu-drawer">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-menu-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        .mobile-menu-drawer {
          position: absolute;
          top: 52px;
          left: 0;
          right: 0;
          background: var(--color-navbar-bg);
          border-bottom: 1px solid var(--color-navbar-border);
          padding: var(--spacing-md) var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          animation: slideDown 0.25s ease-out;
          z-index: var(--z-dropdown);
        }

        .mobile-menu-link {
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          padding: 8px 0;
          transition: color var(--transition-fast);
        }

        .mobile-menu-link:hover,
        .mobile-menu-link.active {
          color: var(--color-text-primary);
          font-weight: 600;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
}
