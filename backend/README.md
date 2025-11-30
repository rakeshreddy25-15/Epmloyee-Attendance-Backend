# TeamTime Backend (Node + Express + TypeScript)

Quick start guide for developing locally on Windows PowerShell.

Steps:

1. Open PowerShell in this folder `backend\`.
2. Copy `.env.example` to `.env` and set values.
3. Install dependencies: `npm install`.
4. Run development server: `npm run dev`.
5. Build for production: `npm run build` then `npm start`.

Notes:
- Uses `ts-node-dev` for fast TypeScript reload during development.
- Example simple API with health check and basic API key auth.

MongoDB setup and usage

**Option 1: Local MongoDB**
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB: run `mongod` in PowerShell (or start MongoDB Service from Services app)
3. Set in `.env`: `MONGO_URI=mongodb://localhost:27017/teamtime`

**Option 2: MongoDB Atlas (Cloud) - Recommended for development**
1. Go to https://www.mongodb.com/cloud/atlas and sign up (free tier available)
2. Create a new project and cluster (M0 free tier is fine)
3. Create a database user:
   - Click "Database Access" → "Add New Database User"
   - Username: `teamtime_user` (or any name)
   - Password: choose "Autogenerate Secure Password" and copy it
4. Whitelist your IP:
   - Click "Network Access" → "Add IP Address"
   - Enter "0.0.0.0/0" to allow all IPs (dev only) or your IP
5. Get connection string:
   - Click "Clusters" → "Connect" → "Connect your application"
   - Select "Node.js" driver
   - Copy the MongoDB URI (looks like: `mongodb+srv://teamtime_user:PASSWORD@cluster0.xxxxx.mongodb.net/teamtime?retryWrites=true&w=majority`)
6. Replace `PASSWORD` in the URI with your database user password
7. Set in `.env`: `MONGO_URI=mongodb+srv://teamtime_user:your-password@cluster0.xxxxx.mongodb.net/teamtime?retryWrites=true&w=majority`

**Then for both options:**
1. Set `JWT_SECRET` in `.env` (e.g., `my-secret-key-12345`)
2. Install dependencies: `npm install` (run inside `backend` folder)
3. Start dev server: `npm run dev`

Endpoints implemented:
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Attendance (employee): `POST /api/attendance/checkin`, `POST /api/attendance/checkout`, `GET /api/attendance/my-history`, `GET /api/attendance/my-summary`, `GET /api/attendance/today`
- Attendance (manager): `GET /api/attendance/all`, `GET /api/attendance/employee/:id`, `GET /api/attendance/summary`, `GET /api/attendance/export`, `GET /api/attendance/today-status`
- Dashboard: `GET /api/dashboard/employee`, `GET /api/dashboard/manager`

Use the `Authorization: Bearer <token>` header (token from login) for protected endpoints.

Example .env configuration (MongoDB Atlas)

```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb+srv://teamtime_user:your-password-here@cluster0.xxxxx.mongodb.net/teamtime?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-key-change-this
API_KEY=change-this-to-a-secure-token
```

Example .env configuration (Local MongoDB)

```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/teamtime
JWT_SECRET=my-super-secret-key-change-this
API_KEY=change-this-to-a-secure-token
```

If your frontend runs on a different origin (Vite dev server defaults to port 8080 in this project), set the backend to allow that origin by adding `FRONTEND_URL` to your `.env`:

```
FRONTEND_URL=http://localhost:8080
```

