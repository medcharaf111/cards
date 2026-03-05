import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Calendar, FlaskConical, CheckSquare, Archive,
  NotebookPen, FileText, Eye, Search, ChevronDown,
  Sparkles, User, GraduationCap, Shield, Building2,
  ClipboardList, ArrowRight, Star, Zap, Lock,
  Users, Brain, CheckCircle2, AlertCircle,
} from "lucide-react";

const Background = () => (
  <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
    {/* Base */}
    <div style={{ position:"absolute", inset:0, background:"linear-gradient(160deg,#f4f7ff 0%,#eef1f9 55%,#f2f5ff 100%)" }} />
    {/* Dot matrix */}
    <div style={{
      position:"absolute", inset:0,
      backgroundImage:"radial-gradient(circle,rgba(79,70,229,0.11) 1px,transparent 1px)",
      backgroundSize:"30px 30px",
    }} />
    {/* Subtle right-side bleed */}
    <div style={{
      position:"absolute", top:0, right:0, width:"35%", height:"100%",
      background:"linear-gradient(to left,rgba(124,58,237,0.04),transparent)",
    }} />
    {/* Top accent bar */}
    <div style={{
      position:"absolute", top:0, left:0, right:0, height:3,
      background:"linear-gradient(90deg,#4f46e5 0%,#7c3aed 40%,#0d9488 100%)",
    }} />
  </div>
);

// ─── Light theme tokens ───────────────────────────────────────────────────────
const T = {
  page:    "#f0f2f6",
  card:    "#ffffff",
  sect:    "#f7f8fb",
  sunken:  "#eef0f4",
  bdr:     "#e5e7eb",
  bdr2:    "#d1d5db",
  hi:      "#111827",
  md:      "#4b5563",
  lo:      "#9ca3af",
  blue:    "#3b82f6",
  purple:  "#7c3aed",
  teal:    "#0d9488",
  green:   "#059669",
  gold:    "#d97706",
  red:     "#dc2626",
  pink:    "#db2777",
  indigo:  "#4f46e5",
  orange:  "#ea580c",
  slate:   "#475569",
  ai:      "#7c3aed",
};

// Per-card hero gradients
const HERO = {
  lesson:     ["#1e3a8a","#3b82f6"],
  timetable:  ["#134e4a","#0d9488"],
  testgen:    ["#4c1d95","#7c3aed"],
  correction: ["#064e3b","#059669"],
  vault:      ["#78350f","#d97706"],
  notebook:   ["#831843","#db2777"],
  cnp:        ["#7f1d1d","#dc2626"],
  advisor:    ["#312e81","#4f46e5"],
  inspection: ["#1e293b","#475569"],
  parent:     ["#7c2d12","#ea580c"],
};

// Real photos per card — gradient overlaid on top at ~80% opacity
const HERO_PHOTOS = {
  lesson:     "https://picsum.photos/seed/classroom101/960/200",
  timetable:  "https://picsum.photos/seed/schedule202/960/200",
  testgen:    "https://picsum.photos/seed/science303/960/200",
  correction: "https://picsum.photos/seed/grading404/960/200",
  vault:      "https://picsum.photos/seed/library505/960/200",
  notebook:   "https://picsum.photos/seed/notebook606/960/200",
  cnp:        "https://picsum.photos/seed/document707/960/200",
  advisor:    "https://picsum.photos/seed/meeting808/960/200",
  inspection: "https://picsum.photos/seed/inspect909/960/200",
  parent:     "https://picsum.photos/seed/family010/960/200",
};

// ─── i18n ─────────────────────────────────────────────────────────────────────
const UI = {
  en: {
    title:"منصة الشعب", subtitle:"Platform — How it works",
    heroText:"A complete overview of every major feature — explained for everyone, not just developers. Click any card to learn how it works.",
    featuresAi:"features powered by AI", featuresManual:"features fully manual",
    all:"All features", ai:"AI-powered", manual:"Manual / Rules",
    expandAll:"Expand all", collapseAll:"Collapse all", aiBadge:"AI-powered",
    footer:"Platform documentation · All AI features require human review before reaching students",
  },
  ar: {
    title:"منصة الشعب", subtitle:"المنصة — كيف تعمل",
    heroText:"نظرة شاملة على كل ميزة رئيسية في المنصة — مشروحة للجميع، وليس للمطورين فقط. اضغط على أي بطاقة لمعرفة كيفية عملها.",
    featuresAi:"ميزة مدعومة بالذكاء الاصطناعي", featuresManual:"ميزة يدوية بالكامل",
    all:"جميع الميزات", ai:"ذكاء اصطناعي", manual:"يدوي",
    expandAll:"توسيع الكل", collapseAll:"طي الكل", aiBadge:"مدعوم بالذكاء الاصطناعي",
    footer:"توثيق المنصة · جميع مخرجات الذكاء الاصطناعي تستلزم مراجعة بشرية قبل وصولها للتلاميذ",
  },
};

const ROLE_LABELS = {
  en: { Teacher:"Teacher", Student:"Student", Advisor:"Advisor", Director:"Director", Inspector:"Inspector", CNP:"CNP", AI:"AI", Parent:"Parent" },
  ar: { Teacher:"أستاذ", Student:"تلميذ", Advisor:"متفقد مساعد", Director:"مدير", Inspector:"متفقّد", CNP:"هيئة المناهج", AI:"ذكاء اصطناعي", Parent:"ولي الأمر" },
};
const ROLE_META = {
  Teacher:  { color:"#2563eb", Icon:GraduationCap },
  Student:  { color:"#059669", Icon:User           },
  Advisor:  { color:"#4f46e5", Icon:Shield         },
  Director: { color:"#0d9488", Icon:Building2      },
  Inspector:{ color:"#ea580c", Icon:Search         },
  CNP:      { color:"#dc2626", Icon:FileText       },
  AI:       { color:"#7c3aed", Icon:Sparkles       },
  Parent:   { color:"#ea580c", Icon:Users          },
};

// ─── Font helper ──────────────────────────────────────────────────────────────
const font = (lang) => lang === "ar"
  ? "'Cairo','Segoe UI',system-ui,sans-serif"
  : "'Inter',system-ui,sans-serif";

// ─── Atoms ────────────────────────────────────────────────────────────────────
const RolePill = ({ role, lang }) => {
  const { color, Icon } = ROLE_META[role] ?? { color:T.slate, Icon:User };
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:`${color}12`, color,
      border:`1.5px solid ${color}28`,
      borderRadius:20, padding:"4px 12px",
      fontSize:11, fontWeight:700, whiteSpace:"nowrap",
      fontFamily:font("en"),
    }}>
      <Icon size={11} strokeWidth={2.5} />{ROLE_LABELS[lang][role] ?? role}
    </span>
  );
};

const Step = ({ icon: Icon, title, body, accent, last, rtl }) => (
  <div style={{ display:"flex", gap:14, position:"relative" }}>
    {!last && (
      <div style={{
        position:"absolute",
        ...(rtl ? { right:18 } : { left:18 }),
        top:40, bottom:-6, width:1.5,
        background:`linear-gradient(${accent}50,transparent)`,
      }} />
    )}
    <div style={{
      flexShrink:0, width:36, height:36,
      background:`${accent}10`, border:`1.5px solid ${accent}30`,
      borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", zIndex:1,
    }}>
      <Icon size={16} color={accent} strokeWidth={2} />
    </div>
    <div style={{ paddingBottom: last ? 0 : 18 }}>
      <div style={{ fontWeight:700, fontSize:13.5, color:T.hi, marginBottom:3 }}>{title}</div>
      <div style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{body}</div>
    </div>
  </div>
);

const Highlight = ({ icon: Icon, color, title, children }) => (
  <div style={{
    background:`${color}08`, border:`1.5px solid ${color}20`,
    borderRadius:14, padding:"16px 18px",
  }}>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
      <div style={{ background:`${color}15`, borderRadius:8, padding:6 }}>
        <Icon size={14} color={color} strokeWidth={2.2} />
      </div>
      <span style={{ fontWeight:700, fontSize:13, color }}>{title}</span>
    </div>
    <div style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{children}</div>
  </div>
);

const Chip = ({ label, color }) => (
  <span style={{
    background:`${color}10`, border:`1.5px solid ${color}25`,
    borderRadius:8, padding:"5px 13px", fontSize:12, color, fontWeight:600,
  }}>{label}</span>
);

const Panel = ({ accent, title, children, roles, lang }) => (
  <div style={{
    background:T.sect, border:`1.5px solid ${accent}20`,
    borderRadius:14, overflow:"hidden",
  }}>
    <div style={{
      background:`${accent}08`, borderBottom:`1.5px solid ${accent}15`,
      padding:"11px 16px",
      display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, flexWrap:"wrap",
    }}>
      <span style={{ fontWeight:700, fontSize:13, color:accent }}>{title}</span>
      {roles && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {roles.map(r => <RolePill key={r} role={r} lang={lang} />)}
        </div>
      )}
    </div>
    <div style={{ padding:"14px 16px" }}>{children}</div>
  </div>
);

const TwoCol = ({ children, gap=14 }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap }}>{children}</div>
);

// ─── Content components ───────────────────────────────────────────────────────

const LessonContent = ({ lang }) => {
  const rtl = lang === "ar";
  const s = {
    en: {
      intro:"Teachers can create a full, structured lesson plan in minutes. The platform offers three different starting points — all of them result in a ready-to-teach lesson adapted to the subject and grade level.",
      p1t:"Start from scratch", p1b:"Open the Lessons tab, pick a subject and grade, and type what you want to teach. The platform writes the full lesson — objectives, content, examples, and practice questions — instantly.",
      p2t:"Ask the AI chatbot", p2b:"Just chat naturally:", p2em:`"Create a lesson about fractions for 3rd grade."`, p2b2:"The assistant understands the request and builds the lesson automatically.",
      p3t:"Use a plan from the library", p3b:"Browse the school's lesson library (the Vault), find a ready-made plan that fits your class, and either use it as-is or add your own instructions so the AI tailors it for your students.",
      out_t:"What the AI actually produces", out_b:"Every generated lesson includes a clear title, learning objectives, full lesson content, worked examples, and practice questions — all calibrated to the right age group and difficulty level. The teacher can read, edit, or regenerate any part before using it in class.",
      val_t:"One important requirement", val_b:"A teacher must be officially assigned to a subject before they can create lessons for it. If no assignment exists, the platform warns them and the generate button stays disabled until a director sets up the assignment.",
    },
    ar: {
      intro:"يستطيع الأساتذة إنشاء خطط دروس كاملة ومنظمة في دقائق. تتيح المنصة ثلاثة مسارات مختلفة للبدء — وجميعها تنتهي بدرس جاهز للتدريس، مناسب للمادة والمستوى الدراسي.",
      p1t:"البدء من الصفر", p1b:"افتح تبويب الدروس، اختر المادة والصف، واكتب ما تريد تدريسه. تُنشئ المنصة الدرس الكامل — الأهداف، المحتوى، الأمثلة، والأسئلة التدريبية — فوراً.",
      p2t:"اسأل المساعد الذكي", p2b:"تحدث بشكل طبيعي:", p2em:`"أنشئ درساً عن الكسور للصف الثالث."`, p2b2:"يفهم المساعد الطلب ويبني الدرس تلقائياً.",
      p3t:"استخدم خطة من المكتبة", p3b:"تصفّح مكتبة خطط الدروس (الخزينة)، ابحث عن خطة جاهزة تناسب فصلك، واستخدمها كما هي أو أضف تعليماتك ليكيّفها الذكاء الاصطناعي لتلاميذك.",
      out_t:"ما يُنتجه الذكاء الاصطناعي فعلياً", out_b:"كل درس يتضمن عنواناً واضحاً، أهداف تعلم، محتوى الدرس الكامل، أمثلة تطبيقية، وأسئلة تدريبية — مصممة للفئة العمرية الصحيحة. يمكن للأستاذ قراءة أي جزء وتعديله أو إعادة توليده قبل استخدامه.",
      val_t:"متطلب أساسي واحد", val_b:"يجب أن يكون الأستاذ معيناً رسمياً على المادة قبل إنشاء دروس لها. في حال عدم وجود تعيين، تنبّه المنصة الأستاذ وتبقي زر الإنشاء معطلاً حتى يُعدّ المدير التعيين.",
    },
  }[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <p style={{ fontSize:14, color:T.md, lineHeight:1.85 }}>{s.intro}</p>
      <TwoCol>
        <Panel accent={T.blue}   title={s.p1t} roles={["Teacher"]}        lang={lang}><p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{s.p1b}</p></Panel>
        <Panel accent={T.purple} title={s.p2t} roles={["Teacher","AI"]}   lang={lang}><p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{s.p2b} <em style={{ color:T.purple }}>{s.p2em}</em> {s.p2b2}</p></Panel>
      </TwoCol>
      <Panel accent={T.teal} title={s.p3t} roles={["Teacher"]} lang={lang}><p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{s.p3b}</p></Panel>
      <Highlight icon={Sparkles}    color={T.purple} title={s.out_t}>{s.out_b}</Highlight>
      <Highlight icon={AlertCircle} color={T.gold}   title={s.val_t}>{s.val_b}</Highlight>
    </div>
  );
};

const TimetableContent = ({ lang }) => {
  const s = {
    en: {
      intro:"The platform handles two completely separate kinds of scheduling — one for managing when a teacher works, and one for planning what they'll teach.",
      p1t:"Work schedule", p1b1:"The school director sets each teacher's working hours for every day of the week — for example, Monday 8 AM to 2 PM.",
      p1b2:"Used automatically for attendance: when a teacher checks in, the system compares the time against their schedule and records them as on time, late, or absent — no manual entry needed.",
      p2t:"Teaching calendar", p2b1:"Teachers plan which lessons they'll deliver on which days by adding sessions to a calendar — like a visual lesson planner.",
      p2blue:"blue for planned,", p2green:"green for taught,", p2red:"red for cancelled.", p2b2:"Students and advisors can view this calendar too.",
    },
    ar: {
      intro:"تدير المنصة نوعين مختلفين تماماً من الجداول — أحدهما لإدارة أوقات عمل الأستاذ، والآخر لتخطيط ما سيُدرَّس.",
      p1t:"جدول العمل الأسبوعي", p1b1:"يحدد مدير المدرسة ساعات عمل كل أستاذ لكل يوم من أيام الأسبوع.",
      p1b2:"يُستخدم تلقائياً لتتبع الحضور: عند تسجيل الدخول، يقارن النظام الوقت بالجدول ويسجل الأستاذ حاضراً أو متأخراً أو غائباً.",
      p2t:"تقويم التدريس", p2b1:"يخطط الأساتذة الدروس في أيام محددة عبر إضافة جلسات إلى التقويم.",
      p2blue:"أزرق للمخطط،", p2green:"أخضر للمُدرَّس،", p2red:"أحمر للملغى.", p2b2:"يمكن للتلاميذ والمتفقدين المساعدين الاطلاع على التقويم.",
    },
  }[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <p style={{ fontSize:14, color:T.md, lineHeight:1.85 }}>{s.intro}</p>
      <TwoCol>
        <Panel accent={T.teal} title={s.p1t} roles={["Director","Teacher"]} lang={lang}>
          <p style={{ fontSize:12.5, color:T.md, lineHeight:1.75, marginBottom:8 }}>{s.p1b1}</p>
          <p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{s.p1b2}</p>
        </Panel>
        <Panel accent={T.blue} title={s.p2t} roles={["Teacher","Student","Advisor"]} lang={lang}>
          <p style={{ fontSize:12.5, color:T.md, lineHeight:1.75, marginBottom:8 }}>{s.p2b1}</p>
          <p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>
            <span style={{ color:T.blue, fontWeight:600 }}>{s.p2blue}</span>{" "}
            <span style={{ color:T.green, fontWeight:600 }}>{s.p2green}</span>{" "}
            <span style={{ color:T.red, fontWeight:600 }}>{s.p2red}</span>{" "}{s.p2b2}
          </p>
        </Panel>
      </TwoCol>
    </div>
  );
};

const TestGenContent = ({ lang }) => {
  const rtl = lang === "ar";
  const s = {
    en: {
      intro:"Tests are generated from lesson content automatically — teachers don't write questions by hand. The AI reads the lesson and creates a full set of questions. The teacher always reviews and approves before any student sees them.",
      mcq:"Multiple-choice tests", qa:"Open-ended written tests",
      m1t:"Pick a lesson",      m1b:"Teacher clicks 'Generate Test' on any lesson they've created.",
      m2t:"AI reads the lesson", m2b:"The platform reads the lesson content and creates questions with four answer choices each, marking the correct one and explaining why.",
      m3t:"Teacher reviews",    m3b:"The test lands in the teacher's review queue. They can approve, reject, or edit any question before students can access it.",
      q1t:"Pick a lesson",         q1b:"Same starting point — teacher selects any lesson and requests a written Q&A test.",
      q2t:"AI writes open questions", q2b:"Questions require students to think and explain, not just pick an option. Each question comes with key points the answer should cover.",
      q3t:"Teacher reviews",       q3b:"Same approval process — no student sees anything until the teacher gives the green light.",
      pers_t:"Personalized tests that adapt to each student",
      pers_b:"Through the AI chatbot, teachers can generate personalized tests. The system looks at each student's past performance and automatically adjusts difficulty — struggling students get easier questions to build confidence, high performers get harder ones to stay challenged.",
      lock_t:"Nothing goes live without teacher approval",
      lock_b:"Every AI-generated test starts as a draft. Students cannot see it or take it until the teacher explicitly approves it. The teacher is always in control.",
      diff:[["< 40%","Easy",T.green],["40–60%","Medium",T.gold],["60–80%","Med-Hard",T.orange],["> 80%","Hard",T.red]],
    },
    ar: {
      intro:"تُولَّد الاختبارات تلقائياً من محتوى الدرس — لا يكتب الأساتذة الأسئلة يدوياً. يراجع الأستاذ دائماً ويوافق قبل أن يرى أي تلميذ الاختبار.",
      mcq:"اختبارات الاختيار من متعدد", qa:"اختبارات الإجابة المكتوبة",
      m1t:"اختر درساً",              m1b:"يضغط الأستاذ على 'إنشاء اختبار' على أي درس.",
      m2t:"الذكاء الاصطناعي يقرأ",   m2b:"تُنشئ المنصة أسئلة بأربعة خيارات لكل منها مع الإجابة الصحيحة والشرح.",
      m3t:"الأستاذ يراجع",            m3b:"يمكنه الموافقة أو الرفض أو تعديل أي سؤال قبل وصوله للتلاميذ.",
      q1t:"اختر درساً",               q1b:"نفس نقطة البداية لاختبار إجابات مكتوبة.",
      q2t:"الذكاء الاصطناعي يكتب أسئلة", q2b:"أسئلة تتطلب التفكير والشرح، مع النقاط الرئيسية لكل إجابة.",
      q3t:"الأستاذ يراجع",             q3b:"نفس عملية الموافقة — لا يرى أي تلميذ شيئاً حتى يعطي الأستاذ الضوء الأخضر.",
      pers_t:"اختبارات مخصصة تتكيف مع كل تلميذ",
      pers_b:"يرى النظام أداء كل تلميذ السابق ويضبط مستوى الصعوبة تلقائياً — التلاميذ المتعثرون يحصلون على أسئلة أسهل، والمتفوقون على أصعب.",
      lock_t:"لا شيء يُنشر دون موافقة الأستاذ",
      lock_b:"كل اختبار يبدأ كمسودة. لا يمكن للتلاميذ رؤيته حتى يوافق الأستاذ صراحةً عليه.",
      diff:[["< 40%","سهل",T.green],["40–60%","متوسط",T.gold],["60–80%","متوسط صعب",T.orange],["> 80%","صعب",T.red]],
    },
  }[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <p style={{ fontSize:14, color:T.md, lineHeight:1.85 }}>{s.intro}</p>
      <TwoCol>
        <Panel accent={T.purple} title={s.mcq} roles={["Teacher","AI"]} lang={lang}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
            <Step icon={BookOpen}     accent={T.purple} title={s.m1t} body={s.m1b} rtl={rtl} />
            <Step icon={Brain}        accent={T.ai}     title={s.m2t} body={s.m2b} rtl={rtl} />
            <Step icon={CheckCircle2} accent={T.purple} title={s.m3t} body={s.m3b} rtl={rtl} last />
          </div>
        </Panel>
        <Panel accent={T.indigo} title={s.qa} roles={["Teacher","AI"]} lang={lang}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
            <Step icon={BookOpen}     accent={T.indigo} title={s.q1t} body={s.q1b} rtl={rtl} />
            <Step icon={Brain}        accent={T.ai}     title={s.q2t} body={s.q2b} rtl={rtl} />
            <Step icon={CheckCircle2} accent={T.indigo} title={s.q3t} body={s.q3b} rtl={rtl} last />
          </div>
        </Panel>
      </TwoCol>
      <Highlight icon={Star} color={T.pink} title={s.pers_t}>
        <p style={{ marginBottom:10 }}>{s.pers_b}</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {s.diff.map(([range, label, color], i) => (
            <span key={i} style={{ background:`${color}12`, border:`1.5px solid ${color}28`, borderRadius:8, padding:"4px 12px", fontSize:11.5, color, fontWeight:700 }}>{range} → {label}</span>
          ))}
        </div>
      </Highlight>
      <Highlight icon={Lock} color={T.gold} title={s.lock_t}>{s.lock_b}</Highlight>
    </div>
  );
};

const CorrectionContent = ({ lang }) => {
  const rtl = lang === "ar";
  const s = {
    en: {
      intro:"How a test gets graded depends on its type. Multiple-choice tests grade themselves instantly. Written tests get an AI first-pass, then the teacher makes the final call.",
      mcq:"Multiple-choice: instant results", qa:"Written tests: AI + teacher",
      mc1t:"Student takes the test",   mc1b:"The student answers each question by selecting one of four options.",
      mc2t:"Scored immediately",        mc2b:"The moment they submit, the score appears. No waiting — the system counts correct answers and calculates the percentage automatically.",
      mc3t:"Full breakdown shown",      mc3b:"The student sees which questions they got right or wrong, and an explanation for every answer so they learn from their mistakes right away.",
      mcNote:"Completely automatic — no teacher action required.",
      q1t:"Protected test environment", q1b:"The test runs in fullscreen mode. The system tracks if students try to leave, and automatically submits when the timer runs out.",
      q2t:"AI grades every answer",     q2b:"As soon as the student submits, the AI scores each written answer, writes feedback on what was strong and what could be better.",
      q3t:"Teacher reviews and finalizes", q3b:"The teacher sees the AI's scores and comments, can adjust any score, then clicks Finalize. Only then does the grade get saved.",
      statusLabel:"Status of a written test through its life",
      statuses:[["Submitted","Student handed it in"],["AI Graded","AI has scored it"],["Teacher Review","Teacher is checking"],["Finalized","Grade is official"]],
    },
    ar: {
      intro:"طريقة التصحيح تعتمد على نوع الاختبار. الاختيار من متعدد يُصحَّح فوراً. الأسئلة المكتوبة تحظى بمراجعة أولية من الذكاء الاصطناعي ثم الأستاذ يقرر.",
      mcq:"الاختيار من متعدد: نتائج فورية", qa:"الأسئلة المكتوبة: ذكاء اصطناعي + أستاذ",
      mc1t:"التلميذ يُجري الاختبار",    mc1b:"يجيب التلميذ على كل سؤال باختيار خيار من الأربعة.",
      mc2t:"التصحيح فوري",              mc2b:"في اللحظة التي يُرسل فيها، تظهر النتيجة. لا انتظار.",
      mc3t:"تفصيل كامل يُعرض",         mc3b:"يرى التلميذ ما أصابه وما أخطأ فيه، مع شرح لكل إجابة.",
      mcNote:"تلقائي بالكامل — لا يحتاج لأي إجراء من الأستاذ.",
      q1t:"بيئة اختبار محمية",          q1b:"يعمل الاختبار في وضع الشاشة الكاملة ويُرسل تلقائياً عند انتهاء الوقت.",
      q2t:"الذكاء الاصطناعي يصحح",    q2b:"يُقيّم الذكاء الاصطناعي كل إجابة ويكتب ملاحظات تفصيلية.",
      q3t:"الأستاذ يراجع ويُنهي",       q3b:"يرى الأستاذ الدرجات والتعليقات، يعدّل ما يراه، ثم يُنهي. عندها تُحفظ الدرجة رسمياً.",
      statusLabel:"مراحل الاختبار المكتوب",
      statuses:[["مُرسَل","التلميذ سلّمه"],["صُحِّح بالذكاء","الذكاء الاصطناعي قيّمه"],["مراجعة الأستاذ","الأستاذ يفحصه"],["مُنتهٍ","الدرجة رسمية"]],
    },
  }[lang];
  const sc = [T.blue, T.purple, T.gold, T.green];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <p style={{ fontSize:14, color:T.md, lineHeight:1.85 }}>{s.intro}</p>
      <TwoCol>
        <Panel accent={T.green} title={s.mcq} roles={["Student"]} lang={lang}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
            <Step icon={ClipboardList} accent={T.green} title={s.mc1t} body={s.mc1b} rtl={rtl} />
            <Step icon={Zap}           accent={T.green} title={s.mc2t} body={s.mc2b} rtl={rtl} />
            <Step icon={CheckCircle2}  accent={T.green} title={s.mc3t} body={s.mc3b} rtl={rtl} last />
          </div>
          <div style={{ marginTop:12, fontSize:11.5, color:T.green, fontWeight:700, background:`${T.green}08`, borderRadius:8, padding:"8px 12px" }}>{s.mcNote}</div>
        </Panel>
        <Panel accent={T.purple} title={s.qa} roles={["Student","AI","Teacher"]} lang={lang}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
            <Step icon={Lock}         accent={T.orange} title={s.q1t} body={s.q1b} rtl={rtl} />
            <Step icon={Brain}        accent={T.ai}     title={s.q2t} body={s.q2b} rtl={rtl} />
            <Step icon={CheckCircle2} accent={T.purple} title={s.q3t} body={s.q3b} rtl={rtl} last />
          </div>
        </Panel>
      </TwoCol>
      <div style={{ background:T.sect, border:`1.5px solid ${T.bdr}`, borderRadius:14, padding:"18px 20px" }}>
        <div style={{ fontWeight:700, fontSize:12.5, color:T.md, marginBottom:14 }}>{s.statusLabel}</div>
        <div style={{ display:"flex", gap:10, alignItems:"flex-start", flexWrap:"wrap" }}>
          {s.statuses.map(([label, desc], i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ background:`${sc[i]}12`, border:`1.5px solid ${sc[i]}30`, borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:700, color:sc[i] }}>{label}</div>
                <div style={{ fontSize:10, color:T.lo, marginTop:4 }}>{desc}</div>
              </div>
              {i < 3 && <ArrowRight size={14} color={T.lo} style={{ flexShrink:0, ...(rtl?{transform:"scaleX(-1)"}:{}) }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VaultContent = ({ lang }) => {
  const s = {
    en: {
      intro:"The Vault is the school's shared library of official, pre-approved lesson plans. Advisors manage it. Teachers browse it and use plans directly in their classes.",
      srcTitle:"How plans get into the library",
      sources:[
        { title:"From an official curriculum PDF", color:T.red,    roles:["Advisor","AI"],      body:"An advisor uploads an official curriculum guide PDF. The AI reads the entire document and automatically generates 20–30 complete lesson plans covering the full academic year." },
        { title:"Single AI-generated plan",        color:T.orange, roles:["Advisor","AI"],      body:"The advisor specifies a topic. The AI generates one detailed, polished lesson plan for that exact topic." },
        { title:"Written manually",                color:T.teal,   roles:["Advisor"],           body:"The advisor writes the plan directly in the platform — no AI. Useful for specialized content or local adaptations." },
        { title:"Imported from a teacher",         color:T.blue,   roles:["Advisor","Teacher"], body:"If a teacher created an outstanding lesson, the advisor can pull it into the official library so every teacher benefits." },
      ],
      exTitle:"How teachers use library plans",
      e1t:"Use it as-is",             e1b:"One click copies the plan into the teacher's lesson list, ready to teach. The library tracks usage so advisors see which plans are most popular.",
      e2t:"Customize it with AI",     e2b:"The teacher adds instructions like", e2em:`"make it more interactive"`, e2b2:"or", e2em2:`"focus more on vocabulary"`, e2b3:", and the AI rewrites the plan incorporating their notes while keeping all curriculum requirements.",
    },
    ar: {
      intro:"الخزينة هي المكتبة المشتركة للمدرسة من خطط الدروس الرسمية المعتمدة. يديرها المتفقدون المساعدون ويستخدمها الأساتذة في فصولهم.",
      srcTitle:"كيف تدخل الخطط إلى المكتبة",
      sources:[
        { title:"من ملف PDF المنهج الرسمي",   color:T.red,    roles:["Advisor","AI"],      body:"يرفع المتفقد المساعد ملف PDF لدليل المنهج. يُنشئ الذكاء الاصطناعي 20-30 خطة درس كاملة تغطي السنة الدراسية." },
        { title:"خطة واحدة بالذكاء الاصطناعي",color:T.orange, roles:["Advisor","AI"],      body:"يحدد المتفقد المساعد موضوعاً فيُنشئ الذكاء الاصطناعي خطة درس واحدة مفصلة." },
        { title:"كتابة يدوية",                 color:T.teal,   roles:["Advisor"],           body:"يكتب المتفقد المساعد الخطة مباشرة في المنصة بدون ذكاء اصطناعي. مفيد للمحتوى المتخصص." },
        { title:"مستوردة من أستاذ",             color:T.blue,   roles:["Advisor","Teacher"], body:"إذا أنشأ أستاذ درساً متميزاً، يمكن للمتفقد مساعد سحبه إلى المكتبة ليستفيد منه الجميع." },
      ],
      exTitle:"كيف يستخدم الأساتذة خطط المكتبة",
      e1t:"استخدامها كما هي",         e1b:"بنقرة واحدة تُنسخ الخطة إلى قائمة دروس الأستاذ. تسجل المكتبة الاستخدام.",
      e2t:"تخصيصها بالذكاء الاصطناعي", e2b:"يضيف الأستاذ تعليمات مثل", e2em:`"اجعلها تفاعلية"`, e2b2:"أو", e2em2:`"ركز على المفردات"`, e2b3:"، ويعيد الذكاء الاصطناعي كتابتها مع الحفاظ على المنهج.",
    },
  }[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <p style={{ fontSize:14, color:T.md, lineHeight:1.85 }}>{s.intro}</p>
      <div>
        <div style={{ fontWeight:700, fontSize:13.5, color:T.hi, marginBottom:12 }}>{s.srcTitle}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {s.sources.map(src => (
            <div key={src.title} style={{ background:T.sect, border:`1.5px solid ${src.color}20`, borderRadius:14, overflow:"hidden" }}>
              <div style={{ background:`${src.color}08`, borderBottom:`1.5px solid ${src.color}15`, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:6 }}>
                <span style={{ fontWeight:700, fontSize:12.5, color:src.color }}>{src.title}</span>
                <div style={{ display:"flex", gap:5 }}>{src.roles.map(r => <RolePill key={r} role={r} lang={lang} />)}</div>
              </div>
              <div style={{ padding:"12px 14px" }}><p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{src.body}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontWeight:700, fontSize:13.5, color:T.hi, marginBottom:12 }}>{s.exTitle}</div>
        <TwoCol>
          <Panel accent={T.green} title={s.e1t} roles={["Teacher"]} lang={lang}><p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{s.e1b}</p></Panel>
          <Panel accent={T.ai}    title={s.e2t} roles={["Teacher","AI"]} lang={lang}><p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{s.e2b} <em style={{ color:T.ai }}>{s.e2em}</em> {s.e2b2} <em style={{ color:T.ai }}>{s.e2em2}</em>{s.e2b3}</p></Panel>
        </TwoCol>
      </div>
    </div>
  );
};

const NotebookContent = ({ lang }) => {
  const rtl = lang === "ar";
  const s = {
    en: {
      intro:"Every student has a digital notebook that works like a daily log. Each day gets its own page. Teachers assign exercises, students write answers, and teachers mark and comment — all in one place.",
      st:"The student's experience", te:"The teacher's experience",
      s1t:"Opens today's page",  s1b:"When the student opens their notebook, today's page is already there — created automatically.",
      s2t:"Sees the exercises",  s2b:"If the teacher set exercises, they appear at the top. The student writes answers directly on the page.",
      s3t:"Gets feedback",       s3b:"Once the teacher marks the work, the student sees their marks and comments on the same page.",
      t1t:"Searches for a student", t1b:"The Notebooks tab shows a searchable list of all assigned students.",
      t2t:"Sets exercises",         t2b:"The teacher types exercises directly into the student's page for the day.",
      t3t:"Marks and comments",     t3b:"After reviewing answers, the teacher marks each one and writes a comment. The student sees it immediately.",
      loop_t:"The full loop", loop_b:"Teacher writes exercises → Student answers → Teacher marks the work → Student reads feedback — all in the same notebook page.",
    },
    ar: {
      intro:"كل تلميذ لديه كراس رقمي يعمل كسجل يومي. كل يوم يحصل على صفحته. يضع الأساتذة التمارين، يكتب التلاميذ الإجابات، ويصحح الأساتذة ويعلقون — كل شيء في مكان واحد.",
      st:"تجربة التلميذ", te:"تجربة الأستاذ",
      s1t:"يفتح صفحة اليوم",  s1b:"صفحة اليوم موجودة تلقائياً عند الفتح.",
      s2t:"يرى التمارين",     s2b:"تظهر التمارين في أعلى الصفحة ويكتب التلميذ إجاباته.",
      s3t:"يحصل على ملاحظات", s3b:"بعد التصحيح يرى التلميذ علاماته وتعليقات الأستاذ.",
      t1t:"يبحث عن تلميذ",   t1b:"قائمة التلاميذ قابلة للبحث في تبويب الكراريس.",
      t2t:"يحدد التمارين",   t2b:"يكتب الأستاذ التمارين مباشرة في صفحة التلميذ.",
      t3t:"يصحح ويعلق",     t3b:"يحدد علامة لكل إجابة ويكتب تعليقاً. التلميذ يراه فوراً.",
      loop_t:"الحلقة الكاملة", loop_b:"الأستاذ يكتب التمارين ← التلميذ يجيب ← الأستاذ يصحح ← التلميذ يقرأ الملاحظات — في نفس الصفحة.",
    },
  }[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <p style={{ fontSize:14, color:T.md, lineHeight:1.85 }}>{s.intro}</p>
      <TwoCol>
        <Panel accent={T.green} title={s.st} roles={["Student"]} lang={lang}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
            <Step icon={BookOpen}     accent={T.green} title={s.s1t} body={s.s1b} rtl={rtl} />
            <Step icon={ClipboardList}accent={T.green} title={s.s2t} body={s.s2b} rtl={rtl} />
            <Step icon={CheckCircle2} accent={T.green} title={s.s3t} body={s.s3b} rtl={rtl} last />
          </div>
        </Panel>
        <Panel accent={T.teal} title={s.te} roles={["Teacher"]} lang={lang}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
            <Step icon={Users}        accent={T.teal} title={s.t1t} body={s.t1b} rtl={rtl} />
            <Step icon={ClipboardList}accent={T.teal} title={s.t2t} body={s.t2b} rtl={rtl} />
            <Step icon={CheckCircle2} accent={T.teal} title={s.t3t} body={s.t3b} rtl={rtl} last />
          </div>
        </Panel>
      </TwoCol>
      <Highlight icon={ArrowRight} color={T.pink} title={s.loop_t}>{s.loop_b}</Highlight>
    </div>
  );
};

const CnpContent = ({ lang }) => {
  const rtl = lang === "ar";
  const s = {
    en: {
      intro:"CNP is the official curriculum body. They upload official teacher guide PDFs — the same books teachers use in real classrooms. Once approved, those PDFs become the source material for generating lesson plans in the Vault.",
      st1t:"CNP uploads a guide",              st1b:"A CNP agent uploads the official PDF for a subject and grade. The guide enters a pending state — not yet usable.",
      st2t:"A senior CNP member approves it",  st2b:"A senior reviewer checks the document and approves it. Only after approval does it become available to advisors.",
      st3t:"Advisors can now use it",          st3b:"Advisors can select the approved guide to generate lesson plans for the Vault — a full year's worth or individual plans.",
      st4t:"AI reads the PDF and generates plans", st4b:"The AI processes the entire guide — understanding its structure, topics, and objectives — then writes complete lesson plans.",
      cur_t:"How it works today",    cur_b:"The AI reads the PDF fresh each time a plan is generated. Fast and effective — but the PDF is processed repeatedly.",
      fut_t:"Where this is heading", fut_b:"In the future, PDFs will be processed once and stored as a searchable knowledge base. The AI will pull from it at generation time — faster, smarter, curriculum-aware.",
      acc_title:"Who can access these guides", acc_b:"CNP members can upload and see their own files. Admins can manage and approve everything. Teachers and advisors see approved guides only. Students and parents have no access.",
    },
    ar: {
      intro:"هيئة المناهج هي الجهة الرسمية للمنهج. ترفع ملفات PDF الرسمية التي يستخدمها الأساتذة. بعد الاعتماد تصبح مصدراً لتوليد خطط الدروس في الخزينة.",
      st1t:"هيئة المناهج ترفع الدليل",           st1b:"يرفع عضو ملف PDF الرسمي للمادة. يدخل في حالة انتظار.",
      st2t:"عضو أول يعتمده",                      st2b:"يفحص مراجع أول الوثيقة ويعتمدها. بعدها يصبح متاحاً للمتفقدين مساعدين.",
      st3t:"المتفقدون المساعدون يمكنهم الاستخدام",         st3b:"يمكن للمتفقدين مساعدين تحديد الدليل لتوليد خطط سنة كاملة أو خطط فردية.",
      st4t:"الذكاء الاصطناعي يقرأ ويُنشئ الخطط", st4b:"يعالج الذكاء الاصطناعي الدليل كاملاً ويكتب خطط دروس متكاملة.",
      cur_t:"كيف يعمل الآن",    cur_b:"يقرأ الذكاء الاصطناعي الملف في كل مرة — سريع لكن يُعالَج الملف مراراً.",
      fut_t:"إلى أين نتجه",     fut_b:"مستقبلاً تُعالَج الملفات مرة واحدة وتُخزَّن كقاعدة معرفة — أسرع وأذكى.",
      acc_title:"صلاحيات الوصول", acc_b:"هيئة المناهج ترفع وترى ملفاتها. المشرفون يديرون ويعتمدون. الأساتذة والمتفقدون المساعدون يرون المعتمد فقط. التلاميذ وأولياء الأمور لا يملكون وصولاً.",
    },
  }[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <p style={{ fontSize:14, color:T.md, lineHeight:1.85 }}>{s.intro}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <Step icon={FileText}     accent={T.red}  title={s.st1t} body={s.st1b} rtl={rtl} />
        <Step icon={CheckCircle2} accent={T.gold} title={s.st2t} body={s.st2b} rtl={rtl} />
        <Step icon={Archive}      accent={T.teal} title={s.st3t} body={s.st3b} rtl={rtl} />
        <Step icon={Brain}        accent={T.ai}   title={s.st4t} body={s.st4b} rtl={rtl} last />
      </div>
      <TwoCol>
        <Highlight icon={Zap}   color={T.orange} title={s.cur_t}>{s.cur_b}</Highlight>
        <Highlight icon={Brain} color={T.green}  title={s.fut_t}>{s.fut_b}</Highlight>
      </TwoCol>
      <div style={{ background:T.sect, border:`1.5px solid ${T.bdr}`, borderRadius:12, padding:"12px 16px" }}>
        <span style={{ fontWeight:700, color:T.hi }}>{s.acc_title}: </span>
        <span style={{ fontSize:12.5, color:T.md }}>{s.acc_b}</span>
      </div>
    </div>
  );
};

const AdvisorContent = ({ lang }) => {
  const s = {
    en: {
      intro:"After teachers approve a test and students take it, advisors step in as an independent quality layer. They review the tests — not to approve or reject them — but to rate quality and leave professional feedback for the teacher.",
      hi_t:"Two separate approval layers, by design",
      hi_b:"The teacher approves the test for students. The advisor reviews the test for quality. These are intentionally separate — an advisor's opinion never blocks or changes what students see.",
      jour_t:"The full journey of a test",
      journey:[
        { label:"AI generates the test",       sub:"Questions are created from lesson content",        color:T.purple, Icon:Brain         },
        { label:"Teacher reviews and approves", sub:"Teacher edits if needed, then publishes",          color:T.blue,   Icon:GraduationCap },
        { label:"Students take the test",       sub:"It becomes visible and students complete it",      color:T.green,  Icon:User          },
        { label:"Advisor reviews the quality",  sub:"Rates 1–5 stars and writes professional remarks",  color:T.indigo, Icon:Shield        },
        { label:"Teacher sees the feedback",    sub:"Visible in the teacher's Reviews tab",             color:T.teal,   Icon:CheckCircle2  },
      ],
      rev:"Advisors can review:", types:["Lessons","Multiple-choice tests","Written tests"],
    },
    ar: {
      intro:"بعد اعتماد الاختبار وإجرائه، يتدخل المتفقدون المساعدون كطبقة مستقلة لضمان الجودة — لتقييمها وترك ملاحظات مهنية، لا لاعتمادها أو رفضها.",
      hi_t:"طبقتا اعتماد مستقلتان بتصميم متعمد",
      hi_b:"الأستاذ يعتمد للتلاميذ. المتفقد المساعد يراجع للجودة. رأي المتفقد المساعد لا يحجب ما يراه التلاميذ أبداً.",
      jour_t:"الرحلة الكاملة لاختبار",
      journey:[
        { label:"الذكاء الاصطناعي يُنشئ",  sub:"الأسئلة تُولَّد من محتوى الدرس",          color:T.purple, Icon:Brain         },
        { label:"الأستاذ يراجع ويعتمد",     sub:"يعدّل إذا لزم ثم ينشر للتلاميذ",             color:T.blue,   Icon:GraduationCap },
        { label:"التلاميذ يجرون الاختبار",  sub:"يصبح مرئياً ويكمله التلاميذ",               color:T.green,  Icon:User          },
        { label:"المتفقد المساعد يراجع الجودة",   sub:"يمنح تقييماً من 1-5 ويكتب ملاحظات",        color:T.indigo, Icon:Shield        },
        { label:"الأستاذ يرى الملاحظات",    sub:"مرئية في تبويب المراجعات",                  color:T.teal,   Icon:CheckCircle2  },
      ],
      rev:"المتفقدون المساعدون يمكنهم مراجعة:", types:["الدروس","اختبارات الاختيار من متعدد","الاختبارات المكتوبة"],
    },
  }[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <p style={{ fontSize:14, color:T.md, lineHeight:1.85 }}>{s.intro}</p>
      <Highlight icon={Layers} color={T.indigo} title={s.hi_t}>{s.hi_b}</Highlight>
      <div style={{ background:T.sect, border:`1.5px solid ${T.bdr}`, borderRadius:14, padding:"20px 22px" }}>
        <div style={{ fontWeight:700, fontSize:13.5, color:T.hi, marginBottom:18 }}>{s.jour_t}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {s.journey.map(({ label, sub, color, Icon }, i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, position:"relative" }}>
              {i < 4 && <div style={{ position:"absolute", left:18, top:38, height:20, width:1.5, background:`linear-gradient(${color}40,transparent)` }} />}
              <div style={{ flexShrink:0, width:36, height:36, background:`${color}12`, border:`1.5px solid ${color}25`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={16} color={color} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:13.5, color:T.hi }}>{label}</div>
                <div style={{ fontSize:12, color:T.md, marginTop:2 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:12.5, color:T.md, fontWeight:600 }}>{s.rev}</span>
        {s.types.map(t => <Chip key={t} label={t} color={T.indigo} />)}
      </div>
    </div>
  );
};

const InspectionContent = ({ lang }) => {
  const rtl = lang === "ar";
  const s = {
    en: {
      intro:"The platform supports two parallel inspection systems at different levels — one covers entire regions, the other focuses on individual schools and teachers. Both run independently with no AI.",
      reg:"Regional inspection", sch:"School-level inspection",
      r1t:"Inspector is assigned a region",   r1b:"An inspector is responsible for a geographic area covering multiple schools.",
      r2t:"Schedules and conducts visits",     r2b:"Visits can be routine checks, complaint follow-ups, annual reviews, or surprise inspections.",
      r3t:"Writes a report",                  r3b:"After each visit, the inspector writes a formal report which goes to a GPI for review.",
      r4t:"GPI approves or sends back",       r4b:"The GPI can approve, reject, or ask for revisions. Monthly summaries go through the same flow.",
      s1t:"Delegation schedules inspection",  s1b:"The regional school authority creates an inspection for a specific teacher.",
      s2t:"An advisor may conduct it",        s2b:"The delegation can assign an advisor to carry out the inspection — useful for subject-specific evaluations.",
      s3t:"Inspection is completed",          s3b:"Stages: scheduled → in progress → completed → submitted, with a full report at the end.",
      s4t:"Ongoing mentorship (separate)",    s4b:"An advisor can also be formally assigned to a teacher as a long-term mentor for continuous professional support.",
    },
    ar: {
      intro:"تدعم المنصة نظامَي تفقد متوازيَين على مستويين مختلفين — أحدهما للمناطق والآخر للمدارس والأساتذة. كلاهما مستقل ولا يشمل ذكاءً اصطناعياً.",
      reg:"التفقد الإقليمي", sch:"التفقد على مستوى المدرسة",
      r1t:"يُعيَّن المتفقد لمنطقة",     r1b:"مسؤول عن منطقة جغرافية تشمل مدارس متعددة.",
      r2t:"يجدول الزيارات وينفذها",     r2b:"تشمل زيارات دورية، متابعة شكاوى، مراجعات سنوية، وتفقداً مفاجئاً.",
      r3t:"يكتب تقريراً",              r3b:"بعد كل زيارة يُرفع تقرير رسمي للمتفقد العام.",
      r4t:"المتفقد العام يعتمد أو يُعيد", r4b:"يمكن الاعتماد أو الرفض أو طلب مراجعات. الملخصات الشهرية تمر بنفس المسار.",
      s1t:"المديرية تجدول التفقد",    s1b:"تُنشئ السلطة التعليمية تفقداً لأستاذ محدد في مدرسته.",
      s2t:"قد يتولاه متفقد مساعد",           s2b:"يمكن تعيين متفقد مساعد لإجراء التفقد — مفيد للتقييمات المتخصصة.",
      s3t:"اكتمال التفقد",            s3b:"مراحل: مجدول ← قيد التنفيذ ← مكتمل ← مُقدَّم، مع تقرير كامل.",
      s4t:"الإشراف المستمر (منفصل)",   s4b:"يمكن تعيين متفقد مساعد كمُرشد طويل الأمد للأستاذ — علاقة مستمرة للدعم المهني.",
    },
  }[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <p style={{ fontSize:14, color:T.md, lineHeight:1.85 }}>{s.intro}</p>
      <TwoCol>
        <Panel accent={T.slate} title={s.reg} roles={["Inspector"]} lang={lang}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
            <Step icon={Search}       accent={T.slate} title={s.r1t} body={s.r1b} rtl={rtl} />
            <Step icon={Calendar}     accent={T.slate} title={s.r2t} body={s.r2b} rtl={rtl} />
            <Step icon={FileText}     accent={T.slate} title={s.r3t} body={s.r3b} rtl={rtl} />
            <Step icon={CheckCircle2} accent={T.gold}  title={s.r4t} body={s.r4b} rtl={rtl} last />
          </div>
        </Panel>
        <Panel accent={T.teal} title={s.sch} roles={["Advisor","Teacher"]} lang={lang}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
            <Step icon={Building2}    accent={T.teal}   title={s.s1t} body={s.s1b} rtl={rtl} />
            <Step icon={Shield}       accent={T.teal}   title={s.s2t} body={s.s2b} rtl={rtl} />
            <Step icon={ClipboardList}accent={T.teal}   title={s.s3t} body={s.s3b} rtl={rtl} />
            <Step icon={Users}        accent={T.indigo} title={s.s4t} body={s.s4b} rtl={rtl} last />
          </div>
        </Panel>
      </TwoCol>
    </div>
  );
};

const ParentContent = ({ lang }) => {
  const s = {
    en: {
      intro:"Parents get their own dedicated space to stay connected with their child's school life — no need to contact the school office. Test scores, attendance, and teacher communication are all in one place.",
      lnk_t:"Link your children to your account",
      lnk_b:"Search for your child and link them to your account. You can be a parent, guardian, or relative — each child gets their own profile card showing their performance at a glance.",
      perf_t:"Track your child's progress",
      perf_b:"View test scores, overall average, and gamification stats — XP points, level, and learning streak. Every test result is listed with its score so you always know where your child stands.",
      chat_t:"Chat directly with teachers",
      chat_b:"Start a private conversation with any teacher who teaches your child. Share files, ask questions, receive updates. Teachers only see messages from parents of their own students.",
      att_t:"Monitor attendance",
      att_b:"View your child's daily attendance — present, absent, late, or excused — for any date range. Monthly summaries show the overall attendance rate with a visual progress bar.",
      tabs_t:"Four dashboard tabs",
      tabs:[
        { label:"Students",   body:"Per-child cards with XP, level, test scores, and assigned teachers." },
        { label:"Attendance", body:"Daily records and monthly summary for each child." },
        { label:"Chats",      body:"All conversations with teachers, with unread message badges." },
        { label:"Overview",   body:"Totals at a glance: children linked, tests taken, average score." },
      ],
    },
    ar: {
      intro:"يمتلك أولياء الأمور فضاءً خاصاً للبقاء على اطلاع بحياة أبنائهم المدرسية — دون الحاجة للتواصل مع إدارة المدرسة. نتائج الاختبارات وسجلات الحضور والتواصل مع الأساتذة كل شيء في مكان واحد.",
      lnk_t:"ربط أبنائك بحسابك",
      lnk_b:"ابحث عن ابنك واربطه بحسابك. يمكنك أن تكون والداً أو وصياً أو قريباً — لكل تلميذ بطاقة ملف خاصة تُظهر أداءه في لمحة.",
      perf_t:"تتبع أداء ابنك",
      perf_b:"اطّلع على درجات الاختبارات والمعدل العام ونقاط التحفيز — نقاط XP والمستوى وسلسلة التعلم. كل نتيجة مدرجة بدرجتها حتى تعرف دائماً أين يقف ابنك.",
      chat_t:"تواصل مباشرة مع الأساتذة",
      chat_b:"ابدأ محادثة خاصة مع أي أستاذ يدرّس ابنك. أرسل ملفات، اطرح أسئلة، واستقبل تحديثات. الأساتذة يرون فقط رسائل أولياء أمور تلاميذهم.",
      att_t:"متابعة الحضور",
      att_b:"اطّلع على سجل حضور ابنك اليومي — حاضر أو غائب أو متأخر أو معذور — لأي فترة زمنية. الملخصات الشهرية تُظهر نسبة الحضور الإجمالية بشريط مرئي.",
      tabs_t:"أربعة تبويبات في لوحة التحكم",
      tabs:[
        { label:"التلاميذ",      body:"بطاقات لكل تلميذ مع XP والمستوى والدرجات والأساتذة المعيّنين." },
        { label:"الحضور",        body:"سجلات يومية وملخص شهري لكل تلميذ." },
        { label:"المحادثات",     body:"جميع محادثاتك مع الأساتذة مع شارة الرسائل غير المقروءة." },
        { label:"نظرة عامة",    body:"الإجماليات دفعة واحدة: التلاميذ المرتبطون والاختبارات والمعدل." },
      ],
    },
  }[lang];
  const tabColors = [T.orange, T.purple, T.teal, T.green];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <p style={{ fontSize:14, color:T.md, lineHeight:1.85 }}>{s.intro}</p>
      <TwoCol>
        <Panel accent={T.orange} title={s.lnk_t}  roles={["Parent"]}           lang={lang}><p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{s.lnk_b}</p></Panel>
        <Panel accent={T.purple} title={s.perf_t} roles={["Parent"]}           lang={lang}><p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{s.perf_b}</p></Panel>
      </TwoCol>
      <TwoCol>
        <Panel accent={T.teal}   title={s.chat_t} roles={["Parent","Teacher"]} lang={lang}><p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{s.chat_b}</p></Panel>
        <Panel accent={T.green}  title={s.att_t}  roles={["Parent"]}           lang={lang}><p style={{ fontSize:12.5, color:T.md, lineHeight:1.75 }}>{s.att_b}</p></Panel>
      </TwoCol>
      <div style={{ background:T.sect, border:`1.5px solid ${T.bdr}`, borderRadius:14, padding:"18px 20px" }}>
        <div style={{ fontWeight:700, fontSize:13, color:T.hi, marginBottom:14 }}>{s.tabs_t}</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {s.tabs.map((t, i) => (
            <div key={i} style={{ background:`${tabColors[i]}08`, border:`1.5px solid ${tabColors[i]}20`, borderRadius:10, padding:"10px 12px" }}>
              <div style={{ fontWeight:700, fontSize:12, color:tabColors[i], marginBottom:4 }}>{t.label}</div>
              <div style={{ fontSize:11.5, color:T.md, lineHeight:1.6 }}>{t.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Procedures ───────────────────────────────────────────────────────────────
const PROCEDURES = [
  { id:"lesson",     num:"01", icon:BookOpen,     hasAi:true,  accent:T.blue,
    title:{ en:"Lesson Planning",                  ar:"التخطيط للدروس"          },
    tagline:{ en:"From blank page to full lesson plan — in seconds.", ar:"من صفحة فارغة إلى خطة درس متكاملة — في ثوانٍ." },
    roles:["Teacher","AI"], Content:LessonContent },

  { id:"timetable",  num:"02", icon:Calendar,      hasAi:false, accent:T.teal,
    title:{ en:"Schedules & Timetables",           ar:"الجداول والمواعيد"        },
    tagline:{ en:"Work hours and teaching plans — two tools, one place.", ar:"ساعات العمل وخطط التدريس — أداتان في مكان واحد." },
    roles:["Director","Teacher"], Content:TimetableContent },

  { id:"testgen",    num:"03", icon:FlaskConical,  hasAi:true,  accent:T.purple,
    title:{ en:"Test Generation",                  ar:"توليد الاختبارات"         },
    tagline:{ en:"The AI writes the questions. The teacher decides what's fair.", ar:"الذكاء الاصطناعي يكتب الأسئلة. الأستاذ يقرر ما هو عادل." },
    roles:["Teacher","AI"], Content:TestGenContent },

  { id:"correction", num:"04", icon:CheckSquare,   hasAi:true,  accent:T.green,
    title:{ en:"Test Correction & Grading",        ar:"تصحيح الاختبارات"         },
    tagline:{ en:"Instant scores for MCQs. AI-assisted grading for written tests.", ar:"نتائج فورية للاختيار من متعدد. تصحيح ذكي للمكتوبة." },
    roles:["Student","AI","Teacher"], Content:CorrectionContent },

  { id:"vault",      num:"05", icon:Archive,        hasAi:true,  accent:T.gold,
    title:{ en:"Lesson Library (Vault)",           ar:"مكتبة خطط الدروس"         },
    tagline:{ en:"A shared library of curriculum-aligned plans, always ready.", ar:"مكتبة مشتركة من الخطط المعتمدة وفق المنهج، جاهزة دائماً." },
    roles:["Advisor","Teacher"], Content:VaultContent },

  { id:"notebook",   num:"06", icon:NotebookPen,   hasAi:false, accent:T.pink,
    title:{ en:"Student Notebooks",               ar:"كراريس التلاميذ"              },
    tagline:{ en:"A daily digital notebook connecting teachers and students.", ar:"كراس رقمي يومي يربط الأساتذة بالتلاميذ." },
    roles:["Teacher","Student"], Content:NotebookContent },

  { id:"cnp",        num:"07", icon:FileText,       hasAi:true,  accent:T.red,
    title:{ en:"Official Curriculum Guides",       ar:"أدلة المنهج الرسمية"       },
    tagline:{ en:"Official PDFs become the source of AI-generated plans.", ar:"ملفات PDF الرسمية تصبح مصدراً لخطط الدروس الذكية." },
    roles:["CNP","Advisor"], Content:CnpContent },

  { id:"advisor",    num:"08", icon:Eye,            hasAi:false, accent:T.indigo,
    title:{ en:"Advisor Quality Review",           ar:"مراجعة المتفقد المساعد للجودة"    },
    tagline:{ en:"Professional peer review — a quality check for teacher content.", ar:"مراجعة مهنية بالأقران — ضمان جودة محتوى الأساتذة." },
    roles:["Advisor","Teacher"], Content:AdvisorContent },

  { id:"inspection", num:"09", icon:Search,         hasAi:false, accent:T.slate,
    title:{ en:"Inspections & Oversight",          ar:"التفقد والرقابة"          },
    tagline:{ en:"Regional and school-level inspections, all tracked digitally.", ar:"التفقد الإقليمي وعلى مستوى المدرسة — كل شيء مُتتبَّع رقمياً." },
    roles:["Inspector","Advisor"], Content:InspectionContent },

  { id:"parent",     num:"10", icon:Users,          hasAi:false, accent:T.orange,
    title:{ en:"Parent Portal",                    ar:"بوابة أولياء الأمور"      },
    tagline:{ en:"Track your child's scores, attendance, and chat with teachers — all in one place.", ar:"تابع درجات ابنك وحضوره وتواصل مع الأساتذة — كل شيء في مكان واحد." },
    roles:["Parent","Teacher"], Content:ParentContent },
];

// ─── Card Hero ────────────────────────────────────────────────────────────────
const CardHero = ({ proc, lang }) => {
  const [from, to] = HERO[proc.id];
  const Icon = proc.icon;
  const u = UI[lang];
  return (
    <div style={{
      position:"relative", height:160, overflow:"hidden",
      background: HERO_PHOTOS[proc.id]
        ? `linear-gradient(140deg,${from}cc 0%,${to}bb 100%),url(${HERO_PHOTOS[proc.id]}) center/cover no-repeat`
        : `linear-gradient(140deg,${from} 0%,${to} 100%)`,
    }}>
      {/* big ghost icon */}
      <div style={{
        position:"absolute", bottom:-20, right: lang==="ar" ? "auto" : -20, left: lang==="ar" ? -20 : "auto",
        opacity:0.1,
      }}>
        <Icon size={130} color="#fff" strokeWidth={1} />
      </div>
      {/* content */}
      <div style={{ position:"relative", zIndex:1, padding:"22px 24px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ background:"rgba(255,255,255,0.18)", backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.9)", letterSpacing:"0.05em" }}>
            {proc.num}
          </span>
          {proc.hasAi && (
            <span style={{ background:"rgba(255,255,255,0.18)", backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.95)", display:"inline-flex", alignItems:"center", gap:5 }}>
              <Sparkles size={10} strokeWidth={2.5} /> {u.aiBadge}
            </span>
          )}
        </div>
        <div>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", borderRadius:14, padding:10, marginBottom:10 }}>
            <Icon size={24} color="#fff" strokeWidth={1.8} />
          </div>
          <div style={{ fontWeight:800, fontSize:17, color:"#fff", letterSpacing:"-0.02em", lineHeight:1.2 }}>{proc.title[lang]}</div>
        </div>
      </div>
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang]       = useState("en");
  const [expanded, setExpanded] = useState(new Set());
  const [filter, setFilter]   = useState("all");

  const rtl  = lang === "ar";
  const u    = UI[lang];
  const bodyFont = font(lang);

  const toggle = (id) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const filtered = PROCEDURES.filter(p =>
    filter === "all" ? true : filter === "ai" ? p.hasAi : !p.hasAi
  );
  const aiCount   = PROCEDURES.filter(p => p.hasAi).length;
  const noAiCount = PROCEDURES.filter(p => !p.hasAi).length;

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ background:"transparent", minHeight:"100vh", fontFamily:bodyFont, position:"relative", zIndex:1 }}>
      <Background />

      {/* ── Header ── */}
      <div style={{
        background:"rgba(255,255,255,0.75)",
        backdropFilter:"blur(24px)",
        WebkitBackdropFilter:"blur(24px)",
        borderBottom:`1px solid rgba(255,255,255,0.6)`,
        padding:"16px 40px",
        position:"relative", zIndex:10,
      }}>
        <div style={{ maxWidth:1160, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", gap:20, flexWrap:"wrap" }}>
          <img src="/minassa.svg" alt="منصة الشعب" style={{ height:40 }} />

          {/* Language toggle */}
          <div style={{ display:"flex", background:"rgba(255,255,255,0.6)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", border:`1.5px solid rgba(226,232,240,0.8)`, borderRadius:12, padding:3, alignSelf:"flex-start" }}>
            {[["en","EN"],["ar","عر"]].map(([l, label]) => (
              <button key={l} onClick={() => setLang(l)} style={{
                width:52, height:34,
                background: lang === l ? "#fff" : "transparent",
                border: lang === l ? `1.5px solid ${T.bdr2}` : "1.5px solid transparent",
                borderRadius:9,
                boxShadow: lang === l ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                color: lang === l ? T.hi : T.lo,
                fontWeight:700, fontSize:13,
                cursor:"pointer", transition:"all 0.18s",
                fontFamily: l === "ar" ? "'Cairo',sans-serif" : "'Inter',sans-serif",
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{
        background:"rgba(255,255,255,0.80)",
        backdropFilter:"blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
        borderBottom:`1px solid rgba(226,232,240,0.7)`,
        padding:"12px 40px",
        display:"flex", alignItems:"center",
        position:"sticky", top:0, zIndex:40,
      }}>
        <div style={{ maxWidth:1160, margin:"0 auto", width:"100%", display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          {[
            { id:"all",  label:u.all,    count:PROCEDURES.length, color:T.blue   },
            { id:"ai",   label:u.ai,     count:aiCount,            color:T.purple },
            { id:"noai", label:u.manual, count:noAiCount,          color:T.slate  },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              display:"inline-flex", alignItems:"center", gap:7,
              border:`1.5px solid ${filter===f.id ? f.color : T.bdr}`,
              borderRadius:10, padding:"7px 16px",
              background: filter===f.id ? `${f.color}10` : "#fff",
              color: filter===f.id ? f.color : T.md,
              fontWeight:600, fontSize:12.5, cursor:"pointer",
              transition:"all 0.15s", fontFamily:bodyFont,
            }}>
              {f.label}
              <span style={{ background: filter===f.id ? `${f.color}18` : T.sect, border:`1px solid ${T.bdr}`, borderRadius:8, padding:"1px 8px", fontSize:11 }}>{f.count}</span>
            </button>
          ))}
          <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
            {[[u.expandAll, () => setExpanded(new Set(filtered.map(p=>p.id)))], [u.collapseAll, () => setExpanded(new Set())]].map(([label, action]) => (
              <button key={label} onClick={action} style={{ background:"#fff", border:`1.5px solid ${T.bdr}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12, color:T.md, fontFamily:bodyFont }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cards grid ── */}
      <div style={{ padding:"28px 40px 60px", maxWidth:1160, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20 }}>
          {filtered.map((p, idx) => {
            const isOpen = expanded.has(p.id);
            const { Content } = p;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity:0, y:16 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:idx*0.04, duration:0.3, ease:[0.4,0,0.2,1] }}
                style={{ gridColumn: isOpen ? "1 / -1" : undefined }}
              >
                <div style={{
                  background:"rgba(255,255,255,0.82)",
                  backdropFilter:"blur(16px)",
                  WebkitBackdropFilter:"blur(16px)",
                  borderRadius:20,
                  overflow:"hidden",
                  boxShadow: isOpen
                    ? `0 12px 48px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.9)`
                    : "0 4px 16px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.8)",
                  border:`1px solid ${isOpen ? `${p.accent}35` : "rgba(226,232,240,0.8)"}`,
                  transition:"box-shadow 0.3s, border-color 0.3s",
                }}>

                  {/* Hero */}
                  <div onClick={() => toggle(p.id)} style={{ cursor:"pointer" }}>
                    <CardHero proc={p} lang={lang} />
                  </div>

                  {/* Info bar */}
                  <div
                    onClick={() => toggle(p.id)}
                    style={{ padding:"18px 22px 16px", cursor:"pointer", borderBottom: isOpen ? `1px solid ${T.bdr}` : "none" }}
                  >
                    <p style={{ fontSize:13.5, color:T.md, lineHeight:1.6, marginBottom:12 }}>{p.tagline[lang]}</p>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {p.roles.map(r => <RolePill key={r} role={r} lang={lang} />)}
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration:0.22 }}
                        style={{ color:T.lo, flexShrink:0 }}
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height:0, opacity:0 }}
                        animate={{ height:"auto", opacity:1 }}
                        exit={{ height:0, opacity:0 }}
                        transition={{ duration:0.32, ease:[0.4,0,0.2,1] }}
                        style={{ overflow:"hidden" }}
                      >
                        <div style={{ padding:"24px 28px 28px", background:"rgba(248,249,252,0.95)" }}>
                          <Content lang={lang} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        background:"rgba(255,255,255,0.70)",
        backdropFilter:"blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
        borderTop:`1px solid rgba(226,232,240,0.6)`,
        padding:"18px 40px", fontSize:12, color:T.lo, textAlign:"center", fontFamily:bodyFont,
      }}>
        {u.footer}
      </div>
    </div>
  );
}
