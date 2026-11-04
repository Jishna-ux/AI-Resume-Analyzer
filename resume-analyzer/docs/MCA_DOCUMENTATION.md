# MCA Mini-Project Documentation Content

Use this file as the source text for your report. Replace bracketed items, add your own screenshots, and keep your institution's report format.

## Abstract
Job seekers often do not know how well their resume communicates their skills. This project presents **ResumeLens**, a web application built on the MERN stack that lets a candidate upload a PDF resume and receive an AI-generated evaluation: an overall score out of 100, seven category scores, a summary, detected skills, strengths, weaknesses, missing keywords and improvement recommendations. The server validates the PDF, extracts its text, sends the text to an AI model through a dedicated service, validates the structured JSON reply and stores the result in MongoDB. Users can review their analysis history and track improvement; an administrator can manage users and view system statistics. Security measures include JWT authentication, role-based authorization, bcrypt hashing, strict upload validation and server-side secret management.

## 1. Introduction
Recruiters spend seconds on each resume, and applicants rarely receive feedback. Recent AI language models can read a resume and give structured, specific feedback instantly. This project applies that capability inside a full-stack web application, demonstrating REST APIs, file handling, database design, authentication and third-party API integration.

## 2. Problem statement
Candidates lack fast, consistent, affordable feedback on their resumes. Manual review by mentors is slow and subjective, and many online tools hide how scores are produced or claim unverifiable "ATS" accuracy. A transparent system with a documented scoring framework and actionable suggestions is needed.

## 3. Objectives
1. Build a secure MERN web application with candidate and admin roles.
2. Accept PDF resumes with strict validation and extract their text.
3. Use an AI model, through a backend service, to evaluate resumes against a documented 100-point framework.
4. Validate AI output before storing or displaying it.
5. Store analyses so users can view history and progress.
6. Provide an admin view for user management and statistics.
7. Keep the design modular so features such as job-description matching can be added later.

## 4. Existing system
Resume feedback is currently obtained from (a) mentors or friends - slow, inconsistent; (b) online resume checkers - often closed-source, require payment, sometimes claim an "ATS score" without evidence, and may store documents without clear control; (c) generic AI chat tools - no history, no fixed scoring framework, no structured output, and manual copy-paste of resume text.

## 5. Proposed system
A web application with a fixed scoring framework, structured AI output, saved history and role-based access. The AI key never leaves the server, uploaded files are validated by content and not only by name, the overall score is recalculated server-side, and users can delete their data. The score is explicitly labelled as an AI-generated evaluation, not an official ATS score.

## 6. Requirements
**Functional:** FR1 register and log in; FR2 upload PDF; FR3 validate file type and size; FR4 extract text; FR5 AI analysis with structured result; FR6 display score, categories, strengths, weaknesses, missing keywords, recommendations; FR7 save and list history; FR8 delete analysis / resume; FR9 view and update profile; FR10 admin: list users, activate / disable, view statistics.

**Non-functional:** security (hashing, JWT, validation, rate limiting, secrets in `.env`); performance (analysis within about 10-40 s, UI never freezes); usability (responsive, accessible, clear errors); reliability (graceful handling of AI, database and network failures); maintainability (layered modular code, AI isolated in one service); privacy (users see only their data; admins see no resume text); portability (runs locally with Node and MongoDB).

## 7. System architecture
Three tiers: React client, Express REST API (routes -> controllers -> services -> models), and MongoDB. External dependency: AI provider API. See the architecture diagram in `README.md` and the UML in `docs/UML.md`.

## 8. Module description
1. **Authentication:** registration, login, JWT issue and verification, role checks, disabled-account enforcement on every request.
2. **User/profile:** view and update name, change password (requires current password).
3. **Resume upload:** Multer limits and MIME/extension filter, random filenames, magic-byte check, cleanup of rejected files.
4. **Text extraction:** `pdfService` parses the PDF, cleans text, rejects empty or image-only files.
5. **AI analysis:** `aiService` builds the prompt (resume treated as untrusted data), calls the provider with timeout, parses JSON; `aiResponseValidator` checks shape, clamps scores, limits lengths and recomputes the total.
6. **History:** list, view, delete (cascade removes unused file and text), progress chart.
7. **Admin:** user list with search and pagination, status toggle, aggregate statistics via MongoDB aggregation.
8. **Frontend:** landing, auth pages, dashboard, upload with progress, result dashboard, history, profile, admin pages; protected routes by role.

## 9. Database design
Three collections with references (no duplicated large data; the extracted text is stored once, in `resumes`, and excluded from queries by default).

**users** - `_id`, `name`, `email` (unique), `password` (bcrypt hash, never returned), `role` (`user`|`admin`), `isActive`, `createdAt`, `updatedAt`.
**resumes** - `_id`, `userId -> users`, `originalFileName`, `storedFileName`, `fileSize`, `pageCount`, `extractedText`, `uploadedAt`.
**resumeanalyses** - `_id`, `userId -> users`, `resumeId -> resumes`, `overallScore`, `categoryScores{7 fields}`, `summary`, `skills[]`, `strengths[]`, `weaknesses[]`, `missingKeywords[]`, `recommendations[]`, `aiModel`, `createdAt`.
Indexes: unique `users.email`; `resumes.userId`; `resumeanalyses.resumeId`; compound `resumeanalyses(userId, createdAt desc)`.

## 10. Scoring framework
Skills 20, Experience 20, Projects 15, Keywords 15, Education 10, Structure 10, Content quality 10 = 100. Certifications and presentation are assessed within these categories. The AI proposes category scores; the server enforces the limits and sums them.

## 11. Security summary
Passwords hashed with bcrypt (cost 12). JWT in the `Authorization` header. Role middleware on every protected route. Candidate data isolation by always querying with `userId`. Helmet, CORS allow-list, rate limits (global, login, registration, AI). Input validation with type checks (blocks NoSQL operator injection). Uploads: type, extension, size, magic bytes, random names, not publicly served. Prompt-injection defence: resume text is delimited and declared untrusted, output is validated, nothing from the AI is executed, React escapes all text. Centralized error handler hides internals.

## 12. Testing
See `docs/TESTING.md` for 20 test cases and the Postman collection. Add your executed results and screenshots here.

## 13. Results
[Insert screenshots and real measured results from your own runs: sample resumes, the scores produced, the time taken, and the admin statistics. Do not quote figures you have not measured.]

## 14. Limitations
Scanned PDFs are unsupported; AI feedback can be inaccurate or vary between runs; the score is not an ATS score; the token is stored in `localStorage`; files are stored on local disk; a single AI provider is configured.

## 15. Future enhancements
Job-description matching (match score, matched and missing skills), ATS-style keyword analysis, resume comparison, AI resume rewriting, job recommendations, LinkedIn analysis, DOCX support, PDF report export, advanced analytics, OCR, httpOnly cookie sessions, email verification and password reset.

## 16. Conclusion
The project delivers a working, secure, modular MERN application that integrates an AI model for practical resume feedback, with transparent scoring, validated outputs and saved history. It demonstrates REST design, authentication and authorization, file processing, MongoDB modelling and third-party API integration, and it leaves clear extension points for future features.

## Viva preparation - likely questions
1. **Why is the AI key not in React?** Anything in the browser can be read by users; the backend keeps the key and applies rate limits.
2. **Why recalculate the overall score on the server?** AI output is untrusted; clamping and summing guarantees valid 0-100 scores.
3. **How do you stop fake PDFs?** MIME + extension filter, then the `%PDF-` signature, then a parser that must succeed.
4. **How is a candidate prevented from reading another's data?** Every query includes `userId` from the verified token.
5. **What happens if the AI returns bad JSON?** The service returns a 502 with a friendly message; nothing is saved.
6. **Why MongoDB references, not embedding?** Resume text is large and analyses are many per resume; references avoid duplication.
7. **How would you add job-description matching?** Extend `aiService` with a second input and prompt, add `jobDescription` and `matchScore` fields, and a new route - no other layer changes.
8. **What is prompt injection?** Instructions hidden inside the resume; we delimit the resume, instruct the model to ignore them, and validate the output.
