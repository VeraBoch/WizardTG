const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    const dbPath = path.join(__dirname, '../../data/botwizard.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('✅ Connected to SQLite database');
        this.createTables();
      }
    });
  }

  createTables() {
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        organization TEXT,
        phone TEXT,
        timezone TEXT DEFAULT 'Europe/Moscow',
        language TEXT DEFAULT 'ru',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Projects table
      `CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        bot_token TEXT,
        status TEXT DEFAULT 'inactive',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Bots table
      `CREATE TABLE IF NOT EXISTS bots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        token TEXT NOT NULL,
        parents_chat_id TEXT,
        staff_chat_id TEXT,
        announcements_chat_id TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // Channels table
      `CREATE TABLE IF NOT EXISTS channels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        type TEXT NOT NULL, -- 'parents', 'staff', 'announcements'
        chat_id TEXT NOT NULL,
        chat_title TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // FAQ table
      `CREATE TABLE IF NOT EXISTS faq (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        keywords TEXT, -- JSON array of keywords
        priority INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // Events table (calendar)
      `CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        location TEXT,
        instructor TEXT,
        max_participants INTEGER,
        current_participants INTEGER DEFAULT 0,
        status TEXT DEFAULT 'scheduled', -- 'scheduled', 'full', 'cancelled'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // Messages table (for analytics)
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        chat_id TEXT NOT NULL,
        user_id TEXT,
        message_text TEXT,
        bot_response TEXT,
        response_time INTEGER, -- in milliseconds
        is_escalated BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // Settings table
      `CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        key TEXT NOT NULL,
        value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id),
        UNIQUE(project_id, key)
      )`,

      // Payments table
      `CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        student_name TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        period TEXT NOT NULL,
        class_title TEXT,
        payment_method TEXT,
        notes TEXT,
        google_sheet_row_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // Attendance table
      `CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        class_title TEXT NOT NULL,
        class_date DATE NOT NULL,
        present_students TEXT, -- JSON array of student names
        absent_students TEXT,  -- JSON array of student names
        total_students INTEGER,
        comment TEXT,
        google_sheet_row_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // Leaves table (отпуска/больничные)
      `CREATE TABLE IF NOT EXISTS leaves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        staff_name TEXT NOT NULL,
        leave_type TEXT NOT NULL, -- 'vacation', 'sick', 'personal'
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT,
        status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
        approved_by TEXT,
        google_sheet_row_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // Absences table (отсутствия)
      `CREATE TABLE IF NOT EXISTS absences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        student_name TEXT NOT NULL,
        class_title TEXT,
        absence_date DATE NOT NULL,
        reason TEXT,
        is_excused BOOLEAN DEFAULT 0,
        google_sheet_row_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // Announcements table
      `CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        target_audience TEXT, -- 'parents', 'staff', 'all'
        status TEXT DEFAULT 'draft', -- 'draft', 'pending_approval', 'published'
        published_at DATETIME,
        google_sheet_row_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // Triage table (эскалации)
      `CREATE TABLE IF NOT EXISTS triage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        ticket_id TEXT UNIQUE NOT NULL,
        chat_id TEXT NOT NULL,
        chat_title TEXT,
        user_name TEXT,
        question TEXT NOT NULL,
        answer TEXT,
        status TEXT DEFAULT 'open', -- 'open', 'answered', 'closed'
        escalated_to TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`
    ];

    tables.forEach((sql) => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        }
      });
    });

    // Create default admin user
    this.createDefaultUser();
  }

  async createDefaultUser() {
    const email = 'admin@botwizard.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    this.db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error('Error checking default user:', err.message);
        return;
      }

      if (!row) {
        this.db.run(
          'INSERT INTO users (email, password_hash, name, organization) VALUES (?, ?, ?, ?)',
          [email, hashedPassword, 'Admin User', 'Bot Wizard'],
          (err) => {
            if (err) {
              console.error('Error creating default user:', err.message);
            } else {
              console.log('✅ Default admin user created: admin@botwizard.com / admin123');
            }
          }
        );
      }
    });
  }

  // Generic query methods
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = new Database();
