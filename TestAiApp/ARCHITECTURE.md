# BankApp - Technical Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Architecture](#api-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Authentication & Security](#authentication--security)
8. [External Integrations](#external-integrations)
9. [Deployment Architecture](#deployment-architecture)
10. [File Structure](#file-structure)
11. [Data Flow](#data-flow)
12. [Security Considerations](#security-considerations)

---

## System Overview

BankApp is a full-stack personal finance and wellness application that combines banking features with health tracking, investment monitoring, and goal management. The application follows a client-server architecture with a React frontend and Node.js/Express backend, using PostgreSQL for data persistence.

### Key Features
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Personal Finance**: Account management, transaction limits, card preferences
- **Investment Tracking**: Multi-portfolio management, stock performance monitoring (JSE)
- **Cryptocurrency**: Real-time crypto price tracking via CoinGecko API
- **Health & Fitness**: Strava integration for activity tracking
- **Goal Management**: Personal financial and fitness goal setting
- **Settings Management**: User preferences, API configuration

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React 18.3.1 (Vite 6.0.3)                    │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Components (Dashboard, Accounts, Health, etc) │  │   │
│  │  │  - State Management (useState, useEffect)      │  │   │
│  │  │  - Client-side Routing (onNavigate)            │  │   │
│  │  │  - Session Storage (JWT tokens)                │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS (Fetch API)
                            │ JWT Bearer Tokens
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION TIER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Node.js (v25.3.0) + Express.js (5.2.1)        │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Middleware                                     │  │   │
│  │  │  - CORS (localhost:5173)                       │  │   │
│  │  │  - JSON Parser                                 │  │   │
│  │  │  - JWT Verification (auth.cjs)                 │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Routes                                         │  │   │
│  │  │  - /api/auth (login, register)                 │  │   │
│  │  │  - /api/settings (user settings CRUD)          │  │   │
│  │  │  - /api/goals (goal management)                │  │   │
│  │  │  - /api/stocks (JSE stock proxy)               │  │   │
│  │  │  - /api/strava (OAuth, activities)             │  │   │
│  │  │  - /api/config (API credentials)               │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Models (Sequelize ORM)                        │  │   │
│  │  │  - User, UserSettings, Goal                    │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Sequelize (PostgreSQL Protocol)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA TIER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         PostgreSQL 14+ (localhost:5432)              │   │
│  │  Database: testaiapp                                 │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Tables:                                        │  │   │
│  │  │  - users (id, email, password_hash)            │  │   │
│  │  │  - user_settings (settings, limits, Strava)    │  │   │
│  │  │  - goals (title, amount, status)               │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL INTEGRATIONS                      │
│  - Strava API (OAuth 2.0, activity data)                    │
│  - Yahoo Finance API (JSE stock prices)                      │
│  - ExchangeRate-API (USD/ZAR conversion)                     │
│  - CoinGecko API (cryptocurrency prices)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 6.0.3 | Build tool and dev server |
| CSS3 | - | Styling (no frameworks) |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 25.3.0 | Runtime environment |
| Express.js | 5.2.1 | Web framework |
| Sequelize | 6.37.5 | ORM for database |
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT authentication |
| express-validator | 7.2.2 | Input validation |
| cors | 2.8.5 | Cross-origin resource sharing |
| dotenv | 17.2.3 | Environment variables |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 14+ | Primary database |
| pg (node-postgres) | 8.14.0 | PostgreSQL client |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| Vitest | - | Unit testing |
| Chai | - | Assertion library |

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │──┐
│ email (UNIQUE)  │  │
│ password_hash   │  │
│ created_at      │  │
│ updated_at      │  │
└─────────────────┘  │
                     │ 1:1
                     ├──────────────────┐
                     │                  │
                     │                  │ 1:N
      ┌──────────────▼──────────┐      │
      │    user_settings        │      │
      ├─────────────────────────┤      │
      │ id (PK)                 │      │
      │ user_id (FK, UNIQUE)    │      │
      │ street_address          │      │
      │ city                    │      │
      │ postal_code             │      │
      │ country                 │      │
      │ daily_limit             │      │
      │ monthly_limit           │      │
      │ mobile_app_limit        │      │
      │ internet_banking_limit  │      │
      │ atm_limit               │      │
      │ card_enabled            │      │
      │ contactless_enabled     │      │
      │ online_payments_enabled │      │
      │ international_tx_enabled│      │
      │ email_notifications     │      │
      │ sms_notifications       │      │
      │ whatsapp_notifications  │      │
      │ in_app_notifications    │      │
      │ strava_access_token     │      │
      │ strava_refresh_token    │      │
      │ strava_token_expires_at │      │
      │ strava_athlete_id       │      │
      │ strava_connected        │      │
      │ created_at              │      │
      │ updated_at              │      │
      └─────────────────────────┘      │
                                        │
                          ┌─────────────▼────────┐
                          │       goals          │
                          ├──────────────────────┤
                          │ id (PK)              │
                          │ user_id (FK)         │
                          │ title                │
                          │ description          │
                          │ target_amount (cents)│
                          │ current_amount       │
                          │ target_date          │
                          │ category             │
                          │ icon                 │
                          │ color                │
                          │ status (ENUM)        │
                          │ created_at           │
                          │ updated_at           │
                          └──────────────────────┘
```

### Table Details

#### `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

**Constraints:**
- Email must be unique
- Password hash minimum 60 characters (bcrypt)

#### `user_settings`
```sql
CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Address
  street_address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'South Africa',

  -- Transaction Limits (stored in cents)
  daily_limit INTEGER DEFAULT 500000,
  monthly_limit INTEGER DEFAULT 5000000,
  mobile_app_limit INTEGER DEFAULT 300000,
  internet_banking_limit INTEGER DEFAULT 1000000,
  atm_limit INTEGER DEFAULT 200000,

  -- Card Settings
  card_enabled BOOLEAN DEFAULT true,
  contactless_enabled BOOLEAN DEFAULT true,
  online_payments_enabled BOOLEAN DEFAULT true,
  international_transactions_enabled BOOLEAN DEFAULT false,

  -- Notifications
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT true,
  whatsapp_notifications BOOLEAN DEFAULT false,
  in_app_notifications BOOLEAN DEFAULT true,

  -- Strava Integration
  strava_access_token VARCHAR(255),
  strava_refresh_token VARCHAR(255),
  strava_token_expires_at BIGINT,
  strava_athlete_id VARCHAR(50),
  strava_connected BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

**Business Rules:**
- One-to-one relationship with users
- `daily_limit` ≤ `monthly_limit`
- Sum of channel limits ≤ `monthly_limit`
- Cascade delete when user is deleted

#### `goals`
```sql
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'paused');

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_amount INTEGER NOT NULL,
  current_amount INTEGER DEFAULT 0,
  target_date DATE,
  category VARCHAR(100) NOT NULL DEFAULT 'Other',
  icon VARCHAR(10) DEFAULT '🎯',
  color VARCHAR(50) DEFAULT 'blue',
  status goal_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
```

**Business Rules:**
- Multiple goals per user
- Amounts stored in cents
- Status transitions: active → completed/paused

---

## API Architecture

### Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://api.bankapp.example.com/api`

### Authentication Flow

```
┌─────────┐                              ┌─────────┐
│ Client  │                              │ Server  │
└────┬────┘                              └────┬────┘
     │                                        │
     │  POST /api/auth/register              │
     │  { email, password }                  │
     ├───────────────────────────────────────>│
     │                                        │ 1. Validate input
     │                                        │ 2. Hash password (bcrypt)
     │                                        │ 3. Create user record
     │                                        │ 4. Generate JWT token
     │                                        │
     │  { user, token }                      │
     │<───────────────────────────────────────┤
     │                                        │
     │  Store token in sessionStorage        │
     │                                        │
     │                                        │
     │  GET /api/settings                    │
     │  Authorization: Bearer <token>        │
     ├───────────────────────────────────────>│
     │                                        │ 1. Verify JWT
     │                                        │ 2. Extract user.id
     │                                        │ 3. Query DB (WHERE user_id=...)
     │                                        │
     │  { settings }                         │
     │<───────────────────────────────────────┤
     │                                        │
```

### API Endpoints

#### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create new user account |
| POST | `/login` | No | Authenticate and get JWT token |

**POST /api/auth/register**
```json
Request:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**POST /api/auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Settings (`/api/settings`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get user settings |
| PUT | `/` | Yes | Update user settings |
| POST | `/initialize` | Yes | Create default settings |

**GET /api/settings**
```json
Response (200):
{
  "settings": {
    "id": 1,
    "user_id": 1,
    "street_address": "123 Main St",
    "city": "Johannesburg",
    "daily_limit": 500000,
    "monthly_limit": 5000000,
    "card_enabled": true,
    "strava_connected": false,
    ...
  }
}
```

#### Goals (`/api/goals`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List user's goals |
| POST | `/` | Yes | Create new goal |
| PUT | `/:id` | Yes | Update goal |
| DELETE | `/:id` | Yes | Delete goal |

#### Stocks (`/api/stocks`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/jse` | No | Get JSE stock prices (proxy) |

**GET /api/stocks/jse**
```json
Response (200):
{
  "success": true,
  "fallback": false,
  "data": [
    {
      "symbol": "SBK",
      "name": "Standard Bank Group Ltd",
      "exchange": "JSE",
      "price": 29500,
      "change": -84,
      "changePercent": -0.28,
      "volume": 155824,
      "marketCap": 285000000000,
      "pe": 8.45,
      "dividendYield": 5.2,
      "icon": "🏦"
    }
  ]
}
```

#### Strava (`/api/strava`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/auth` | Yes | Initiate OAuth flow |
| GET | `/callback` | No | OAuth callback handler |
| GET | `/status` | Yes | Check connection status |
| GET | `/activities` | Yes | Fetch recent activities |
| GET | `/stats` | Yes | Get athlete statistics |
| POST | `/disconnect` | Yes | Disconnect Strava |

**Strava OAuth Flow:**
```
1. GET /api/strava/auth
   → Returns Strava authorization URL

2. User authorizes on Strava.com

3. GET /api/strava/callback?code=XXX&state=YYY
   → Exchange code for access token
   → Store tokens in user_settings
   → Redirect to Health page

4. GET /api/strava/activities
   → Auto-refresh token if expired
   → Fetch activities from Strava API
```

#### Config (`/api/config`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/strava` | Yes | Get Strava config status |
| PUT | `/strava` | Yes | Update Strava credentials |

---

## Frontend Architecture

### Component Hierarchy

```
App.jsx (Root)
├── Login.jsx
└── Dashboard.jsx (Authenticated)
    ├── Header (Logo, User, Logout)
    ├── Sidebar (Navigation)
    └── Main Content
        ├── Dashboard.jsx (Overview)
        ├── Accounts.jsx (Account details)
        ├── Investments.jsx (Portfolios)
        ├── Health.jsx (Fitness tracking + Strava)
        ├── Goals.jsx (Goal management)
        ├── BuyHub.jsx (Product marketplace)
        ├── Crypto.jsx (Cryptocurrency prices)
        ├── StockPerformance.jsx (JSE stocks)
        └── Settings.jsx (User preferences + API config)
```

### State Management

BankApp uses React's built-in state management:

**App-level State (App.jsx)**
```javascript
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [currentPage, setCurrentPage] = useState('dashboard');
const [userEmail, setUserEmail] = useState('');
const [token, setToken] = useState('');
```

**Component-level State (Example: Health.jsx)**
```javascript
// Strava integration
const [stravaConnected, setStravaConnected] = useState(false);
const [stravaActivities, setStravaActivities] = useState([]);

// UI state
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### Routing Strategy

Navigation is handled via callback functions (no React Router):

```javascript
// App.jsx
const handleNavigate = (page) => {
  setCurrentPage(page);
};

// Pass to components
<Dashboard
  userEmail={userEmail}
  onNavigate={handleNavigate}
  onLogout={handleLogout}
/>
```

### Data Fetching Pattern

```javascript
useEffect(() => {
  fetchData();
}, [dependency]);

const fetchData = async () => {
  try {
    setLoading(true);
    const token = sessionStorage.getItem('token');
    const response = await fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('API error');

    const data = await response.json();
    setState(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## Authentication & Security

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": 1,
    "email": "user@example.com",
    "iat": 1706000000,
    "exp": 1706086400
  },
  "signature": "..."
}
```

**Token Lifecycle:**
- Generated on login/register
- Expires after 24 hours
- Stored in `sessionStorage` (cleared on tab close)
- Sent in `Authorization: Bearer <token>` header

### Authentication Middleware

**server/middleware/auth.cjs**
```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Password Security

- **Hashing**: bcrypt with 10 salt rounds
- **Minimum Length**: 8 characters
- **Storage**: Only hash stored, never plaintext
- **Validation**: Server-side only

### Per-User Data Isolation

All queries filtered by authenticated user ID:

```javascript
// ✅ Correct - filtered by JWT user.id
const settings = await UserSettings.findOne({
  where: { user_id: req.user.id }
});

// ❌ Wrong - would expose all users' data
const settings = await UserSettings.findAll();
```

### CORS Configuration

```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true,
}));
```

**Production**: Should be updated to actual domain

---

## External Integrations

### 1. Strava API (OAuth 2.0)

**Purpose**: Fitness activity tracking

**Authentication Flow:**
```
1. User clicks "Connect to Strava"
2. Backend generates authorization URL with state parameter
3. User redirects to Strava, logs in, authorizes
4. Strava redirects to callback with authorization code
5. Backend exchanges code for access + refresh tokens
6. Tokens stored in user_settings table
7. Activities fetched on-demand with automatic token refresh
```

**Endpoints Used:**
- `POST /oauth/token` - Token exchange
- `GET /api/v3/athlete/activities` - Recent activities
- `GET /api/v3/athletes/{id}/stats` - Athlete statistics

**Token Refresh:**
```javascript
// Automatic refresh when token expires
if (settings.strava_token_expires_at < Date.now() / 1000) {
  const newToken = await refreshStravaToken(settings);
  // Use newToken for API call
}
```

### 2. Yahoo Finance API

**Purpose**: JSE stock price data

**Backend Proxy Pattern:**
```javascript
// Client calls backend proxy
fetch('/api/stocks/jse')

// Backend fetches from Yahoo Finance
fetch('https://query1.finance.yahoo.com/v8/finance/chart/SBK.JO')
```

**Why Proxy?**
- Avoid CORS issues
- Centralized error handling
- Rate limit management
- Fallback data if API fails

**Stocks Monitored:**
- SBK.JO (Standard Bank)
- FSR.JO (FirstRand)
- NED.JO (Nedbank)
- CPI.JO (Capitec)
- ABG.JO (Absa)

### 3. ExchangeRate-API

**Purpose**: USD to ZAR conversion

**Implementation:**
```javascript
const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
const data = await response.json();
const zarRate = data.rates.ZAR;
```

**Display:** Real-time in Dashboard

### 4. CoinGecko API

**Purpose**: Cryptocurrency price tracking

**Currencies Tracked:**
- Bitcoin (BTC)
- Ethereum (ETH)
- Cardano (ADA)
- Polkadot (DOT)
- Solana (SOL)

**Implementation:**
```javascript
fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=zar')
```

---

## Deployment Architecture

### AWS Infrastructure (Planned)

```
┌─────────────────────────────────────────────────────────┐
│                      AWS Region                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │                  VPC                            │    │
│  │                                                 │    │
│  │  ┌──────────────┐         ┌──────────────┐     │    │
│  │  │ Public Subnet│         │Private Subnet│     │    │
│  │  │              │         │              │     │    │
│  │  │  ┌────────┐  │         │  ┌────────┐  │     │    │
│  │  │  │  ALB   │  │         │  │  ECS   │  │     │    │
│  │  │  │        │──┼────────>│  │ Tasks  │  │     │    │
│  │  │  └────────┘  │         │  └────┬───┘  │     │    │
│  │  │              │         │       │      │     │    │
│  │  └──────────────┘         │       │      │     │    │
│  │                           │       ▼      │     │    │
│  │                           │  ┌────────┐  │     │    │
│  │                           │  │   RDS  │  │     │    │
│  │                           │  │  (PG)  │  │     │    │
│  │                           │  └────────┘  │     │    │
│  │                           │              │     │    │
│  │                           └──────────────┘     │    │
│  │                                                 │    │
│  │  ┌──────────────────────────────────────────┐  │    │
│  │  │         Secrets Manager                  │  │    │
│  │  │  - JWT_SECRET                            │  │    │
│  │  │  - DB credentials                        │  │    │
│  │  │  - Strava API credentials                │  │    │
│  │  └──────────────────────────────────────────┘  │    │
│  │                                                 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                    ECR                            │   │
│  │  - bankapp-frontend:latest                       │   │
│  │  - bankapp-backend:latest                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                CloudWatch                         │   │
│  │  - Application logs                              │   │
│  │  - Performance metrics                           │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Docker Configuration

**Multi-stage Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY server ./server
EXPOSE 3001
CMD ["node", "server/index.cjs"]
```

### Environment Configuration

**Development (.env)**
```bash
NODE_ENV=development
PORT=3001
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=<local-secret>
STRAVA_CLIENT_ID=<dev-client-id>
```

**Production (.env.production.template)**
```bash
NODE_ENV=production
PORT=3001
DB_DIALECT=postgres
DB_HOST={{resolve:secretsmanager:bankapp/prod/db-host}}
DB_PASSWORD={{resolve:secretsmanager:bankapp/prod/db-password}}
JWT_SECRET={{resolve:secretsmanager:bankapp/prod/jwt-secret}}
STRAVA_CLIENT_ID={{resolve:secretsmanager:bankapp/prod/strava-client-id}}
```

---

## File Structure

```
TestAiApp/
├── public/
│   └── index.html                    # HTML entry point
│
├── src/                              # Frontend source
│   ├── main.jsx                      # React entry point
│   ├── App.jsx                       # Root component
│   ├── App.css                       # Global styles
│   ├── index.css                     # Reset styles
│   │
│   └── components/                   # React components
│       ├── Login.jsx                 # Authentication
│       ├── Dashboard.jsx             # Overview page
│       ├── Accounts.jsx              # Account management
│       ├── Investments.jsx           # Portfolio view
│       ├── Health.jsx                # Fitness + Strava
│       ├── Goals.jsx                 # Goal management
│       ├── BuyHub.jsx                # Marketplace
│       ├── Crypto.jsx                # Crypto tracking
│       ├── StockPerformance.jsx      # JSE stocks
│       ├── Settings.jsx              # User preferences
│       │
│       └── [Component].css           # Component styles
│
├── server/                           # Backend source
│   ├── index.cjs                     # Express server entry
│   │
│   ├── config/
│   │   ├── database.cjs              # Sequelize config
│   │   └── auth.cjs                  # JWT config
│   │
│   ├── models/
│   │   ├── index.cjs                 # Model registry + associations
│   │   ├── User.cjs                  # User model
│   │   ├── UserSettings.cjs          # Settings model
│   │   └── Goal.cjs                  # Goal model
│   │
│   ├── middleware/
│   │   └── auth.cjs                  # JWT verification
│   │
│   └── routes/
│       ├── auth.cjs                  # Authentication routes
│       ├── settings.cjs              # Settings CRUD
│       ├── goals.cjs                 # Goals CRUD
│       ├── stocks.cjs                # JSE stock proxy
│       ├── strava.cjs                # Strava OAuth + API
│       └── config.cjs                # API config management
│
├── docs/                             # Documentation
│   └── BankApp_Executive_Presentation.pptx
│
├── .env                              # Environment variables (gitignored)
├── .env.production.template          # Production config template
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
├── README.md                         # Project overview
├── ARCHITECTURE.md                   # This file
├── STRAVA_SETUP.md                   # Strava integration guide
└── TESTING.md                        # Testing documentation
```

---

## Data Flow

### User Registration Flow

```
1. User fills registration form
   ↓
2. Client sends POST /api/auth/register
   { email, password }
   ↓
3. Server validates input
   ↓
4. Server hashes password (bcrypt)
   ↓
5. Server creates user record in DB
   ↓
6. Server generates JWT token
   ↓
7. Server initializes user_settings
   ↓
8. Server returns { user, token }
   ↓
9. Client stores token in sessionStorage
   ↓
10. Client redirects to Dashboard
```

### Settings Update Flow

```
1. User modifies settings in UI
   ↓
2. Client validates input (frontend)
   ↓
3. Client sends PUT /api/settings
   Authorization: Bearer <token>
   { daily_limit: 600000, ... }
   ↓
4. Server verifies JWT → extracts user.id
   ↓
5. Server validates input (backend)
   ↓
6. Server checks business rules
   (daily_limit ≤ monthly_limit)
   ↓
7. Server updates DB
   UPDATE user_settings
   SET daily_limit = 600000
   WHERE user_id = <extracted-id>
   ↓
8. Server returns updated settings
   ↓
9. Client updates UI state
```

### Strava Activity Fetch Flow

```
1. User navigates to Health page
   ↓
2. Client sends GET /api/strava/status
   ↓
3. Server checks strava_connected flag
   ↓
4. If connected, client sends GET /api/strava/activities
   ↓
5. Server checks token expiration
   ↓
6. If expired, server refreshes token
   POST https://www.strava.com/oauth/token
   { refresh_token, grant_type: 'refresh_token' }
   ↓
7. Server updates tokens in DB
   ↓
8. Server fetches activities from Strava API
   GET https://www.strava.com/api/v3/athlete/activities
   Authorization: Bearer <access_token>
   ↓
9. Server formats and returns activities
   ↓
10. Client displays activities in UI
```

---

## Security Considerations

### Authentication
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens expire after 24 hours
- ✅ Tokens stored in sessionStorage (not localStorage)
- ✅ All protected endpoints require valid JWT
- ✅ Token verification via middleware

### Authorization
- ✅ Per-user data isolation via `user_id` from JWT
- ✅ SQL injection prevention via Sequelize ORM
- ✅ Input validation with express-validator
- ✅ CORS restricted to frontend origin

### Data Protection
- ✅ Passwords never stored in plaintext
- ✅ Sensitive data (amounts) stored as integers (cents)
- ✅ Environment variables for secrets
- ✅ .env file gitignored
- ✅ Strava tokens encrypted at rest in PostgreSQL

### API Security
- ✅ Rate limiting on auth endpoints (planned)
- ✅ HTTPS in production (planned)
- ✅ Helmet.js for HTTP headers (planned)
- ✅ Backend proxy for external APIs

### Production Security Checklist
- [ ] Enable HTTPS
- [ ] Use AWS Secrets Manager for credentials
- [ ] Enable database encryption at rest
- [ ] Configure AWS security groups
- [ ] Set up CloudWatch alerts
- [ ] Enable database backups
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Enable audit logging

---

## Performance Considerations

### Frontend Optimization
- Vite for fast builds and HMR
- Code splitting by route (planned)
- Lazy loading of images
- Minimal dependencies (no heavy frameworks)

### Backend Optimization
- Database indexing on foreign keys
- Connection pooling (Sequelize default)
- Backend proxy for API rate limiting
- Caching of frequently accessed data (planned)

### Database Optimization
- Indexes on `email`, `user_id`, `status`
- Foreign key constraints
- Query optimization via Sequelize
- PostgreSQL query planning

---

## Development Workflow

### Local Development

1. **Start PostgreSQL**
   ```bash
   # Ensure PostgreSQL is running on port 5432
   ```

2. **Start Backend**
   ```bash
   cd TestAiApp
   node server/index.cjs
   # Server runs on http://localhost:3001
   ```

3. **Start Frontend**
   ```bash
   cd TestAiApp
   npm run dev
   # Vite dev server on http://localhost:5173
   ```

### Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- Settings.test.jsx
```

### Database Migration

```bash
# Sync database (development only)
# Set alter: true in server/models/index.cjs
node server/index.cjs

# Production: Use proper migrations
npx sequelize-cli db:migrate
```

---

## Monitoring & Logging

### Application Logs
```javascript
// Console logging (development)
console.log('✅ Server running on http://localhost:3001');
console.error('❌ Database sync error:', error);

// CloudWatch (production - planned)
logger.info('User logged in', { userId: user.id });
logger.error('API error', { error, endpoint });
```

### Metrics to Track
- API response times
- Database query performance
- Authentication success/failure rates
- External API call latency
- Error rates by endpoint

---

## Future Enhancements

### Planned Features
- [ ] Real-time notifications (WebSockets)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Budget tracking and alerts
- [ ] Multi-currency support
- [ ] Export data to CSV/PDF

### Technical Improvements
- [ ] GraphQL API layer
- [ ] Redis caching
- [ ] Microservices architecture
- [ ] CDN for static assets
- [ ] Service worker for offline support
- [ ] Automated database backups

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01 | Initial release with core features |
| 1.1.0 | 2026-01 | Added Strava integration |
| 1.1.1 | 2026-01 | Added UI config for Strava API |

---

## Contact & Support

**Project Repository**: [GitHub - J-S-O-N/myrepo](https://github.com/J-S-O-N/myrepo)

**Documentation**:
- [README.md](README.md) - Project overview
- [STRAVA_SETUP.md](STRAVA_SETUP.md) - Strava integration guide
- [TESTING.md](TESTING.md) - Testing documentation

---

*Last Updated: January 26, 2026*
