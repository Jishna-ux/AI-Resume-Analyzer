# Testing Guide

Tools: **Postman** (import `docs/ResumeLens.postman_collection.json`), the browser, and MongoDB Compass to inspect data.
Preparation: start MongoDB, run `npm run seed:admin`, run `npm run dev`. Use a normal text-based PDF resume, a `.txt` file renamed to `.pdf`, and a PDF larger than 5 MB.

Fill the **Result** column during your own test run and attach screenshots in your report.

| ID | Area | Steps | Expected | Result |
|---|---|---|---|---|
| T1 | Registration | POST `/auth/register` with valid data | 201, token + user, password not in response, `role` = `user` | |
| T1b | Registration | Same email again | 409 | |
| T1c | Registration | Password `abc` | 400 with a clear message | |
| T2 | Login | POST `/auth/login` with correct credentials | 200 + token | |
| T3 | Invalid login | Wrong password, and unknown email | 401, same message for both | |
| T4 | PDF upload | POST `/resumes/upload` with a real PDF | 201, resume record without `extractedText` | |
| T5 | Invalid file | Upload `.png`, then a `.txt` renamed `.pdf` | 400 "Only PDF..." / "not a valid PDF"; no file left in `server/uploads` | |
| T5b | Large file | Upload a PDF over 5 MB | 413 | |
| T6 | Text extraction | After T4, check the `resumes` collection | `extractedText` contains resume text, page count set | |
| T6b | Empty / scanned PDF | Upload an image-only PDF | 422 explaining that no text was found | |
| T7 | AI analysis | POST `/analysis/:resumeId` | 201, structured result with all fields | |
| T7b | AI failure | Set a wrong `AI_API_KEY`, repeat T7 | 502 friendly message, no key or stack trace in body | |
| T8 | Score generation | Inspect the analysis | each category <= its max; `overallScore` = sum of categories; 0-100 | |
| T9 | Database storage | Check `resumeanalyses` in Compass | document references `userId` and `resumeId` | |
| T10 | History | GET `/analysis/history`; open the History page | newest first; chart appears with 2+ analyses; delete works | |
| T11 | Unauthorized access | Call `/resumes` without a token; with a garbage token; candidate calls `/admin/users` | 401, 401, 403 | |
| T11b | Data isolation | User B requests user A's analysis id | 404 | |
| T12 | Admin access | Admin logs in, lists users, disables a user, reads statistics | works; disabled user's next request returns 403 | |
| T13 | Security | Login with `{"email":{"$ne":""},"password":{"$ne":""}}` | 400, no login | |
| T14 | UI | Resize to phone width; tab through forms | layout adapts; focus visible; errors announced | |

## Checks already run during development (without a database)

These were executed against the code before delivery and are repeatable:

- A generated text PDF was parsed (359 characters, 1 page); a text file disguised as a PDF was rejected by the signature check.
- A mock AI endpoint returned JSON wrapped in code fences with an out-of-range score; the validator clamped it and recalculated the total. Non-JSON replies and a provider 401 produced friendly 502 errors with no leakage.
- Without a token, with a bad token, with weak registration data, with NoSQL operators, and with malformed JSON the API returned 401/401/400/400/400; unknown routes returned 404.
- The React client passes `eslint` and `vite build`, and the main pages were rendered in a headless browser at desktop and phone widths using mocked API data.

**Not run here:** anything requiring a live MongoDB or the real AI service (T1-T4, T6-T12 in full). Please run those on your machine with the table above.
