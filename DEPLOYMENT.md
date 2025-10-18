# Deployment Guide - Vercel & Netlify Setup for PrepVerse

## Overview
This guide provides step-by-step instructions for deploying PrepVerse to Vercel (frontend + backend) or Netlify (frontend only with separate backend deployment).

## Prerequisites

1. ✅ Neon PostgreSQL database set up (see DATABASE_SETUP.md)
2. ✅ GitHub account with PrepVerse repository access
3. ✅ Vercel or Netlify account (free tier works)

## Option 1: Full Stack Deployment on Vercel (Recommended)

### Why Vercel?
- **Serverless Functions**: Perfect for Node.js backend API
- **Zero Config**: Automatic detection of frontend framework
- **Environment Variables**: Secure secret management
- **Free Tier**: Generous limits for personal projects
- **Global CDN**: Fast content delivery worldwide

### Step 1: Create vercel.json Configuration

Create this file in the root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/build"
      }
    },
    {
      "src": "backend/api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 2: Set Up Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the following variables:

```bash
# Database
DATABASE_URL=your_neon_postgresql_connection_string

# JWT Authentication
JWT_SECRET=your_secure_random_secret_at_least_32_characters_long
JWT_EXPIRATION=7d

# CORS Configuration
CORS_ORIGIN=https://your-domain.vercel.app

# Node Environment
NODE_ENV=production
```

**Important**: Use Vercel's "Encrypted" option for sensitive values like DATABASE_URL and JWT_SECRET.

### Step 3: Deploy to Vercel

#### Method A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from root directory
vercel

# For production deployment
vercel --prod
```

#### Method B: Using Vercel Dashboard (Easier)

1. Visit [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `Vyom1Jain/PrepVerse`
3. Configure:
   - **Framework Preset**: Other (or auto-detect)
   - **Root Directory**: Leave empty (monorepo setup)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
4. Add environment variables (as listed in Step 2)
5. Click "Deploy"

### Step 4: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update CORS_ORIGIN environment variable with your custom domain

## Option 2: Frontend on Netlify + Backend Separately

### Frontend Deployment on Netlify

#### Create netlify.toml in root:

```toml
[build]
  base = "frontend/"
  publish = "frontend/build/"
  command = "npm install && npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-api.vercel.app/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Deploy Steps:

1. Visit [netlify.com](https://netlify.com) and sign up
2. New Site from Git → Select GitHub → Choose PrepVerse
3. Build Settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/build`
4. Environment Variables:
   - `REACT_APP_API_URL`: Your backend API URL
   - `NODE_VERSION`: `18`
5. Deploy Site

### Backend Deployment on Vercel (Serverless)

Create `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

Deploy backend separately:
```bash
cd backend
vercel --prod
```

## Backend API Structure for Serverless

Create these files in `backend/api/` for serverless functions:

### backend/api/auth/register.js
```javascript
const { registerUser } = require('../../auth/jwt-auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
```

### backend/api/auth/login.js
```javascript
const { loginUser } = require('../../auth/jwt-auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
```

### backend/api/user/progress.js
```javascript
const { authenticateToken } = require('../../auth/jwt-auth');
const { saveProgress, fetchUserProgress } = require('../../services/userData');

module.exports = async (req, res) => {
  try {
    // Verify authentication
    await new Promise((resolve, reject) => {
      authenticateToken(req, res, (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    if (req.method === 'GET') {
      const result = await fetchUserProgress(req.user.id);
      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const result = await saveProgress(req.user.id, req.body);
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

## Database Connection Configuration

Create `backend/config/database.js`:

```javascript
const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

module.exports = getPool();
```

## Frontend Environment Configuration

Create `frontend/.env.production`:

```env
REACT_APP_API_URL=https://your-domain.vercel.app/api
REACT_APP_ENV=production
```

## Testing the Deployment

### 1. Test Authentication
```bash
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","username":"testuser"}'
```

### 2. Test Login
```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### 3. Test Protected Route
```bash
curl https://your-domain.vercel.app/api/user/progress \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Continuous Deployment

Both Vercel and Netlify support automatic deployments:

- **Main branch**: Automatically deploys to production
- **Other branches**: Create preview deployments
- **Pull requests**: Generate preview links for testing

## Security Checklist

- [ ] All environment variables are set in deployment platform (not in code)
- [ ] JWT_SECRET is a strong random string (32+ characters)
- [ ] DATABASE_URL uses SSL connection
- [ ] CORS is configured with specific origins (not `*`)
- [ ] API rate limiting is implemented
- [ ] Input validation is in place for all endpoints
- [ ] HTTPS is enabled (automatic with Vercel/Netlify)

## Performance Optimization

1. **Enable Caching**: Configure cache headers for static assets
2. **Database Connection Pooling**: Reuse connections in serverless functions
3. **CDN**: Use Vercel/Netlify's built-in CDN
4. **Compression**: Enable gzip/brotli compression
5. **Image Optimization**: Use Vercel Image Optimization or similar

## Monitoring & Logging

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor function execution times
- Track error rates

### Custom Logging
```javascript
// Add to all API functions
console.log('[API]', req.method, req.url, {
  timestamp: new Date().toISOString(),
  userId: req.user?.id
});
```

## Troubleshooting

### Issue: "Module not found" errors
**Solution**: Ensure all dependencies are in package.json and run `npm install` locally first

### Issue: Database connection timeout
**Solution**: 
- Verify DATABASE_URL is correct
- Check Neon database is active
- Increase connectionTimeoutMillis in pool config

### Issue: CORS errors
**Solution**: 
- Add proper CORS_ORIGIN environment variable
- Ensure frontend URL matches exactly (including https://)

### Issue: JWT token not working
**Solution**:
- Verify JWT_SECRET is set in environment variables
- Check token format in Authorization header ("Bearer TOKEN")

## Next Steps

1. Deploy frontend and backend
2. Test all API endpoints
3. Set up custom domain (optional)
4. Configure monitoring and alerts
5. Enable continuous deployment from GitHub
6. Test user registration and login flow
7. Verify data persistence across sessions

---

**Remember**: This is your private development setup. The repository is public, but deployment URLs and credentials remain private until you're ready to launch.
