import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './HomePage.css';
import { useProjects } from '../contexts/ProjectContext';
import ProjectCard from '../components/ProjectCard';

function TypewriterText({ text, delay = 0, cursor = true }: { text: string; delay?: number; cursor?: boolean }) {
  const [displayedText, setDisplayedText] = useState('');
  const [typing, setTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let blinkInterval: ReturnType<typeof setInterval>;
    let i = 0;
    
    if (cursor) {
      blinkInterval = setInterval(() => setShowCursor(prev => !prev), 500);
    }

    const startTyping = () => {
      setTyping(true);
      if (cursor) setShowCursor(true);
      timeout = setInterval(() => {
        if (i < text.length) {
          const char = text.charAt(i);
          setDisplayedText((prev) => prev + char);
          i++;
        } else {
          clearInterval(timeout);
          setTyping(false);
        }
      }, 30); // Speed of typing
    };

    const initialDelay = setTimeout(startTyping, delay * 1000);
    return () => {
      clearTimeout(initialDelay);
      clearInterval(timeout);
      if (blinkInterval) clearInterval(blinkInterval);
    };
  }, [text, delay, cursor]);

  return (
    <span>
      {displayedText}
      {cursor && (typing || showCursor) && <span style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }}>|</span>}
    </span>
  );
}

interface HomePageProps {
  goToProjects: () => void;
}

export default function HomePage({ goToProjects }: HomePageProps) {
  const { projects } = useProjects();
  const recentProjects = projects.slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1
            className="hero-title"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.04, delayChildren: 0.4 } },
            }}
          >
            <span className="hero-greeting">
              {"Добро пожаловать".split("").map((char, index) => (
                <motion.span 
                  key={`g-${index}`} 
                  variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                  style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <br />
            <span className="hero-highlight">
              {"в SMTeam".split("").map((char, index) => (
                <motion.span 
                  key={`h-${index}`} 
                  variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1 } }}
                  style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h1>
          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <TypewriterText 
              text="Здесь вы увидите проекты SMTeam — команды, которая создаёт инновационные решения и воплощает идеи в жизнь. Мы делимся нашими лучшими проектами, разработками и достижениями." 
              delay={0.6}
              cursor={false}
            />
          </motion.p>
          <motion.div
            className="hero-desc-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <p>
              <TypewriterText 
                text="Наша команда объединяет талантливых разработчиков, дизайнеров и энтузиастов технологий. Каждый проект — это уникальная история создания чего-то нового и значимого." 
                delay={2.5} 
              />
            </p>
          </motion.div>
          <motion.button
            className="hero-btn"
            onClick={goToProjects}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            Смотреть проекты
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.button>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="hero-terminal">
            <div className="ht-header">
               <div className="ht-btns">
                 <span className="ht-btn close"></span>
                 <span className="ht-btn min"></span>
                 <span className="ht-btn max"></span>
               </div>
               <div className="ht-title">smteam-dev — bash</div>
            </div>
            <div className="ht-body">
              <p><span className="ht-path">~/SMTeam</span> <span className="ht-prompt">❯</span> <span className="ht-cmd">npm run start-protocol</span></p>
              <p className="ht-out system">[INIT] Booting SMTeam Core V2.0.0...</p>
              <p className="ht-out success">✔ Neural network synced</p>
              <p className="ht-out success">✔ PostgreSQL DB connected to Neon</p>
              <p className="ht-out success">✔ Modules assembled successfully</p>
              <br/>
              <p><span className="ht-path">~/SMTeam</span> <span className="ht-prompt">❯</span> <TypewriterText text="Ready to create history..." delay={2} cursor={true} /></p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="stats-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
          >
            <span className="stat-number" style={{ color: 'var(--accent-blue)' }}>{projects.length}</span>
            <span className="stat-label">Проектов</span>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
          >
            <span className="stat-number" style={{ color: 'var(--accent-purple)' }}>SM</span>
            <span className="stat-label">Команда</span>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
          >
            <span className="stat-number" style={{ color: 'var(--accent-cyan)' }}>∞</span>
            <span className="stat-label">Идей</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <motion.section
          className="recent-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-title-accent">Последние</span> проекты
            </h2>
            <button className="section-link" onClick={goToProjects}>
              Все проекты →
            </button>
          </div>
          <div className="projects-grid">
            {recentProjects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
