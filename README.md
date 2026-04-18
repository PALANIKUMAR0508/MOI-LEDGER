# MOI Ledger — The Grand Ledger
### "Aurelian Heritage" Design System — Royal Gold & Cream

A premium full-stack web application for digitally tracking MOI (monetary gifts) and contributions at ceremonies like weddings, birthdays, and engagements.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19 + Vite + Tailwind CSS v3       |
| Fonts     | Cinzel, Playfair Display, Cormorant Garamond, Montserrat, Inter |
| Icons     | Google Material Symbols Outlined        |
| Backend   | Node.js + Express.js                    |
| Database  | MongoDB + Mongoose                      |
| Auth      | JWT + bcryptjs                          |
| HTTP      | Axios + React Router v6                 |
| Toasts    | react-hot-toast                         |

---

## Project Structure

```
moi-ledger/
├── client/                  ← React Frontend (Vite)
│   ├── src/
│   │   ├── context/         ← AuthContext (JWT + login/register)
│   │   ├── components/      ← Sidebar, TopBar, AppLayout
│   │   ├── pages/
│   │   │   ├── Landing.jsx          ← Public hero + features
│   │   │   ├── SignIn.jsx           ← Auth page
│   │   │   ├── Register.jsx         ← Registration (two-panel)
│   │   │   ├── Dashboard.jsx        ← Overview + bento grid
│   │   │   ├── CreateFunction.jsx   ← New ceremony form
│   │   │   ├── Functions.jsx        ← All functions list
│   │   │   ├── EntryWorkspace.jsx   ← Live contribution ledger
│   │   │   └── SummaryReports.jsx   ← Printable archival reports
│   │   └── index.css        ← Design tokens + utilities
│   └── tailwind.config.js   ← Color palette + typography
│
└── server/                  ← Node.js Backend
    ├── models/
    │   ├── User.js
    │   ├── Function.js
    │   └── Contribution.js
    ├── routes/
    │   ├── auth.js          ← POST /register, /login
    │   ├── functions.js     ← CRUD + stats
    │   └── contributions.js ← CRUD + live totals
    ├── middleware/auth.js    ← JWT verification
    └── index.js             ← Express server entry
```

---

## Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB (running locally on port 27017, or use MongoDB Atlas)

### 1. Backend

```bash
cd server
npm install
# Edit .env to set your MONGO_URI and JWT_SECRET
npm run dev
```
Server runs on: `http://localhost:5000`

### 2. Frontend

```bash
cd client
npm install
# .env already set to http://localhost:5000/api
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## Design System: Aurelian Heritage

### Color Palette
| Token          | Hex       | Usage                        |
|----------------|-----------|------------------------------|
| `primary`      | `#4A3728` | Deep Bronze — headers, nav   |
| `secondary`    | `#C5A059` | Royal Gold — accents, CTAs   |
| `accent`       | `#D4AF37` | Metallic Gold — totals, glow |
| `surface`      | `#FDFCF0` | Cream — page background      |
| `outline`      | `#C5B358` | Gold Outline — borders       |

### Typography
| Font                | Role                           |
|---------------------|--------------------------------|
| Cinzel              | Headlines, nav, titles         |
| Playfair Display    | Display text, card headers     |
| Cormorant Garamond  | Input fields, editorial body   |
| Montserrat          | UI body, labels, buttons       |
| Inter               | Metadata, small labels         |

---

## API Endpoints

### Auth
```
POST /api/auth/register   { username, email, password }
POST /api/auth/login      { email, password }
```

### Functions
```
GET    /api/functions              → All user functions
POST   /api/functions              → Create function
GET    /api/functions/:id          → Single function
PUT    /api/functions/:id          → Update function
DELETE /api/functions/:id          → Delete function + contributions
GET    /api/functions/stats/overview → Dashboard stats
```

### Contributions
```
GET    /api/contributions/function/:functionId → List contributions
POST   /api/contributions                       → Add contribution
DELETE /api/contributions/:id                   → Remove entry
```

---

## Pages Overview

| Page             | Route                  | Description                        |
|------------------|------------------------|------------------------------------|
| Landing          | `/`                    | Hero, features bento grid, CTA     |
| Sign In          | `/signin`              | Auth form with diamond logo        |
| Register         | `/register`            | Two-panel split with image         |
| Dashboard        | `/dashboard`           | Stats + function cards             |
| Functions        | `/functions`           | Full archive with filters          |
| Create Function  | `/functions/new`       | Multi-field ceremony form          |
| Entry Workspace  | `/contributions/:id`   | Live ledger with add/delete        |
| Summary Reports  | `/reports`             | Printable contribution reports     |
