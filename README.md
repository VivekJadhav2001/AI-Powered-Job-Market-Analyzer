# AI-Powered Job Market Analyzer

AI-Powered Job Market Analyzer is a full-stack MERN-style project for exploring job listings, uploading resumes, parsing candidate profiles with AI, and generating personalized job recommendations through a hybrid matching system.

The application is intentionally split into two major product flows:

1. Job market exploration and filtering.
2. Resume-based AI job matching.

The matching flow is designed around two frontend API calls:

```txt
POST /resume   -> upload and parse the resume
POST /matches  -> generate personalized AI job recommendations from the stored resume
```

This separation keeps resume processing, job retrieval, scoring, and AI ranking predictable, reusable, and easier to debug.

## Why This Project Uses Upload First, Then Hybrid Matching

The resume matching system does not send the resume text with every matching request. Instead, the user uploads the resume once, the backend extracts and stores the parsed profile, and the recommendation endpoint uses that stored resume data later.

This design was chosen for several reasons:

- It avoids repeatedly parsing the same resume on every recommendation request.
- It keeps the frontend simple: upload once, generate matches when needed.
- It allows the backend to store structured candidate data such as skills, experience, preferred roles, projects, education, and keywords.
- It makes the matching flow easier to extend later with saved profiles, ATS scores, user dashboards, and historical recommendations.
- It keeps sensitive resume handling centralized in the backend instead of passing large resume text through the client multiple times.

The recommendation engine uses a hybrid approach instead of relying only on an LLM.

The pipeline is:

```txt
Resume Upload
  -> AI Resume Parsing
  -> Candidate Retrieval from MongoDB
  -> Local Scoring Engine
  -> LLM Re-ranking
  -> Top AI-ranked Jobs + Career Insights
```

## Why Hybrid Matching Instead Of Only AI

Using only an LLM for job matching can be expensive, slow, and inconsistent. A hybrid system gives better control.

### MongoDB Candidate Retrieval

The backend first retrieves a smaller candidate set from MongoDB using structured signals:

- Candidate skills
- Preferred roles
- Resume keywords
- Job title
- Job description
- Job skills

This avoids sending every job in the database to the LLM. It is faster and more scalable.

### Local Scoring Engine

After candidate retrieval, the local scoring engine calculates a deterministic score using rules such as:

- Skill overlap
- Preferred role match
- Experience fit
- Location fit
- Industry relevance
- Education bonus

This gives the system a stable numeric score that does not depend on model randomness. The score is treated as the final numeric fit score.

### LLM Re-ranking

The LLM is used after local scoring, not before it. Its job is to improve the user-facing recommendation quality:

- Rank the already-scored jobs.
- Explain why each job fits.
- Summarize strengths.
- Highlight missing skills.
- Estimate interview chance.
- Generate career advice.

This gives the best of both approaches:

- Local code handles structured scoring.
- AI handles explanation, prioritization, and career insight.

## Tech Stack

### Frontend

- React
- Vite
- Redux Toolkit
- React Redux
- React Router
- Tailwind CSS
- Framer Motion
- React Icons
- Recharts
- Axios
- PapaParse and XLSX for job file parsing

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Multer
- pdf-parse
- Cloudinary
- Groq SDK

## Root Folder Structure

```txt
AI-Powered Job Market Analyzer/
  backend/
  frontend/
  README.md
```

### backend/

The backend contains the Express API, MongoDB models, route definitions, controllers, middleware, and AI utilities.

```txt
backend/
  package.json
  package-lock.json
  src/
    server.js
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
```

### frontend/

The frontend contains the React application, Redux slices, pages, reusable components, charts, layout, and API helper.

```txt
frontend/
  package.json
  package-lock.json
  vite.config.js
  index.html
  public/
  src/
    App.jsx
    main.jsx
    index.css
    app/
    assets/
    charts/
    components/
    context/
    data/
    features/
    hooks/
    layout/
    pages/
    utils/
```

## Backend Folder Structure

### backend/src/server.js

Main Express application entry point.

Responsibilities:

- Loads environment variables.
- Connects to MongoDB.
- Enables JSON and URL-encoded request bodies.
- Configures CORS.
- Registers global response helpers.
- Mounts API routes.
- Starts the server.

Important route mounts:

```txt
/api/v1
/api/v1/user
/api/v1/dashboard
/api/v1/daTeam
```

The resume routes are available under `/api/v1`, so the frontend can call:

```txt
POST /resume
POST /matches
```

through the configured Axios base URL.

### backend/src/config/

```txt
config/
  cloudinary.js
  connectDB.js
```

#### cloudinary.js

Configures Cloudinary for storing uploaded resume PDFs.

#### connectDB.js

Connects the backend to MongoDB using Mongoose.

### backend/src/models/

```txt
models/
  Job.model.js
  User.model.js
  Resume.js
```

#### Job.model.js

Defines the job listing schema.

Important fields:

- `jobRole`
- `jobUrl`
- `companyName`
- `companyLogo`
- `companyRating`
- `experience`
- `location`
- `description`
- `postedAt`
- `skills`

These fields power Explore page cards, filters, MongoDB candidate retrieval, and scoring.

#### User.model.js

Stores the public candidate profile and parsed resume data.

Important fields:

- `publicClientId`
- `resumeUrl`
- `resumePublicId`
- `resumeText`
- `headline`
- `skills`
- `normalizedSkills`
- `preferredRoles`
- `industries`
- `yearsOfExperience`
- `education`
- `experience`
- `projects`
- `keywords`
- `atsScores`

This schema is important because `/matches` uses the stored resume profile instead of requiring the frontend to send resume text again.

#### Resume.js

Reserved model for resume-specific data if the project later separates resumes from user profiles.

### backend/src/routes/

```txt
routes/
  upload.routes.js
  jobs.routes.js
  dashboard.routes.js
  recommendation.routes.js
```

#### upload.routes.js

Handles resume and matching routes.

Key routes:

```txt
GET    /me
POST   /resume
POST   /matches
DELETE /resume
POST   /ats-scores
```

Important project flow:

- `POST /resume` uploads and parses the resume.
- `POST /matches` generates recommendations from the stored resume.

#### jobs.routes.js

Handles job listing upload and retrieval.

Used by:

- Job upload page
- Explore page
- Dashboard summaries
- Matching system candidate database

#### dashboard.routes.js

Handles dashboard metrics and analytics data.

#### recommendation.routes.js

Reserved or legacy recommendation route file.

### backend/src/controllers/

```txt
controllers/
  upload.controller.js
  match.controller.js
  job.controller.js
  dashboard.controller.js
  ai.controller.js
```

#### upload.controller.js

Handles resume upload, resume deletion, current public user lookup, and ATS score calculation.

Main resume upload process:

```txt
Client uploads PDF
  -> Multer receives file in memory
  -> pdf-parse extracts resume text
  -> AI utility extracts structured profile
  -> Profile is normalized
  -> PDF is uploaded to Cloudinary
  -> User document stores resume URL, resume text, and parsed fields
```

Why this matters:

- Resume parsing happens once.
- Parsed data is stored for reuse.
- Matching endpoint can work from backend state.

#### match.controller.js

Controls the main AI job recommendation pipeline.

Flow:

```txt
Find public user by x-public-client-id
  -> Check stored resumeText exists
  -> Parse/normalize resume profile
  -> Retrieve candidate jobs from MongoDB
  -> Score candidates locally
  -> Keep high-confidence jobs or fallback to best scored jobs
  -> Send scored jobs to LLM reranker
  -> Merge AI explanation with DB job data
  -> Save ATS-style scores on user profile
  -> Return profile, career insights, and jobs
```

This controller is the center of the hybrid matching architecture.

#### job.controller.js

Handles job listing upload and retrieval.

Used by the Upload Jobs page and Explore page.

#### dashboard.controller.js

Builds dashboard analytics from available job data.

#### ai.controller.js

Contains AI-related controller logic or older matching helper flow.

### backend/src/utils/ai/

```txt
utils/
  ai/
    extractResumeProfile.js
    retrieveCandidateJobs.js
    scoreJob.js
    rankJobs.js
```

This folder contains the core AI matching engine.

#### extractResumeProfile.js

Uses Groq to extract structured resume data.

Expected output includes:

- Name
- Headline
- Contact details
- Skills
- Soft skills
- Preferred roles
- Industries
- Years of experience
- Education
- Experience
- Certifications
- Projects
- Keywords

It also normalizes skills into `normalizedSkills`, combining:

- Explicit skills
- Resume keywords
- Project technologies
- Experience technologies

Fallback behavior:

If `GROQ_API_KEY` is missing or parsing fails, the utility still extracts a basic profile using known skill keywords. This keeps the app usable in development.

#### retrieveCandidateJobs.js

Retrieves likely matching jobs from MongoDB.

It searches using:

- Normalized skills
- Preferred roles
- Resume keywords in job descriptions

If no targeted candidates are found, it falls back to recent or available jobs from the database.

Why this exists:

- It reduces the number of jobs sent into scoring/reranking.
- It keeps the system scalable.
- It avoids asking the LLM to process the full job database.

#### scoreJob.js

Local deterministic scoring engine.

Score components:

```txt
Skill match       -> 50 points
Preferred role    -> 20 points
Experience fit    -> 15 points
Location fit      -> 5 points
Industry match    -> 5 points
Education bonus   -> 5 points
```

The final score is capped at 100.

Why this exists:

- Scores are repeatable.
- Business logic is transparent.
- The LLM cannot randomly change the numeric match percentage.

#### rankJobs.js

Uses Groq to rerank already-scored jobs and generate explanations.

The LLM returns:

- Career summary
- Overall advice
- Ranked jobs
- Fit reason
- Strengths
- Missing skills
- Interview chance

Fallback behavior:

If the LLM is unavailable, the app returns local ranking with generated fallback explanations.

### backend/src/middleware/

```txt
middleware/
  multer.js
  responseHandler.js
```

#### multer.js

Configures file upload handling for resume PDFs.

#### responseHandler.js

Adds consistent response helpers:

```txt
res.success(statusCode, message, data)
res.error(statusCode, message, error)
```

Also provides the global error handler.

### backend/src/services/

```txt
services/
  resumeAI.service.js
  recommendation.service.js
```

These files contain service-level or legacy recommendation logic. The current main AI matching flow is handled through `utils/ai` and `match.controller.js`.

## Frontend Folder Structure

### frontend/src/App.jsx

Defines application routes and page layout.

Main pages:

- Dashboard
- Explore
- Upload Jobs
- AI Matches
- Profile

### frontend/src/main.jsx

React app entry point.

Mounts the app and Redux provider.

### frontend/src/index.css

Global Tailwind and theme styles.

Defines colors such as:

- `ink`
- `muted`
- `panel`
- `violet`
- `mint`

Also defines the global dark background and glass UI style.

### frontend/src/app/

```txt
app/
  store.js
```

Configures Redux Toolkit store.

Registered slices:

- `jobs`
- `profile`
- `dashboard`
- `aiMatches`

### frontend/src/features/

```txt
features/
  jobSlice.js
  profileSlice.js
  dashboardSlice.js
  aiMatchSlice.js
```

#### jobSlice.js

Handles job listing fetch state.

Used by:

- Explore page
- Job cards
- Dashboard job data

#### profileSlice.js

Handles candidate profile and ATS score state.

Used by:

- Profile page
- Resume upload/profile display

#### dashboardSlice.js

Handles dashboard metric state.

Used by:

- Dashboard page
- Charts
- Metric cards

#### aiMatchSlice.js

Handles the AI matching flow state.

Async actions:

```txt
uploadResumeForMatches(file)
generateAiMatches()
```

State includes:

- Uploaded resume/profile
- AI-ranked jobs
- Career summary
- Overall advice
- Uploading state
- Matching state
- Candidate/scoring metadata
- Errors

This slice enforces the two-call frontend contract:

```txt
POST /resume
POST /matches
```

### frontend/src/pages/

```txt
pages/
  DashboardPage.jsx
  ExplorePage.jsx
  UploadPage.jsx
  MatchesPage.jsx
  ProfilePage.jsx
```

#### DashboardPage.jsx

Shows high-level job market analytics and charts.

#### ExplorePage.jsx

Shows searchable and filterable job cards.

Current filter UX:

- Search box filters by role, company, location, and skills.
- Filter panel supports job title, company, location, experience, salary, and posted date.
- Source filter was removed because it was not part of the useful job matching criteria.
- Filters update job cards in real time.

#### UploadPage.jsx

Allows uploading job listings from CSV/XLSX files and sending them to the backend.

This page is for job data ingestion, not candidate resume upload.

#### MatchesPage.jsx

Main AI matching page.

Flow:

```txt
Upload resume
  -> Parse resume
  -> Generate AI matches
  -> Show career insights
  -> Show ranked job recommendations
```

The page shows the matching pipeline:

- Resume Upload
- AI Resume Parsing
- Candidate Retrieval
- Local Scoring
- LLM Re-ranking

It also renders:

- Match score
- Company and location
- AI reason
- Strengths
- Skill gaps
- Interview chance
- Apply link

#### ProfilePage.jsx

Shows the candidate profile extracted from the resume, resume actions, skills, and role compatibility scores.

### frontend/src/components/

```txt
components/
  dashboard/
  jobs/
  profile/
  ui/
```

#### components/ui/

Shared UI building blocks.

```txt
Card.jsx
PageIntro.jsx
```

#### components/jobs/

Job list/card-related components.

#### components/profile/

Resume upload and profile UI components.

```txt
ResumeActions.jsx
ResumeCard.jsx
ResumeUpload.jsx
ResumeUploaded.jsx
```

#### components/dashboard/

Dashboard metric components.

### frontend/src/layout/

```txt
layout/
  AppLayout.jsx
  Sidebar.jsx
```

Defines the main application shell and sidebar navigation.

### frontend/src/charts/

```txt
charts/
  MarketTrendChart.jsx
  SkillDemandChart.jsx
```

Reusable chart components for dashboard analytics.

### frontend/src/utils/

```txt
utils/
  api.js
```

Configures Axios.

Important behavior:

- Uses the backend base URL from environment variables.
- Sends `x-public-client-id` with every request.

The public client ID lets the backend associate resume uploads and matches with the same browser session without requiring a full authentication flow.

### frontend/src/data/

Contains local dashboard fallback or seed-style display data.

### frontend/src/assets/

Contains local frontend assets.

## Main API Flow

### 1. Upload Resume

Frontend:

```txt
POST /resume
```

Backend:

```txt
upload.routes.js
  -> upload.controller.js
  -> pdf-parse
  -> extractResumeProfile.js
  -> normalizeResume()
  -> Cloudinary upload
  -> User model save
```

Response:

- Parsed user profile
- Resume URL
- Extracted skills
- Stored resume text availability

### 2. Generate AI Matches

Frontend:

```txt
POST /matches
```

Backend:

```txt
match.controller.js
  -> find public user
  -> use stored resumeText
  -> extract/normalize profile
  -> retrieveCandidateJobs()
  -> scoreJob()
  -> rankJobs()
  -> save atsScores
  -> return ranked jobs and insights
```

Response:

- Parsed profile
- Career summary
- Overall advice
- Candidate counts
- AI-ranked jobs

## Environment Variables

Backend environment variables typically include:

```txt
PORT=
MONGO_URI=
FRONTEND_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GROQ_API_KEY=
```

Frontend environment variables typically include:

```txt
VITE_BACKEND_LOCAL_URL=
```

## Running The Project

Install dependencies separately for backend and frontend.

```txt
cd backend
npm install
npm start
```

```txt
cd frontend
npm install
npm run dev
```

## Build Verification

Frontend production build:

```txt
cd frontend
npm run build
```

Single-file frontend lint example:

```txt
cd frontend
npx eslint src/pages/ExplorePage.jsx
```

Backend syntax check example:

```txt
cd backend
node --check src/controllers/match.controller.js
```

## Design Decisions Summary

- Resume upload and matching are separate because parsing is expensive and should not happen repeatedly.
- The frontend only needs two calls for the AI matching flow: `/resume` and `/matches`.
- MongoDB retrieval narrows the job search space before AI is used.
- Local scoring creates stable, explainable match percentages.
- LLM reranking improves recommendation quality without controlling the final numeric score.
- Fallback logic keeps the app usable even when the LLM API key is missing or the model response fails.
- The Explore page remains fast because search and filters run in memory against the loaded job list.

## Current User Experience

1. Upload job listings from CSV/XLSX into MongoDB.
2. Explore jobs with real-time search and filters.
3. Upload a resume on AI Matches or Profile.
4. Let the backend parse and store the resume.
5. Click Generate AI Matches.
6. Review ranked jobs, match scores, skill strengths, gaps, and career advice.

## Future Improvements

- Add authentication for persistent user accounts.
- Add saved jobs and application tracking.
- Add semantic embeddings for stronger candidate retrieval.
- Cache parsed resume profiles to avoid re-parsing during `/matches`.
- Add advanced filter presets in Explore.
- Add job recommendation history.
- Add admin dashboard for job ingestion quality.
