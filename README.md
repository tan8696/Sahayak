# SAHAYAK: The Zero-UI Digital Co-Teacher 🎤

**Live Demo:** [https://sahayak-9xy31hq8j-imagodpro.vercel.app/]

Sahayak is an offline-first Progressive Web App (PWA) designed to act as an autonomous digital co-teacher for single-teacher, multi-grade rural classrooms. It bypasses the need for high-speed internet and digital literacy by shifting computation to the edge and utilizing a Zero-UI voice interface.

## 🛠️ Tech Stack
*   **Frontend:** React (Vite)
*   **Edge Architecture:** Workbox (Service Workers for offline caching)
*   **Database:** IndexedDB (Local in-browser NoSQL storage)
*   **Voice Engine:** Native Web Speech API (Speech-to-Text) & `window.speechSynthesis` (Text-to-Speech)
*   **Deployment:** Vercel

## ⚙️ Local Setup Instructions
1. Clone the repository: `git clone https://github.com/tan8696/Sahayak.git`
2. Navigate into the directory: `cd frontend`
3. Install dependencies: `npm install`
4. Start the local development server: `npm run dev`
5. *Note: To test the offline PWA capabilities locally, you must run a production build using `npm run build` followed by `npm run preview`.*

## 🏗️ Built vs. Mocked (Scope Disclosure)
To adhere to hackathon transparency guidelines, here is the exact scope of the project:

*   **Fully Built (Production Ready):** 
    * The PWA Service Worker caching architecture.
    * The IndexedDB gamification engine (XP streaks and score saving).
    * The two-way voice loop logic (Mic triggers, state management, UI shifts).
    * The dark mode "Modern Creator" UI layout and responsive design.
*   **Mocked (Demo Purpose):** 
    * The curriculum content. Instead of a massive database of real PDFs and videos, the lessons and quizzes are algorithmically generated via lightweight JSON to keep the edge application fast and prove the UX loop.
    * The "Simulate Offline" toggle. This is a UI switch built for judges to simulate network failure without needing to turn off their actual Wi-Fi during a demo.

## 🤖 Required AI Disclosures
The following AI tools and coding assistants were used to build this project:
*   **Antigravity:** Used as the primary IDE and coding assistant to scaffold the React components, write the CSS boilerplate, and debug the Vite configuration.
*   **GitHub Copilot:** Used for inline code completion and syntax suggestions during development.
*   **Gemini:** Used for architectural planning, debugging the Web Speech API lifecycle, and formatting the final presentation documents and pitch structure.
