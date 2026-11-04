# ResumeLens - AI-Powered Resume Scoring and Analysis System (MERN)

**MCA Mini-Project:** *Design and Development of an AI-Powered Resume Scoring and Analysis System Using the MERN Stack*

Upload a PDF resume and receive an AI-generated score (0-100), category scores, strengths, weaknesses, missing keywords and recommendations. Results are saved so users can track their progress. An admin panel manages users and shows system statistics.

> The score is an **AI-generated evaluation**, not an official ATS score. The UI and documentation say so explicitly.

---

## 1. Features

**Candidate:** register / log in, upload a PDF (drag and drop, progress bar), view score + 7 category scores, summary, detected skills, strengths, weaknesses, missing keywords, recommendations, analysis history with a progress chart, delete analyses (also deletes the stored PDF and text when nothing else uses it), edit profile and change password.

**Admin:** statistics (users, resumes, analyses, average score, score distribution, recent activity), searchable and paginated user list, activate / disable accounts. Admins never see resume text.

**Security:** bcrypt password hashing, JWT auth, role-based authorization, PDF magic-byte validation, upload size limit, random on-disk filenames, input validation (also blocks NoSQL operator injection), Helmet headers, CORS restriction, rate limiting (stricter on login and AI calls), AI output treated as untrusted and validated, no stack traces or secrets in responses, AI key only on the server.

## 2. Architecture

```
React (Vite) --Axios--> Express routes -> Controllers -> Services -> Mongoose models -> MongoDB
                                                         |
                                                         +-> pdfService  (validate + extract text)
                                                         +-> aiService   (ONLY file that calls the AI API)
                                                         +-> aiResponseValidator (shape check, clamp scores)
```

Analysis flow: `Upload PDF -> validate (MIME, extension, %PDF- signature, size) -> extract + clean text -> save Resume -> send text to AI -> parse JSON -> validate/clamp -> server recalculates overall score -> save ResumeAnalysis -> show result`.

**Scoring framework** (`server/utils/scoring.js`, mirrored in `client/src/utils/constants.js`):

| Category | Points | Category | Points |
|---|---|---|---|
| Skills | 20 | Keywords | 15 |
| Experience | 20 | Structure | 10 |
| Projects | 15 | Content quality | 10 |
| Education | 10 | **Total** | **100** |

Design decision: the AI returns the category scores; the **server clamps each to its maximum and computes the overall score itself**, so a faulty or manipulated AI reply can never produce an impossible score.

## 3. Technologies

React 19, Vite, Tailwind CSS 4, React Router, Axios, Lucide icons - Node.js, Express 5, Mongoose, Multer, pdf-parse, jsonwebtoken, bcryptjs, helmet, cors, express-rate-limit - MongoDB - Anthropic Messages API (swappable) - Postman, ESLint, Git.

## 4. Folder structure

```
resume-analyzer/
  .env.example  .gitignore  README.md  package.json
  docs/                MCA_DOCUMENTATION.md, UML.md, TESTING.md, Postman collection
  server/
    config/            env.js (loads + checks .env), db.js
    controllers/       auth, user, resume, analysis, admin
    middleware/        auth (protect/authorize), validate, upload, error
    models/            User, Resume, ResumeAnalysis
    routes/            one file per resource
    services/          pdfService, aiService, aiResponseValidator, analysisService, resumeService
    scripts/           createAdmin.js
    uploads/           stored PDFs (git-ignored, never served publicly)
    utils/             AppError, asyncHandler, token, scoring
    server.js
  client/src/
    components/  pages/  layouts/  services/  hooks/  context/  utils/
    App.jsx  main.jsx
```

## 5. Installation

Prerequisites: **Node.js 20.16+** (22 LTS recommended), **MongoDB** (local or Atlas), an **AI API key**.

```bash
cd resume-analyzer
npm run install:all          # installs root, server and client dependencies
cp .env.example .env         # Windows: copy .env.example .env
# edit .env (see below)
```

## 6. Environment variables (`.env` in the project root)

| Variable | Required | Meaning |
|---|---|---|
| `MONGODB_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | long random string used to sign tokens |
| `AI_API_KEY` | for analysis | AI provider key (server only) |
| `AI_MODEL` | no | default `claude-sonnet-5-5` |
| `PORT` | no | default 5000 |
| `CLIENT_URL` | no | allowed CORS origin, default `http://localhost:5173` |
| `MAX_FILE_SIZE_MB` | no | default 5 (also change `MAX_FILE_SIZE_MB` in `client/src/utils/constants.js`) |
| `ADMIN_NAME/EMAIL/PASSWORD` | for seeding | used by `npm run seed:admin` |

Generate a secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## 7. MongoDB setup

*Local:* install MongoDB Community, start it, use `MONGODB_URI=mongodb://127.0.0.1:27017/resume_analyzer`.
*Atlas:* create a free cluster, create a database user, add your IP under Network Access, copy the `mongodb+srv://...` string into `.env`.
Collections (`users`, `resumes`, `resumeanalyses`) are created automatically.

## 8. AI API setup

1. Create an API key in the Anthropic Console (https://console.anthropic.com).
2. Put it in `.env` as `AI_API_KEY`. It is read only by `server/services/aiService.js`.
3. To use another provider, change only `aiService.js` (the request/response code); the validator and the rest of the app stay the same.

## 9. Run the project

```bash
npm run seed:admin    # once: creates the admin user from ADMIN_* in .env
npm run dev           # starts API (http://localhost:5000) and client (http://localhost:5173)
```

Or separately: `cd server && npm run dev` and `cd client && npm run dev`.
Health check: `http://localhost:5000/api/health`. Production build of the client: `npm run build:client`.

Public registration always creates a **candidate**. Admin accounts exist only through the seed script.

## 10. API documentation

All responses are JSON: `{ success: true, ... }` or `{ success: false, message, errors? }`. Protected routes need `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | create candidate account `{name,email,password}` |
| POST | `/api/auth/login` | public | returns `{token,user}` |
| GET | `/api/auth/me` | any user | current user |
| GET / PUT | `/api/users/profile` | any user | read / update profile (`name`, or `currentPassword`+`newPassword`) |
| POST | `/api/resumes/upload` | candidate | multipart field `resume` (PDF) -> validates, extracts text, saves |
| GET | `/api/resumes` | candidate | list own resumes |
| GET / DELETE | `/api/resumes/:id` | candidate | read / delete resume + its analyses + file |
| POST | `/api/analysis/:resumeId` | candidate | run AI analysis, returns saved analysis |
| GET | `/api/analysis/history` | candidate | list own analyses (newest first) |
| GET / DELETE | `/api/analysis/:id` | candidate | read / delete one analysis |
| GET | `/api/admin/users?page&limit&search` | admin | paginated users with counts |
| PUT | `/api/admin/users/:id/status` | admin | `{isActive: true/false}` |
| GET | `/api/admin/statistics` | admin | totals, average, distribution, recent activity |

Status codes used: 200, 201, 400 (validation), 401 (not logged in), 403 (wrong role / disabled), 404, 409 (duplicate email), 413 (file too large), 422 (unreadable or empty PDF), 429 (rate limit), 502/503/504 (AI service problems).

Import `docs/ResumeLens.postman_collection.json` into Postman to test everything (see `docs/TESTING.md`).

## 11. Screenshots

Add your own screenshots to `docs/screenshots/` and list them here: landing page, register, dashboard, upload, analysis result, history, profile, admin overview, admin users.

## 12. Future enhancements

Job-description matching (a hook is documented in `aiService.js`), ATS-style keyword analysis, resume comparison, AI rewriting assistant, job recommendations, LinkedIn profile analysis, DOCX support, PDF export of reports, advanced analytics, OCR for scanned PDFs, refresh tokens / httpOnly cookies.

## Known limitations

- Scanned (image-only) PDFs are rejected because no text can be extracted.
- The JWT is stored in `localStorage` for simplicity; for production, prefer httpOnly cookies.
- Uploaded files live on the server's disk; production deployments should use object storage.
- AI output can be imperfect. The score is a guide, not a guarantee.
