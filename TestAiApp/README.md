# TestAiApp

A modern React application built with Vite.

## Prerequisites

Before running this project, you need:
- **Node.js**: Download from https://nodejs.org/ (LTS version recommended)
- **PostgreSQL 14**: Database server for persistent storage
  ```bash
  brew install postgresql@14
  brew services start postgresql@14
  ```

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
   - Copy `.env.example` to `.env` (or use existing `.env`)
   - Update database credentials if needed
   - Default configuration uses PostgreSQL on localhost:5432

3. **Create database**:
```bash
createdb testaiapp
```

4. **Start the backend server** (Terminal 1):
```bash
node server/index.cjs
```

5. **Start the frontend dev server** (Terminal 2):
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally

## Project Structure

```
TestAiApp/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## Technology Stack

- React 18.3.1
- Vite 6.0.3
- Modern ES6+ JavaScript
