# Data Science Digital Lab (React + Express + MongoDB)
## 1. MongoDB Atlas (free)
Create a free M0 cluster at mongodb.com/atlas → Database Access: add a user → Network Access: allow your IP → Connect → Drivers: copy the connection string (add `/dsl` before the `?`).
## 2. Backend
```
cd server
copy .env.example .env      (Mac/Linux: cp)
```
Edit `server/.env`: MONGO_URI, JWT_SECRET (any long random text), ADMIN_EMAIL, ADMIN_PASSWORD. Then:
```
npm install
npm start
```
## 3. Frontend (new terminal, in the project root)
```
copy .env.example .env
npm install
npm run dev
```
Open http://localhost:5173/login and sign in with ADMIN_EMAIL / ADMIN_PASSWORD.
## Notes
- Only the logged-in owner can write; the server checks a signed token on every write. Visitors can only read.
- Uploaded files are saved in `server/uploads`. Hosting needs a server with a persistent disk.
- Spline: set VITE_SPLINE_URL. Java execution: set VITE_EXEC_URL (Piston). JavaScript and Python run in the browser.

## Quick start without MongoDB
`server/.env` ships with `MONGO_URI=local`: data is saved in `server/data.json`. Default admin login: admin@dsl.local / Dsl-Admin-2026. **Change ADMIN_PASSWORD and JWT_SECRET before putting the site online.** To use MongoDB Atlas later, replace `local` with your connection string.
