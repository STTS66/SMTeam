import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectContext';
import type { ProjectFile } from '../types';
import ProjectCard from '../components/ProjectCard';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const { user } = useAuth();
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<ProjectFile[]>([]);
  const [publishing, setPublishing] = useState(false);

  const startEdit = (project: any) => {
    setEditProjectId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setSelectedFiles(project.files || []);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditProjectId(null);
    setTitle('');
    setDescription('');
    setSelectedFiles([]);
    setShowForm(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles: ProjectFile[] = [];
    const currentImages = selectedFiles.filter(f => f.type === 'image').length;
    const currentVideos = selectedFiles.filter(f => f.type === 'video').length;
    let addedImages = 0;
    let addedVideos = 0;

    Array.from(fileList).forEach((file) => {
      let ftype: 'image' | 'video' | 'file' = 'file';
      if (file.type.startsWith('image/')) {
        if (currentImages + addedImages >= 20) return;
        ftype = 'image';
        addedImages++;
      } else if (file.type.startsWith('video/')) {
        if (currentVideos + addedVideos >= 10) return;
        ftype = 'video';
        addedVideos++;
      }

      const url = URL.createObjectURL(file);
      newFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        type: ftype,
        url,
        size: file.size,
      });
    });

    setSelectedFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const f = prev.find(x => x.id === id);
      if (f && f.url.startsWith('blob:')) URL.revokeObjectURL(f.url);
      return prev.filter(x => x.id !== id);
    });
  };

  const handlePublish = async () => {
    if (!title.trim() || !description.trim() || !user) return;
    setPublishing(true);
    await new Promise(r => setTimeout(r, 600));
    
    if (editProjectId) {
      updateProject(editProjectId, title, description, selectedFiles);
    } else {
      addProject(title, description, selectedFiles, user.id, user.displayName);
    }
    
    cancelEdit();
    setPublishing(false);
  };

  const imgCount = selectedFiles.filter(f => f.type === 'image').length;
  const vidCount = selectedFiles.filter(f => f.type === 'video').length;

  return (
    <div className="projects-page">
      <div className="pp-header">
        <div>
          <h1 className="pp-title">
            <i className="fi fi-br-folder pp-title-icon"></i>
            <span className="pp-title-text">Проекты</span>
            <span className="pp-title-accent"> SMTeam</span>
          </h1>
          <p className="pp-subtitle">Все наши проекты и разработки в одном месте</p>
        </div>
        {user?.isAdmin && (
          <motion.button
            className="pp-add-btn"
            onClick={() => {
              if (showForm) cancelEdit();
              else setShowForm(true);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {showForm ? '✕ Отменить' : '+ Новый проект'}
          </motion.button>
        )}
      </div>

      {/* Admin Publish Form */}
      <AnimatePresence>
        {showForm && user?.isAdmin && (
          <motion.div
            className="pp-form"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="pp-form-inner">
              <h2 className="pp-form-title">{editProjectId ? 'Редактировать проект' : 'Опубликовать проект'}</h2>

              <div className="pp-field">
                <label className="pp-label">Название проекта</label>
                <input
                  className="pp-input"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Введите название проекта"
                />
              </div>

              <div className="pp-field">
                <label className="pp-label">Описание</label>
                <textarea
                  className="pp-textarea"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Опишите ваш проект подробнее..."
                  rows={5}
                />
              </div>

              <div className="pp-field">
                <label className="pp-label">
                  Файлы
                  <span className="pp-label-hint">
                    Фото: {imgCount}/20 · Видео: {vidCount}/10 · Другие файлы: без лимита
                  </span>
                </label>
                <label className="pp-file-input">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <span className="pp-file-btn">
                    <i className="fi fi-br-cloud-upload"></i>
                    Добавить файлы
                  </span>
                </label>
              </div>

              {/* File Preview */}
              {selectedFiles.length > 0 && (
                <div className="pp-file-preview">
                  {selectedFiles.map((f) => (
                    <div key={f.id} className={`pp-file-chip pp-file-chip-${f.type}`}>
                      <span className="pp-chip-icon">
                        {f.type === 'image' ? <i className="fi fi-br-picture"></i> : f.type === 'video' ? <i className="fi fi-br-play-alt"></i> : <i className="fi fi-br-document"></i>}
                      </span>
                      <span className="pp-chip-name">{f.name}</span>
                      <button type="button" className="pp-chip-remove" onClick={() => removeFile(f.id)}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <motion.button
                className="pp-publish-btn"
                onClick={handlePublish}
                disabled={publishing || !title.trim() || !description.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {publishing ? (
                  <span className="pp-spinner" />
                ) : (
                  <>
                    <i className="fi fi-br-check-circle"></i>
                    {editProjectId ? 'Сохранить изменения' : 'Опубликовать'}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      {projects.length === 0 ? (
        <motion.div
          className="pp-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="pp-empty-icon"><i className="fi fi-br-box-open"></i></div>
          <h3 className="pp-empty-title">Проектов пока нет</h3>
          <p className="pp-empty-desc">Администратор скоро опубликует первый проект</p>
        </motion.div>
      ) : (
        <div className="projects-grid">
          {projects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              onEdit={user?.isAdmin ? startEdit : undefined}
              onDelete={user?.isAdmin ? deleteProject : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
