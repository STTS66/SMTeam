import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
import './index.css';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'profile'>('home');

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <ProjectProvider>
      <div className="app-layout">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="app-main">
          {activeTab === 'home' && (
            <HomePage goToProjects={() => setActiveTab('projects')} />
          )}
          {activeTab === 'projects' && <ProjectsPage />}
          {activeTab === 'profile' && <ProfilePage />}
        </main>
      </div>
    </ProjectProvider>
  );
}

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 6) + 3;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
      setProgress(current);
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(15px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="splash-content">
        <motion.div 
          className="splash-counter"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {progress}%
        </motion.div>
        
        <div className="splash-track">
          <motion.div 
            className="splash-fill"
            animate={{ width: `${progress}%` }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
          />
        </div>
        
        <motion.div 
          className="splash-brand"
          initial={{ opacity: 0, letterSpacing: "2px" }}
          animate={{ opacity: 1, letterSpacing: "12px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          SMTeam
        </motion.div>
      </div>
    </motion.div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        {loading ? (
          <SplashScreen key="splash" onComplete={() => setLoading(false)} />
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="app-wrapper"
          >
            <AppContent />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
