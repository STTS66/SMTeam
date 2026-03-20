import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const { Pool } = pg;
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_Ljs3e2pShQxk@ep-fragrant-credit-amtyamlh-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

const JWT_SECRET = 'smteam_secret_2026';

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        display_name VARCHAR(100),
        is_admin BOOLEAN DEFAULT FALSE,
        avatar TEXT
      );
      
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        author_id VARCHAR(100) REFERENCES users(id),
        author_name VARCHAR(100),
        author_avatar TEXT,
        likes INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        files JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS project_likes (
        project_id VARCHAR(100) REFERENCES projects(id) ON DELETE CASCADE,
        user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (project_id, user_id)
      );
    `);
    
    // Seed admin accounts if none exist
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', ['SMAdmin_Alpha']);
    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO users (id, username, password, display_name, is_admin) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10)',
        ['admin-001', 'SMAdmin_Alpha', 'SM$T3am_@dM1n#2026!xK9', 'SM Admin Alpha', true, 'admin-002', 'SMAdmin_Omega', 'Pr0j3ct$_M@st3r#SM!7qZ', 'SM Admin Omega', true]
      );
    }
    console.log('Database connected and initialized successfully!');
  } catch (err) {
    console.error('DB Init Error:', err);
  }
};
initDB();

// Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Доступ запрещен' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Недействительный токен' });
  }
};

// --- ROUTES ---

// Auth
app.post('/api/auth/register', async (req, res) => {
  const { username, password, displayName } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO users (id, username, password, display_name) VALUES ($1, $2, $3, $4)',
      [id, username, password, displayName]
    );
    const token = jwt.sign({ id, username, displayName, isAdmin: false }, JWT_SECRET);
    res.json({ user: { id, username, displayName, isAdmin: false }, token });
  } catch (err) {
    if (err.constraint === 'users_username_key') {
      return res.status(400).json({ error: 'Имя пользователя уже занято' });
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (rows.length === 0) return res.status(400).json({ error: 'Неверные данные' });
    
    const user = rows[0];
    const token = jwt.sign({ id: user.id, username: user.username, displayName: user.display_name, isAdmin: user.is_admin, avatar: user.avatar }, JWT_SECRET);
    res.json({ user: { id: user.id, username: user.username, displayName: user.display_name, isAdmin: user.is_admin, avatar: user.avatar }, token });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/auth/profile', auth, async (req, res) => {
  const { displayName, oldPassword, newPassword, avatar } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = rows[0];
    
    if (oldPassword && newPassword) {
      if (user.password !== oldPassword) return res.status(400).json({ error: 'Неверный старый пароль' });
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, req.user.id]);
    }
    
    if (displayName) await pool.query('UPDATE users SET display_name = $1 WHERE id = $2', [displayName, req.user.id]);
    if (avatar) await pool.query('UPDATE users SET avatar = $1 WHERE id = $2', [avatar, req.user.id]);
    
    const { rows: updated } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const u = updated[0];
    const token = jwt.sign({ id: u.id, username: u.username, displayName: u.display_name, isAdmin: u.is_admin, avatar: u.avatar }, JWT_SECRET);
    res.json({ user: { id: u.id, username: u.username, displayName: u.display_name, isAdmin: u.is_admin, avatar: u.avatar }, token });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка базы данных' });
  }
});

// Projects
app.get('/api/projects', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows.map(r => ({ ...r, displayName: r.author_name }))); // Format for frontend
  } catch (err) {
    res.status(500).json({ error: 'Ошибка базы данных' });
  }
});

app.post('/api/projects', auth, async (req, res) => {
  const { title, description, files } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO projects (id, title, description, author_id, author_name, author_avatar, files) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, title, description, req.user.id, req.user.displayName, req.user.avatar, JSON.stringify(files || [])]
    );
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сохранения проекта' });
  }
});

app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT author_id FROM projects WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Проект не найден' });
    if (rows[0].author_id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Нет прав' });
    }
    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

app.post('/api/projects/:id/like', auth, async (req, res) => {
  try {
    const likeCheck = await pool.query('SELECT * FROM project_likes WHERE project_id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    
    if (likeCheck.rows.length === 0) {
      await pool.query('INSERT INTO project_likes (project_id, user_id) VALUES ($1, $2)', [req.params.id, req.user.id]);
      await pool.query('UPDATE projects SET likes = likes + 1 WHERE id = $1', [req.params.id]);
      res.json({ success: true, liked: true });
    } else {
      await pool.query('DELETE FROM project_likes WHERE project_id = $1 AND user_id = $2', [req.params.id, req.user.id]);
      await pool.query('UPDATE projects SET likes = likes - 1 WHERE id = $1', [req.params.id]);
      res.json({ success: true, liked: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Ошибка' });
  }
});

app.post('/api/projects/:id/view', async (req, res) => {
  try {
    await pool.query('UPDATE projects SET views = views + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(\`Server running on http://localhost:\${PORT}\`));
