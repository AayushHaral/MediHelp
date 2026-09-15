# MediHelp — Decoupled Full-Stack Architecture

MediHelp is an advanced AI-powered prescription savings, smart pharmacy routing, and patient management platform.

The project is structured with a decoupled full-stack architecture, separating the **Frontend** (Vite + React + TypeScript + Tailwind CSS) and **Backend** (Express + Gemini AI + FHIR Engine + Prisma ORM) into independent subfolders.

---

## Directory Structure

```text
MediHelp/
├── frontend/                 # React 19 SPA & PWA Application
│   ├── src/                  # React UI components, context providers, data layers & services
│   ├── public/               # Static assets, Web Manifest, and Service Worker
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.ts        # Vite build & API proxy configuration
│   ├── tsconfig.json         # Frontend TypeScript config
│   ├── .env.example          # Frontend environment variable template
│   └── .env                  # Frontend runtime environment configuration
│
├── backend/                  # Express API Server & Database Microservice
│   ├── server.js             # Express API endpoints & AI bridge
│   ├── prisma/               # Database ORM schema (`schema.prisma`)
│   ├── package.json          # Backend dependencies
│   ├── tsconfig.json         # Backend TypeScript config
│   ├── .env.example          # Backend environment variable template
│   └── .env                  # Backend runtime environment configuration
│
├── package.json              # Root workspace orchestrator & helper scripts
├── README.md                 # System overview and setup instructions
├── test_medihelp.py          # Comprehensive 5-phase test verification suite
└── .gitignore                # Global git ignore configuration
```

---

## Installation & Setup

### Prerequisites
- **Node.js**: `v18.0.0` or later
- **npm**: `v9.0.0` or later
- **Python 3**: For running verification tests

### 1. Install Dependencies

You can install dependencies for both frontend and backend at once from the root directory:

```bash
# Install root, frontend, and backend dependencies
npm run install:all
```

Alternatively, install them individually:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

## Running the Application

### Option A: Run Frontend and Backend Together (Recommended)
From the root directory:

```bash
npm run dev
```
* **Frontend**: Running on `http://localhost:3000` (Vite Proxy forwards `/api` requests to backend)
* **Backend**: Running on `http://localhost:3001` (Express API Server)

---

### Option B: Run Individually

#### Start the Backend Server:
```bash
cd backend
npm run dev
```
* Backend API listens on `http://localhost:3001`
* Health check: `http://localhost:3001/api/health`

#### Start the Frontend Application:
```bash
cd frontend
npm run dev
```
* Access the web UI at `http://localhost:3000`

---

## Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL="http://localhost:3001"
VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### Backend (`backend/.env`)
```env
PORT=3001
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
DATABASE_URL="postgresql://user:password@localhost:5432/medihelp?schema=public"
```

---

## Running Automated Verification Tests

Run the comprehensive 5-phase test suite:

```bash
python test_medihelp.py
```
