# Database Setup Guide - Neon PostgreSQL Integration

## Overview
This guide walks you through setting up a free Neon PostgreSQL database for persistent user data storage in PrepVerse.

## 1. Create Neon PostgreSQL Database

### Steps:
1. Visit [neon.tech](https://neon.tech) and sign up for a free account
2. Create a new project named "PrepVerse"
3. Copy your connection string from the dashboard
4. Save it as `DATABASE_URL` in your environment variables

### Connection String Format:
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

## 2. Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

### User Progress Table
```sql
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  topic VARCHAR(100) NOT NULL,
  questions_attempted INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category, topic)
);
```

### Study Plans Table
```sql
CREATE TABLE study_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_name VARCHAR(200) NOT NULL,
  target_exam VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  daily_goal_minutes INTEGER DEFAULT 120,
  topics JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Bookmarks Table
```sql
CREATE TABLE bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  question_id VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, question_id)
);
```

### User Settings Table
```sql
CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme VARCHAR(20) DEFAULT 'light',
  notification_enabled BOOLEAN DEFAULT TRUE,
  difficulty_preference VARCHAR(20) DEFAULT 'medium',
  preferences JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Environment Variables

Create a `.env` file in the backend directory:

```env
# Neon PostgreSQL Database
DATABASE_URL=your_neon_connection_string_here

# JWT Configuration
JWT_SECRET=your_secure_random_secret_key_here
JWT_EXPIRATION=7d

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Settings
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Optional: Supabase Alternative
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Database Migration Script

Create and run this script to initialize your database:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Run all CREATE TABLE statements here
    // (Use the schema above)
    
    await client.query('COMMIT');
    console.log('✅ Database migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
    pool.end();
  }
}

runMigrations();
```

## 5. Database Connection Pool Setup

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
```

## 6. Data Persistence Features

### Automatic Save on Action:
- Progress saved after each question attempt
- Settings saved on change
- Study plans auto-saved every 5 minutes
- Bookmarks saved immediately

### Session Management:
- JWT tokens stored in httpOnly cookies
- Automatic session refresh on login
- Progress fetched and synced on login
- Offline data queued and synced when online

## 7. Security Best Practices

1. **Never commit .env files**
2. **Use parameterized queries** to prevent SQL injection
3. **Hash passwords** with bcrypt (salt rounds: 10)
4. **Validate all user inputs** server-side
5. **Enable SSL connections** (Neon provides this by default)
6. **Rotate JWT secrets** periodically
7. **Implement rate limiting** on API endpoints

## 8. Backup Strategy

Neon provides automatic backups. Additional considerations:
- Export user data weekly
- Keep schema versioning in migrations folder
- Test restore procedures regularly

## 9. Free Tier Limits (Neon)

- Storage: 10 GB
- Compute: 191 hours/month (sufficient for 24/7 operation)
- Branches: 10
- Project size: Perfect for MVP and initial users

## 10. Next Steps

1. Set up Neon account and get connection string
2. Create `.env` file with credentials
3. Run migration script to create tables
4. Test connection with sample queries
5. Integrate with JWT authentication (see AUTH_SETUP.md)
6. Deploy backend to Vercel/Netlify

---

**Important**: Keep this file private. Never commit actual credentials or connection strings to the repository.
