import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  activeTab: 'home' | 'projects' | 'profile';
  setActiveTab: (tab: 'home' | 'projects' | 'profile') => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <motion.header
      className="header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="header-inner">
        <div className="header-logo" onClick={() => setActiveTab('home')}>
          <div className="header-logo-shape">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" stroke="url(#h-grad)" strokeWidth="2.5" fill="rgba(255,59,48,0.1)" />
              <path d="M24 14L34 20V28L24 34L14 28V20L24 14Z" stroke="url(#h-grad)" strokeWidth="2" fill="rgba(44,44,46,0.15)" />
              <defs>
                <linearGradient id="h-grad" x1="6" y1="4" x2="42" y2="44">
                  <stop stopColor="#ff3b30" />
                  <stop offset="1" stopColor="#2c2c2e" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="header-brand">
            <span className="header-brand-sm">SM</span>
            <span className="header-brand-team">Team</span>
          </span>
        </div>

        <nav className="header-nav">
          <button
            className={`header-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <i className="fi fi-br-home header-nav-icon"></i>
            Главная
          </button>
          <button
            className={`header-nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <i className="fi fi-br-folder header-nav-icon"></i>
            Проекты
          </button>
        </nav>

        <div className="header-user">
          <div className="header-user-info" onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="header-avatar" />
            ) : (
              <div className="header-avatar header-avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
            <div className="header-user-details">
              <span className="header-name">{user?.displayName}</span>
              {user?.isAdmin && <span className="header-badge">Admin</span>}
            </div>
          </div>
          <button className="header-logout" onClick={logout} title="Выйти">
            <i className="fi fi-br-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
