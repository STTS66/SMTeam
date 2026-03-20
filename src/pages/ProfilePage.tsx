import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');
    
    const result = updateProfile({ 
      displayName, 
      ...(password ? { newPassword: password, oldPassword } : {}),
      avatar: avatarPreview
    });
    
    if (result.success) {
      setMsg('Профиль успешно обновлен!');
      setPassword('');
      setOldPassword('');
      setTimeout(() => setMsg(''), 3000);
    } else {
      setErrorMsg(result.error || 'Ошибка');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setAvatarPreview(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-page">
      <motion.div 
        className="profile-layout"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Banner Section */}
        <div className="profile-banner">
          <div className="profile-banner-pattern" />
          
          <div className="profile-header-content">
            <div className="profile-avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-placeholder">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
              <div className="profile-avatar-overlay">
                <i className="fi fi-br-camera"></i>
              </div>
            </div>
            
            <div className="profile-header-text">
              <h1 className="profile-display-name">{user?.displayName || 'Пользователь'}</h1>
              <span className="profile-tag">@{user?.username}</span>
              {user?.isAdmin && <span className="profile-admin-badge">Admin</span>}
            </div>
          </div>
        </div>

        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleAvatarChange}
        />

        {/* Content Section */}
        <div className="profile-body">
          <form className="profile-settings-form" onSubmit={handleSave}>
            <div className="profile-section">
              <h2 className="profile-section-title">
                <i className="fi fi-br-user"></i> Публичные данные
              </h2>
              <div className="profile-input-group">
                <label>Отображаемое имя</label>
                <div className="profile-input-wrapper">
                  <i className="fi fi-br-edit"></i>
                  <input 
                    type="text" 
                    className="profile-input" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    required
                  />
                </div>
                <span className="profile-hint">Это имя будет видно всем в проектах.</span>
              </div>
            </div>

            <div className="profile-section">
              <h2 className="profile-section-title">
                <i className="fi fi-br-lock"></i> Безопасность
              </h2>
              <div className="profile-input-group">
                <label>Старый пароль</label>
                <div className="profile-input-wrapper">
                  <i className="fi fi-br-key"></i>
                  <input 
                    type="password" 
                    className="profile-input" 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} 
                    placeholder="Пароль от аккаунта"
                  />
                </div>
              </div>
              
              <div className="profile-input-group">
                <label>Новый пароль</label>
                <div className="profile-input-wrapper">
                  <i className="fi fi-br-lock"></i>
                  <input 
                    type="password" 
                    className="profile-input" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Нажмите для ввода"
                  />
                </div>
                <span className="profile-hint">Оставьте оба поля пустыми, если не хотите менять пароль.</span>
              </div>
            </div>

            <div className="profile-footer">
              <button type="submit" className="profile-save-btn">
                <i className="fi fi-br-disk"></i> Сохранить изменения
              </button>
              {msg && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="profile-msg"
                >
                  {msg}
                </motion.div>
              )}
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="profile-msg profile-msg-error"
                >
                  {errorMsg}
                </motion.div>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
