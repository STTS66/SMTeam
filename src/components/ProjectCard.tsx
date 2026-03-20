import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Project, ProjectFile } from '../types';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  index: number;
  onDelete?: (id: string) => void;
  onEdit?: (project: Project) => void;
}

export default function ProjectCard({ project, index, onDelete, onEdit }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<{ url: string; type: string } | null>(null);

  const images = useMemo(() => project.files.filter(f => f.type === 'image'), [project.files]);
  const videos = useMemo(() => project.files.filter(f => f.type === 'video'), [project.files]);
  const files = useMemo(() => project.files.filter(f => f.type === 'file'), [project.files]);

  const dateStr = new Date(project.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const colorAccents = ['#ff3b30', '#ff453a', '#ff6961', '#aeaeb2', '#8e8e93', '#636366'];
  const accentColor = colorAccents[index % colorAccents.length];

  const downloadFile = async (file: ProjectFile) => {
    try {
      if (file.url.startsWith('blob:') || file.url.startsWith('http')) {
        const a = document.createElement('a');
        a.href = file.url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert("Файл недоступен для скачивания (демо-режим).");
      }
    } catch {
      alert("Ошибка при скачивании файла.");
    }
  };

  return (
    <>
      <motion.div
        className="project-card"
        style={{ '--card-accent': accentColor } as React.CSSProperties}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
        whileHover={{ y: -4 }}
      >
        <div className="pc-header">
          <div className="pc-accent-bar" />
          <h3 className="pc-title">{project.title}</h3>
          <div className="pc-meta">
            <span className="pc-author">{project.authorName}</span>
            <span className="pc-dot">·</span>
            <span className="pc-date">{dateStr}</span>
          </div>
        </div>

        <p className={`pc-desc ${expanded ? 'expanded' : ''}`}>
          {project.description}
        </p>
        {project.description.length > 150 && (
          <button className="pc-expand" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Свернуть' : 'Читать далее'}
          </button>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div className="pc-media-section">
            <span className="pc-media-label"><i className="fi fi-br-picture"></i> Фото ({images.length})</span>
            <div className="pc-images-grid">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="pc-img-thumb"
                  onClick={() => setLightbox({ url: img.url, type: 'image' })}
                >
                  <img src={img.url} alt={img.name} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <div className="pc-media-section">
            <span className="pc-media-label"><i className="fi fi-br-play-alt"></i> Видео ({videos.length})</span>
            <div className="pc-videos-grid">
              {videos.map((vid) => (
                <div key={vid.id} className="pc-video-thumb">
                  <video src={vid.url} controls preload="metadata" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        {files.length > 0 && (
          <div className="pc-media-section">
            <span className="pc-media-label"><i className="fi fi-br-document"></i> Файлы ({files.length})</span>
            <div className="pc-files-list">
              {files.map((file) => (
                <div key={file.id} className="pc-file-item">
                  <span className="pc-file-name">{file.name}</span>
                  <span className="pc-file-size">{(file.size / 1024).toFixed(1)} KB</span>
                  <button type="button" className="pc-file-dl" onClick={(e) => { e.stopPropagation(); downloadFile(file); }}>
                    Скачать
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pc-actions-row">
          {onEdit && (
            <button type="button" className="pc-action-btn pc-edit" onClick={(e) => { e.stopPropagation(); onEdit(project); }} title="Редактировать проект">
              <i className="fi fi-br-pencil"></i> Редактировать
            </button>
          )}
          {onDelete && (
            <button type="button" className="pc-action-btn pc-delete" onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} title="Удалить проект">
              <i className="fi fi-br-trash"></i> Удалить
            </button>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      {lightbox && (
        <div className="pc-lightbox" onClick={() => setLightbox(null)}>
          <div className="pc-lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="pc-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            {lightbox.type === 'image' ? (
              <img src={lightbox.url} alt="" className="pc-lightbox-img" />
            ) : (
              <video src={lightbox.url} controls autoPlay className="pc-lightbox-video" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
