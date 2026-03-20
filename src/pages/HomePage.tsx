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
          className="hero-code-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="code-header">
            <div className="code-dots">
              <span className="code-dot red"></span>
              <span className="code-dot yellow"></span>
              <span className="code-dot green"></span>
            </div>
            <div className="code-title">SMTeam_Core.ts — VS Code</div>
            <div className="code-spacer"></div>
          </div>
          <div className="code-body">
            <div className="code-line"><span className="code-keyword">import</span> <span className="code-variable">{'{'}</span> innovation, speed, quality <span className="code-variable">{'}'}</span> <span className="code-keyword">from</span> <span className="code-string">'@smteam/core'</span>;</div>
            <div className="code-line"><br/></div>
            <div className="code-line"><span className="code-keyword">class</span> <span className="code-class">Future</span> <span className="code-keyword">extends</span> <span className="code-class">Project</span> {'{'}</div>
            <div className="code-line">  <span className="code-keyword">constructor</span>() {'{'}</div>
            <div className="code-line">    <span className="code-keyword">super</span>();</div>
            <div className="code-line">    <span className="code-keyword">this</span>.<span className="code-property">team</span> = [<span className="code-string">'Developers'</span>, <span className="code-string">'Designers'</span>, <span className="code-string">'AI Engineers'</span>];</div>
            <div className="code-line">  {'}'}</div>
            <div className="code-line"><br/></div>
            <div className="code-line">  <span className="code-keyword">async</span> <span className="code-function">buildAwesomeProduct</span>() {'{'}</div>
            <div className="code-line">    <span className="code-keyword">await</span> <span className="code-function">innovation</span>.<span className="code-function">inject</span>();</div>
            <div className="code-line">    <span className="code-keyword">return</span> <span className="code-string">"🚀 Success guaranteed!"</span><span className="code-cursor"></span></div>
            <div className="code-line">  {'}'}</div>
            <div className="code-line">{'}'}</div>
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
