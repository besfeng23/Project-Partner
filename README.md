# Project Partner

Project Partner is a web application that acts as a long-term project copilot and control plane. It helps track projects, tasks, decisions, constraints, and artifacts, while integrating an AI "Project Partner" to provide optimized solutions and suggestions.

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend & Database**: Firebase (Authentication, Firestore, Storage)
- **AI**: Google Gemini via Genkit
- **Deployment**: Vercel (recommended) / Firebase Hosting

## Project Structure

- `src/app/`: Next.js App Router pages.
  - `(main)/`: Route group for all authenticated pages.
  - `login/`: Public login page.
- `src/components/`: Reusable React components.
- `src/lib/`: Core utilities, Firebase configuration, and data types.
- `src/context/`: React context providers (e.g., AuthProvider).
- `src/hooks/`: Custom React hooks.
- `src/ai/`: Genkit AI flows and configuration.
- `firestore.rules`: Security rules for Firestore.
- `storage.rules`: Security rules for Firebase Storage.

## Getting Started

### 1. Prerequisites

- Node.js (v18 or later)
- Firebase Project
- Google AI API Key for Genkit

### 2. Setup Environment Variables

Copy the `.env.example` file to a new file named `.env.local` and fill in the required values.

```bash
cp .env.example .env.local
```

You will need to create a Firebase project and get your web app's configuration keys. Enable Email/Password authentication in the Firebase console.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## Memory Model

The AI's "memory" is explicitly persisted to Firestore to ensure long-term context and avoid reliance on ephemeral chat history.

- **Tasks, Decisions, Constraints, Artifacts**: All stored in their respective collections within a project.
- **Summaries**: Conversations are periodically summarized by an AI flow and stored in `memorySummaries`.
- **AI Interaction**: Before generating a response, the AI partner reads the latest project data from Firestore to ensure it has the most up-to-date context.

## Security

- **Authentication**: All pages except `/login` require authentication.
- **Firebase Rules**: Firestore and Storage are protected by security rules (`firestore.rules`, `storage.rules`). These rules enforce role-based access control (viewer, member, admin).
- **API Keys**: All AI calls are made server-side. No API keys are exposed to the client.

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com).

1.  Connect your Git repository to Vercel.
2.  Configure the environment variables in the Vercel project settings.
3.  Push to your main branch to trigger a deployment.

The application is also compatible with Firebase Hosting.
