# Job Tracker SaaS

A full-stack job application tracker — track every application, upload resumes, visualise your pipeline.

**Stack:** React 19 · Vite · Tailwind CSS · Node.js · Express · Prisma · PostgreSQL (Supabase) · Cloudinary · JWT

---

## Features

- JWT authentication (register / login / update profile & password)
- Full CRUD for job applications with soft-delete
- Status tracking: Applied · Interview · Offer · Rejected
- Priority levels: Low · Medium · High
- Salary range, notes, interview date per job
- Resume upload per job (Cloudinary — PDF/Word, max 5 MB)
- Interview email reminders (Nodemailer)
- Search, filter (status + priority), pagination
- Dashboard stats + donut chart breakdown
- Admin role guard
- Rate limiting, Helmet security headers, input validation (Zod)

---

## Local Development

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)
- A Cloudinary account (free tier works)

### 1 — Clone & install

```bash
git clone <repo-url>
cd job-tracker-saas

# backend
cd backend && npm install

# frontend
cd ../frontend && npm install
```

### 2 — Backend `.env`

Copy `backend/.env.example` to `backend/.env` and fill in every value:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
JWT_SECRET=any_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 3 — Push database schema

```bash
cd backend
npx prisma db push
```

### 4 — Run both servers

```bash
# terminal 1
cd backend && npm run dev    # → http://localhost:4000

# terminal 2
cd frontend && npm run dev   # → http://localhost:5173
```

---

## Deploy to Render

The repo includes a `render.yaml` that defines both services. You can either use that or follow the manual steps below.

### Step 1 — Push to GitHub

Make sure your code is pushed to a GitHub repo (Render pulls from it).

```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

### Step 2 — Create Backend Web Service

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** → `backend`
4. Set **Build Command** → `npm install && npm run build`
5. Set **Start Command** → `npm start`
6. Set **Environment** → `Node`

**Add these Environment Variables in the Render dashboard:**

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Your Supabase connection string |
| `JWT_SECRET` | A long random string |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | *(leave blank for now — fill in after step 3)* |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

7. Click **Create Web Service** — note the URL: `https://job-tracker-backend.onrender.com`

### Step 3 — Create Frontend Static Site

1. Go to Render → **New → Static Site**
2. Connect the same GitHub repo
3. Set **Root Directory** → `frontend`
4. Set **Build Command** → `npm install && npm run build`
5. Set **Publish Directory** → `dist`

**Add Environment Variable:**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://job-tracker-backend.onrender.com/api/v1` |

6. Under **Redirects/Rewrites**, add:  
   Source: `/*` → Destination: `/index.html` → Action: **Rewrite**  
   *(This makes React Router work on page refresh)*

7. Click **Create Static Site** — note the URL: `https://job-tracker-frontend.onrender.com`

### Step 4 — Wire the two services together

Go back to the **backend** service on Render → **Environment** → update:

| Key | Value |
|-----|-------|
| `CLIENT_URL` | `https://job-tracker-frontend.onrender.com` |

Click **Save Changes** — Render redeploys automatically.

### Step 5 — Keep Supabase awake (free tier)

Supabase free databases **auto-pause after 7 days of inactivity**. When that happens you'll see `Can't reach database server`.

**Fix:** Visit [supabase.com](https://supabase.com) → your project → click **Restore project**.

**Prevent it:** Set up a free uptime monitor (e.g. UptimeRobot) pointing to `https://job-tracker-backend.onrender.com/health` every 5 minutes — this also keeps Render's free tier awake.

---

## API Reference

All routes are prefixed with `/api/v1`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Register |
| POST | `/auth/login` | — | Login |
| GET | `/auth/me` | ✓ | Current user |
| PATCH | `/auth/update-profile` | ✓ | Update name |
| PATCH | `/auth/update-password` | ✓ | Change password |
| GET | `/jobs` | ✓ | List jobs (search, filter, paginate) |
| POST | `/jobs` | ✓ | Create job |
| PATCH | `/jobs/:id` | ✓ | Update job |
| DELETE | `/jobs/:id` | ✓ | Soft-delete job |
| POST | `/jobs/:id/upload` | ✓ | Upload resume (PDF/Word ≤ 5 MB) |
| POST | `/jobs/:id/send-reminder` | ✓ | Email interview reminder |
| GET | `/dashboard` | ✓ | Stats + status breakdown |
| GET | `/users/me` | ✓ | User profile |
| GET | `/admin` | ADMIN | Admin-only route |
| GET | `/health` | — | Health check |
