# Low-Level Design (LLD) Practice & Evaluation — Research Note

## 1. Learner Problem
Low-Level Design (LLD) / Object-Oriented Design (OOD) is a critical component of software engineering interviews and real-world system architecture. Unlike algorithmic coding problems (e.g., LeetCode), where automated unit tests provide binary pass/fail feedback, LLD practice lacks instant, objective feedback mechanisms. 

Learners struggle with:
* **Lack of instant feedback**: Self-evaluating OOD solutions requires expert intervention or mock interviews.
* **Ambiguity in "Good Design"**: There is rarely a single "correct" solution in object-oriented design; trade-offs and abstraction boundaries vary.
* **Incomplete submissions**: Candidates frequently focus on basic class attributes while omitting interfaces, concurrency edge cases, and design trade-offs.

## 2. Common Approaches to LLD Practice
Traditionally, engineers practice LLD using three primary modalities:
1. **Reading Design Pattern Books & Static Diagrams**: Studying Gang of Four (GoF) patterns or reading static solution articles (e.g., "How to Design a Parking Lot").
2. **Peer Mock Interviews**: Partnering with peers on platforms like Pramp or Interviewing.io for live whiteboarding.
3. **Manual Solution Writing on Paper/Notion**: Drafting class diagrams and requirements manually without structured validation.

## 3. Existing Tools & Benchmarks
* **Educational Platforms (Educative.io / Grokking the Low Level Design Interview)**: Provide comprehensive text explanations and reference class diagrams, but offer static, non-interactive exercises.
* **System Design Repositories (GitHub `donnemartin/system-design-primer`)**: Serve as excellent reference guides but provide no submission validation or personalized feedback.
* **Generic LLMs (ChatGPT / Claude)**: Learners prompt general AI models for feedback, but receive unstructured, uncalibrated praise or overly broad advice without consistent rubric dimensions.

## 4. Identified Gaps
* **No Standardized Rubric**: Existing tools rarely evaluate designs across standard architectural dimensions (Requirement Coverage, Encapsulation, Interface Design, Extensibility, Edge Cases).
* **Binary vs Nuanced Feedback**: Simple scoring (e.g., "7/10") fails to explain *why* a design choice is weak or *how* to improve it.
* **Lack of Evidence-Based Analysis**: Feedback often provides generic recommendations without citing specific evidence from the user's submitted design.

## 5. Product Direction
LLD Coach addresses these gaps by providing:
1. **Curated Problem Specifications**: Clear functional requirements and fixed evaluation rubrics per problem.
2. **Guided Evidence Collection**: Multi-section submission forms forcing learners to explicitly document classes, abstractions, relationships, trade-offs, and edge cases.
3. **Hybrid Evaluation Engine**: Deterministic section presence checks paired with an LLM evaluator generating evidence-backed feedback.

## 6. Why MVP Focuses on Structured Text Submission
While graphical UML diagrams (e.g., Draw.io, PlantUML) are visually appealing, text-based structured submissions were chosen for the MVP for key architectural reasons:
* **Precision in Object Modeling**: Forcing learners to articulate class responsibilities, interfaces, and trade-offs in structured text prevents ambiguous visual representations.
* **Parsing Reliability**: Structured text fields map cleanly into LLM prompts without visual OCR errors or diagram parsing ambiguities.
* **Extensibility**: The domain model uses a discriminated union (`type: 'TEXT'`), allowing visual diagram submission formats (e.g., PlantUML or JSON graphs) to be added without breaking core practice flows.

## 7. Why Evidence-Based Rubric Feedback Beats Simple Scoring
A single numerical score is insufficient for architectural learning. Learners need:
* **Observed Evidence**: Direct quotes or references from their design proving the evaluator analyzed their actual submission.
* **Specific Concerns**: Precise identification of missing patterns, tight coupling, or unhandled edge cases.
* **Actionable Suggestions**: Concrete refactoring recommendations (e.g., "Extract `ParkingStrategy` interface from `Gate`").
* **Confidence Representation**: Explicit confidence metrics indicating the reliability of automated evaluation.
