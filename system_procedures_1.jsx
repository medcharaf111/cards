import { useState } from "react";

// ─── Palette ───
const C = {
  navy: "#1B2A4A", gold: "#C5A55A", white: "#FFFFFF", light: "#F7F8FA",
  text: "#2D2D2D", muted: "#6B7280", border: "#E5E7EB",
  blue: "#3B82F6", green: "#10B981", purple: "#8B5CF6", red: "#EF4444",
  orange: "#F59E0B", teal: "#14B8A6", pink: "#EC4899", indigo: "#6366F1",
  aiGlow: "#A78BFA", noAi: "#9CA3AF",
};

// ─── Tiny Components ───
const Badge = ({ color, children, glow }) => (
  <span style={{
    background: `${color}18`, color, border: `1px solid ${color}40`,
    padding: "2px 8px", borderRadius: 2, fontSize: 9, fontWeight: 700,
    fontFamily: "mono", letterSpacing: 0.5, whiteSpace: "nowrap",
    boxShadow: glow ? `0 0 8px ${color}30` : "none",
  }}>{children}</span>
);

const AiBadge = () => <Badge color={C.purple} glow>✦ AI</Badge>;
const NoAiBadge = () => <Badge color={C.noAi}>NO AI</Badge>;

const Endpoint = ({ method = "POST", path }) => (
  <div style={{
    display: "inline-flex", gap: 4, alignItems: "center",
    background: "#1E1E1E", borderRadius: 2, padding: "2px 8px",
    fontFamily: "mono", fontSize: 9, color: "#D4D4D4",
  }}>
    <span style={{ color: method === "GET" ? C.green : method === "POST" ? C.blue : C.orange, fontWeight: 700 }}>{method}</span>
    <span>{path}</span>
  </div>
);

const FlowStep = ({ n, text, ai, highlight }) => (
  <div style={{
    display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0",
    borderLeft: `2px solid ${ai ? C.purple : highlight ? C.gold : C.border}`,
    paddingLeft: 10, marginLeft: 8,
  }}>
    <span style={{
      background: ai ? C.purple : highlight ? C.gold : C.navy,
      color: C.white, borderRadius: "50%", width: 18, height: 18, minWidth: 18,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 9, fontWeight: 700,
    }}>{n}</span>
    <span style={{ fontSize: 11, lineHeight: 1.5, color: C.text }}>
      {ai && <span style={{ color: C.purple, fontWeight: 600 }}>🤖 </span>}
      {text}
    </span>
  </div>
);

const PromptPreview = ({ label, prompt }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 6 }}>
      <button onClick={() => setOpen(!open)} style={{
        background: "none", border: `1px dashed ${C.purple}40`, borderRadius: 2,
        padding: "3px 8px", fontSize: 9, color: C.purple, cursor: "pointer",
        fontFamily: "mono",
      }}>{open ? "▾ Hide" : "▸ Show"} {label}</button>
      {open && (
        <pre style={{
          background: "#1E1E1E", color: "#D4D4D4", borderRadius: 3,
          padding: 10, fontSize: 8, lineHeight: 1.5, overflow: "auto",
          maxHeight: 160, marginTop: 4, border: `1px solid #333`,
          whiteSpace: "pre-wrap",
        }}>{prompt}</pre>
      )}
    </div>
  );
};

const Arrow = ({ label, color = C.muted }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "4px 0", color, fontSize: 10, fontFamily: "mono", gap: 4,
  }}>
    <span>↓</span>
    {label && <span style={{ fontSize: 9 }}>{label}</span>}
  </div>
);

const ModelTable = ({ fields }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px",
    background: C.border, borderRadius: 2, overflow: "hidden", marginTop: 6,
  }}>
    {fields.map(([name, type], i) => (
      <div key={i} style={{
        background: C.white, padding: "2px 6px", fontSize: 9,
        fontFamily: "mono", color: i === 0 ? C.navy : C.text,
        fontWeight: name.includes("→") ? 400 : name === name.toUpperCase() ? 700 : 400,
      }}>
        {i % 2 === 0 ? <span style={{ fontWeight: 600 }}>{name}</span> : <span style={{ color: C.muted }}>{type}</span>}
      </div>
    ))}
  </div>
);

// ─── Procedure Cards ───

const procedures = [
  {
    id: "lesson",
    title: "1. Lesson Planning",
    subtitle: "3 paths to create lessons — all converge on AIService.generate_lesson()",
    icon: "📝",
    hasAi: true,
    color: C.blue,
    content: () => (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { path: "Path 1: Direct Form", actor: "Teacher", color: C.blue, endpoint: "/api/lessons/generate/", desc: "Dashboard → Lessons tab → Fill form (title?, subject, grade, prompt) → ✨ Generate" },
            { path: "Path 2: AI Chatbot", actor: "Teacher", color: C.purple, endpoint: "/api/chatbot/conversations/chat/", desc: 'Chat page → "Create a lesson about fractions" → FUNCTION_CALL parsed → dispatched' },
            { path: "Path 3: Vault", actor: "Teacher", color: C.green, endpoint: "/api/vault-lesson-plans/{id}/*", desc: "Browse vault → use_plan (copy) or generate_lesson (AI-enhanced with custom instructions)" },
          ].map(p => (
            <div key={p.path} style={{ border: `1px solid ${p.color}40`, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ background: p.color, color: C.white, padding: "4px 8px", fontSize: 10, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
                <span>{p.path}</span><span style={{ opacity: 0.7, fontSize: 9 }}>{p.actor}</span>
              </div>
              <div style={{ padding: "6px 8px", fontSize: 10, lineHeight: 1.5 }}>
                <Endpoint path={p.endpoint} />
                <div style={{ marginTop: 4 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}25`, borderRadius: 3, padding: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <AiBadge />
            <span style={{ fontWeight: 700, fontSize: 11, color: C.navy }}>AIService.generate_lesson(prompt, subject, grade_level)</span>
          </div>
          <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>
            All 3 paths converge here → Gemini 2.5-pro → returns structured text (title, objectives, content, examples, practice) → saved to Lesson.content
          </div>
          <PromptPreview label="Exact Gemini Prompt" prompt={`You are an expert educational content creator.
Generate a comprehensive lesson based on:
  Subject: [Mathematics / Science / etc.]
  Grade Level: [1st Grade / 2nd Grade / etc.]

[Teacher's prompt text]

Structure: 1. Clear title  2. Learning objectives
3. Detailed content  4. Examples
5. Practice questions / activities
→ Age-appropriate vocabulary and difficulty.`} />
        </div>

        <div style={{ background: `${C.orange}08`, border: `1px solid ${C.orange}25`, borderRadius: 3, padding: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <AiBadge />
            <span style={{ fontWeight: 700, fontSize: 11, color: C.navy }}>Chapter Change Detection (side-effect)</span>
          </div>
          <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>
            After every lesson creation → <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 2 }}>_detect_chapter_change()</code> →
            Gemini analyzes if lesson indicates new chapter → if confidence &gt; 0.7 → creates ChapterProgressNotification for advisors → updates TeacherProgress
          </div>
        </div>

        <div style={{ marginTop: 8, fontSize: 10, fontWeight: 600, color: C.navy }}>Validation Gate:</div>
        <div style={{ fontSize: 10, color: C.muted }}>
          Teacher must have active <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 2 }}>TeacherGradeAssignment</code> →
          subject restricted to assigned subjects → if none exist → warning banner + generate button disabled
        </div>
      </div>
    ),
  },
  {
    id: "timetable",
    title: "2. Timetables",
    subtitle: "Two distinct concepts: weekly schedule (Director) vs teaching timeline (Teacher)",
    icon: "📅",
    hasAi: false,
    color: C.teal,
    content: () => (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ border: `1px solid ${C.teal}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.teal, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>
              2A. Teacher Weekly Timetable <NoAiBadge />
            </div>
            <div style={{ padding: 10, fontSize: 10, lineHeight: 1.6 }}>
              <div><strong>Model:</strong> <code>accounts.TeacherTimetable</code></div>
              <div><strong>Managed by:</strong> School Director</div>
              <div><strong>Purpose:</strong> Defines working schedule per day (Mon–Sun). Used for automatic attendance tracking — check-in time compared against timetable entry → present / late / absent.</div>
              <div style={{ marginTop: 4 }}><strong>Constraint:</strong> <code>unique_together = [teacher, day_of_week]</code></div>
              <div style={{ marginTop: 4 }}><Endpoint method="CRUD" path="/api/teacher-timetables/" /></div>
            </div>
          </div>
          <div style={{ border: `1px solid ${C.blue}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.blue, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>
              2B. Teaching Timeline / Calendar <NoAiBadge />
            </div>
            <div style={{ padding: 10, fontSize: 10, lineHeight: 1.6 }}>
              <div><strong>Model:</strong> <code>core.TeachingPlan</code></div>
              <div><strong>Managed by:</strong> Teacher (editable), Students/Advisors (read-only)</div>
              <div><strong>Purpose:</strong> Plans individual teaching sessions on a calendar. Links to Lessons. Color-coded: Blue=planned, Green=taught, Red=cancelled.</div>
              <div style={{ marginTop: 4 }}><strong>Component:</strong> <code>react-big-calendar</code></div>
              <div style={{ marginTop: 4 }}><Endpoint method="CRUD" path="/api/teaching-plans/" /></div>
              <div><Endpoint method="GET" path="/api/teaching-plans/my_teachers/" /></div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "testgen",
    title: "3. Test Generation",
    subtitle: "MCQ + Q&A tests from lessons — AI generates, teacher always moderates",
    icon: "🧪",
    hasAi: true,
    color: C.purple,
    content: () => (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ border: `1px solid ${C.purple}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.purple, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
              <span>3A. MCQ Test Generation</span><AiBadge />
            </div>
            <div style={{ padding: 10 }}>
              <Endpoint path="/api/lessons/generate-test/" />
              <FlowStep n={1} text="Teacher clicks 'Generate Test' on a lesson card" />
              <FlowStep n={2} text="Backend reads lesson.content (first 3000 chars)" />
              <FlowStep n={3} text="AIService.generate_test_questions(content, num_questions)" ai />
              <FlowStep n={4} text="Gemini returns JSON array: [{question, options[4], correct_answer, explanation}]" ai />
              <FlowStep n={5} text="Test.objects.create(status='pending') — ALWAYS pending" highlight />
              <FlowStep n={6} text="Teacher reviews → approves/rejects/edits questions" />
              <PromptPreview label="MCQ Prompt" prompt={`Generate exactly {num_questions} multiple-choice questions in JSON.
Lesson Content: {lesson_content[:3000]}
Return: [{ "question": "...", "options": ["A","B","C","D"],
  "correct_answer": 0, "explanation": "..." }]
Rules: correct_answer = index 0-3, challenging but fair.`} />
            </div>
          </div>
          <div style={{ border: `1px solid ${C.indigo}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.indigo, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
              <span>3B. Q&A (Open-Ended) Test</span><AiBadge />
            </div>
            <div style={{ padding: 10 }}>
              <Endpoint path="/api/qa-tests/generate-qa-test/" />
              <FlowStep n={1} text="Teacher clicks 'Q&A Test' on a lesson" />
              <FlowStep n={2} text="AIService.generate_qa_questions(content, num_questions)" ai />
              <FlowStep n={3} text="Gemini returns: [{question, expected_points}]" ai />
              <FlowStep n={4} text="QATest.objects.create(status='pending') — teacher reviews" highlight />
              <FlowStep n={5} text="Questions require understanding, not just facts" />
              <PromptPreview label="Q&A Prompt" prompt={`Generate {num_questions} open-ended questions requiring
detailed written answers. Return JSON:
[{ "question": "...", "expected_points": "3-5 key concepts
   that a complete answer should address" }]
Thought-provoking, aligned with lesson objectives.`} />
            </div>
          </div>
        </div>
        <div style={{ background: `${C.pink}08`, border: `1px solid ${C.pink}25`, borderRadius: 3, padding: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 11, color: C.navy, marginBottom: 4 }}>3C. Personalized Tests (via Chatbot) <AiBadge /></div>
          <div style={{ fontSize: 10, lineHeight: 1.6, color: C.muted }}>
            Chatbot's <code>generate_quiz()</code> → reads Portfolio.get_subject_statistics() per student → maps performance to difficulty:
            <span style={{ fontFamily: "mono", background: "#f0f0f0", padding: "1px 6px", borderRadius: 2, marginLeft: 4 }}>
              &lt;40%=easy | 40-60%=medium | 60-80%=medium-hard | &gt;80%=hard
            </span>
            → creates base Test + PersonalizedTest per student with adjusted difficulty
          </div>
        </div>
        <div style={{ marginTop: 8, padding: "6px 10px", background: `${C.gold}15`, border: `1px solid ${C.gold}40`, borderRadius: 3, fontSize: 10, fontWeight: 600, color: C.navy }}>
          ⚠ All AI-generated tests start as status='pending'. Teacher MUST approve before students can see them.
        </div>
      </div>
    ),
  },
  {
    id: "correction",
    title: "4. Test Correction",
    subtitle: "MCQ = auto-graded (no AI). Q&A = AI grades → teacher finalizes",
    icon: "✅",
    hasAi: true,
    color: C.green,
    content: () => (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ border: `1px solid ${C.green}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.green, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
              <span>4A. MCQ — Auto-Graded</span><NoAiBadge />
            </div>
            <div style={{ padding: 10 }}>
              <FlowStep n={1} text="Student sees only status='approved' tests" />
              <FlowStep n={2} text="Takes test (radio buttons, 1 answer/question)" />
              <FlowStep n={3} text="Submit → score = (correct / total) × 100" highlight />
              <FlowStep n={4} text="TestSubmission created with is_final=True" />
              <FlowStep n={5} text="Score auto-saved to Portfolio.test_results" />
              <FlowStep n={6} text="Student sees immediate result + explanations" />
              <div style={{ marginTop: 6, fontSize: 9, color: C.green, fontWeight: 600 }}>Purely deterministic — no AI involvement.</div>
            </div>
          </div>
          <div style={{ border: `1px solid ${C.purple}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.purple, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
              <span>4B. Q&A — AI + Teacher</span><AiBadge />
            </div>
            <div style={{ padding: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 10, color: C.navy, marginBottom: 4 }}>Phase 1: Student Takes Test</div>
              <FlowStep n={1} text="Fullscreen enforced (ESC/F11 blocked, 500ms re-check)" />
              <FlowStep n={2} text="Timer (default 30min), auto-submit at 0:00" />
              <FlowStep n={3} text="fullscreen_exits tracked for anti-cheating" />
              <div style={{ fontWeight: 600, fontSize: 10, color: C.purple, marginTop: 6, marginBottom: 4 }}>Phase 2: AI Grading (automatic on submit)</div>
              <FlowStep n={4} text="AIService.grade_qa_submission(questions, answers)" ai />
              <FlowStep n={5} text="Per-question: score/10, feedback, strengths, improvements" ai />
              <FlowStep n={6} text="AIService.analyze_student_weaknesses() → weakness categories" ai />
              <FlowStep n={7} text="status → 'ai_graded'" ai />
              <div style={{ fontWeight: 600, fontSize: 10, color: C.navy, marginTop: 6, marginBottom: 4 }}>Phase 3: Teacher Finalizes</div>
              <FlowStep n={8} text="Teacher sees AI scores + can adjust each question" />
              <FlowStep n={9} text="Clicks 'Finalize' → POST finalize/ → Portfolio auto-save" highlight />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 4, alignItems: "center", fontFamily: "mono", fontSize: 10, color: C.muted }}>
          <span>Status flow:</span>
          {["submitted", "ai_graded", "teacher_review", "finalized"].map((s, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{
                background: i === 1 ? `${C.purple}15` : i === 3 ? `${C.green}15` : `${C.navy}08`,
                padding: "2px 6px", borderRadius: 2, fontWeight: i === 3 ? 700 : 400,
                border: `1px solid ${i === 1 ? C.purple : i === 3 ? C.green : C.border}40`,
              }}>{s}</span>
              {i < 3 && <span>→</span>}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "vault",
    title: "5. Vault — Lesson Plan Repository",
    subtitle: "Advisor-managed library. 4 sources in, 2 ways out. CNP PDFs feed AI generation.",
    icon: "🏛️",
    hasAi: true,
    color: C.gold,
    content: () => (
      <div>
        <div style={{ fontWeight: 700, fontSize: 11, color: C.navy, marginBottom: 8 }}>How Plans Enter the Vault (4 Sources)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[
            { type: "ai_yearly", title: "AI Yearly Breakdown", ai: true, color: C.red, desc: "Advisor selects approved CNPTeacherGuide PDF → genai.upload_file() → Gemini generates 20-30 plans from full curriculum", endpoint: "/api/vault-lesson-plans/generate_yearly/" },
            { type: "ai_single", title: "AI Single Plan", ai: true, color: C.orange, desc: "Advisor selects CNP guide PDF + custom topic → Gemini generates 1 detailed plan", endpoint: "/api/vault-lesson-plans/generate_single/" },
            { type: "manual", title: "Manual", ai: false, color: C.teal, desc: "Advisor writes content directly in the platform UI form. No AI.", endpoint: "POST /api/vault-lesson-plans/" },
            { type: "imported", title: "Imported from Teacher", ai: false, color: C.blue, desc: "Advisor imports outstanding teacher lesson into vault. source_teacher FK tracks origin.", endpoint: "/api/vault-lesson-plans/import_from_teacher/" },
          ].map(s => (
            <div key={s.type} style={{ border: `1px solid ${s.color}40`, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ background: s.color, color: C.white, padding: "4px 8px", fontSize: 10, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
                <span>source_type='{s.type}'</span>
                {s.ai ? <AiBadge /> : <NoAiBadge />}
              </div>
              <div style={{ padding: "6px 8px", fontSize: 10, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontWeight: 700, fontSize: 11, color: C.navy, marginBottom: 8 }}>How Teachers Use Vault Plans (2 Exits)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          <div style={{ border: `1px solid ${C.green}40`, borderRadius: 3, padding: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 10, color: C.green, marginBottom: 4 }}>Direct Copy (use_plan) <NoAiBadge /></div>
            <div style={{ fontSize: 10, color: C.muted }}>Copies vault plan as-is → new Lesson (vault_source FK set) → VaultLessonPlanUsage record → use_count++</div>
          </div>
          <div style={{ border: `1px solid ${C.purple}40`, borderRadius: 3, padding: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 10, color: C.purple, marginBottom: 4 }}>AI-Enhanced (generate_lesson) <AiBadge /></div>
            <div style={{ fontSize: 10, color: C.muted }}>Teacher adds custom_instructions → backend builds rich prompt from ALL vault fields (objectives, materials, grammar, vocab, life_skills) → AIService.generate_lesson() → enhanced Lesson with vault_source FK</div>
          </div>
        </div>
        <div style={{ background: `${C.gold}08`, border: `1px solid ${C.gold}30`, borderRadius: 3, padding: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 10, color: C.navy, marginBottom: 4 }}>Vault Exercise Generation <AiBadge /></div>
          <div style={{ fontSize: 10, color: C.muted }}>
            <Endpoint path="/api/vault-exercises/generate_with_ai/" />
            <div style={{ marginTop: 4 }}>Advisor selects plan → generates MCQ or Q&A exercises. Difficulty: easy/medium/hard affects prompt. Saved as VaultExercise.</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "notebook",
    title: "6. Student Notebooks",
    subtitle: "Daily pages: teacher assigns exercises → student answers → teacher marks & comments",
    icon: "📓",
    hasAi: false,
    color: C.pink,
    content: () => (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ border: `1px solid ${C.blue}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.blue, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>Student Side</div>
            <div style={{ padding: 10 }}>
              <FlowStep n={1} text="Opens 'My Notebook' tab in Student Dashboard" />
              <FlowStep n={2} text="Auto-creates today's page if none exists" />
              <FlowStep n={3} text="Fills in: lesson name, answers (if exercises set), personal notes" />
              <FlowStep n={4} text="Sees teacher's feedback (read-only) if provided" />
              <FlowStep n={5} text="Navigates pages with arrows / swipe (75px threshold)" />
              <div style={{ marginTop: 6 }}>
                <Endpoint method="GET" path="/api/notebook-pages/my_pages/" />
                <Endpoint method="GET" path="/api/notebook-pages/today_page/" />
              </div>
            </div>
          </div>
          <div style={{ border: `1px solid ${C.teal}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.teal, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>Teacher Side</div>
            <div style={{ padding: 10 }}>
              <FlowStep n={1} text="Opens 'Notebooks' tab → searchable student list (left sidebar)" />
              <FlowStep n={2} text="Selects student → loads pages newest-first" />
              <FlowStep n={3} text="Sets exercises for student (editable textarea)" />
              <FlowStep n={4} text="Reviews student's answers → marks: ✓ Correct / ~ Partial / ✗ Incorrect" />
              <FlowStep n={5} text="Writes feedback comment → saves" />
              <div style={{ marginTop: 6 }}>
                <Endpoint path="/api/notebook-pages/{id}/set_exercises/" />
                <Endpoint path="/api/notebook-pages/{id}/mark_answer/" />
                <Endpoint path="/api/notebook-pages/{id}/add_teacher_comment/" />
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 8, fontFamily: "mono", fontSize: 10, color: C.muted, textAlign: "center", padding: 6, background: "#f9f9f9", borderRadius: 3 }}>
          Teacher sets exercises → Student answers → Teacher marks & comments → Student sees feedback
        </div>
      </div>
    ),
  },
  {
    id: "cnp",
    title: "7. CNP — Teacher Guide Integration",
    subtitle: "CNP uploads official PDFs → approved → feeds vault AI generation AND future RAG pipeline",
    icon: "📋",
    hasAi: false,
    color: C.red,
    content: () => (
      <div>
        <div style={{ background: `${C.red}06`, border: `1px solid ${C.red}20`, borderRadius: 3, padding: 12, marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: C.navy, marginBottom: 8 }}>CNP is the single source of truth for curriculum material</div>
          <FlowStep n={1} text="CNP Agent uploads guide PDF → POST /api/cnp-teacher-guides/ → status='pending'" />
          <FlowStep n={2} text="Admin/Senior CNP reviews → POST /{id}/approve/ → status='approved'" highlight />
          <FlowStep n={3} text="Guide becomes available to advisors → GET /available_for_generation/?subject=math&grade_level=grade_5" />
          <FlowStep n={4} text="Advisor selects PDF → uses as input to vault generate_yearly/ or generate_single/" />
          <FlowStep n={5} text="Backend: genai.upload_file(guide.pdf_file.path) → usage_count++" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ border: `1px solid ${C.orange}40`, borderRadius: 3, padding: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 10, color: C.navy, marginBottom: 4 }}>Current: Gemini Stopgap</div>
            <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.6 }}>
              CNPTeacherGuide.pdf_file → genai.upload_file() per request → Gemini processes multimodal → VaultLessonPlans created
            </div>
          </div>
          <div style={{ border: `1px solid ${C.green}40`, borderRadius: 3, padding: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 10, color: C.navy, marginBottom: 4 }}>Target: Local RAG Pipeline</div>
            <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.6 }}>
              CNP PDFs → chunk + embed once → vector store → at generation time retrieve relevant chunks → inject into local LLM prompt → curriculum-aligned output
            </div>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 10 }}>
          <span style={{ fontWeight: 600, color: C.navy }}>Access Control: </span>
          <span style={{ color: C.muted }}>CNP=upload+view own | Admin=full CRUD+approve | Teacher/Advisor=view approved only | Student/Parent=no access</span>
        </div>
      </div>
    ),
  },
  {
    id: "advisor",
    title: "8. Advisor Review of Tests",
    subtitle: "Separate quality layer — advisors rate & remark on teacher content. No AI.",
    icon: "👁️",
    hasAi: false,
    color: C.indigo,
    content: () => (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, lineHeight: 1.6, marginBottom: 8, color: C.text }}>
              Advisors see all tests (pending, approved, rejected) from teachers in their subject at their school.
              They provide a <strong>separate quality-control layer</strong> — they do NOT approve/reject tests (that's teacher-only).
            </div>
            <div style={{ fontFamily: "mono", fontSize: 10, background: "#f9f9f9", padding: 8, borderRadius: 3, lineHeight: 1.8 }}>
              <div>AI generates test (pending)</div>
              <div style={{ color: C.muted }}>  ↓</div>
              <div>Teacher reviews + approves/rejects</div>
              <div style={{ color: C.muted }}>  ↓</div>
              <div>Students take the test</div>
              <div style={{ color: C.muted }}>  ↓</div>
              <div style={{ color: C.indigo, fontWeight: 600 }}>Advisor reviews quality (rating 1-5 + remarks)</div>
              <div style={{ color: C.muted }}>  ↓</div>
              <div>Feedback visible to teacher in Reviews tab</div>
            </div>
          </div>
          <div style={{ border: `1px solid ${C.indigo}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.indigo, color: C.white, padding: "4px 8px", fontSize: 10, fontWeight: 700 }}>AdvisorReview model</div>
            <div style={{ padding: 8, fontSize: 10, fontFamily: "mono", lineHeight: 1.8 }}>
              <div>advisor → FK User</div>
              <div>review_type: lesson|mcq|qa</div>
              <div>lesson / mcq_test / qa_test</div>
              <div style={{ color: C.muted }}>(exactly 1 set)</div>
              <div>rating: 1-5 ⭐</div>
              <div>remarks: text</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "inspection",
    title: "9. Inspector & Delegation Inspection",
    subtitle: "Two parallel hierarchies: Inspector/GPI (regional) and Delegation/Advisor (school-level). No AI.",
    icon: "🔍",
    hasAi: false,
    color: C.navy,
    content: () => (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ border: `1px solid ${C.navy}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.navy, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>
              9A. Inspector / GPI System (Regional) <NoAiBadge />
            </div>
            <div style={{ padding: 10 }}>
              <FlowStep n={1} text="Inspector assigned to region(s) via InspectorRegionAssignment" />
              <FlowStep n={2} text="Schedules visit → POST /api/inspection/visits/" />
              <FlowStep n={3} text="Conducts visit → mark_completed/" />
              <FlowStep n={4} text="Writes report → POST /api/inspection/reports/ (gpi_status='pending')" />
              <FlowStep n={5} text="GPI reviews → approve/ | reject/ | request_revision/" highlight />
              <FlowStep n={6} text="Monthly report: generate_stats/ → submit/ → GPI approve/" />
              <div style={{ marginTop: 6, fontSize: 9, color: C.muted }}>Visit types: routine | complaint_followup | annual_review | spot_check</div>
            </div>
          </div>
          <div style={{ border: `1px solid ${C.teal}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.teal, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>
              9B. Delegation / Advisor System <NoAiBadge />
            </div>
            <div style={{ padding: 10 }}>
              <FlowStep n={1} text="Delegation schedules inspection → POST /api/teacher-inspections/" />
              <FlowStep n={2} text="Optionally assigns advisor to conduct it" />
              <FlowStep n={3} text="Status: scheduled → in_progress → completed → submitted" />
              <FlowStep n={4} text="Review submitted with completion report" />
              <div style={{ marginTop: 8, fontWeight: 600, fontSize: 10, color: C.navy }}>Advisor Assignment (separate from inspection):</div>
              <FlowStep n={5} text="POST /api/teacher-advisor-assignments/ → ongoing mentorship" />
              <FlowStep n={6} text="deactivate/ | activate/ | by_teacher/ | by_advisor/" />
              <div style={{ marginTop: 6, fontSize: 9, color: C.muted }}>Advisor sees teacher in purple with UserCheck icon in inspection list</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "parent",
    title: "10. Parent Portal",
    subtitle: "Parents track children's performance, attendance, and chat with teachers. No AI.",
    icon: "👨‍👩‍👧‍👦",
    hasAi: false,
    color: C.orange,
    content: () => (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ border: `1px solid ${C.orange}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.orange, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>
              10A. Student-Relationship Management <NoAiBadge />
            </div>
            <div style={{ padding: 10 }}>
              <FlowStep n={1} text="Parent clicks 'Assign Student' → selects from dropdown of all students" />
              <FlowStep n={2} text="POST /api/parent-students/assign_student/ → ParentStudentRelationship created" />
              <FlowStep n={3} text="relationship_type: parent | guardian | relative | other" />
              <FlowStep n={4} text="is_primary flag + can_view_grades + can_chat_teachers permissions" highlight />
              <FlowStep n={5} text="unique_together = [parent, student] — no duplicates" />
              <div style={{ marginTop: 6 }}>
                <Endpoint method="GET" path="/api/parent-students/my_students/" />
                <Endpoint path="/api/parent-students/assign_student/" />
                <Endpoint method="CRUD" path="/api/parent-students/" />
              </div>
              <ModelTable fields={[
                ["parent", "→ FK User (role=parent)"],
                ["student", "→ FK User (role=student)"],
                ["relationship_type", "parent|guardian|relative|other"],
                ["is_primary", "bool"],
                ["can_view_grades", "bool (default True)"],
                ["can_chat_teachers", "bool (default True)"],
                ["is_active", "bool"],
              ]} />
            </div>
          </div>
          <div style={{ border: `1px solid ${C.purple}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.purple, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>
              10B. Performance Dashboard + Gamification <NoAiBadge />
            </div>
            <div style={{ padding: 10 }}>
              <FlowStep n={1} text="Dashboard loads → GET /api/parent-dashboard/student_performance/" />
              <FlowStep n={2} text="Backend iterates ParentStudentRelationships → loads Portfolio per student" />
              <FlowStep n={3} text="Computes: overall_average, total_tests, recent_tests (last 5)" />
              <FlowStep n={4} text="Gamification: XP = Σ(10 + score×0.4) per test" highlight />
              <FlowStep n={5} text="Level = (XP ÷ 200) + 1 — streak = consecutive weeks with tests" />
              <FlowStep n={6} text="Lists assigned_teachers with rating + comments" />
              <div style={{ marginTop: 6 }}>
                <Endpoint method="GET" path="/api/parent-dashboard/student_performance/" />
                <Endpoint method="GET" path="/api/parent-dashboard/student/{id}/" />
              </div>
              <div style={{ marginTop: 6, padding: "4px 8px", background: `${C.gold}15`, border: `1px solid ${C.gold}40`, borderRadius: 3, fontSize: 9, color: C.navy }}>
                ℹ strengths & weaknesses intentionally excluded for parent privacy
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ border: `1px solid ${C.teal}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.teal, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>
              10C. Parent-Teacher Chat <NoAiBadge />
            </div>
            <div style={{ padding: 10 }}>
              <FlowStep n={1} text="Parent selects child + teacher → POST /api/parent-teacher-chats/start_chat/" />
              <FlowStep n={2} text="ParentTeacherChat created (unique: parent+teacher+student)" />
              <FlowStep n={3} text="Messages: text + optional file_attachment (multipart/form-data)" />
              <FlowStep n={4} text="Read receipts: is_read flag per message" />
              <FlowStep n={5} text="Edit own messages → PATCH /{id}/edit/ → is_edited=True" />
              <FlowStep n={6} text="mark-read/ → bulk marks all unread from other party" />
              <div style={{ marginTop: 6 }}>
                <Endpoint method="GET" path="/api/parent-teacher-chats/my_chats/" />
                <Endpoint path="/api/parent-teacher-chats/start_chat/" />
                <Endpoint path="/api/parent-teacher-chats/{id}/send_message/" />
                <Endpoint path="/api/parent-teacher-chats/{id}/mark-read/" />
              </div>
              <ModelTable fields={[
                ["CHAT", ""],
                ["parent", "→ FK User (role=parent)"],
                ["teacher", "→ FK User (role=teacher)"],
                ["student", "→ FK User (about)"],
                ["subject", "optional subject filter"],
                ["MESSAGE", ""],
                ["sender", "→ FK User"],
                ["message", "text"],
                ["file_attachment", "FileField"],
                ["is_read", "bool"],
                ["is_edited", "bool"],
              ]} />
            </div>
          </div>
          <div style={{ border: `1px solid ${C.green}40`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: C.green, color: C.white, padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>
              10D. Child Attendance Monitoring <NoAiBadge />
            </div>
            <div style={{ padding: 10 }}>
              <FlowStep n={1} text="Parent selects child from dropdown (loaded from my_students/)" />
              <FlowStep n={2} text="Sets date range filter (defaults to current month)" />
              <FlowStep n={3} text="GET /api/student-attendance/?student={id}&start_date&end_date" />
              <FlowStep n={4} text="Daily records: present ✓ | absent ✗ | late ⏰ | excused ℹ" />
              <FlowStep n={5} text="Monthly summary: GET /api/attendance-summaries/?user={id}&month={date}" highlight />
              <FlowStep n={6} text="Shows: total_days, present, absent, late, excused, attendance_rate %" />
              <div style={{ marginTop: 6 }}>
                <Endpoint method="GET" path="/api/student-attendance/?student={id}" />
                <Endpoint method="GET" path="/api/attendance-summaries/?user={id}" />
              </div>
              <div style={{ marginTop: 6, fontSize: 9, color: C.muted }}>
                Rate color: ≥90% green | ≥75% yellow | &lt;75% red — progress bar visualization
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: `${C.orange}08`, border: `1px solid ${C.orange}25`, borderRadius: 3, padding: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 11, color: C.navy, marginBottom: 6 }}>Dashboard Tabs (Frontend)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[
              { tab: "Students", icon: "👥", desc: "Per-child cards: avatar, XP/level/streak, scores, recent tests, teachers list" },
              { tab: "Attendance", icon: "✅", desc: "Child selector + date range → daily records + monthly summary stats" },
              { tab: "Chats", icon: "💬", desc: "Chat list (left) + messages (right) with unread badge count" },
              { tab: "Overview", icon: "📊", desc: "Aggregated stats: total children, total tests, avg score, unread messages" },
            ].map(t => (
              <div key={t.tab} style={{ padding: "6px 8px", border: `1px solid ${C.border}`, borderRadius: 3, fontSize: 10, lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{t.icon} {t.tab}</div>
                <div style={{ color: C.muted }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 8, fontSize: 10 }}>
          <span style={{ fontWeight: 600, color: C.navy }}>Access Control: </span>
          <span style={{ color: C.muted }}>Parent=view own linked students only | Teacher=sees chats from parents of their students | Admin=full access | Student/Others=no access</span>
        </div>
      </div>
    ),
  },
];

// ─── Main App ───
export default function App() {
  const [expanded, setExpanded] = useState(new Set(["lesson"]));
  const [filter, setFilter] = useState("all"); // all | ai | noai

  const toggle = (id) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const filtered = procedures.filter(p =>
    filter === "all" ? true : filter === "ai" ? p.hasAi : !p.hasAi
  );

  const aiCount = procedures.filter(p => p.hasAi).length;
  const noAiCount = procedures.filter(p => !p.hasAi).length;

  return (
    <div style={{ background: C.light, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.navy, color: C.white, padding: "20px 24px" }}>
        <div style={{ fontFamily: "mono", fontSize: 18, fontWeight: 800, letterSpacing: 1 }}>
          منصة الشعب — System Procedures
        </div>
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
          How AI integrates into the platform — 10 procedures · {aiCount} with AI · {noAiCount} manual-only · Gemini 2.5-pro (stopgap) → Local LLM + RAG (target)
        </div>
      </div>

      {/* AI Summary Bar */}
      <div style={{
        background: C.white, borderBottom: `2px solid ${C.navy}`, padding: "12px 24px",
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: "all", label: `All (${procedures.length})`, color: C.navy },
            { id: "ai", label: `AI-Powered (${aiCount})`, color: C.purple },
            { id: "noai", label: `Manual Only (${noAiCount})`, color: C.noAi },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              border: `1px solid ${f.color}40`, borderRadius: 2, padding: "4px 12px",
              background: filter === f.id ? f.color : C.white,
              color: filter === f.id ? C.white : f.color,
              fontWeight: 600, fontSize: 10, cursor: "pointer", fontFamily: "mono",
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, fontSize: 10, fontFamily: "mono" }}>
          <button onClick={() => setExpanded(new Set(filtered.map(p => p.id)))} style={{
            background: "none", border: `1px solid ${C.border}`, borderRadius: 2,
            padding: "3px 8px", cursor: "pointer", fontSize: 10, color: C.muted,
          }}>Expand All</button>
          <button onClick={() => setExpanded(new Set())} style={{
            background: "none", border: `1px solid ${C.border}`, borderRadius: 2,
            padding: "3px 8px", cursor: "pointer", fontSize: 10, color: C.muted,
          }}>Collapse All</button>
        </div>
      </div>

      {/* Cards */}
      <div style={{ padding: "16px 24px", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(p => {
          const isOpen = expanded.has(p.id);
          return (
            <div key={p.id} style={{
              border: `1px solid ${isOpen ? p.color : C.border}`,
              borderRadius: 4, overflow: "hidden", background: C.white,
              borderLeft: `4px solid ${p.color}`,
              transition: "border-color 0.2s",
            }}>
              <div
                onClick={() => toggle(p.id)}
                style={{
                  padding: "12px 16px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                  background: isOpen ? `${p.color}06` : C.white,
                }}
              >
                <span style={{ fontSize: 22 }}>{p.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: C.navy }}>{p.title}</span>
                    {p.hasAi ? <AiBadge /> : <NoAiBadge />}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{p.subtitle}</div>
                </div>
                <span style={{ color: C.muted, fontSize: 16, fontFamily: "mono", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none" }}>▸</span>
              </div>
              {isOpen && (
                <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}` }}>
                  {p.content()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        background: C.navy, color: `${C.white}80`, padding: "16px 24px",
        fontFamily: "mono", fontSize: 10,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span>AI Model: Gemini 2.5-pro (temporary) → Fine-tuned Local + RAG (target)</span>
          <span>PDF Source: CNP Dashboard → approved → Vault AI gen + future RAG vector store</span>
          <span>All AI outputs require human review before student visibility</span>
        </div>
      </div>
    </div>
  );
}
