# Project Partner

Project Partner is a web application that acts as a long-term project copilot and control plane. It helps track projects, tasks, decisions, constraints, and artifacts, while integrating an AI "Project Partner" to provide optimized solutions and suggestions.

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend & Database**: Firebase (Authentication, Firestore, Storage)
- **AI**: Google Gemini via Genkit
- **Deployment**: Vercel (recommended)

## Getting Started

### 1. Prerequisites

- Node.js (v18 or later)
- Firebase Project
- Google AI API Key for Genkit

### 2. Setup Environment Variables

Copy the `.env.example` file to a new file named `.env.local` and fill in the required Firebase and AI credentials.

```bash
cp .env.example .env.local
```

You will need to create a Firebase project and get your web app's configuration keys. Enable Email/Password authentication in the Firebase console.

<<<<<<< HEAD
Required variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)
- `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON string for the Admin SDK; ensure newlines in `private_key` are encoded as `\n`)

### 3. Install Dependencies
=======
### 3. Vercel Setup

For the application to build and run correctly on Vercel, you must set the following environment variables in your Vercel project settings:

1.  Navigate to your Vercel Project → **Settings** → **Environment Variables**.
2.  Add each variable from your `.env.local` file.
3.  **IMPORTANT**: For each variable, ensure you select the **Production**, **Preview**, and **Development** environments. The app will not work if the variables are not available in all environments.
4.  The required variables are:
    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`
    - `FIREBASE_SERVICE_ACCOUNT_KEY` (as a single JSON string)
    - `GEMINI_API_KEY`

5.  After adding the variables, you must **redeploy** your application for the changes to take effect.

### 4. Install Dependencies
>>>>>>> 0ae23be (You are Firebase Studio working on repo: besfeng23/Project-Partner.)

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.
