import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import brasaoPm from '../assets/images/brasao-pm-clean.png';

function DashboardIcon({ name, className = '' }) {
  const props = {
    className: `gestor-dashboard-icon ${className}`.trim(),
    viewBox: '0 0 24 24',
    'aria-hidden': 'true'
  };

  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <path
            fill="currentColor"
            d="M12 3.15 2.72 10.7a.95.95 0 0 0 .6 1.7h1.56V21h5.96v-5.32h2.32V21h5.96v-8.6h1.56a.95.95 0 0 0 .6-1.7L12 3.15Z"
          />
        </svg>
      );
    case 'ficha':
      return (
        <svg {...props}>
          <rect x="2.5" y="4.5" width="19" height="15" rx="2.2" fill="currentColor" />
          <rect x="4.8" y="7.4" width="3.3" height="3.8" rx="0.6" fill="#0e0b8d" />
          <circle cx="6.45" cy="8.8" r="0.9" fill="currentColor" />
          <path d="M10.2 8.25h8.1" stroke="#0e0b8d" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M10.2 11.85h8.1" stroke="#0e0b8d" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M4.9 15.45h13.4" stroke="#0e0b8d" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'people':
      return (
        <svg {...props}>
          <circle cx="12" cy="8.1" r="3" fill="currentColor" />
          <circle cx="6.1" cy="10.1" r="2.3" fill="currentColor" opacity="0.92" />
          <circle cx="17.9" cy="10.1" r="2.3" fill="currentColor" opacity="0.92" />
          <path d="M7.1 20.2a4.9 4.9 0 0 1 9.8 0Z" fill="currentColor" />
          <path d="M2.8 20a3.6 3.6 0 0 1 4.5-3.5v3.5Z" fill="currentColor" opacity="0.92" />
          <path d="M21.2 20a3.6 3.6 0 0 0-4.5-3.5v3.5Z" fill="currentColor" opacity="0.92" />
        </svg>
      );
    case 'list':
      return (
        <svg {...props}>
          <rect x="3" y="4.3" width="4.2" height="3.4" rx="0.8" fill="currentColor" />
          <rect x="3" y="10.3" width="4.2" height="3.4" rx="0.8" fill="currentColor" />
          <rect x="3" y="16.3" width="4.2" height="3.4" rx="0.8" fill="currentColor" />
          <rect x="8.8" y="4.55" width="12.2" height="2.9" rx="1.45" fill="currentColor" />
          <rect x="8.8" y="10.55" width="12.2" height="2.9" rx="1.45" fill="currentColor" />
          <rect x="8.8" y="16.55" width="12.2" height="2.9" rx="1.45" fill="currentColor" />
        </svg>
      );
    case 'paperclip':
      return (
        <svg {...props} fill="none">
          <path
            d="M9.25 12.7 15.82 6.1a3.1 3.1 0 1 1 4.38 4.38l-8.74 8.74a5.15 5.15 0 1 1-7.28-7.28l8.25-8.25"
            stroke="currentColor"
            strokeWidth="2.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'cog':
      return (
        <svg {...props}>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="m10.85 2.35-.52 1.96a8.14 8.14 0 0 0-1.65.68L6.93 3.9 4.1 6.73l1.1 1.75c-.28.52-.5 1.07-.66 1.66l-1.98.5v4l1.98.5c.16.59.38 1.14.66 1.66l-1.1 1.75 2.83 2.83 1.75-1.1c.52.28 1.07.5 1.65.67l.52 1.96h4l.5-1.96c.59-.16 1.14-.39 1.66-.67l1.75 1.1 2.83-2.83-1.1-1.75c.28-.52.5-1.07.66-1.66l1.98-.5v-4l-1.98-.5a8.1 8.1 0 0 0-.66-1.66l1.1-1.75-2.83-2.83-1.75 1.1a8.1 8.1 0 0 0-1.66-.68l-.5-1.96h-4Zm1.15 6.2a3.45 3.45 0 1 0 0 6.9 3.45 3.45 0 0 0 0-6.9Z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg {...props} fill="none">
          <path
            d="m5.5 8.5 6.5 6.5 6.5-6.5"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'profile':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3.5" fill="currentColor" />
          <path d="M5 20a7 7 0 0 1 14 0" fill="currentColor" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...props} fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2.2" />
          <path d="M12 7.5v5l3.5 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...props} fill="none">
          <path d="M14 7V4.5A1.5 1.5 0 0 0 12.5 3h-6A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h6a1.5 1.5 0 0 0 1.5-1.5V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 12h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="m16 8 4 4-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

const DASHBOARD_MENU = [
  { label: 'Inicio', icon: 'home', href: '/' },
  { label: 'Minha Ficha', icon: 'ficha' },
  {
    label: 'Gestao de Pessoas',
    icon: 'people',
    children: [
      { label: 'Consultar Pessoas', href: '/consultar-pessoas' },
      { label: 'Buscar efetivo por unidade' },
      { label: 'Declaracao de Bens' }
    ]
  },
  { label: 'BAPM Digital', icon: 'list' },
  { label: 'Menu Modelo', icon: 'paperclip' },
  { label: 'Renovar Senha', icon: 'cog' }
];

const QUICK_LINKS = [
  { label: 'Site PMPA', accent: 'crest' },
  { label: 'Portal do Servidor', accent: 'portal' },
  { label: 'PAE', accent: 'gov' },
  { label: 'SIGME - Sistema de Medalhas', accent: 'crest' },
  { label: 'Boletim Academico', accent: 'boletim' }
];

function formatCountdown(totalSeconds) {
  const safeValue = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeValue / 60);
  const seconds = safeValue % 60;
  return `${minutes} m ${String(seconds).padStart(2, '0')} s`;
}

function DashboardFooterBadge({ accent }) {
  if (accent === 'crest') {
    return (
      <span className="gestor-dashboard-footer-badge crest">
        <img src={brasaoPm} alt="" />
      </span>
    );
  }

  if (accent === 'portal') {
    return (
      <span className="gestor-dashboard-footer-badge portal">
        <span className="portal-line portal-line-brand">portal do</span>
        <span className="portal-line portal-line-title">servidor.pa</span>
        <span className="portal-line portal-line-sub">Portal do Servidor</span>
      </span>
    );
  }

  if (accent === 'gov') {
    return (
      <span className="gestor-dashboard-footer-badge gov">
        <span className="gov-mark" aria-hidden="true">
          <span className="gov-mark-blue" />
          <span className="gov-mark-red" />
        </span>
        <span className="gov-copy">
          <strong>GOVERNO</strong>
          <span>DIGITAL</span>
        </span>
      </span>
    );
  }

  return (
    <span className="gestor-dashboard-footer-badge boletim">
      <span className="boletim-crest">
        <img src={brasaoPm} alt="" />
      </span>
      <span className="boletim-copy">Boletim Academico</span>
    </span>
  );
}

export default function GestorPortalLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [secondsRemaining, setSecondsRemaining] = useState(58 * 60 + 53);
  const [expandedMenu, setExpandedMenu] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/consultar-pessoas')) {
      setExpandedMenu('Gestao de Pessoas');
    }
  }, [location.pathname]);

  const userDisplayName = useMemo(() => (user?.name || 'USUARIO').toUpperCase(), [user?.name]);

  function isPathActive(href) {
    if (!href) {
      return false;
    }

    if (href === '/') {
      return location.pathname === href;
    }

    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  }

  return (
    <div className="gestor-dashboard-page">
      <aside className="gestor-dashboard-sidebar">
        <div className="gestor-dashboard-brand">
          <span>Gestor.Web</span>
          <strong>PMPA</strong>
        </div>

        <div className="gestor-dashboard-user">
          <div className="gestor-dashboard-avatar gestor-dashboard-avatar-profile" aria-hidden="true">
            <DashboardIcon name="profile" />
          </div>

          <div className="gestor-dashboard-user-meta">
            <strong>VC {userDisplayName}</strong>
            <DashboardIcon name="cog" className="gestor-dashboard-user-meta-icon" />
          </div>
        </div>

        <nav className="gestor-dashboard-nav">
          {DASHBOARD_MENU.map((item) => {
            const hasActiveChild = item.children?.some((child) => child.href && isPathActive(child.href));

            return (
              <div
                key={item.label}
                className={`gestor-dashboard-nav-group ${expandedMenu === item.label ? 'is-open' : ''}`}
              >
                {item.href ? (
                  <Link to={item.href} className={`gestor-dashboard-nav-link ${isPathActive(item.href) ? 'is-active' : ''}`}>
                    <DashboardIcon name={item.icon} className="gestor-dashboard-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={`gestor-dashboard-nav-link ${item.children ? 'has-children' : ''} ${expandedMenu === item.label ? 'is-open' : ''} ${hasActiveChild ? 'is-active-child' : ''}`}
                    onClick={() => item.children && setExpandedMenu((current) => (current === item.label ? '' : item.label))}
                    aria-expanded={item.children ? expandedMenu === item.label : undefined}
                  >
                    <DashboardIcon name={item.icon} className="gestor-dashboard-nav-icon" />
                    <span>{item.label}</span>
                    {item.children && (
                      <DashboardIcon name="chevron-down" className="gestor-dashboard-nav-arrow" />
                    )}
                  </button>
                )}

                {item.children && expandedMenu === item.label && (
                  <div className="gestor-dashboard-nav-submenu">
                    {item.children.map((child) => (
                      child.href ? (
                        <Link
                          key={child.label}
                          to={child.href}
                          className={`gestor-dashboard-nav-sublink ${isPathActive(child.href) ? 'is-active' : ''}`}
                        >
                          <DashboardIcon name="list" className="gestor-dashboard-nav-subicon" />
                          <span>{child.label}</span>
                        </Link>
                      ) : (
                        <button key={child.label} type="button" className="gestor-dashboard-nav-sublink">
                          <DashboardIcon name="list" className="gestor-dashboard-nav-subicon" />
                          <span>{child.label}</span>
                        </button>
                      )
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="gestor-dashboard-main">
        <header className="gestor-dashboard-topbar">
          <img src={brasaoPm} alt="Brasao PMPA" className="gestor-dashboard-topbar-crest" />

          <div className="gestor-dashboard-session">
            <span>Sessao expira em: {formatCountdown(secondsRemaining)}</span>
            <DashboardIcon name="clock" className="gestor-dashboard-session-icon" />
          </div>

          <button type="button" className="gestor-dashboard-logout" onClick={logout}>
            <DashboardIcon name="logout" className="gestor-dashboard-logout-icon" />
            <span>Sair</span>
          </button>
        </header>

        <section className="gestor-dashboard-content">
          {children}

          <footer className="gestor-dashboard-footer-links">
            {QUICK_LINKS.map((item) => (
              <a key={item.label} href="#" className="gestor-dashboard-footer-link">
                <DashboardFooterBadge accent={item.accent} />
                {item.accent !== 'boletim' && <span>- {item.label}</span>}
              </a>
            ))}
          </footer>
        </section>
      </main>
    </div>
  );
}
