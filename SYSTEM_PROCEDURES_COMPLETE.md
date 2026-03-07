# Native Learn Nexus — Complete System Procedures

> Compiled from source code + documentation. Intended as a reference for prompt crafting or system design work.
> All AI calls currently use **Google Gemini 2.5-pro** via `google-generativeai` Python SDK (temporary; target is a fine-tuned local model + RAG pipeline).

---

## Table of Contents

1. [Lesson Planning (with exact AI interference)](#1-lesson-planning)
2. [Timetables](#2-timetables)
3. [Test Generation (with exact AI interference)](#3-test-generation)
4. [Test Correction (with exact AI interference)](#4-test-correction)
5. [Vault — Storage of Lesson Plans](#5-vault--storage-of-lesson-plans)
6. [Student Notebooks (all interfering parts)](#6-student-notebooks)
7. [CNP Integration of Teacher Guidelines](#7-cnp-integration-of-teacher-guidelines)
8. [Advisor Review of Tests](#8-advisor-review-of-tests)
9. [Inspector Timetable and Assignment](#9-inspector-timetable-and-assignment)

---

## 1. Lesson Planning

### Overview

Teachers create lesson plans through three paths. All three ultimately call the same `AIService.generate_lesson()` backend function.

**Model: `Lesson`** (`backend/core/models.py`)

| Field | Type | Notes |
|-------|------|-------|
| `title` | CharField(255) | Lesson title |
| `content` | TextField | Full AI-generated or copied content |
| `subject` | CharField(50) | math, science, english, arabic, social_studies, art, music, physical_education, computer_science, religious_studies |
| `grade_level` | CharField(2) | `1`–`6` (Lesson model) or `grade_1`–`grade_12` (frontend may send either) |
| `created_by` | FK → User | Teacher who owns it |
| `school` | FK → School | Teacher's school |
| `scheduled_date` | DateField (nullable) | Timeline scheduling date |
| `vault_source` | FK → VaultLessonPlan (nullable) | If derived from vault |

---

### Path 1: Direct Form (Lessons Tab in Teacher Dashboard)

**Frontend:** Teacher Dashboard → "Lessons" tab (default tab 1 of 12)

**Form fields:**
- Lesson Title (optional; defaults to `"AI Generated: {first 50 chars of prompt}"`)
- Subject (dropdown, restricted to `TeacherGradeAssignment` for that teacher)
- Grade Level (dropdown, restricted to teacher's assigned grades)
- Prompt (textarea, 5 rows — teacher describes what the lesson should cover)

**Button:** "✨ Generate" (disabled if prompt is empty, no subject selected, or no active assignments)

**API Call:** `POST /api/lessons/generate/`

**Backend flow (`LessonViewSet.generate`, `backend/core/views.py`):**

```
1. Validate teacher has active TeacherGradeAssignment for requested subject
   → if none: HTTP 403 "You have no active subject assignments"
   → if subject not in assignments: HTTP 403 "You can only create lessons for..."

2. ai_service = get_ai_service()
3. content = ai_service.generate_lesson(prompt, subject, grade_level)
4. Lesson.objects.create(title, content, subject, grade_level, created_by, school)
5. Return { lesson_id, lesson, content }
```

---

### EXACT AI Interference — `AIService.generate_lesson()`

**File:** `backend/core/ai_service.py`

**Model called:** `gemini-2.5-pro` via `genai.GenerativeModel`

**Exact prompt sent to Gemini:**

```
You are an expert educational content creator. Generate a comprehensive lesson based on the following request:

Subject: [Mathematics / Science / etc.]
Grade Level: [1st Grade / 2nd Grade / etc.]

[Teacher's prompt text]

Please structure the lesson with:
1. A clear title
2. Learning objectives appropriate for the grade level
3. Detailed content explanation tailored to the subject and grade
4. Examples where appropriate
5. Practice questions or activities suitable for the grade level

Format the content in a clear, educational manner suitable for students at this grade level.
Make sure the difficulty and vocabulary are age-appropriate.
```

**Output:** Plain text stored in `Lesson.content` (structured as: title, learning objectives, content, examples, practice questions/activities).

**Return value:** `response.text` (the raw Gemini plain-text response).

---

### Path 2: AI Chatbot (Conversational)

**Frontend:** `/chat` page (separate from dashboard)

**API Call:** `POST /api/chatbot/conversations/chat/`

**Class:** `GeminiTeachingAssistant` (`backend/core/gemini_service.py`)

**How it works:**

```
1. Teacher sends natural-language message:
   e.g. "Create a lesson about fractions for 3rd grade"

2. GeminiTeachingAssistant.chat() sends the message + conversation history (last 3 exchanges)
   to gemini-2.5-pro with a system prompt that defines available function calls.

3. Gemini responds with natural text + a function call block:
   FUNCTION_CALL: create_lesson_plan
   {
     "title": "Introduction to Fractions",
     "subject": "math",
     "grade_level": "3",
     "prompt": "Teach 3rd grade students about fractions..."
   }

4. The backend parses the FUNCTION_CALL block from the response text.

5. GeminiTeachingAssistant.create_lesson_plan() dispatches to:
   AIService.generate_lesson(prompt, subject, grade_level)
   → same function as Path 1

6. Lesson object created in database.
   The function result is injected back into the chatbot response text.

7. Conversation persisted in ChatConversation + ChatMessage models.
```

**Chatbot's other capabilities (all text-based function calling):**
- `list_lessons` — queries teacher's lessons from DB
- `generate_quiz` — creates personalized MCQ/QA tests per student based on Portfolio performance
- `analyze_student_performance` — reads Portfolio data, generates reports

**Personalized quiz logic:** reads `Portfolio.get_subject_statistics()` per student → maps performance to difficulty:
- `< 40%` → easy, `40–60%` → medium, `60–80%` → medium-hard, `> 80%` → hard

---

### Path 3: Via Vault (Copy or AI-Enhanced)

See [Section 5 — Vault](#5-vault--storage-of-lesson-plans) for full detail.

Two sub-paths:
- **Direct copy:** `POST /api/vault-lesson-plans/{id}/use_plan/` — copies vault plan as-is
- **AI-enhanced:** `POST /api/vault-lesson-plans/{id}/generate_lesson/` — uses vault plan metadata as context and calls `AIService.generate_lesson()` with an extended prompt

---

### Chapter Change Detection (AI side-effect)

Every time a teacher creates a lesson (any path), the backend calls `_detect_chapter_change()`:

```python
# After Lesson.objects.create(...)
if request.user.role == 'teacher':
    self._detect_chapter_change(lesson)
```

**What it does:**

```
1. Gets or creates a TeacherProgress record (teacher + subject + grade_level).
2. If just created → no notification.
3. Otherwise → calls Gemini with:
   Prompt: "Analyze if this lesson indicates a new chapter/unit...
            Previous Chapter: {progress.current_chapter}
            New Lesson Title: {lesson.title}
            Lesson Content (first 500 chars): {lesson.content[:500]}
            → respond ONLY with JSON:
            { is_new_chapter, new_chapter_name, new_chapter_number, confidence, reasoning }"

4. If is_new_chapter=true AND confidence > 0.7:
   → Creates ChapterProgressNotification for each advisor who teaches this subject in this school
   → Updates TeacherProgress.current_chapter and chapter_number
```

---

## 2. Timetables

There are two distinct timetable concepts in the system:

---

### 2A. Teacher Weekly Timetable (`TeacherTimetable`)

**Model:** `accounts.TeacherTimetable` (`backend/accounts/models.py`)

**Purpose:** Defines teacher's weekly working schedule (for automatic attendance tracking).

| Field | Type | Notes |
|-------|------|-------|
| `teacher` | FK → User (role=teacher) | Teacher this schedule belongs to |
| `day_of_week` | IntegerField (0=Mon … 6=Sun) | Day |
| `start_time` | TimeField | Expected check-in time |
| `end_time` | TimeField | Expected check-out time |
| `is_active` | BooleanField | Whether schedule is currently active |
| `created_by` | FK → User (role=director) | School director who created it |

**Constraints:** `unique_together = ['teacher', 'day_of_week']` — one record per teacher per day.

**Purpose in system:** When a teacher checks in, the system compares the check-in time against the `TeacherTimetable` entry for that day. It determines whether attendance is `present`, `late`, or `absent`.

**Who manages it:** School Director creates and assigns weekly timetable entries for each teacher via the Director Dashboard.

**API:** Referenced by `backend/accounts/attendance_views.py` and the `TeacherTimetable` viewset at `/api/teacher-timetables/`.

---

### 2B. Teaching Timeline / Calendar (`TeachingPlan`)

**Model:** `core.TeachingPlan` (`backend/core/models.py`)

**Purpose:** Teacher plans and tracks individual teaching sessions on a calendar. Visible to students and advisors.

| Field | Type | Notes |
|-------|------|-------|
| `teacher` | FK → User | Teacher who owns it |
| `title` | CharField(255) | Topic/lesson title |
| `description` | TextField | What will be covered |
| `subject` | CharField(50) | Same subject choices as Lesson |
| `grade_level` | CharField(20) | `grade_1` through `grade_12` |
| `lesson` | FK → Lesson (nullable) | Optional link to existing Lesson object |
| `date` | DateField | Date of session |
| `time` | TimeField (nullable) | Time of day |
| `status` | CharField(20) | `planned` / `taught` / `cancelled` |
| `duration_minutes` | IntegerField (nullable) | Expected duration |
| `notes` | TextField | Preparation notes |
| `completion_notes` | TextField | Post-teaching reflection |

**API:** `GET/POST/PATCH/DELETE /api/teaching-plans/`
- `GET /api/teaching-plans/my_teachers/` — for students/advisors, returns plans grouped by teacher

**Frontend component:** `TeachingTimeline.tsx` (editable, for teacher) and `TeacherTimelineViewer.tsx` (read-only, for student/advisor).

**Access control:**
- Teachers: see only their own plans; can create/edit/delete
- Students: see plans from their assigned teachers (`TeacherStudentRelationship`)
- Advisors: see plans from teachers with matching subject in same school

**Calendar rendering:** `react-big-calendar` — color-coded events:
- Blue = `planned`, Green = `taught`, Red = `cancelled`

---

## 3. Test Generation

### 3A. MCQ Test Generation

**Trigger:** Teacher clicks "Generate Test" on a lesson card in the Teacher Dashboard.

**API:** `POST /api/lessons/generate-test/`

**Backend flow (`LessonViewSet.generate_test`, `backend/core/views.py`):**

```
1. Receive: { lesson_id, num_questions (default 10), title }
2. lesson = get_object_or_404(Lesson, pk=lesson_id)
3. ai_service = get_ai_service()
4. questions_text = ai_service.generate_test_questions(lesson.content, num_questions)
5. questions_data = json.loads(questions_text)
6. Test.objects.create(
     lesson=lesson,
     title=title or f"MCQ Test: {lesson.title}",
     questions=questions_data,
     num_questions=num_questions,
     status='pending',   ← ALWAYS pending after AI generation
     created_by=request.user
   )
7. Return { test_id, test, message: "Test created and pending teacher review" }
```

---

### EXACT AI Interference — `AIService.generate_test_questions()`

**File:** `backend/core/ai_service.py`

**Exact prompt sent to Gemini:**

```
Based on the following lesson content, generate exactly {num_questions} multiple-choice questions in VALID JSON format.

Lesson Content:
{lesson_content[:3000]}

Return ONLY a valid JSON array (no markdown, no code blocks, no explanation) with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Brief explanation why this is correct"
  }
]

Rules:
- Generate exactly {num_questions} questions
- correct_answer is the index (0-3) of the correct option
- Make questions challenging but fair
- Ensure all JSON is properly formatted
- Return ONLY the JSON array, nothing else
```

**Post-processing:**
1. Strip markdown code fences (` ```json ... ``` `) if present
2. `json.loads(questions_text)` — validate JSON
3. Validate `len(parsed) == num_questions`

**Stored in:** `Test.questions` (JSONField)

---

### 3B. Q&A (Open-Ended) Test Generation

**Trigger:** Teacher clicks "Q&A Test" button on a lesson in the Teacher Dashboard.

**API:** `POST /api/qa-tests/generate-qa-test/`

**Backend flow (`QATestViewSet.generate_qa_test`):**

```
1. Receive: { lesson_id, num_questions (default 5), time_limit (default 30), title }
2. lesson = get_object_or_404(Lesson, pk=lesson_id)
3. ai_service = get_ai_service()
4. questions_text = ai_service.generate_qa_questions(lesson.content, num_questions)
5. questions_data = json.loads(questions_text)
6. QATest.objects.create(
     lesson=lesson,
     title=title or f"Q&A Test: {lesson.title}",
     questions=questions_data,
     time_limit=time_limit,
     num_questions=num_questions,
     status='pending',   ← ALWAYS pending after AI generation
     created_by=request.user
   )
7. Return { test_id, test, message: "Q&A test created and pending teacher review" }
```

---

### EXACT AI Interference — `AIService.generate_qa_questions()`

**File:** `backend/core/ai_service.py`

**Exact prompt sent to Gemini:**

```
Based on the following lesson content, generate exactly {num_questions} open-ended questions
that require detailed written answers in VALID JSON format.

Lesson Content:
{lesson_content[:3000]}

Return ONLY a valid JSON array (no markdown, no code blocks, no explanation) with this exact structure:
[
  {
    "question": "Question text requiring a detailed explanation?",
    "expected_points": "Key points that should be covered in a good answer"
  }
]

Rules:
- Generate exactly {num_questions} questions
- Questions should require understanding and explanation, not just facts
- expected_points should list 3-5 key concepts that a complete answer should address
- Make questions thought-provoking and aligned with lesson objectives
- Ensure all JSON is properly formatted
- Return ONLY the JSON array, nothing else
```

**Stored in:** `QATest.questions` (JSONField, array of `{ question, expected_points }`)

---

### 3C. Personalized Test Generation (via Chatbot)

When the AI chatbot generates a quiz, it calls `GeminiTeachingAssistant.generate_quiz()`:

```
1. Identifies lesson and target students
2. For each student:
   a. Reads Portfolio.get_subject_statistics() to determine difficulty
   b. Maps: <40% → easy, 40-60% → medium, 60-80% → medium-hard, >80% → hard
3. Generates base Test with standard questions
4. Creates PersonalizedTest per student with adjusted difficulty
5. Saves all to database
```

---

## 4. Test Correction

### 4A. MCQ Test — Auto-Graded (No AI)

**Flow:**
1. Student navigates to `/mcq-test` → sees only `status='approved'` tests
2. Student takes test question-by-question (radio buttons, 1 answer per question)
3. Student submits → `POST /api/tests/{id}/submit/`
4. Backend calculates score instantly: `(correct_answers / total_questions) * 100`
5. `TestSubmission` created with `is_final=True`
6. Score auto-saved to `Portfolio.test_results`
7. Student sees immediate result with percentage and explanations

**No AI involvement in MCQ correction — purely deterministic.**

---

### 4B. Q&A Test — AI Graded, Then Teacher Reviewed

**Phase 1: Student takes the test**
- Student navigates to `/qa-test`
- System enters **fullscreen mode** (forced, with anti-cheating):
  - ESC key blocked (`e.preventDefault()`)
  - F11 key blocked
  - Checks every 500ms; forces re-entry if exited
  - Exit count tracked in `QASubmission.fullscreen_exits`
- Timer starts (default 30 min, configurable); auto-submits at 0:00
- Student answers each question in a textarea
- Submits: `POST /api/qa-submissions/submit/`

**Phase 2: AI Grading (automatic, on submit)**

**API:** `POST /api/qa-submissions/submit/`

**Backend flow:**

```
1. Receive: { test_id, answers: [{question_index, answer}], time_taken, fullscreen_exits }
2. Validate: test is approved, student hasn't already submitted (unique_together constraint)
3. QASubmission.objects.create(
     test, student, answers,
     status='submitted',
     time_taken, fullscreen_exits
   )
4. ai_service = get_ai_service()
5. ai_feedback = ai_service.grade_qa_submission(test_questions, student_answers)
6. submission.ai_feedback = ai_feedback
7. submission.status = 'ai_graded'
8. submission.save()
9. Return { submission_id, submission, message, ai_score }
```

---

### EXACT AI Interference — `AIService.grade_qa_submission()`

**File:** `backend/core/ai_service.py`

**Exact prompt sent to Gemini:**

```
You are an expert teacher grading student answers. For each question-answer pair below, provide:
1. A score out of 10
2. Specific feedback on what was good
3. What was missing or could be improved
4. Whether key points were addressed

Return your response as VALID JSON array (no markdown, no code blocks) in this EXACT format:
[
  {
    "question_index": 0,
    "score": 8.5,
    "feedback": "Good explanation of...",
    "strengths": "Clear understanding of...",
    "improvements": "Could have mentioned...",
    "points_covered": ["point1", "point2"]
  }
]

Question-Answer Pairs:

Question 1:
{question['question']}
Expected Points: {question['expected_points']}
Student Answer: {answer.get('answer', 'No answer provided')}

[...repeated for each question...]

Provide detailed, constructive feedback. Be fair but thorough. Return ONLY the JSON array.
```

**Score calculation:**
```python
total_score = sum(item['score'] for item in feedback_data)
average_score = (total_score / len(feedback_data)) * 10  # Convert to percentage
```

**Stored in:** `QASubmission.ai_feedback` (JSONField):
```json
{
  "question_feedback": [ { "question_index", "score", "feedback", "strengths", "improvements", "points_covered" } ],
  "overall_score": 85.0,
  "total_questions": 5
}
```

---

### EXACT AI Interference — `AIService.analyze_student_weaknesses()`

Also called during or after grading (shown to teacher during review):

**Exact prompt sent to Gemini:**

```
You are an expert educational psychologist and teacher assistant. Analyze {student_name}'s responses
to identify specific learning weaknesses and areas needing improvement.

Focus on:
1. Spelling and grammar errors (with specific examples)
2. Comprehension issues (did they understand the question?)
3. Incomplete or superficial answers (missing key points)
4. Critical thinking gaps (lack of depth or analysis)
5. Structure and organization problems
6. Also note their STRENGTHS

Return ONLY a VALID JSON object (no markdown, no code blocks) in this EXACT format:
{
  "overall_assessment": "...",
  "spelling_grammar": { "has_issues", "severity", "examples", "count" },
  "comprehension": { "has_issues", "severity", "problems", "misunderstood_questions" },
  "completeness": { "incomplete_count", "details", "incomplete_questions" },
  "critical_thinking": { "level", "observations", "needs_improvement" },
  "strengths": [...],
  "recommendations_for_teacher": [...],
  "priority_areas": [...],
  "confidence_score": 0-100
}
```

**Displayed in:** `StudentWeaknessAnalysis` component on teacher's Q&A management page.

---

**Phase 3: Teacher Review (finalization)**

**Frontend:** `/qa-management` → "Submissions to Review" tab

**Teacher sees:**
- Student name, test title, time taken, fullscreen exits, AI suggested score
- Each question with: student answer, AI feedback, AI score, strengths/improvements
- Teacher can adjust the AI score for each question
- Teacher writes overall feedback
- Clicks "Finalize Grade"

**API:** `POST /api/qa-submissions/{id}/finalize/`
```json
{ "final_score": 88.0, "teacher_feedback": "Excellent work!" }
```

**Status progression:**
```
submitted → ai_graded → (teacher_review) → finalized
```

On `finalized`: auto-saves result to `Portfolio.test_results` (student can now see their final grade).

---

## 5. Vault — Storage of Lesson Plans

### Overview

The Vault is a school-scoped repository of lesson plans, managed by advisors, accessible to teachers. A teacher's generated lesson can also be imported into the Vault.

**Model: `VaultLessonPlan`** (`backend/core/models.py`)

| Field | Type | Notes |
|-------|------|-------|
| `title` | CharField(255) | — |
| `description` | TextField | 2-3 sentence summary |
| `content` | TextField | Full plan content |
| `subject` | CharField(50) | Same as Lesson + `french` |
| `grade_level` | CharField(2) | 1–6 |
| `objectives` | JSONField | Array of learning objectives |
| `materials_needed` | JSONField | Array of materials |
| `duration_minutes` | IntegerField (nullable) | — |
| `tags` | JSONField | Array of search tags |
| `grammar` | JSONField | Grammar points (language subjects) |
| `vocabulary` | JSONField | Vocabulary words (language subjects) |
| `life_skills_and_values` | JSONField | Character education aspects |
| `source_type` | CharField(20) | `manual` / `ai_yearly` / `ai_single` / `imported` |
| `source_teacher` | FK → User (nullable) | Original teacher if imported |
| `teacher_guide_file` | FileField (nullable) | PDF used for AI generation |
| `yearly_breakdown_file` | FileField (nullable) | Yearly breakdown PDF |
| `ai_generation_prompt` | TextField | Custom prompt used |
| `created_by` | FK → User | Advisor or admin |
| `school` | FK → School | — |
| `is_active` | BooleanField | Soft delete |
| `is_featured` | BooleanField | Featured appear at top |
| `view_count` | IntegerField | Engagement metric |
| `use_count` | IntegerField | Times teachers used it |

---

### How Vault Plans Are Created

#### Source 1: AI Yearly Breakdown (`source_type='ai_yearly'`)

**Who:** Advisor
**API:** `POST /api/vault-lesson-plans/generate_yearly/`

```
1. Advisor uploads curriculum PDF + sets subject, grade_level, custom_instructions
2. YearlyBreakdown object created (status: pending → processing)
3. Backend: uploaded_file = genai.upload_file(pdf_path)  ← multimodal PDF input
4. AIService.generate_yearly_breakdown(pdf_path, subject, grade_level, custom_instructions) called
5. Gemini 2.5-pro processes the PDF with the prompt below
6. Returns a JSON array of 20-30 lesson plans
7. Each plan saved as VaultLessonPlan (source_type='ai_yearly')
8. YearlyBreakdown.status → 'completed' (or 'failed')
```

**EXACT prompt sent to Gemini (with PDF as multimodal input):**

```
You are an expert curriculum designer. Analyze the attached PDF curriculum document
for {Subject} - {Grade Level}.

[Additional instructions if provided]

Generate a comprehensive yearly breakdown of lesson plans. For EACH distinct
topic/unit/chapter in the curriculum, create a detailed lesson plan.

Return your response as a valid JSON array of lesson plan objects. Each lesson plan
should have this EXACT structure:
{
  "title": "Lesson title",
  "description": "Brief description (2-3 sentences)",
  "content": "Full detailed lesson plan content including introduction, main teaching points, activities, and conclusion",
  "objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "materials_needed": ["Material 1", "Material 2"],
  "duration_minutes": 45,
  "tags": ["tag1", "tag2"],
  "grammar": ["grammar point 1", "grammar point 2"],       // Language subjects only
  "vocabulary": ["word1", "word2", "word3"],                // Language subjects only
  "life_skills_and_values": ["skill1", "skill2"]            // Character education
}

IMPORTANT:
- Create AT LEAST 20-30 lesson plans to cover the full year
- Each lesson should be complete and detailed
- For language subjects (English, French, Arabic), include grammar, vocabulary, and life_skills_and_values
- For other subjects, those fields can be empty arrays
- Return ONLY the JSON array, no additional text
- Ensure valid JSON format
```

---

#### Source 2: AI Single Lesson (`source_type='ai_single'`)

**API:** `POST /api/vault-lesson-plans/generate_single/`

```
1. Advisor uploads teacher guide PDF + provides custom_text
2. uploaded_file = genai.upload_file(teacher_guide_path)  ← multimodal
3. AIService.generate_single_lesson_plan(grade_level, teacher_guide_path, custom_text, subject) called
4. Returns one JSON lesson plan object
5. Saved as VaultLessonPlan (source_type='ai_single')
```

**EXACT prompt sent to Gemini:**

```
You are an expert lesson planner. Using the attached teacher's guide PDF, create a
detailed lesson plan for {Subject} - {Grade Level}.

Topic/Instructions: {custom_text}

Return your response as a valid JSON object with this EXACT structure:
{
  "title": "Lesson title",
  "description": "Brief description (2-3 sentences)",
  "content": "Full detailed lesson plan content...",
  "objectives": [...],
  "materials_needed": [...],
  "duration_minutes": 45,
  "tags": [...],
  "grammar": [...],              // Language subjects only
  "vocabulary": [...],           // Language subjects only
  "life_skills_and_values": [...]
}

IMPORTANT:
- Make the lesson plan detailed and classroom-ready
- Align with the teacher's guide content
- Make it age-appropriate for {Grade Level}
- For language subjects: include grammar points and vocabulary
- Include life skills and values that can be taught through this lesson
- Return ONLY the JSON object, no additional text
```

---

#### Source 3: Manual (`source_type='manual'`)

Advisor writes content directly in the UI form. No AI.

#### Source 4: Imported from Teacher (`source_type='imported'`)

Advisor selects an outstanding teacher lesson and imports it into the vault. `source_teacher` FK tracks the original teacher.

---

### How Teachers Use Vault Plans

**API:** `GET /api/vault-lesson-plans/by_subject/` — returns plans organized by teacher's assigned subjects.

#### Option A: Direct Copy

**API:** `POST /api/vault-lesson-plans/{id}/use_plan/`

```
1. Copies vault plan content as-is into teacher's Lesson list
2. Creates VaultLessonPlanUsage record (optional rating + feedback)
3. Increments use_count on VaultLessonPlan
4. Returns new Lesson object (vault_source FK set)
```

No AI involvement.

#### Option B: AI-Enhanced Generation

**API:** `POST /api/vault-lesson-plans/{id}/generate_lesson/`

```
1. Teacher provides optional custom_instructions and scheduled_date
2. Backend builds extended prompt from all vault plan fields
3. Calls AIService.generate_lesson(extended_prompt, subject, grade_level)
4. Returns AI-enhanced Lesson (vault_source FK set, scheduled_date set)
5. Fallback: if AI fails → creates lesson from original vault content (ai_enhanced: false)
```

**EXACT prompt sent to Gemini:**

```
Based on the following lesson plan from our vault, generate a customized,
detailed lesson for teaching.

VAULT PLAN INFORMATION:
Title: {title}
Description: {description}
Subject: {subject}
Grade Level: {grade_level}

LEARNING OBJECTIVES:
- {objective 1}
- {objective 2}

ORIGINAL CONTENT:
{full content}

MATERIALS NEEDED: {materials}
DURATION: {duration_minutes} minutes

GRAMMAR POINTS:        (language subjects only)
VOCABULARY:            (language subjects only)
LIFE SKILLS & VALUES:  (if present)

TEACHER'S CUSTOM INSTRUCTIONS: {custom_instructions}

Please generate a complete, ready-to-teach lesson that:
1. Expands on the content with clear explanations
2. Includes engaging examples and activities
3. Provides step-by-step teaching instructions
4. Adds practice exercises appropriate for the grade level
5. Includes assessment questions
6. Maintains the original learning objectives and key concepts
```

---

### Vault Exercise Generation (AI)

**API:** `POST /api/vault-exercises/generate_with_ai/`

Advisor selects a vault plan → requests exercises:

- **MCQ type:** calls `AIService.generate_vault_mcq_exercise(lesson_plan_content, title, num_questions, difficulty, subject, grade_level)`
  - Returns: `{ title, description, questions: [{question, options[4], correct_answer}] }`
- **Q&A type:** calls `AIService.generate_vault_qa_exercise(...)`
  - Returns: `{ title, description, questions: [{question, answer}] }`

Difficulty: `easy` / `medium` / `hard` — affects prompt instructions. Saved as `VaultExercise` objects.

---

## 6. Student Notebooks

### Overview

Each student has a digital notebook with daily pages. Teachers assign exercises, students answer, teachers review and mark.

**Models** (`backend/core/models.py`):
- `StudentNotebook`: one-to-one with student User
- `NotebookPage`: daily pages with date, content, teacher interactions

**`NotebookPage` fields:**

| Field | Type | Notes |
|-------|------|-------|
| `notebook` | FK → StudentNotebook | — |
| `date` | DateField | Page date |
| `lesson_name` | CharField | Lesson name (student fills in) |
| `exercises_set_by_teacher` | TextField | Exercises the teacher wrote for the student |
| `exercises_answers` | TextField | Student's answers |
| `notes` | TextField | Student's personal notes |
| `answer_status` | CharField | `pending` / `correct` / `incorrect` / `partial` |
| `teacher_viewed` | BooleanField | Whether teacher has viewed this page |
| `teacher_viewed_at` | DateTimeField (nullable) | When teacher viewed |
| `teacher_comment` | TextField | Teacher's feedback text |

---

### Student Side (`StudentNotebook.tsx`)

**API used:**

| Action | API call |
|--------|----------|
| Load all pages | `GET /api/notebook-pages/my_pages/` |
| Create today's page | `GET /api/notebook-pages/today_page/` (auto-creates if none) |
| Save page edits | `PATCH /api/notebook-pages/{id}/` |
| Create new page | `POST /api/notebook-pages/` |

**Student UI flow:**

```
1. Student opens "My Notebook" tab in Student Dashboard
2. System auto-loads pages; if none exist → calls today_page/ to create one
3. Student sees notebook-style card with:
   - Date header with prev/next navigation
   - "Lesson Name" input (student writes the lesson title)
   - If teacher set exercises: shows "Exercises from Teacher" block (read-only)
   - "My Answers" textarea (only editable if teacher set exercises)
   - "My Notes & Thoughts" textarea
   - If teacher left feedback: shows "Teacher's Feedback" box (read-only)
4. Student clicks "Save My Work" → PATCH /api/notebook-pages/{id}/
5. Navigation: arrow buttons or swipe gestures (75px threshold)
```

**No AI interference in the student notebook.**

---

### Teacher Side (`TeacherNotebookViewer.tsx`)

**API used:**

| Action | API call |
|--------|----------|
| Load teacher's students | `GET /api/relationships/my-students/` |
| Load a student's pages | `GET /api/notebook-pages/student_pages/?student_id={id}` |
| Set exercises | `POST /api/notebook-pages/{id}/set_exercises/` (saves `exercises_set_by_teacher`) |
| Add comment | `POST /api/notebook-pages/{id}/add_teacher_comment/` (saves `teacher_comment`, marks `teacher_viewed=True`) |
| Mark answer status | `POST /api/notebook-pages/{id}/mark_answer/` (sets `answer_status` to `correct`/`incorrect`/`partial`) |
| Create new page for student | `POST /api/notebook-pages/create_for_student/` |

**Teacher UI flow:**

```
1. Teacher opens "Notebooks" tab in Teacher Dashboard
2. Left sidebar: searchable list of teacher's students
3. Teacher selects a student → loads student's pages sorted newest first
4. Teacher sees the same notebook-style card but with:
   - "Set Exercises for Student" textarea (editable) + "Save Exercises" button
   - Student's lesson name (read-only)
   - Student's answers (read-only) with marking buttons: ✓ Correct / ~ Partial / ✗ Incorrect
   - Student's personal notes (read-only)
   - "Your Feedback" textarea + "Save Feedback" button
5. Teacher can also click "New Page" to create a blank page for the student
```

**No AI interference in the teacher notebook viewer.**

---

### Interaction Summary

```
Teacher creates page / sets exercises
         ↓
Student sees exercises, writes answers and notes, saves
         ↓
Teacher reviews student's answers, marks as correct/partial/incorrect
         ↓
Teacher writes feedback comment
         ↓
Student sees teacher's feedback on their notebook page
```

---

## 7. CNP Integration of Teacher Guidelines

### Overview

The CNP (Centre National Pédagogique) agent uploads official teacher guide PDFs. Once approved, these PDFs become available to advisors for AI-powered lesson plan generation in the Vault.

**Model: `CNPTeacherGuide`** (`backend/core/models.py`)

| Field | Type | Notes |
|-------|------|-------|
| `title` | CharField(300) | Guide title |
| `description` | TextField | Guide description |
| `subject` | CharField(50) | One of 15 subjects |
| `grade_level` | CharField(10) | `grade_1` to `grade_12` |
| `guide_type` | CharField(20) | `yearly` / `unit` / `lesson` / `assessment` / `resource` |
| `academic_year` | CharField(20) | e.g. `2024-2025` |
| `pdf_file` | FileField | Stored in `media/cnp/teacher_guides/YYYY/MM/` |
| `file_size` | BigIntegerField | Bytes |
| `page_count` | IntegerField | — |
| `keywords` | JSONField | Array of tags |
| `topics_covered` | JSONField | List of topics |
| `learning_objectives` | JSONField | List of objectives |
| `status` | CharField(20) | `pending` → `approved` / `archived` |
| `uploaded_by` | FK → User (role=cnp) | Uploading CNP agent |
| `approved_by` | FK → User | Admin who approved |
| `usage_count` | IntegerField | Times used for generation |
| `download_count` | IntegerField | Times downloaded |
| `cnp_notes` | TextField | Internal notes |
| `admin_notes` | TextField | Admin review notes |
| `approved_at` | DateTimeField | — |

---

### CNP Workflow

```
Step 1: CNP Agent uploads guide
   POST /api/cnp-teacher-guides/
   FormData: { pdf_file, title, description, subject, grade_level, guide_type,
               academic_year, keywords, topics_covered, learning_objectives, cnp_notes }
   → status: 'pending'

Step 2: Admin/Senior CNP reviews the guide
   POST /api/cnp-teacher-guides/{id}/approve/
   Body: { admin_notes: "Approved for use" }
   → status: 'approved', approved_by, approved_at set

Step 3: Guide becomes available to advisors/teachers
   GET /api/cnp-teacher-guides/available_for_generation/?subject=math&grade_level=grade_5
   → Returns only approved guides filtered by subject/grade

Step 4: Advisor uses guide for vault lesson generation
   → Selects the PDF from available CNP guides
   → Uses it as input to: POST /api/vault-lesson-plans/generate_yearly/ or generate_single/
   → Backend calls genai.upload_file(guide.pdf_file.path)
   → usage_count incremented via POST /api/cnp-teacher-guides/{id}/increment_usage/
```

---

### Access Control

| Role | Access |
|------|--------|
| CNP Agent | Upload, view own uploads + approved guides, delete own |
| Admin | Full CRUD, approve/archive all |
| Teacher / Advisor | View approved guides only (for lesson generation) |
| Student / Parent | No access |

---

### Integration Point with Vault

The CNP guide PDF is the **source material** for Vault AI generation:

```python
# In vault lesson generation endpoint:
guide = CNPTeacherGuide.objects.get(id=guide_id, status='approved')
uploaded_file = genai.upload_file(guide.pdf_file.path)
# → passed to AIService.generate_yearly_breakdown() or generate_single_lesson_plan()
guide.usage_count += 1
guide.save()
```

This closes the loop: CNP uploads official curriculum → advisor uses it as AI context → AI generates lesson plans grounded in official pedagogical material → plans stored in Vault → teachers use them.

---

## 8. Advisor Review of Tests

### Overview

Advisors can review and annotate any lesson, MCQ test, or Q&A test created by teachers in their subject. This is a separate feedback layer on top of the teacher's own moderation.

**Model: `AdvisorReview`** (`backend/accounts/models.py`)

| Field | Type | Notes |
|-------|------|-------|
| `advisor` | FK → User (role=advisor) | — |
| `review_type` | CharField(10) | `lesson` / `mcq_test` / `qa_test` |
| `lesson` | FK → Lesson (nullable) | Set if review_type='lesson' |
| `mcq_test` | FK → Test (nullable) | Set if review_type='mcq_test' |
| `qa_test` | FK → QATest (nullable) | Set if review_type='qa_test' |
| `rating` | IntegerField (1-5) | Star rating |
| `remarks` | TextField | Written feedback |

**Constraint:** `clean()` validates exactly one of lesson/mcq_test/qa_test is set.

---

### Advisor Access to Tests

**Advisor's Lesson/Test visibility** (from `TestViewSet.get_queryset`):

```python
elif user.role == 'advisor':
    advisor_subject = user.subjects[0] if user.subjects else None
    if advisor_subject:
        queryset = queryset.filter(
            lesson__school=user.school,
            lesson__subject=advisor_subject,
            lesson__created_by__role='teacher'  # Only from teacher lessons
        )
```

Advisors see all tests (any status: pending, approved, rejected) from teachers in their subject at their school.

---

### Advisor Review Workflow (Frontend)

**Dashboard:** `AdvisorDashboard.tsx`

**Data loaded on mount:**
```typescript
const lessons = await lessonAPI.getAllLessons();         // teacher's lessons in advisor's subject
const mcqTests = await testAPI.getAll();                 // MCQ tests (all statuses)
const qaTests = await api.get('/qa-tests/');             // Q&A tests (all statuses)
const reviews = await advisorReviewAPI.getMyReviews();   // advisor's own past reviews
```

**Review dialog (opened from Lessons/Tests tab):**

```typescript
reviewData = {
  review_type: 'lesson' | 'mcq_test' | 'qa_test',
  lesson: number | undefined,   // set if review_type='lesson'
  mcq_test: number | undefined, // set if review_type='mcq_test'
  qa_test: number | undefined,  // set if review_type='qa_test'
  rating: 1-5,
  remarks: string               // written feedback text
}
```

**Submit:** `advisorReviewAPI.create(reviewData)` → `POST /api/advisor-reviews/`

**What advisors see per test:**
- Test title, associated lesson, status badge
- A "Leave Review" button → opens the review dialog
- Their existing reviews listed in a "Reviews" tab

**No AI is involved in advisor review of tests.** The advisor writes manual remarks and assigns a star rating.

---

### Relationship to Test Generation

The advisor review is a **post-generation quality check**:

```
AI generates test (pending)
         ↓
Teacher reviews + approves/rejects/edits
         ↓
Test becomes 'approved' (visible to students)
         ↓
Students take the test
         ↓
Advisor reviews the test quality (rating + remarks)
         ↓
Advisor feedback visible to the teacher in the Reviews tab
```

The advisor does **not** approve or reject tests (that is teacher-only). They provide a separate quality-control layer.

---

## 9. Inspector Timetable and Assignment

### Overview

Two role hierarchies manage inspection:
- **Inspector** (GPI system) — conducts classroom visits in assigned regions
- **Delegation** (formerly "Mandobiya") — manages teachers in a delegation, assigns advisors to inspections

---

### 9A. Inspector (GPI System) — Regional Assignment

**Model: `InspectorRegionAssignment`** (`backend/core/inspection_models.py`)

```python
inspector      → FK to User (role='inspector')
region         → FK to Region
assigned_at    → DateTimeField
is_active      → BooleanField
# Constraint: one inspector per region
```

**Region model:**
```python
class Region:
    name, code, description, created_at
```

Schools have a `region` FK to `Region`. This lets inspectors access all schools (and teachers) in their assigned region.

---

### Inspector Workflow

**Login** → redirected to `/inspector` (protected route for role='inspector' or 'admin')

**Dashboard displays:**
- Assigned regions with school/teacher counts
- Upcoming scheduled visits (next 10)
- Pending reports (submitted to GPI, awaiting review)
- Monthly report status

**Step 1: Schedule a visit**

`POST /api/inspection/visits/`
```json
{
  "teacher": 1,
  "school": 2,
  "scheduled_date": "2025-01-15",
  "visit_type": "routine",   // routine | complaint_followup | annual_review | spot_check
  "subject": "math",
  "grade_level": "3",
  "notes": "Pre-visit notes"
}
```
→ `InspectionVisit` created with `status='scheduled'`

**Step 2: Conduct visit**

`POST /api/inspection/visits/{id}/mark_completed/`
→ `InspectionVisit.status = 'completed'`

**Step 3: Write inspection report**

`POST /api/inspection/reports/`
```json
{
  "visit": 42,
  "report_date": "2025-01-15",
  "strengths": "...",
  "weaknesses": "...",
  "recommendations": "...",
  "teaching_rating": 4,
  "classroom_management_rating": 5,
  "student_engagement_rating": 4,
  "overall_rating": 4
}
```
→ `InspectionReport` created with `gpi_status='pending'`

**Step 4: GPI reviews and approves/rejects**

GPI Dashboard: `GET /api/inspection/gpi-dashboard/pending_reports/`

GPI actions:
- `POST /api/inspection/reports/{id}/approve/` → `gpi_status='approved'`
- `POST /api/inspection/reports/{id}/reject/` → `gpi_status='rejected'`
- `POST /api/inspection/reports/{id}/request_revision/` → `gpi_status='revision_requested'`

All actions include a `feedback` text.

**Step 5: Monthly report**

Inspector generates: `POST /api/inspection/monthly-reports/generate_stats/`
Inspector submits: `POST /api/inspection/monthly-reports/{id}/submit/`
GPI approves: `POST /api/inspection/monthly-reports/{id}/approve/`

**No AI involvement in the inspector/GPI system.**

---

### 9B. Delegation — Teacher Inspection with Advisor Assignment

**Model: `TeacherInspection`** (`backend/accounts/models.py`)

| Field | Type | Notes |
|-------|------|-------|
| `teacher` | FK → User (role=teacher) | Teacher being inspected |
| `mandobiya` / `delegation` | FK → User (role=delegation) | Who scheduled it |
| `advisor` | FK → User (role=advisor, nullable) | Assigned advisor (optional) |
| `school` | FK → School | — |
| `subject` | CharField(50) | Subject being inspected |
| `scheduled_date` | DateField | — |
| `scheduled_time` | TimeField (nullable) | — |
| `duration_minutes` | IntegerField | — |
| `purpose` | TextField | Inspection purpose |
| `pre_inspection_notes` | TextField (nullable) | Notes before inspection |
| `status` | CharField(20) | `scheduled` / `in_progress` / `completed` / `submitted` |
| `started_at` | DateTimeField (nullable) | — |
| `completed_at` | DateTimeField (nullable) | — |

---

### Delegation — Inspection Scheduling + Advisor Assignment

**Frontend:** `MandobiyaDashboard.tsx` → Inspections tab → "Schedule Inspection" button

**Form:**
1. Select teacher (dropdown from school)
2. Select subject
3. **Select advisor (optional)** — dropdown showing all advisors in school with their subject specializations
4. Fill in date, time, duration, purpose, pre-inspection notes

**API:** `POST /api/teacher-inspections/`
```json
{
  "teacher_id": 1,
  "advisor_id": 5,   // or 0/null to skip
  "subject": "math",
  "scheduled_date": "2025-11-15",
  "scheduled_time": "10:00",
  "duration_minutes": 60,
  "purpose": "Quarterly performance review",
  "pre_inspection_notes": "Focus on new teaching methods"
}
```

**If advisor is assigned:**
- Advisor appears in the inspection record and list (displayed in purple with UserCheck icon)
- Advisor can conduct the inspection and submit the review on behalf of the delegation
- If no advisor: delegation conducts inspection personally

**Inspection status progression:**

```
scheduled → in_progress (Start) → completed (Complete) → submitted (Submit Review)
```

Actions:
- `POST /api/teacher-inspections/{id}/start/` → `status='in_progress'`, `started_at` set
- `POST /api/teacher-inspections/{id}/complete/` → `status='completed'`, `completed_at` set
- `POST /api/teacher-inspections/{id}/submit_review/` → `status='submitted'`, completion report saved

---

### Advisor-to-Teacher Assignment (Separate from Inspection)

**Model: `TeacherAdvisorAssignment`** (`backend/accounts/models.py`)

Independent of inspections — this is for ongoing mentorship/subject support:

| Field | Type | Notes |
|-------|------|-------|
| `teacher` | FK → User (role=teacher) | — |
| `advisor` | FK → User (role=advisor) | — |
| `assigned_by` | FK → User (role=delegation) | Who made the assignment |
| `school` | FK → School | — |
| `subject` | CharField(50) | Subject for supervision |
| `is_active` | BooleanField | — |
| `notes` | TextField | Optional assignment notes |

**Constraint:** `unique_together = ['teacher', 'advisor', 'subject', is_active=True]` — no duplicate active assignments.

**API:**
- `POST /api/teacher-advisor-assignments/` → create assignment
- `POST /api/teacher-advisor-assignments/{id}/deactivate/` → deactivate
- `POST /api/teacher-advisor-assignments/{id}/activate/` → reactivate
- `GET /api/teacher-advisor-assignments/by_teacher/?teacher_id={id}` → all assignments for a teacher
- `GET /api/teacher-advisor-assignments/by_advisor/?advisor_id={id}` → all assignments for an advisor

**No AI involvement in advisor-to-teacher assignment.**

---

## Appendix: AI Model Configuration

| Parameter | Value |
|-----------|-------|
| Current model | `gemini-2.5-pro` |
| SDK | `google-generativeai` Python package |
| API key | `GEMINI_API_KEY` in `backend/.env` |
| PDF input | `genai.upload_file(path)` for multimodal (Vault generation only) |
| Singleton | `get_ai_service()` in `backend/core/ai_service.py` |
| JSON cleanup | All methods strip ` ```json ... ``` ` fences before `json.loads()` |

**Target architecture (not yet implemented):**
- Fine-tuned LLM, locally hosted
- RAG pipeline: teacher guide PDFs pre-indexed in vector DB
- At generation time: retrieve relevant chunks for the grade/subject → inject into prompt
- Fully on-premise; no external API dependency

---

## Appendix: Key API Endpoints Summary

| Feature | Method | Endpoint |
|---------|--------|----------|
| Generate lesson (AI) | POST | `/api/lessons/generate/` |
| Generate MCQ test (AI) | POST | `/api/lessons/generate-test/` |
| Approve MCQ test | POST | `/api/tests/{id}/approve/` |
| Reject MCQ test | POST | `/api/tests/{id}/reject/` |
| Generate Q&A test (AI) | POST | `/api/qa-tests/generate-qa-test/` |
| Submit Q&A test (AI grades) | POST | `/api/qa-submissions/submit/` |
| Finalize Q&A grade | POST | `/api/qa-submissions/{id}/finalize/` |
| Vault: yearly breakdown (AI+PDF) | POST | `/api/vault-lesson-plans/generate_yearly/` |
| Vault: single plan (AI+PDF) | POST | `/api/vault-lesson-plans/generate_single/` |
| Vault: use plan (copy) | POST | `/api/vault-lesson-plans/{id}/use_plan/` |
| Vault: AI-enhanced lesson | POST | `/api/vault-lesson-plans/{id}/generate_lesson/` |
| Vault: AI exercise | POST | `/api/vault-exercises/generate_with_ai/` |
| CNP: upload guide | POST | `/api/cnp-teacher-guides/` |
| CNP: approve guide | POST | `/api/cnp-teacher-guides/{id}/approve/` |
| CNP: available for generation | GET | `/api/cnp-teacher-guides/available_for_generation/` |
| Advisor: create review | POST | `/api/advisor-reviews/` |
| Notebook: student pages | GET | `/api/notebook-pages/my_pages/` |
| Notebook: today's page | GET | `/api/notebook-pages/today_page/` |
| Notebook: set exercises | POST | `/api/notebook-pages/{id}/set_exercises/` |
| Notebook: add comment | POST | `/api/notebook-pages/{id}/add_teacher_comment/` |
| Notebook: mark answer | POST | `/api/notebook-pages/{id}/mark_answer/` |
| Teaching plan (timeline) | CRUD | `/api/teaching-plans/` |
| Teacher timetable | CRUD | `/api/teacher-timetables/` |
| Inspection: schedule visit | POST | `/api/inspection/visits/` |
| Inspection: submit report | POST | `/api/inspection/reports/` |
| Inspection: GPI approve | POST | `/api/inspection/reports/{id}/approve/` |
| Delegation: schedule inspection | POST | `/api/teacher-inspections/` |
| Delegation: assign advisor | POST | `/api/teacher-advisor-assignments/` |
| AI Chatbot | POST | `/api/chatbot/conversations/chat/` |
