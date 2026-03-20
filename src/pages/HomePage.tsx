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
           className="hero-data-cube-wrap"
           initial={{ opacity: 0, scale: 0.5 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.5, type: 'spring' }}
        >
          <div className="hero-data-cube">
            <div className="cube-core"></div>
            <div className="cube-face cube-front">
              <i className="fi fi-rr-browser"></i>
              <span>Web</span>
            </div>
            <div className="cube-face cube-back">
               <i className="fi fi-rr-smartphone"></i>
               <span>App</span>
            </div>
            <div className="cube-face cube-right">
               <i className="fi fi-rr-shield-check"></i>
               <span>Sec</span>
            </div>
            <div className="cube-face cube-left">
               <i className="fi fi-rr-database"></i>
               <span>Data</span>
            </div>
            <div className="cube-face cube-top">
               <i className="fi fi-rr-brain"></i>
               <span>AI</span>
            </div>
            <div className="cube-face cube-bottom">
               <i className="fi fi-rr-rocket-lunch"></i>
               <span>Boost</span>
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
          {[
            { value: projects.length, label: "Проектов", color: "var(--accent-blue)" },
            { value: "SM", label: "Команда", color: "var(--accent-purple)" },
            { value: "∞", label: "Идей", color: "var(--accent-cyan)" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              className="stat-card"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.2, duration: 0.5, type: 'spring' }}
              whileHover={{ 
                y: -10, 
                scale: 1.06,
                boxShadow: "0 20px 50px rgba(255, 59, 48, 0.15), 0 0 25px rgba(255, 59, 48, 0.08)",
                borderColor: "rgba(255, 59, 48, 0.3)",
                transition: { type: "spring", stiffness: 400, damping: 15 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="stat-number" style={{ color: stat.color }}>{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
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
