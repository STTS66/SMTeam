import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    if (isLogin) {
      const ok = login(username, password);
      if (!ok) setError('Неверный логин или пароль');
    } else {
      if (!displayName.trim()) { setError('Введите отображаемое имя'); setLoading(false); return; }
      if (password.length < 4) { setError('Пароль слишком короткий'); setLoading(false); return; }
      const ok = register(username, password, displayName);
      if (!ok) setError('Пользователь уже существует');
    }
    setLoading(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setPassword('');
    setDisplayName('');
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        <div className="auth-grid" />
      </div>

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="auth-logo">
          <motion.div
            className="auth-logo-icon"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" stroke="url(#logo-grad)" strokeWidth="2" fill="rgba(255,59,48,0.1)" />
              <path d="M24 12L36 18V30L24 36L12 30V18L24 12Z" stroke="url(#logo-grad)" strokeWidth="2" fill="rgba(44,44,46,0.15)" />
              <defs>
                <linearGradient id="logo-grad" x1="6" y1="4" x2="42" y2="44">
                  <stop stopColor="#ff3b30" />
                  <stop offset="1" stopColor="#2c2c2e" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <h1 className="auth-title">
            <span className="auth-title-sm">SM</span>
            <span className="auth-title-team">Team</span>
          </h1>
          <p className="auth-subtitle">Платформа командных проектов</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? 'login' : 'register'}
            className="auth-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: isLogin ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 30 : -30 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="auth-form-title">
              {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
            </h2>

            {!isLogin && (
              <motion.div
                className="auth-field"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="auth-label">Отображаемое имя</label>
                <input
                  className="auth-input"
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Ваше имя"
                  required
                />
              </motion.div>
            )}

            <div className="auth-field">
              <label className="auth-label">Логин</label>
              <input
                className="auth-input"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Введите логин"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Пароль</label>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="auth-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              className="auth-btn"
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="auth-spinner" />
              ) : isLogin ? 'Войти' : 'Зарегистрироваться'}
            </motion.button>

            <p className="auth-switch">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              <button type="button" className="auth-switch-btn" onClick={switchMode}>
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </motion.form>
        </AnimatePresence>
      </motion.div>

      <div className="auth-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="auth-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
