# 🛠️ KaamNearby (कामNearby)

> **"Work nearby. Get hired simply." / "नज़दीक काम पाएं, आसानी से जुड़ें।"**

A hyperlocal, voice-first job matching web platform connecting semi-skilled workers, daily-wage laborers, and informal workers directly with nearby shops, contractors, and households in Bengaluru without resumes, lengthy forms, or English-centric interfaces.

---

- **Dual Operating Modes**:
  - **Demo Mode**: Instant offline operation using browser `localStorage` and a rich seed dataset of 14 realistic Bengaluru job listings.
---

## 🚀 Core Implemented MVPs

### MVP 1 — Hyperlocal Job Discovery
- Browse jobs with visual trade category tiles (Electrician, Plumber, Helper, Cook, Painter, Driver, etc.).
- Search by trade, skill, or area.
- Sort by **Nearest First**, **Highest Wage**, or **Newly Added**.
- Clear cards emphasizing wage (₹/day, ₹/month) and location.

### MVP 2 — Location-Based Matching
- Browser geolocation integration with permission handling.
- Real-time Haversine distance calculations in kilometers (e.g. `1.2 km away` / `1.2 किमी दूर`).
- Distance radius filter pills (`2 km`, `5 km`, `10 km`, `Any distance`).
- Locality fallback for Bengaluru areas (Marathahalli, Whitefield, Bellandur, KR Puram, Varthur, Hoodi, HSR Layout, Mahadevapura) if GPS is denied or unavailable.

### MVP 3 — Simple Job Posting for Employers
- Clean, guided "Hire Workers / Post a Job" form.
- Form fields: Title, trade category, vacancies, wage amount & frequency (day/month/hour/contract), locality, address, hours, duration, start date, description, employer name, phone number, and urgent hiring flag.
- Validates essential fields and immediately publishes to listings in real-time.

### MVP 4 — One-Tap Job Application (No Resume)
- Simple worker profile: Name, 10-digit mobile number, skills, and locality.
- Click "Apply Now" to open a simple 1-tap confirmation modal.
- Includes KaamVoice spoken confirmation before final submission.
- Prevents duplicate applications from the same worker phone number.
- Applications appear immediately in the Employer Dashboard.

### MVP 5 — Worker-Friendly, Mobile-First UI
- Designed specifically for low digital literacy on mobile screens.
- Large touch targets (48px+), high-contrast readability, simple vocabulary.
- Indian-inspired color palette: Primary green (`#237A4B`), dark green (`#185C38`), soft green (`#E8F3E9`), warm yellow (`#F4C84A`), and neutral background (`#F7F8F3`).
- Lucide icon set with clear dual-language labels.
- Mobile bottom navigation bar for quick access: Search, Post Job, My Applications, Employer, Profile.

### MVP 6 — Voice-Based Job Search
- Web Speech API speech recognition with a large pulsing microphone button.
- Supports natural spoken queries in English (`en-IN`) and Hindi (`hi-IN`).
- Automatically filters out conversational filler phrases ("Find electrician work near me" ➔ searches "electrician").
- Live transcript preview with one-tap search execution and graceful fallback if microphone permission is denied.

### Additional Support Features
- **Language Selector**: English, हिंदी (Hindi), and ಕನ್ನಡ (Kannada) with comprehensive translation dictionaries.
- **Worker Profile**: Edit and persist name, phone, trade skills, and preferred area.
- **Employer Dashboard**: Metrics (total, active, filled, applicants), job status toggles (Active / Filled), delete job, view applicant list with one-tap call buttons and hiring actions (Shortlist, Hire 🎉, Reject).
- **My Applications Tracker**: View submitted applications with real-time status badges (Applied, Shortlisted, Hired, Rejected).

---

## 📂 Project Structure

```
kaam-nearby/
├── server/
│   ├── index.js             # Express REST API (Jobs, Applications, ElevenLabs TTS endpoint)
│   ├── lambda.js            # AWS Lambda entry handler for API Gateway
│   ├── awsConfig.js         # DynamoDB & S3 configuration / local adapter
│   └── ttsService.js        # ElevenLabs Text-to-Speech service & in-memory audio caching
├── src/
│   ├── types/
│   │   └── index.ts         # TypeScript definitions (Job, Application, WorkerProfile, Language)
│   ├── data/
│   │   ├── localities.ts    # Bengaluru localities with geographical coordinates
│   │   ├── categories.ts    # Trade categories with Lucide icons & color accents
│   │   └── initialJobs.ts   # 14 realistic Bengaluru demo job listings
│   ├── utils/
│   │   ├── distance.ts      # Haversine distance calculator & formatting
│   │   ├── storage.ts       # LocalStorage persistence & seed management
│   │   ├── api.ts           # Unified API client (Demo Mode vs Cloud Mode)
│   │   ├── speech.ts        # Web Speech API recognition engine
│   │   └── audio.ts         # KaamVoice ElevenLabs audio player + browser TTS fallback
│   ├── i18n/
│   │   └── translations.ts  # Full translation dictionary for EN, HI, KN
│   ├── context/
│   │   ├── LanguageContext.tsx  # Global language provider
│   │   ├── LocationContext.tsx  # GPS & locality selector provider
│   │   └── AppContext.tsx       # Jobs, applications & profile provider
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx           # Header with language picker & mode indicator
│   │   │   ├── BottomNav.tsx        # Touch-friendly bottom bar for mobile
│   │   │   ├── LocationModal.tsx    # Locality picker & GPS prompt
│   │   │   ├── VoiceSearchModal.tsx # Pulsing microphone voice search dialog
│   │   │   └── KaamVoicePlayer.tsx  # ElevenLabs audio player with play/pause/replay
│   │   ├── jobs/
│   │   │   ├── JobCard.tsx          # High-contrast wage emphasis card
│   │   │   ├── JobFilters.tsx       # Category icons & distance filter pills
│   │   │   └── ApplyModal.tsx       # 1-tap application dialog with spoken confirmation
│   │   └── layout/
│   │       └── Footer.tsx           # Trust & safety banner & reset demo data
│   ├── pages/
│   │   ├── HomePage.tsx             # Home landing with hero voice search & urgent jobs
│   │   ├── JobListingsPage.tsx      # Browse & filter jobs
│   │   ├── JobDetailsPage.tsx       # Job details with KaamVoice audio player
│   │   ├── PostJobPage.tsx          # Employer post-a-job form
│   │   ├── WorkerProfilePage.tsx    # Edit worker profile & skills
│   │   ├── EmployerDashboardPage.tsx# Employer job management & applicant reviewer
│   │   └── MyApplicationsPage.tsx   # Worker application tracker
│   ├── App.tsx                      # Router & layout shell
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Tailwind CSS directives & mobile touch styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router v6.
- **Audio & Voice AI**
- **Backend & Cloud**: Node.js, Express.
- **Storage**: `localStorage` (Demo Mode) .

---

## ⚡ Instructions to Run Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 2. Install Dependencies
```bash
cd kaam-nearby
npm install
```

### 3. Environment Variables (Optional)
To enable cloud ElevenLabs voice synthesis, create a `.env` file in the project root:
```env
PORT=5000
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```
*(If no API key is set, the app will automatically and seamlessly use browser SpeechSynthesis in Hindi and English).*

### 4. Run the Application
You can run the frontend and backend together:

**Option A — Run Both Backend and Frontend:**
```bash
# Terminal 1: Run Backend API Server
npm run server

# Terminal 2: Run Vite Frontend Dev Server
npm run dev
```

**Option B — Run Frontend in Standalone Demo Mode:**
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 📱 Mobile & Android APK Compatibility
The codebase is structured to be wrapped seamlessly into an Android APK using **Capacitor**:
- Clean separation between core logic (`utils/`, `context/`) and presentation (`components/`).
- Standard Web APIs (`navigator.geolocation`, `window.SpeechRecognition`) with native Capacitor plugin equivalents (`@capacitor/geolocation`, `@capacitor-community/speech-recognition`).
- No browser-specific DOM dependencies that block webview packaging.

---

## 🧪 Verification & Automated Testing

- **TypeScript Compilation**: Passed (`tsc --noEmit` exits with 0 errors).
- **Vite Production Build**: Passed (`vite build` created optimized chunks in `dist/`).
- **Backend API Integration**: Verified with automated tests covering:
  - `GET /api/health` ➔ Status 200 (healthy)
  - `GET /api/jobs` ➔ Status 200 (retrieves seeded jobs)
  - `POST /api/jobs` ➔ Status 201 (validates & creates new job)
  - `POST /api/applications` ➔ Status 201 (records 1-tap application)
  - Duplicate application prevention ➔ Status 409 Conflict
  - `POST /api/voice/tts` ➔ Fallback handled gracefully when unconfigured
