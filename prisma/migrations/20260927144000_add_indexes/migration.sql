-- CreateIndex
CREATE INDEX "Requirement_problemId_idx" ON "Requirement"("problemId");

-- CreateIndex
CREATE INDEX "Rubric_problemId_idx" ON "Rubric"("problemId");

-- CreateIndex
CREATE INDEX "RubricCriterion_rubricId_idx" ON "RubricCriterion"("rubricId");

-- CreateIndex
CREATE INDEX "Attempt_problemId_idx" ON "Attempt"("problemId");

-- CreateIndex
CREATE INDEX "Attempt_userId_idx" ON "Attempt"("userId");

-- CreateIndex
CREATE INDEX "EvaluationResult_evaluationId_idx" ON "EvaluationResult"("evaluationId");
