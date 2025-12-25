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

### 2. Environment Variables (Firebase Studio & Vercel)

To run the application, you need to configure several environment variables. Create a `.env.local` file in your root directory by copying `.env.example`:

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local` with your credentials. These variables are required for both local development (via Firebase Studio) and Vercel deployments.

<<<<<<< HEAD
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
=======
**Required Variables:**
>>>>>>> 8b5b253 (You are Firebase Studio working on repo: besfeng23/Project-Partner.)

```
# Firebase Client Configuration (public keys)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin Configuration (server-side only)
# IMPORTANT: This is a secret. Paste the entire JSON content as a single line.
FIREBASE_SERVICE_ACCOUNT_KEY=

# Genkit/Gemini AI Configuration (server-side only)
GEMINI_API_KEY=
```

#### **Setting Variables in Firebase Studio**

1.  In the Firebase Studio IDE, navigate to **Project Settings** (the gear icon in the left sidebar).
2.  Go to the **Environment Variables** section.
3.  Add each of the variables listed above.
4.  Restart the preview server for the changes to take effect.

#### **Setting Variables on Vercel**

1.  Navigate to your Vercel Project → **Settings** → **Environment Variables**.
2.  Add each variable from your `.env.local` file.
3.  **IMPORTANT**: For each variable, ensure you select the **Production**, **Preview**, and **Development** environments. The app will not work if the variables are not available in all environments.
4.  After adding the variables, you must **redeploy** your application for the changes to take effect.

<<<<<<< HEAD
5.  After adding the variables, you must **redeploy** your application for the changes to take effect.

### 4. Install Dependencies
>>>>>>> 0ae23be (You are Firebase Studio working on repo: besfeng23/Project-Partner.)
=======
### 3. Install Dependencies
>>>>>>> 8b5b253 (You are Firebase Studio working on repo: besfeng23/Project-Partner.)

```bash
npm install
```

### 4. Run the Development Server

The development server is managed by Firebase Studio. Use the "Run" button in the IDE to start the preview. The application will be available at a unique URL provided by the Studio.
