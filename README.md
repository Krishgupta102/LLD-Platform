# LLD Coach — Low-Level Design Practice Platform

## Project Overview
LLD Coach is a focused web application designed to help learners repeatedly practice Low-Level Design (LLD) problems. The platform allows users to choose a problem, think and design a solution, submit it, receive AI-powered and deterministic evaluation feedback, and track their progress through previous attempts.

## Features
- **Problem Discovery**: Browse a curated set of LLD problems (e.g., Parking Lot, Vending Machine).
- **Practice Area**: Submit text-based LLD solutions detailing requirements, classes, interfaces, relationships, design trade-offs, and edge cases.
- **Evaluation Engine**: Uses a hybrid approach with deterministic checks and an LLM-based evaluator to provide structured, rubric-based feedback.
- **Attempt History**: Review past submissions, see scores across various dimensions, and retry problems to improve.

## Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js Route Handlers
- **Database**: PostgreSQL (Neon compatible)
- **ORM**: Prisma
- **Validation**: Zod
- **Testing**: Vitest/Jest (To be configured)
- **AI**: Abstracted Evaluator interface (ready for LLM provider integration)

## Architecture
This project follows a clean, modular monolith architecture to keep UI, application logic, domain logic, and infrastructure separated.

```
src/
  app/              # Next.js App Router (UI & Route Handlers)
  components/       # Reusable React components
  domain/           # Core domain models (Problem, Attempt, Submission, Evaluation)
  application/      # Application services and use cases
  infrastructure/   # External integrations (Database, AI Providers)
  lib/              # Shared utilities
  types/            # Global TypeScript types
```

## Setup Instructions

### Environment Variables
Create a `.env` file in the root directory based on `.env.example` (if provided). You will need:
- `DATABASE_URL`: Connection string for your PostgreSQL database.
- AI Provider keys (e.g., `OPENAI_API_KEY` or similar, depending on the chosen provider).

### Database Setup
Ensure you have a running instance of PostgreSQL.

1. **Apply Migrations**:
   ```bash
   npx prisma migrate dev
   ```
2. **Seed the Database** (Loads initial LLD problems):
   ```bash
   npx prisma db seed
   ```

### Development Commands
To start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## Testing
Tests will be located alongside the files or in a dedicated `__tests__` folder.
To run the test suite (once fully set up):
```bash
npm run test
```

## Deployment
The application is designed to be easily deployed to Vercel. Ensure your `DATABASE_URL` is set in Vercel's environment variables.

## Limitations
- **Submission Format**: Currently supports only text-based submissions (no custom UML/diagram editors in the MVP).
- **Authentication**: Uses a simple demo session/learner for the MVP to minimize scope.
- **Microservices**: None. This is intentionally built as a monolithic application without complex event buses or distributed infrastructure to stay focused on the core practice loop.
