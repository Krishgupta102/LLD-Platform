# AI Usage & Engineering Judgement Log

This document records key architectural and implementation decisions where AI suggestions were evaluated, filtered, and refined using engineering judgement.

---

## 1. Evaluator Interface & Provider Abstraction

### What AI Suggested
Initially, AI proposed calling the Gemini SDK directly inside the Next.js Route Handler (`src/app/api/attempts/[id]/submissions/route.ts`), combining database updates, prompt formatting, and LLM calls in a single monolithic handler function.

### What We Accepted
* Interface definition for `LLMProvider` (`complete(prompt: string): Promise<string>`).
* Interface definition for `Evaluator` (`evaluate(submission, problem): Promise<EvaluationResult>`).

### What We Rejected
* Direct SDK coupling inside API route handlers.
* Mixing prompt generation with database persistence.

### Engineering Judgement Applied
Decoupling the AI vendor via the `LLMProvider` interface ensures that swapping Gemini for OpenAI, Anthropic, or a local Llama model requires zero changes to application services or UI components. Moving evaluation logic into dedicated infrastructure classes (`AIEvaluator`, `RuleBasedEvaluator`) maintains Clean Architecture boundaries.

---

## 2. Structured LLM Output with Zod Validation

### What AI Suggested
AI suggested trusting the LLM's raw JSON output directly and parsing it with standard `JSON.parse()`, assuming the model would always comply with markdown code block formatting.

### What We Accepted
* Configuring `responseMimeType: 'application/json'` in `GeminiProvider.ts`.
* Rubric dimension mapping structure (evidence, concern, suggestion, confidence).

### What We Rejected
* Blind trust of unvalidated JSON parsing without schema runtime enforcement.

### Engineering Judgement Applied
LLMs can emit malformed JSON, missing properties, or hallucinated criterion names. We added strict runtime validation using Zod (`aiEvaluationSchema.parse(json)`) in [`AIEvaluator.ts`](file:///Users/krishgupta/Documents/LLD-Practice-Platform/src/infrastructure/evaluation/AIEvaluator.ts#L131-L142). If parsing fails, the system safely catches the exception and transitions the attempt status to `FAILED` with detailed diagnostic error messages.

---

## 3. Hybrid Evaluation Architecture (Deterministic + AI)

### What AI Suggested
AI recommended sending every submission directly to the LLM regardless of content quality or length.

### What We Accepted
* Multi-stage evaluation workflow.

### What We Rejected
* Invoking high-latency, cost-bearing LLM API calls for empty or trivial submissions ("asdf", single-word answers).

### Engineering Judgement Applied
We introduced [`RuleBasedEvaluator`](file:///Users/krishgupta/Documents/LLD-Practice-Platform/src/infrastructure/evaluation/RuleBasedEvaluator.ts) as a deterministic Tier-1 check. If a submission lacks required sections or contains fewer than 20 characters per section, `RuleBasedEvaluator` immediately yields a score of 0 with actionable deterministic feedback. This saves API costs, reduces latency, and guarantees deterministic enforcement of minimum design standards.

---

## 4. Discriminated Union for Submission Formats

### What AI Suggested
AI suggested creating separate database tables for `TextSubmission`, `DiagramSubmission`, and `CodeSubmission`.

### What We Accepted
* Flexible payload storage using JSON content in the `Submission` database model.

### What We Rejected
* Premature database schema normalization across separate tables for unreleased submission types.

### Engineering Judgement Applied
We implemented a discriminated union type in domain models ([`src/domain/submission/types.ts`](file:///Users/krishgupta/Documents/LLD-Practice-Platform/src/domain/submission/types.ts#L10-L26)) with `format` (`TEXT | DIAGRAM`) and `type: 'TEXT'` discriminators. This allows expanding to PlantUML or graphical diagrams by adding new TypeScript interface variants without running complex database schema migrations.

---

## 5. Persistent Submission & Fire-and-Forget Evaluation State Machine

### What AI Suggested
AI suggested executing evaluation synchronously during the `POST /api/attempts/[id]/submissions` request, forcing the learner to wait 5–10 seconds before receiving a response.

### What We Accepted
* State machine status flags (`DRAFT`, `SUBMITTED`, `EVALUATING`, `COMPLETED`, `FAILED`).

### What We Rejected
* Synchronous HTTP blocking during long-running LLM calls.

### Engineering Judgement Applied
To ensure high user responsiveness, we split the workflow into:
1. **Atomic Database Transaction**: Persists `Submission` record and updates attempt state to `SUBMITTED`.
2. **Background Async Execution**: Fires `processEvaluation(attemptId)` asynchronously while returning an immediate `200 OK` response to the client.
3. **Client Polling UI**: [`FeedbackClient`](file:///Users/krishgupta/Documents/LLD-Practice-Platform/src/app/attempts/%5Bid%5D/feedback/FeedbackClient.tsx) polls evaluation status until `COMPLETED` or `FAILED`, displaying an animated loading state.
