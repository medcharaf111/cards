import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Sparkles, BookOpen, ClipboardCheck,
  Award, TrendingUp, CheckCircle2, Brain, Users, BarChart3,
  MessageSquare, CalendarDays, NotebookPen, Star, Zap, ShieldCheck,
} from "lucide-react";

// ─── i18n ────────────────────────────────────────────────────────────────────
const TR = {
  en: {
    backToHome:"Back to Home", prev:"Previous Step", next:"Next Step",
    stepOf:"of",
    demoTitle:"منصة الشعب — Ministry Demo",
    demoSub:"AI-Powered Education Platform · Full 7-Step Walkthrough",
    steps:[
      { title:"AI Lesson Plan Generation",   desc:"Teacher uses AI to generate a full lesson plan" },
      { title:"Interactive Lesson Creation", desc:"Students engage with drag, click & fill activities" },
      { title:"Gamified Student Test",       desc:"MCQ test with instant feedback per question" },
      { title:"AI-Assisted Grading",         desc:"Teacher reviews with full AI analysis" },
      { title:"Real-Time Analytics",         desc:"Live performance insights across the class" },
      { title:"Parent Portal",               desc:"Parent tracks their child's academic life in one place" },
      { title:"Student Notebook",            desc:"Student sees their own progress, badges and learning journey" },
    ],
    pp:{
      childName:"Youssef Ben Salah", childGrade:"Grade 7 — English", xp:1240, level:8, streak:12,
      tabOverview:"Overview", tabTests:"Test Results", tabAttendance:"Attendance", tabMessages:"Messages",
      avgScore:"Average Score", testsCount:"Tests Taken", attendRate:"Attendance Rate", streakLabel:"Day Streak",
      recentTests:"Recent Tests",
      tests:[
        { name:"Let's Have Fun — Gerunds",   score:80,  date:"Today",      status:"passed" },
        { name:"Daily Routines — Adverbs",   score:92,  date:"3 days ago", status:"passed" },
        { name:"My Town — Prepositions",     score:64,  date:"1 week ago", status:"passed" },
        { name:"Food & Cooking — Comparatives", score:55, date:"2 weeks ago", status:"failed" },
      ],
      attendance:[
        { day:"Mon", status:"present" }, { day:"Tue", status:"present" }, { day:"Wed", status:"late" },
        { day:"Thu", status:"present" }, { day:"Fri", status:"absent"  }, { day:"Mon", status:"present" },
        { day:"Tue", status:"present" }, { day:"Wed", status:"present" }, { day:"Thu", status:"present" },
        { day:"Fri", status:"present" }, { day:"Mon", status:"late"    }, { day:"Tue", status:"present" },
      ],
      presentLabel:"Present", lateLabel:"Late", absentLabel:"Absent",
      attendanceSummary:"Last 12 school days",
      messages:[
        { teacher:"Mr. Karim Gharbi", subject:"English Language", date:"Today, 10:42", msg:"Youssef did well on today's test. He struggles slightly with expressing reasons using 'because' — I'd recommend some extra practice at home. Overall he's progressing nicely.", unread:true },
        { teacher:"Ms. Nadia Bouaziz", subject:"Mathematics", date:"Yesterday", msg:"Youssef completed the geometry chapter. His scores are consistent. No concerns at this time.", unread:false },
      ],
      teacherLabel:"Teacher", subjectLabel:"Subject", unreadBadge:"New",
      noIssues:"No issues flagged — your child is on track.",
    },
    nb:{
      greeting:"Good morning,", studentName:"Youssef Ben Salah",
      level:"Level", xpToNext:"XP to next level",
      streakLabel:"Day streak", badgesLabel:"Badges earned", lessonsLabel:"Lessons completed",
      recentActivity:"Recent Activity",
      subjects:[
        { name:"English Language", score:80,  lessons:8,  color:"#7c3aed" },
        { name:"Mathematics",      score:74,  lessons:6,  color:"#2563eb" },
        { name:"Science",          score:88,  lessons:5,  color:"#059669" },
        { name:"History",          score:71,  lessons:4,  color:"#d97706" },
      ],
      badges:[
        { icon:"🏆", label:"Top Scorer",     earned:true  },
        { icon:"🔥", label:"12-Day Streak",  earned:true  },
        { icon:"⚡", label:"Speed Reader",   earned:true  },
        { icon:"🎯", label:"Perfect Speller",earned:false },
        { icon:"🌟", label:"Class Champion", earned:false },
        { icon:"📚", label:"Bookworm",       earned:false },
      ],
      recentLessons:[
        { name:"Let's Have Fun — Gerunds",    score:80,  done:true  },
        { name:"Daily Routines — Adverbs",    score:92,  done:true  },
        { name:"My Town — Prepositions",      score:64,  done:true  },
        { name:"Future Plans — Will / Going to", score:null, done:false },
      ],
      upcoming:"Next up", xpLabel:"XP",
    },
    lp:{
      teacherInputs:"Teacher Inputs for AI Generation",
      ministerViews:"Minister views the teacher's lesson planning interface",
      subject:"Subject", grade:"Grade Level", unit:"Unit Number", lesson:"Lesson Number",
      topic:"Lesson Topic", objectives:"Learning Objectives",
      vault:"Use NATIVE OS Lesson Vault (approved curriculum content)",
      generateBtn:"Generate Lesson Plan with AI",
      generating:"AI is generating your lesson plan…",
      step1:"Analysing curriculum standards…",
      step2:"Accessing lesson vault…",
      step3:"Creating interactive activities…",
      generatedTitle:"AI-Generated Lesson Plan",
      success:"Successfully Generated!",
      ready:"Ready to use in classroom",
      titleLabel:"Lesson Title",
      engLang:"English Language", grade7:"Grade 7", unit1:"Unit 1", lesson1:"Lesson 1",
      lessonName:"Let's Have Fun — Leisure Activities",
      objectives_list:["Learn vocabulary related to leisure activities","Practice expressing likes and dislikes","Use gerunds (verb + -ing) correctly"],
      warmUp:"Warm-up Activity", warmUpDesc:"Ice-breaker discussion about favourite activities",
      main:"Main Activity",     mainDesc:"Interactive vocabulary matching game with leisure activities",
      practice:"Practice",     practiceDesc:"Students create sentences using gerunds to describe hobbies",
      assessment:"Assessment", assessmentDesc:"5-question MCQ quiz about gerunds and leisure vocabulary",
      vocab:"Key Vocabulary",  grammar:"Grammar Focus",
      complete:'Lesson Plan Complete! — Click "Next" to see Lesson Creation',
    },
    lc:{
      title:"Interactive Lesson Activities", sub:"Build engaging content with click & fill tools",
      a1title:"Activity 1 — Vocabulary Matching",
      a1desc:"Click each image card to match it with its activity",
      a1bank:"Click words below, then click a card to assign",
      a2title:"Activity 2 — Preference Table",
      a2desc:"Click cells to record your preferences",
      a2hint:"Click cells to select preferences",
      a3title:"Activity 3 — Grammar Practice",
      a3desc:"Fill in the blanks using the gerund form",
      complete:'Interactive Lesson Complete! — Click "Next" for the Student Test',
      answered:"answered", matched:"matched",
      allMatched:"All activities matched correctly! 🎉",
      allAnswered:"All preferences selected! 🎯",
    },
    test:{
      header:"Gamified MCQ Test", progress:"Progress", answered:"Answered",
      q:"Question", selectAns:"Select your answer:",
      correct:"Correct! Well done!", wrong:"Not quite right! Correct answer:",
      prev:"Previous", nextQ:"Next Question", submit:"Submit Test",
      resultsTitle:"Test Results 🎉",
      score:"Your Score", outOf:"out of", correct2:"correct",
      excellent:"Excellent Work! 🌟", good:"Good Job! 👍", keep:"Keep Practising! 📚",
      tracked:"Student Performance Tracked",
      trackedSub:'Results saved to portfolio for AI analysis — Click "Next" for AI Grading',
    },
    gr:{
      title:"AI-Assisted Grading System",
      sub:"Teacher reviews student test submission with AI analysis",
      review:"Submission Review", student:"Student Name", lesson:"Lesson",
      testType:"Test Type", autoScore:"Automatic Score",
      grid:"Answer Grid", analyzeBtn:"Analyse with AI",
      analysing:"AI is analysing the submission…",
      p1:"Processing student answers…", p2:"Checking grammar understanding…",
      p3:"Evaluating learning patterns…", p4:"Generating personalised insights…",
      analysisTitle:"AI Analysis Complete",
      analysisSub:"Automated grading confirmed with intelligent feedback",
      qAnalysis:"Question-by-Question Analysis",
      studentAns:"Student's Answer:", correctAns:"Correct Answer:",
      aiFeedback:"AI Feedback:",
      insightsTitle:"AI Learning Insights",
      strengths:"Strengths Identified", improve:"Areas for Improvement", next:"Recommended Next Steps",
      confirmed:"AI Grading Confirmed!",
      confirmedSub:'Score: 80% (4/5) · Result saved to student portfolio · Click "Next" for Analytics',
      correctFeedback:"Excellent! Student demonstrated strong understanding of gerund usage after \"like/enjoy\" verbs.",
      wrongFeedback:"Learning opportunity: Student needs reinforcement on using explanatory phrases with \"because\". Review expressing reasons for preferences.",
      s1:"Strong grasp of gerund formation (verb + -ing) after like/enjoy verbs (4/4 correct)",
      s2:"Can identify grammatical errors in sentences (100% accuracy)",
      s3:"Understands correct sentence structure for expressing preferences",
      i1:"Expressing reasons: Needs practice using \"because\" to explain why someone likes an activity.",
      i2:"Suggested activities: Practice combining preferences with reasons (e.g. \"I enjoy reading because it's relaxing\")",
      n1:"Move to Unit I, Lesson 2 — Student shows readiness for next topic",
      n2:"Provide supplementary exercise on \"expressing reasons\" before advancing",
      n3:"Overall performance: GOOD (80%) — No remedial action required",
    },
    an:{
      title:"Real-Time Analytics Dashboard",
      desc:"Comprehensive insights from live database · Test submissions, portfolios, progress tracking",
      live:"Live Data 🔴",
      totalStudents:"Total Students", testsCompleted:"Tests Completed",
      avgScore:"Average Score", passRate:"Pass Rate",
      lessonPerf:"Lesson-Specific Performance",
      attempts:"Total Attempts", highest:"Highest Score", median:"Median Score", lowest:"Lowest Score",
      qDiff:"Question Difficulty Analysis", qDiffSub:"Correct answer rate per question",
      q3alert:"⚠️ AI Recommendation: Question 3 Needs Review",
      q3text:"Only 53.6% of students answered correctly. The 'expressing reasons with because' concept needs better explanation or question rewording.",
      progress:"Learning Progress Trajectory", progressSub:"Average scores grouped by week",
      improvement:"Student Improvement Rates", improvementSub:"Comparing first vs latest attempt",
      improved:"Improved Performance", stable:"Stable Performance", declined:"Declined Performance",
      avgImprovement:"Average Improvement",
      content:"Content & System Quality", contentSub:"Content quality metrics",
      lessonsCreated:"Lessons Created", aiTests:"AI Tests", vaultTests:"Vault Tests",
      avgQ:"Avg Questions", approvalRate:"Test Approval Rate",
      approvalNote:"High approval rate (94.7%) — Teachers rarely need to reject or heavily edit AI-generated tests.",
      complete:"Demo Complete! ✅",
      badges:["✓ Real-time Dashboards","✓ Data Analytics","✓ Advanced Analysis","✓ AI Insights","✓ Trend Detection"],
    },
  },
  ar: {
    backToHome:"العودة للرئيسية", prev:"الخطوة السابقة", next:"الخطوة التالية",
    stepOf:"من",
    demoTitle:"منصة الشعب — العرض الوزاري",
    demoSub:"منصة تعليمية بالذكاء الاصطناعي · جولة شاملة من 7 خطوات",
    steps:[
      { title:"توليد خطة الدرس بالذكاء الاصطناعي", desc:"المعلم يستخدم الذكاء الاصطناعي لإنشاء خطط دروس شاملة" },
      { title:"إنشاء الدرس التفاعلي",               desc:"أنشطة تفاعلية جذابة بالسحب والنقر والتعبئة" },
      { title:"اختبار تفاعلي للطالب",               desc:"اختبار متعدد الخيارات مع تغذية راجعة فورية" },
      { title:"التصحيح بمساعدة الذكاء الاصطناعي",  desc:"المعلم يراجع مع تحليل كامل من الذكاء الاصطناعي" },
      { title:"تحليلات في الوقت الفعلي",            desc:"رؤى شاملة عن أداء الفصل" },
      { title:"بوابة ولي الأمر",                    desc:"ولي الأمر يتابع الحياة الدراسية لابنه في مكان واحد" },
      { title:"دفتر الطالب",                        desc:"الطالب يرى تقدمه وشاراته ورحلته التعليمية" },
    ],
    pp:{
      childName:"يوسف بن صالح", childGrade:"الصف السابع — اللغة الإنجليزية", xp:1240, level:8, streak:12,
      tabOverview:"نظرة عامة", tabTests:"نتائج الاختبارات", tabAttendance:"الحضور", tabMessages:"الرسائل",
      avgScore:"متوسط الدرجات", testsCount:"اختبارات مجتازة", attendRate:"نسبة الحضور", streakLabel:"أيام متتالية",
      recentTests:"الاختبارات الأخيرة",
      tests:[
        { name:"هيا نستمتع — الأفعال المصدرية",   score:80,  date:"اليوم",       status:"passed" },
        { name:"روتين يومي — الأفعال الظرفية",     score:92,  date:"منذ 3 أيام",  status:"passed" },
        { name:"مدينتي — حروف الجر",               score:64,  date:"منذ أسبوع",   status:"passed" },
        { name:"الطعام والطبخ — صيغة المقارنة",    score:55,  date:"منذ أسبوعين", status:"failed" },
      ],
      attendance:[
        { day:"إث", status:"present" }, { day:"ثل", status:"present" }, { day:"أرب", status:"late" },
        { day:"خم", status:"present" }, { day:"جم", status:"absent"  }, { day:"إث", status:"present" },
        { day:"ثل", status:"present" }, { day:"أرب", status:"present" }, { day:"خم", status:"present" },
        { day:"جم", status:"present" }, { day:"إث", status:"late"    }, { day:"ثل", status:"present" },
      ],
      presentLabel:"حاضر", lateLabel:"متأخر", absentLabel:"غائب",
      attendanceSummary:"آخر 12 يوم دراسي",
      messages:[
        { teacher:"الأستاذ كريم غربي", subject:"اللغة الإنجليزية", date:"اليوم، 10:42", msg:"يوسف أدى أداءً جيداً في اختبار اليوم. يواجه صعوبة طفيفة في التعبير عن الأسباب بـ 'because' — أنصح ببعض التدريب الإضافي في المنزل. بشكل عام تقدمه ملحوظ.", unread:true },
        { teacher:"الأستاذة نادية بوعزيز", subject:"الرياضيات", date:"أمس", msg:"أنهى يوسف فصل الهندسة. درجاته منتظمة. لا مخاوف في الوقت الحالي.", unread:false },
      ],
      teacherLabel:"الأستاذ", subjectLabel:"المادة", unreadBadge:"جديد",
      noIssues:"لا مشكلات — ابنك على المسار الصحيح.",
    },
    nb:{
      greeting:"صباح الخير،", studentName:"يوسف بن صالح",
      level:"المستوى", xpToNext:"نقطة للمستوى التالي",
      streakLabel:"أيام متتالية", badgesLabel:"شارات مكتسبة", lessonsLabel:"دروس مكتملة",
      recentActivity:"النشاط الأخير",
      subjects:[
        { name:"اللغة الإنجليزية", score:80, lessons:8, color:"#7c3aed" },
        { name:"الرياضيات",        score:74, lessons:6, color:"#2563eb" },
        { name:"العلوم",           score:88, lessons:5, color:"#059669" },
        { name:"التاريخ",          score:71, lessons:4, color:"#d97706" },
      ],
      badges:[
        { icon:"🏆", label:"الأفضل أداءً",    earned:true  },
        { icon:"🔥", label:"12 يوماً متتالياً", earned:true  },
        { icon:"⚡", label:"القارئ السريع",    earned:true  },
        { icon:"🎯", label:"المتهجي المثالي",  earned:false },
        { icon:"🌟", label:"بطل الفصل",       earned:false },
        { icon:"📚", label:"عاشق الكتب",      earned:false },
      ],
      recentLessons:[
        { name:"هيا نستمتع — الأفعال المصدرية",    score:80,  done:true  },
        { name:"روتين يومي — الأفعال الظرفية",      score:92,  done:true  },
        { name:"مدينتي — حروف الجر",                score:64,  done:true  },
        { name:"خططي المستقبلية — will / going to", score:null, done:false },
      ],
      upcoming:"درس قادم", xpLabel:"نقطة",
    },
    lp:{
      teacherInputs:"مدخلات المعلم لتوليد الذكاء الاصطناعي",
      ministerViews:"الوزير يشاهد واجهة تخطيط الدرس للمعلم",
      subject:"المادة", grade:"المستوى الدراسي", unit:"رقم الوحدة", lesson:"رقم الدرس",
      topic:"موضوع الدرس", objectives:"أهداف التعلم",
      vault:"استخدام مخزن دروس المنصة (محتوى منهجي معتمد)",
      generateBtn:"إنشاء خطة الدرس بالذكاء الاصطناعي",
      generating:"الذكاء الاصطناعي يقوم بإنشاء خطة درسك…",
      step1:"تحليل معايير المناهج الدراسية…",
      step2:"الوصول إلى مخزن الدروس…",
      step3:"إنشاء أنشطة تفاعلية…",
      generatedTitle:"خطة الدرس المُولدة بالذكاء الاصطناعي",
      success:"تم التوليد بنجاح!",
      ready:"جاهز للاستخدام في الفصل الدراسي",
      titleLabel:"عنوان الدرس",
      engLang:"اللغة الإنجليزية", grade7:"الصف السابع", unit1:"الوحدة الأولى", lesson1:"الدرس الأول",
      lessonName:"لنستمتع — أنشطة أوقات الفراغ",
      objectives_list:["تعلم المفردات المتعلقة بأنشطة أوقات الفراغ","ممارسة التعبير عن الإعجاب وعدم الإعجاب","استخدام الأفعال المصدرية (verb + -ing) بشكل صحيح"],
      warmUp:"نشاط التمهيد", warmUpDesc:"مناقشة تفاعلية حول الأنشطة المفضلة",
      main:"النشاط الرئيسي", mainDesc:"لعبة مطابقة المفردات التفاعلية مع أنشطة أوقات الفراغ",
      practice:"الممارسة",   practiceDesc:"التلاميذ ينشئون جملاً باستخدام الأفعال المصدرية",
      assessment:"التقييم",  assessmentDesc:"اختبار متعدد الخيارات من 5 أسئلة",
      vocab:"المفردات الرئيسية", grammar:"التركيز النحوي",
      complete:"اكتملت خطة الدرس! — انقر \"التالي\" لرؤية إنشاء الدرس",
    },
    lc:{
      title:"أنشطة الدرس التفاعلية", sub:"بناء محتوى جذاب بأدوات النقر والتعبئة",
      a1title:"النشاط 1 — مطابقة المفردات",
      a1desc:"انقر على بطاقة الصورة لمطابقتها مع النشاط",
      a1bank:"انقر كلمة ثم انقر بطاقة لتعيينها",
      a2title:"النشاط 2 — جدول التفضيلات",
      a2desc:"انقر على الخلايا لتسجيل تفضيلاتك",
      a2hint:"انقر على الخلايا لتحديد التفضيلات",
      a3title:"النشاط 3 — ممارسة القواعد",
      a3desc:"املأ الفراغات باستخدام صيغة الفعل المصدري",
      complete:"اكتمل الدرس التفاعلي! — انقر \"التالي\" لاختبار الطالب",
      answered:"أُجيب", matched:"تم التعيين",
      allMatched:"تمت مطابقة جميع الأنشطة بنجاح! 🎉",
      allAnswered:"تم تحديد جميع التفضيلات! 🎯",
    },
    test:{
      header:"اختبار متعدد الخيارات التفاعلي", progress:"التقدم", answered:"أُجيب",
      q:"السؤال", selectAns:"اختر إجابتك:",
      correct:"صحيح! عمل ممتاز!", wrong:"ليس صحيحاً! الإجابة الصحيحة:",
      prev:"السابق", nextQ:"السؤال التالي", submit:"إرسال الاختبار",
      resultsTitle:"نتائج الاختبار 🎉",
      score:"درجتك", outOf:"من", correct2:"صحيح",
      excellent:"عمل ممتاز! 🌟", good:"عمل جيد! 👍", keep:"استمر في التدريب! 📚",
      tracked:"تم تسجيل أداء الطالب",
      trackedSub:"النتائج محفوظة تلقائياً — انقر \"التالي\" للتصحيح",
    },
    gr:{
      title:"نظام التصحيح بمساعدة الذكاء الاصطناعي",
      sub:"المعلم يراجع تسليم الاختبار مع تحليل الذكاء الاصطناعي",
      review:"مراجعة التسليم", student:"اسم الطالب", lesson:"الدرس",
      testType:"نوع الاختبار", autoScore:"الدرجة التلقائية",
      grid:"شبكة الإجابات", analyzeBtn:"تحليل بالذكاء الاصطناعي",
      analysing:"الذكاء الاصطناعي يحلل التسليم…",
      p1:"معالجة إجابات الطالب…", p2:"فحص فهم القواعد…",
      p3:"تقييم أنماط التعلم…",  p4:"توليد رؤى شخصية…",
      analysisTitle:"اكتمل تحليل الذكاء الاصطناعي",
      analysisSub:"تأكيد التصحيح التلقائي مع تغذية راجعة ذكية",
      qAnalysis:"تحليل سؤال بسؤال",
      studentAns:"إجابة الطالب:", correctAns:"الإجابة الصحيحة:",
      aiFeedback:"ملاحظات الذكاء الاصطناعي:",
      insightsTitle:"رؤى التعلم بالذكاء الاصطناعي",
      strengths:"نقاط القوة", improve:"مجالات التحسين", next:"الخطوات الموصى بها",
      confirmed:"تأكيد التصحيح بالذكاء الاصطناعي!",
      confirmedSub:"الدرجة: 80% (4/5) · محفوظ تلقائياً · انقر \"التالي\" للتحليلات",
      correctFeedback:"ممتاز! أظهر الطالب فهماً قوياً لاستخدام الأفعال المصدرية بعد أفعال like/enjoy.",
      wrongFeedback:"فرصة للتعلم: يحتاج إلى تعزيز استخدام جمل 'because' للتعبير عن الأسباب. يُنصح بمراجعة أمثلة التفضيلات.",
      s1:"فهم قوي لتشكيل الأفعال المصدرية (4/4 صحيحة)",
      s2:"قادر على تحديد الأخطاء النحوية في الجمل (100%)",
      s3:"يفهم بنية الجملة الصحيحة للتعبير عن التفضيلات",
      i1:"يحتاج إلى ممارسة استخدام 'because' لشرح سبب الإعجاب بنشاط ما",
      i2:"أنشطة مقترحة: تمارين تجمع بين التفضيلات والأسباب",
      n1:"الانتقال للوحدة 1، الدرس 2 — الطالب مستعد للموضوع التالي",
      n2:"تقديم تمرين تكميلي على 'التعبير عن الأسباب'",
      n3:"الأداء العام: جيد (80%) — لا حاجة لإجراءات علاجية",
    },
    an:{
      title:"لوحة التحليلات في الوقت الفعلي",
      desc:"رؤى شاملة من قاعدة البيانات المباشرة · اختبارات وملفات وتتبع التقدم",
      live:"بيانات مباشرة 🔴",
      totalStudents:"إجمالي التلاميذ", testsCompleted:"الاختبارات المكتملة",
      avgScore:"متوسط الدرجات", passRate:"معدل النجاح",
      lessonPerf:"أداء الدرس المحدد",
      attempts:"إجمالي المحاولات", highest:"أعلى درجة", median:"الوسيط", lowest:"أدنى درجة",
      qDiff:"تحليل صعوبة الأسئلة", qDiffSub:"معدل الإجابات الصحيحة لكل سؤال",
      q3alert:"⚠️ توصية الذكاء الاصطناعي: السؤال 3 يحتاج مراجعة",
      q3text:"53.6% فقط أجابوا صحيحاً. مفهوم 'التعبير عن الأسباب بـ because' يحتاج شرحاً أفضل أو إعادة صياغة.",
      progress:"مسار التقدم في التعلم", progressSub:"متوسط الدرجات حسب الأسبوع",
      improvement:"معدلات تحسن التلاميذ", improvementSub:"مقارنة المحاولة الأولى بالأخيرة",
      improved:"أداء محسّن", stable:"أداء مستقر", declined:"أداء منخفض",
      avgImprovement:"متوسط التحسن",
      content:"جودة المحتوى والنظام", contentSub:"مقاييس الجودة",
      lessonsCreated:"دروس منشأة", aiTests:"اختبارات الذكاء الاصطناعي", vaultTests:"اختبارات المخزن",
      avgQ:"متوسط الأسئلة", approvalRate:"معدل الموافقة",
      approvalNote:"معدل موافقة مرتفع (94.7%) — نادراً ما يعدّل المدرسون الاختبارات المُولدة.",
      complete:"اكتمل العرض! ✅",
      badges:["✓ لوحات فورية","✓ تحليلات البيانات","✓ تحليل متقدم","✓ رؤى الذكاء الاصطناعي","✓ اكتشاف الاتجاهات"],
    },
  },
};

// ─── Shared style helpers ─────────────────────────────────────────────────────
const card = (extra={}) => ({
  background:"#fff", borderRadius:10,
  border:"1px solid #e8eaed",
  boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
  overflow:"hidden", ...extra,
});

// accent-colored left border strip for section headers (replaces gradient cardHeader)
const cardHeader = (_a, _b) => ({
  background:"#fafafa",
  padding:"14px 20px",
  borderBottom:"1px solid #f0f0f0",
});

// pill tag — tinted bg, colored text, no solid fills
const badge = (accent, _ignored) => ({
  display:"inline-flex", alignItems:"center", gap:4,
  background: accent+"16",
  color: accent,
  border: `1px solid ${accent}28`,
  borderRadius:5, padding:"2px 9px", fontSize:11, fontWeight:700,
});

const btn = (bg, color="#fff", extra={}) => ({
  display:"inline-flex", alignItems:"center", gap:8,
  background:bg, color, border:"none", borderRadius:10,
  padding:"11px 22px", fontSize:14, fontWeight:700,
  cursor:"pointer", transition:"all 0.18s", ...extra,
});

const progressBar = (pct, color) => (
  <div style={{ background:"#f0f0f0", borderRadius:4, height:6, overflow:"hidden" }}>
    <motion.div
      initial={{ width:0 }}
      animate={{ width:`${pct}%` }}
      transition={{ duration:0.8, ease:"easeOut" }}
      style={{ height:"100%", background:color, borderRadius:4 }}
    />
  </div>
);

// thin left-border accent section used throughout (replaces gradient info panels)
const accentSection = (accent, children, extra={}) => (
  <div style={{ borderLeft:`3px solid ${accent}`, paddingLeft:14, ...extra }}>
    {children}
  </div>
);

// ─── Step 1: Lesson Plan Generation ──────────────────────────────────────────
const Step1 = ({ t, accent="#7c3aed" }) => {
  const [phase, setPhase] = useState("idle"); // idle | generating | done
  const lp = t.lp;
  const fields = [
    [lp.subject,  lp.engLang],
    [lp.grade,    lp.grade7],
    [lp.unit,     lp.unit1],
    [lp.lesson,   lp.lesson1],
  ];
  const activities = [
    { num:1, icon:"🎯", color:"#fff7ed", label:t.lp.warmUp,    desc:t.lp.warmUpDesc  },
    { num:2, icon:"💬", color:"#eff6ff", label:t.lp.main,       desc:t.lp.mainDesc    },
    { num:3, icon:"📝", color:"#fdf4ff", label:t.lp.practice,   desc:t.lp.practiceDesc},
    { num:4, icon:"✅", color:"#f0fdf4", label:t.lp.assessment, desc:t.lp.assessmentDesc},
  ];
  const vocab = ["swimming","dancing","playing sports","playing computer games","gardening","fishing","drawing","visiting museums","going to the cinema","listening to music","reading books","riding a bike"];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {phase === "idle" && (
        <>
          <div style={{ ...card(), border:"2px solid #c4b5fd" }}>
            <div style={{ ...cardHeader("#7c3aed22","#3b82f622"), borderBottom:"2px solid #c4b5fd" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Sparkles size={22} color="#7c3aed" />
                <div>
                  <div style={{ fontWeight:800, fontSize:18, color:"#1e1b4b" }}>{lp.teacherInputs}</div>
                  <div style={{ fontSize:13, color:"#6b7280", marginTop:2 }}>{lp.ministerViews}</div>
                </div>
              </div>
            </div>
            <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {fields.map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize:11, fontWeight:600, color:"#9ca3af", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:5 }}>{label}</div>
                    <div style={{ background:"#f9fafb", border:"1px solid #e8eaed", borderRadius:8, padding:"9px 12px", fontWeight:600, color:"#374151", fontSize:13 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#9ca3af", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:5 }}>{lp.topic}</div>
                <div style={{ background:"#f9fafb", border:`1px solid ${accent}30`, borderLeft:`3px solid ${accent}`, borderRadius:8, padding:"9px 12px", fontWeight:700, color:"#111827", fontSize:13 }}>{lp.lessonName}</div>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#9ca3af", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:5 }}>{lp.objectives}</div>
                <div style={{ background:"#f9fafb", border:"1px solid #e8eaed", borderRadius:8, padding:"10px 14px" }}>
                  <ul style={{ margin:0, padding:"0 0 0 18px" }}>
                    {lp.objectives_list.map((o,i)=><li key={i} style={{ fontSize:12.5, color:"#374151", marginBottom:4 }}>{o}</li>)}
                  </ul>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f9fafb", border:"1px solid #e8eaed", borderRadius:8, padding:"9px 12px" }}>
                <input type="checkbox" defaultChecked readOnly style={{ width:15, height:15, accentColor:accent }} />
                <span style={{ fontSize:12.5, color:"#374151", fontWeight:500 }}>{lp.vault}</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign:"center" }}>
            <button onClick={() => { setPhase("generating"); setTimeout(()=>setPhase("done"),2200); }}
              style={{ ...btn(`linear-gradient(135deg,${accent},#3b82f6)`), fontSize:15, padding:"13px 36px", boxShadow:`0 4px 20px ${accent}30` }}>
              <Sparkles size={16} /> {lp.generateBtn}
            </button>
          </div>
        </>
      )}

      {phase === "generating" && (
        <div style={{ ...card(), border:"2px solid #a78bfa", padding:48, textAlign:"center" }}>
          <div style={{ position:"relative", display:"inline-block", marginBottom:16 }}>
            <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:2, ease:"linear" }}>
              <Sparkles size={64} color="#7c3aed" />
            </motion.div>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <motion.div animate={{ scale:[1,1.2,1] }} transition={{ repeat:Infinity, duration:1.5 }}>
                <Brain size={32} color="#3b82f6" />
              </motion.div>
            </div>
          </div>
          <div style={{ fontWeight:800, fontSize:20, color:"#1e1b4b", marginBottom:16 }}>{lp.generating}</div>
          {[lp.step1, lp.step2, lp.step3].map((s,i) => (
            <motion.div key={i} animate={{ opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:1.5, delay:i*0.4 }}
              style={{ fontSize:13, color:"#6b7280", marginBottom:6 }}>{s}</motion.div>
          ))}
          <div style={{ marginTop:20, maxWidth:320, margin:"20px auto 0" }}>
            {progressBar(66,"linear-gradient(90deg,#7c3aed,#3b82f6)")}
          </div>
        </div>
      )}

      {phase === "done" && (
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ ...card() }}>
            <div style={{ padding:"14px 20px", borderBottom:"1px solid #f0f0f0", display:"flex", alignItems:"center", gap:10 }}>
              <CheckCircle2 size={16} color="#059669" />
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{lp.generatedTitle}</div>
                <div style={{ fontSize:11.5, color:"#6b7280", marginTop:1 }}>{lp.success} · {lp.ready}</div>
              </div>
            </div>
            <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:18 }}>

              {/* Fields */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[[lp.subject,lp.engLang],[lp.grade,lp.grade7],[lp.unit,lp.unit1],[lp.lesson,lp.lesson1+": "+lp.lessonName]].map(([l,v])=>(
                  <div key={l} style={{ padding:"9px 12px", background:"#f9fafb", border:"1px solid #e8eaed", borderRadius:7 }}>
                    <div style={{ fontSize:10, color:"#9ca3af", letterSpacing:"0.04em", textTransform:"uppercase", marginBottom:3 }}>{l}</div>
                    <div style={{ fontWeight:600, color:"#111827", fontSize:12.5 }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop:"1px solid #f3f4f6" }} />

              {/* Objectives */}
              <div>
                <div style={{ fontSize:10.5, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>{lp.objectives}</div>
                {lp.objectives_list.map((o,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:9, marginBottom:7 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:accent, flexShrink:0, marginTop:6 }} />
                    <span style={{ fontSize:13, color:"#374151", lineHeight:1.5 }}>{o}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop:"1px solid #f3f4f6" }} />

              {/* Activities */}
              <div>
                <div style={{ fontSize:10.5, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>Interactive Activities</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {activities.map((a,i)=>(
                    <div key={a.num} style={{ padding:"11px 14px", background:"#f9fafb", border:"1px solid #e8eaed", borderRadius:8, borderLeft:`3px solid ${accent}` }}>
                      <div style={{ fontWeight:700, fontSize:12.5, color:"#111827" }}>{a.label}</div>
                      <div style={{ fontSize:11.5, color:"#6b7280", marginTop:3, lineHeight:1.5 }}>{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop:"1px solid #f3f4f6" }} />

              {/* Vocab + Grammar side by side */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div>
                  <div style={{ fontSize:10.5, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:9 }}>{lp.vocab}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {vocab.map(w=><span key={w} style={{ background:"#f3f4f6", color:"#4b5563", border:"1px solid #e5e7eb", borderRadius:4, padding:"2px 7px", fontSize:11 }}>{w}</span>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:10.5, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:9 }}>{lp.grammar}</div>
                  <div style={{ fontSize:13, color:"#374151", lineHeight:1.8 }}>
                    Enjoy / Like + verb + <span style={{ background:"#fef9c3", padding:"1px 5px", borderRadius:3, fontWeight:700, fontSize:12 }}>-ing</span>
                  </div>
                  <div style={{ fontSize:12, color:"#9ca3af", fontStyle:"italic", marginTop:8 }}>e.g. I enjoy swimming.</div>
                </div>
              </div>

              {/* Done strip */}
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:accent+"0d", border:`1px solid ${accent}22`, borderRadius:7 }}>
                <CheckCircle2 size={14} color={accent} />
                <span style={{ fontWeight:600, color:accent, fontSize:12.5 }}>{lp.complete}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ─── Step 2: Lesson Creation ──────────────────────────────────────────────────
const Step2 = ({ t, accent="#f97316" }) => {
  const lc = t.lc;
  const [matched, setMatched] = useState({});
  const [tableSelections, setTableSelections] = useState({});
  const [grammarAnswers, setGrammarAnswers] = useState({ 0:"riding a bike", 1:"", 2:"", 3:"", 4:"" });
  const [selected, setSelected] = useState(null); // selected word from bank

  const cards = [
    { num:1, emoji:"🏊", answer:"swimming" }, { num:2, emoji:"🤸", answer:"dancing" },
    { num:3, emoji:"⚽", answer:"playing sports" }, { num:4, emoji:"💻", answer:"playing computer games" },
    { num:5, emoji:"🌱", answer:"gardening" }, { num:6, emoji:"🎣", answer:"fishing" },
    { num:7, emoji:"🎨", answer:"drawing" }, { num:8, emoji:"🏛️", answer:"visiting museums" },
  ];
  const words = ["swimming","dancing","playing sports","playing computer games","gardening","fishing","drawing","visiting museums","going to the cinema","listening to music","reading books","riding a bike"];
  const hobbies = ["Going to a museum","Reading books","Playing computer games","Gardening","Going to the cinema","Dancing","Drawing","Fishing"];
  const prefs = ["like","love","dislike","hate"];
  const prefLabels = { like:"Like +", love:"Love ++", dislike:"Don't like -", hate:"Hate --" };
  const practiceItems = [
    { name:"William", act:"ride a bike",  emoji:"🚴", ans:"William enjoys riding a bike." },
    { name:"Rex & Kate",act:"dance",      emoji:"💃", ans:"Rex and Kate enjoy dancing." },
    { name:"Carla",    act:"fish",        emoji:"🎣", ans:"Carla enjoys fishing." },
    { name:"Steve",    act:"swim",        emoji:"🏊", ans:"Steve enjoys swimming." },
    { name:"Henry",    act:"read books",  emoji:"📚", ans:"Henry enjoys reading books." },
  ];

  const matchedCount = Object.keys(matched).length;
  const tableCount   = Object.keys(tableSelections).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Header */}
      <div style={{ paddingBottom:18, borderBottom:"1px solid #f0f0f0", marginBottom:4 }}>
        <div style={{ fontWeight:800, fontSize:20, color:"#111827" }}>{lc.title}</div>
        <div style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>{lc.sub}</div>
      </div>

      {/* Activity 1: Vocabulary Matching */}
      <div style={{ ...card(), border:"3px solid #f97316" }}>
        <div style={{ ...cardHeader("#fff7ed","#ffedd5"), borderBottom:"3px solid #f97316", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ background:"#f97316", borderRadius:"50%", padding:10 }}><span style={{ fontSize:20 }}>🎯</span></div>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:"#7c2d12" }}>{lc.a1title}</div>
              <div style={{ fontSize:12.5, color:"#9a3412" }}>{lc.a1desc}</div>
            </div>
          </div>
          <span style={{ ...badge("#f97316"), fontSize:12 }}>{matchedCount}/8 {lc.matched}</span>
        </div>
        <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:14 }}>
          {/* Word bank */}
          <div style={{ background:"#f9fafb", border:"1px dashed #d1d5db", borderRadius:8, padding:"12px 14px" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"#9ca3af", letterSpacing:"0.04em", textTransform:"uppercase", marginBottom:8 }}>{lc.a1bank}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {words.map(w => (
                <span key={w} onClick={() => setSelected(selected===w?null:w)}
                  style={{ background: selected===w ? accent : "#fff", color: selected===w ? "#fff" : "#374151",
                    border:`1px solid ${selected===w ? accent : "#e5e7eb"}`, borderRadius:6,
                    padding:"4px 11px", fontSize:12, fontWeight:500, cursor:"pointer", transition:"all 0.12s" }}>
                  {w}
                </span>
              ))}
            </div>
          </div>
          {/* Cards grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {cards.map(c => (
              <div key={c.num} onClick={() => { if(!matched[c.num]) setMatched(p=>({...p,[c.num]:selected||c.answer})); setSelected(null); }}
                style={{ background: matched[c.num]?"#f0fdf4":"#f9fafb",
                  border:`2px solid ${matched[c.num]?"#34d399":"#e5e7eb"}`,
                  borderRadius:12, padding:"12px 8px", textAlign:"center", cursor:"pointer",
                  position:"relative", transition:"all 0.2s",
                  boxShadow:selected?"0 0 0 2px #f97316":"none" }}>
                {matched[c.num] && <CheckCircle2 size={14} color="#059669" style={{ position:"absolute", top:6, right:6 }} />}
                <div style={{ fontSize:36, marginBottom:6 }}>{c.emoji}</div>
                <div style={{ fontSize:10, fontWeight:600, color: matched[c.num]?"#059669":"#9ca3af",
                  background:matched[c.num]?"#dcfce7":"#f3f4f6", borderRadius:6, padding:"2px 6px" }}>
                  {matched[c.num] || "click to match"}
                </div>
              </div>
            ))}
          </div>
          {matchedCount === 8 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ background:"#f0fdf4", border:"2px solid #34d399", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:8 }}>
              <CheckCircle2 size={18} color="#059669" />
              <span style={{ fontWeight:700, color:"#064e3b" }}>{lc.allMatched}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Activity 2: Preference Table */}
      <div style={{ ...card(), border:"3px solid #3b82f6" }}>
        <div style={{ ...cardHeader("#eff6ff","#dbeafe"), borderBottom:"3px solid #3b82f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ background:"#3b82f6", borderRadius:"50%", padding:10 }}><span style={{ fontSize:20 }}>💬</span></div>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:"#1e3a8a" }}>{lc.a2title}</div>
              <div style={{ fontSize:12.5, color:"#1d4ed8" }}>{lc.a2hint}</div>
            </div>
          </div>
          <span style={{ ...badge("#3b82f6"), fontSize:12 }}>{tableCount}/8 {lc.answered}</span>
        </div>
        <div style={{ padding:"16px 20px", overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#ccfbf1" }}>
                <th style={{ border:"1px solid #99f6e4", padding:"10px 14px", textAlign:"left", fontSize:12.5, color:"#134e4a" }}>Hobby</th>
                {prefs.map(p=><th key={p} style={{ border:"1px solid #99f6e4", padding:"10px 14px", textAlign:"center", fontSize:12.5, color:"#134e4a" }}>{prefLabels[p]}</th>)}
              </tr>
            </thead>
            <tbody>
              {hobbies.map((h,i)=>(
                <tr key={h} style={{ background:i%2===0?"#fff":"#f9fafb" }}>
                  <td style={{ border:"1px solid #e5e7eb", padding:"10px 14px", fontWeight:500, fontSize:13, color:"#374151" }}>{h}</td>
                  {prefs.map(p=>(
                    <td key={p} style={{ border:"1px solid #e5e7eb", padding:"8px", textAlign:"center" }}>
                      <div onClick={() => setTableSelections(prev=>({...prev,[h]:p}))}
                        style={{ width:28, height:28, border:`2px solid ${tableSelections[h]===p?"#3b82f6":"#d1d5db"}`,
                          borderRadius:6, margin:"0 auto", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                          background:tableSelections[h]===p?"#3b82f6":"transparent", transition:"all 0.15s" }}>
                        {tableSelections[h]===p && <CheckCircle2 size={16} color="#fff" />}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {tableCount === 8 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ marginTop:12, background:"#eff6ff", border:"2px solid #93c5fd", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:8 }}>
              <CheckCircle2 size={18} color="#3b82f6" />
              <span style={{ fontWeight:700, color:"#1e3a8a" }}>{lc.allAnswered}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Activity 3: Grammar Fill */}
      <div style={{ ...card(), border:"3px solid #ec4899" }}>
        <div style={{ ...cardHeader("#fdf4ff","#fce7f3"), borderBottom:"3px solid #ec4899" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ background:"#ec4899", borderRadius:"50%", padding:10 }}><span style={{ fontSize:20 }}>📝</span></div>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:"#831843" }}>{lc.a3title}</div>
              <div style={{ fontSize:12.5, color:"#9d174d" }}>{lc.a3desc}</div>
            </div>
          </div>
        </div>
        <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:"#fdf4ff", border:"2px solid #f0abfc", borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontWeight:700, color:"#7e22ce", marginBottom:8 }}>Grammar Rule:</div>
            <div style={{ background:"#fff", borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontSize:14, color:"#1f2937", marginBottom:4 }}>Enjoy + verb + <span style={{ background:"#fef08a", padding:"2px 8px", borderRadius:5, fontWeight:700 }}>-ing</span></div>
              <div style={{ fontSize:14, color:"#1f2937" }}>Like + verb + <span style={{ background:"#fef08a", padding:"2px 8px", borderRadius:5, fontWeight:700 }}>-ing</span></div>
            </div>
          </div>
          <div style={{ background:"#f0fdf4", border:"2px solid #86efac", borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontWeight:700, color:"#166534", marginBottom:12 }}>📚 Practice: What does he/she enjoy doing?</div>
            {practiceItems.map((item,idx)=>(
              <div key={idx} style={{ background:"#fff", border:"2px solid #e5e7eb", borderRadius:10, padding:"12px 16px", marginBottom:10, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, color:"#6b7280", marginBottom:6 }}>
                    <span style={{ fontWeight:700, color:"#16a34a" }}>{String.fromCharCode(97+idx)}.</span> {item.name} / {item.act}
                  </div>
                  {idx === 0 ? (
                    <div style={{ background:"#f0fdf4", borderRadius:6, padding:"8px 12px", fontSize:13, color:"#166534", fontWeight:500 }}>✓ {item.ans}</div>
                  ) : (
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <input value={grammarAnswers[idx]} onChange={e => setGrammarAnswers(p=>({...p,[idx]:e.target.value}))}
                        placeholder="Type the answer here…"
                        style={{ flex:1, border:`2px solid ${grammarAnswers[idx]?.toLowerCase().includes("enjoy")?"#34d399":"#d1d5db"}`,
                          borderRadius:8, padding:"8px 12px", fontSize:13, outline:"none" }} />
                      {grammarAnswers[idx]?.toLowerCase().includes("enjoy") && <CheckCircle2 size={18} color="#059669" />}
                    </div>
                  )}
                  {grammarAnswers[idx]?.toLowerCase().includes("enjoy") && idx!==0 && (
                    <div style={{ fontSize:11, color:"#16a34a", marginTop:4 }}>✓ Correct! {item.ans}</div>
                  )}
                </div>
                <div style={{ width:52, height:52, background:"#f3f4f6", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{item.emoji}</div>
              </div>
            ))}
          </div>
          {/* Complete */}
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"#f9fafb", border:"1px solid #e8eaed", borderRadius:8 }}>
            <CheckCircle2 size={14} color="#059669" />
            <span style={{ fontWeight:600, color:"#374151", fontSize:13 }}>{lc.complete}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Step 3: Gamified Test ────────────────────────────────────────────────────
const QUESTIONS = [
  { q:"Which sentence correctly uses the grammar rule for expressing a preference learned in the lesson?",
    opts:["I like to fishing at the river.","I like fishing at the river.","I am liking fish at the river.","I like fish at the river."], ans:1 },
  { q:'Maria: "What do you enjoy doing in your free time?"\nTom: "I really enjoy ______ stories because I love imagining new worlds."',
    opts:["write","to writing","wrote","writing"], ans:3 },
  { q:"Which sentence best explains *why* someone likes an activity, using the structures from the lesson?",
    opts:["My favourite activity is dancing.","I dislike cleaning my room.","He enjoys playing the guitar because it is creative.","She goes swimming every Saturday."], ans:2 },
  { q:"A student wrote four sentences about their hobbies. Which sentence has a grammatical mistake?",
    opts:["We love playing board games together.","My sister hates washing the dishes.","He dislike reading long books.","Do you enjoy listening to music?"], ans:2 },
  { q:"If someone's favourite leisure activity involves moving their body to music, how would they correctly express their enjoyment?",
    opts:["I enjoy to dance with my friends.","I enjoy dance with my friends.","I enjoy dancing with my friends.","I am enjoy dancing with my friends."], ans:2 },
];

const Step3 = ({ t, accent="#059669" }) => {
  const tt = t.test;
  const [cur, setCur] = useState(0);
  const [answered, setAnswered] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  const q = QUESTIONS[cur];
  const selAns = answered[cur] ?? null;
  const isCorrect = selAns === q.ans;

  const select = idx => { if(showResult) return; setAnswered(p=>({...p,[cur]:idx})); setShowResult(true); };
  const goNext = () => {
    if(cur < QUESTIONS.length-1) { setCur(cur+1); setShowResult(!!answered[cur+1]); }
    else setCompleted(true);
  };
  const goPrev = () => { if(cur>0) { setCur(cur-1); setShowResult(answered[cur-1]!==undefined); } };

  const score = Object.entries(answered).filter(([i,a])=>QUESTIONS[parseInt(i)].ans===a).length;
  const pct = Math.round(score/QUESTIONS.length*100);

  if(completed) return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ ...card(), border:"2px solid #34d399" }}>
        <div style={{ ...cardHeader("#d1fae5","#a7f3d0"), textAlign:"center", borderBottom:"2px solid #34d399", padding:"32px 24px" }}>
          <motion.div animate={{ y:[0,-10,0] }} transition={{ repeat:Infinity, duration:1.5 }}><Award size={64} color="#f59e0b" style={{ margin:"0 auto 16px" }} /></motion.div>
          <div style={{ fontWeight:800, fontSize:28, color:"#064e3b" }}>{tt.resultsTitle}</div>
        </div>
        <div style={{ padding:"24px" }}>
          <div style={{ padding:"24px", textAlign:"center", marginBottom:16, borderBottom:"1px solid #f0f0f0" }}>
            <div style={{ fontSize:60, fontWeight:900, color:accent, lineHeight:1 }}>{pct}%</div>
            <div style={{ fontSize:15, fontWeight:600, color:"#374151", margin:"10px 0 6px" }}>{score} {tt.outOf} {QUESTIONS.length} {tt.correct2}</div>
            <div style={{ fontSize:14, color:"#6b7280" }}>{pct>=80?tt.excellent:pct>=60?tt.good:tt.keep}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:16 }}>
            {QUESTIONS.map((_,i)=>{
              const ok=answered[i]===QUESTIONS[i].ans;
              return <div key={i} style={{ background:ok?"#f0fdf4":"#fef2f2", border:`2px solid ${ok?"#34d399":"#f87171"}`, borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{ok?"✅":"❌"}</div>
                <div style={{ fontSize:11, color:"#6b7280" }}>Q{i+1}</div>
              </div>;
            })}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:accent+"0d", border:`1px solid ${accent}22`, borderRadius:8 }}>
            <TrendingUp size={16} color={accent} />
            <div>
              <div style={{ fontWeight:700, color:"#111827", fontSize:13 }}>{tt.tracked}</div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:1 }}>{tt.trackedSub}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Header */}
      <div style={{ ...card(), border:"2px solid #c4b5fd" }}>
        <div style={{ ...cardHeader("#f5f3ff","#ede9fe"), display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"2px solid #c4b5fd" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <ClipboardCheck size={20} color="#7c3aed" />
              <span style={{ fontWeight:800, fontSize:17, color:"#4c1d95" }}>{tt.header}</span>
            </div>
            <div style={{ fontSize:13, color:"#6b7280" }}>Unit 1, Lesson 1: Let's Have Fun</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:"#6b7280" }}>{tt.progress}</div>
            <div style={{ fontSize:26, fontWeight:900, color:"#7c3aed" }}>{cur+1}/{QUESTIONS.length}</div>
          </div>
        </div>
        <div style={{ padding:"12px 20px" }}>
          {progressBar((cur+1)/QUESTIONS.length*100,"linear-gradient(90deg,#7c3aed,#ec4899)")}
        </div>
      </div>

      {/* Question */}
      <div style={{ ...card(), border:"2px solid #93c5fd" }}>
        <div style={{ ...cardHeader("#eff6ff","#dbeafe"), borderBottom:"2px solid #93c5fd", padding:"16px 20px" }}>
          <span style={{ ...badge("#2563eb"), marginBottom:8, display:"inline-flex" }}>{tt.q} {cur+1}</span>
          <div style={{ fontWeight:700, fontSize:15, color:"#1e3a8a", marginTop:8, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{q.q}</div>
        </div>
        <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:10 }}>
          {q.opts.map((opt,idx)=>{
            const isSel=selAns===idx, isCorr=showResult&&idx===q.ans, isWrong=showResult&&isSel&&!isCorr;
            return <button key={idx} onClick={()=>select(idx)} disabled={showResult}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:10, border:`2px solid ${isCorr?"#34d399":isWrong?"#f87171":isSel?"#3b82f6":"#e5e7eb"}`,
                background:isCorr?"#f0fdf4":isWrong?"#fef2f2":isSel?"#eff6ff":"#fff",
                cursor:showResult?"default":"pointer", textAlign:"left", transition:"all 0.15s",
                boxShadow:isCorr?"0 0 0 3px #34d39940":isWrong?"0 0 0 3px #f8717140":"none" }}>
              <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13,
                background:isCorr?"#22c55e":isWrong?"#ef4444":isSel?"#3b82f6":"#e5e7eb",
                color:isCorr||isWrong||isSel?"#fff":"#6b7280" }}>{String.fromCharCode(65+idx)}</div>
              <span style={{ flex:1, fontSize:13.5, fontWeight:500, color:"#1f2937" }}>{opt}</span>
              {isCorr && <CheckCircle2 size={18} color="#22c55e" />}
              {isWrong && <span style={{ fontSize:16 }}>❌</span>}
            </button>;
          })}
          {showResult && (
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              style={{ background:isCorrect?"#f0fdf4":"#fff7ed", border:`2px solid ${isCorrect?"#34d399":"#fcd34d"}`, borderRadius:10, padding:"12px 16px", display:"flex", gap:10 }}>
              <span style={{ fontSize:24 }}>{isCorrect?"🎉":"💡"}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:isCorrect?"#064e3b":"#92400e" }}>{isCorrect?tt.correct:tt.wrong} {!isCorrect&&`"${q.opts[q.ans]}"`}</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Nav */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={goPrev} disabled={cur===0}
          style={{ ...btn(cur===0?"#f3f4f6":"#fff", cur===0?"#9ca3af":"#374151", { border:"2px solid #e5e7eb", opacity:cur===0?0.5:1 }) }}>
          <ArrowLeft size={16} /> {tt.prev}
        </button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, color:"#6b7280" }}>{tt.answered}</div>
          <div style={{ fontSize:20, fontWeight:900, color:"#7c3aed" }}>{Object.keys(answered).length}/{QUESTIONS.length}</div>
        </div>
        <button onClick={goNext} disabled={!showResult}
          style={{ ...btn(cur===QUESTIONS.length-1&&showResult?"linear-gradient(135deg,#22c55e,#059669)":"linear-gradient(135deg,#7c3aed,#ec4899)"), opacity:!showResult?0.4:1 }}>
          {cur===QUESTIONS.length-1&&showResult?tt.submit:tt.nextQ}
          {cur===QUESTIONS.length-1&&showResult?<Award size={16}/>:<ArrowRight size={16}/>}
        </button>
      </div>
    </div>
  );
};

// ─── Step 4: AI Grading ───────────────────────────────────────────────────────
const GRADING_DATA = {
  studentName:"Youssef Ben Salah", lesson:"Unit I, Lesson 1: Let's Have Fun",
  testType:"MCQ — Grammar & Usage", score:80, correctCount:4, totalCount:5,
  answers:[
    { num:1, q:"Which sentence correctly uses the grammar rule…", sAns:1, cAns:1, opts:["I like to fishing…","I like fishing at the river.","I am liking…","I like fish…"], ok:true },
    { num:2, q:"Tom: \"I really enjoy ______ stories…\"", sAns:3, cAns:3, opts:["write","to writing","wrote","writing"], ok:true },
    { num:3, q:"Which sentence best explains *why* someone likes an activity…", sAns:1, cAns:2, opts:["My favourite activity is dancing.","I dislike cleaning my room.","He enjoys playing the guitar because it is creative.","She goes swimming every Saturday."], ok:false },
    { num:4, q:"Which sentence has a grammatical mistake?", sAns:2, cAns:2, opts:["We love playing board games together.","My sister hates washing the dishes.","He dislike reading long books.","Do you enjoy listening to music?"], ok:true },
    { num:5, q:"How would they correctly express their enjoyment of dancing?", sAns:2, cAns:2, opts:["I enjoy to dance…","I enjoy dance…","I enjoy dancing with my friends.","I am enjoy dancing…"], ok:true },
  ],
};

const Step4 = ({ t, accent="#ea580c" }) => {
  const gr = t.gr;
  const [phase, setPhase] = useState("idle"); // idle | analysing | done
  const d = GRADING_DATA;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {phase === "idle" && (
        <>
          <div style={{ ...card(), border:"2px solid #fb923c" }}>
            <div style={{ ...cardHeader("#fff7ed","#fed7aa"), borderBottom:"2px solid #fb923c" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Brain size={22} color="#ea580c" />
                <div>
                  <div style={{ fontWeight:800, fontSize:17, color:"#7c2d12" }}>{gr.title}</div>
                  <div style={{ fontSize:13, color:"#9a3412" }}>{gr.sub}</div>
                </div>
              </div>
            </div>
            <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
              {/* Summary */}
              <div style={{ background:"#f9fafb", border:"1px solid #e8eaed", borderRadius:8, padding:"14px 16px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:12 }}>{gr.review}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[[gr.student,d.studentName],[gr.lesson,d.lesson],[gr.testType,d.testType],[gr.autoScore, d.score+"%"]].map(([l,v])=>(
                    <div key={l}>
                      <div style={{ fontSize:10.5, color:"#9ca3af", marginBottom:2 }}>{l}</div>
                      <div style={{ fontWeight:700, fontSize:l===gr.autoScore?22:13, color:l===gr.autoScore?accent:"#111827" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:12, display:"flex", gap:8 }}>
                  <span style={{ fontSize:12, fontWeight:600, color:"#059669" }}>✓ {d.correctCount} correct</span>
                  <span style={{ color:"#e5e7eb" }}>·</span>
                  <span style={{ fontSize:12, fontWeight:600, color:"#dc2626" }}>✗ {d.totalCount-d.correctCount} incorrect</span>
                  <span style={{ color:"#e5e7eb" }}>·</span>
                  <span style={{ fontSize:12, fontWeight:600, color:"#6b7280" }}>{d.totalCount} total</span>
                </div>
              </div>
              {/* Answer grid */}
              <div style={{ background:"#fff", border:"2px solid #e5e7eb", borderRadius:12, padding:"16px 20px" }}>
                <div style={{ fontWeight:700, color:"#111827", marginBottom:12 }}>📊 {gr.grid}</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
                  {d.answers.map(a=>(
                    <div key={a.num} style={{ background:a.ok?"#f0fdf4":"#fef2f2", border:`2px solid ${a.ok?"#34d399":"#f87171"}`, borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
                      <div style={{ fontSize:22, marginBottom:4 }}>{a.ok?"✅":"❌"}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:"#374151" }}>Q{a.num}</div>
                      <div style={{ fontSize:11, color:"#6b7280" }}>{String.fromCharCode(65+a.sAns)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign:"center" }}>
                <button onClick={()=>{ setPhase("analysing"); setTimeout(()=>setPhase("done"),3000); }}
                  style={{ ...btn(`linear-gradient(135deg,${accent},#dc2626)`), fontSize:14, padding:"12px 32px", boxShadow:`0 4px 20px ${accent}30` }}>
                  <Brain size={16} /> {gr.analyzeBtn}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {phase === "analysing" && (
        <div style={{ ...card(), border:"2px solid #fb923c", padding:48, textAlign:"center" }}>
          <div style={{ position:"relative", display:"inline-block", marginBottom:16 }}>
            <motion.div animate={{ scale:[1,1.1,1] }} transition={{ repeat:Infinity, duration:1.2 }}><Brain size={64} color="#ea580c" /></motion.div>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:2, ease:"linear" }}><Sparkles size={28} color="#dc2626" /></motion.div>
            </div>
          </div>
          <div style={{ fontWeight:800, fontSize:20, color:"#7c2d12", marginBottom:16 }}>{gr.analysing}</div>
          {[gr.p1,gr.p2,gr.p3,gr.p4].map((s,i)=>(
            <motion.div key={i} animate={{ opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:1.5, delay:i*0.4 }}
              style={{ fontSize:13, color:"#6b7280", marginBottom:5 }}>{s}</motion.div>
          ))}
          <div style={{ marginTop:20, maxWidth:320, margin:"20px auto 0" }}>
            {progressBar(66,"linear-gradient(90deg,#ea580c,#dc2626)")}
          </div>
        </div>
      )}

      {phase === "done" && (
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Header */}
          <div style={{ ...card(), border:"2px solid #34d399" }}>
            <div style={{ ...cardHeader("#d1fae5","#a7f3d0"), borderBottom:"2px solid #34d399", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <CheckCircle2 size={24} color="#059669" />
                <div>
                  <div style={{ fontWeight:800, fontSize:17, color:"#064e3b" }}>{gr.analysisTitle}</div>
                  <div style={{ fontSize:13, color:"#047857" }}>{gr.analysisSub}</div>
                </div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:40, fontWeight:900, color:"#059669" }}>{d.score}%</div>
                <span style={{ ...badge("#059669"), fontSize:11 }}>{gr.confirmed?.split("!")?.[0]||"AI Verified"} ✓</span>
              </div>
            </div>
          </div>
          {/* Q by Q */}
          <div style={{ ...card(), border:"2px solid #93c5fd" }}>
            <div style={{ ...cardHeader("#eff6ff","#dbeafe"), borderBottom:"2px solid #93c5fd", padding:"16px 20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <ClipboardCheck size={20} color="#2563eb" />
                <span style={{ fontWeight:700, fontSize:15, color:"#1e3a8a" }}>{gr.qAnalysis}</span>
              </div>
            </div>
            <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
              {d.answers.map(a=>(
                <div key={a.num} style={{ background:a.ok?"#f0fdf4":"#fff7ed", border:`2px solid ${a.ok?"#34d399":"#fdba74"}`, borderRadius:12, padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                    <div style={{ width:40, height:40, background:a.ok?"#22c55e":"#f97316", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"#fff", fontWeight:700, fontSize:13 }}>Q{a.num}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:13, color:"#1f2937", marginBottom:8, lineHeight:1.5 }}>{a.q}</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                        <div>
                          <div style={{ fontSize:11, color:"#6b7280", marginBottom:3 }}>{gr.studentAns}</div>
                          <div style={{ background:a.ok?"#dcfce7":"#fee2e2", borderRadius:7, padding:"6px 10px", fontSize:12.5, fontWeight:600, color:a.ok?"#166534":"#991b1b" }}>
                            {String.fromCharCode(65+a.sAns)}. {a.opts[a.sAns]}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize:11, color:"#6b7280", marginBottom:3 }}>{gr.correctAns}</div>
                          <div style={{ background:"#dcfce7", borderRadius:7, padding:"6px 10px", fontSize:12.5, fontWeight:600, color:"#166534" }}>
                            {String.fromCharCode(65+a.cAns)}. {a.opts[a.cAns]}
                          </div>
                        </div>
                      </div>
                      <div style={{ background:a.ok?"#d1fae5":"#fef3c7", borderRadius:8, padding:"8px 12px" }}>
                        <span style={{ fontSize:12, fontWeight:700, color:"#374151" }}>🤖 {gr.aiFeedback} </span>
                        <span style={{ fontSize:12, color:a.ok?"#064e3b":"#92400e" }}>{a.ok?gr.correctFeedback:gr.wrongFeedback}</span>
                      </div>
                    </div>
                    <span style={{ fontSize:24, flexShrink:0 }}>{a.ok?"✅":"❌"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Insights */}
          <div style={{ ...card(), border:"2px solid #c4b5fd" }}>
            <div style={{ ...cardHeader("#f5f3ff","#ede9fe"), borderBottom:"2px solid #c4b5fd", padding:"16px 20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Brain size={20} color="#7c3aed" />
                <span style={{ fontWeight:700, fontSize:15, color:"#4c1d95" }}>{gr.insightsTitle}</span>
              </div>
            </div>
            <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:16 }}>
              {/* Strengths */}
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>{gr.strengths}</div>
                {[gr.s1,gr.s2,gr.s3].map((s,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:9, marginBottom:7, paddingLeft:2 }}>
                    <CheckCircle2 size={13} color="#059669" style={{ marginTop:3, flexShrink:0 }} />
                    <span style={{ fontSize:12.5, color:"#374151", lineHeight:1.55 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop:"1px solid #f0f0f0" }} />
              {/* Improve */}
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>{gr.improve}</div>
                {[gr.i1,gr.i2].map((s,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:9, marginBottom:7, borderLeft:`2px solid ${accent}`, paddingLeft:10 }}>
                    <span style={{ fontSize:12.5, color:"#374151", lineHeight:1.55 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop:"1px solid #f0f0f0" }} />
              {/* Next steps */}
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>{gr.next}</div>
                {[gr.n1,gr.n2,gr.n3].map((s,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:9, marginBottom:7 }}>
                    <span style={{ width:18, height:18, borderRadius:"50%", background:accent+"18", color:accent, fontWeight:700, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</span>
                    <span style={{ fontSize:12.5, color:"#374151", lineHeight:1.55 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Confirmed */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"#f0fdf4", border:"1px solid #86efac", borderRadius:8 }}>
            <CheckCircle2 size={16} color="#059669" />
            <div>
              <div style={{ fontWeight:700, color:"#111827", fontSize:13 }}>{gr.confirmed}</div>
              <div style={{ fontSize:11.5, color:"#6b7280", marginTop:1 }}>{gr.confirmedSub}</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ─── Step 5: Analytics ────────────────────────────────────────────────────────
const ANALYTICS = {
  overall:{ students:156, tests:342, avg:76.5, pass:82.3 },
  lesson:{ attempts:28, avg:78.6, highest:100, lowest:40, median:80, pass:85.7 },
  qDiff:[
    { num:1, topic:"Gerund with 'like'",    rate:92.8, diff:"Easy"   },
    { num:2, topic:"Gerund completion",      rate:89.3, diff:"Easy"   },
    { num:3, topic:"Expressing reasons",     rate:53.6, diff:"Hard"   },
    { num:4, topic:"Error identification",   rate:82.1, diff:"Medium" },
    { num:5, topic:"Gerund with dancing",    rate:85.7, diff:"Medium" },
  ],
  progress:[
    { week:"Week 1", avg:65.2, students:28 },
    { week:"Week 2", avg:71.8, students:28 },
    { week:"Week 3", avg:76.4, students:27 },
    { week:"Week 4", avg:78.6, students:28 },
  ],
  improvement:{ improved:72.3, stable:21.4, declined:6.3, avgImprove:"+12.4%" },
  content:{ lessons:45, aiTests:38, vaultTests:7, avgQ:8.5, approval:94.7 },
};

const Step5 = ({ t, accent="#4f46e5" }) => {
  const an = t.an;
  const kpis = [
    { label:an.totalStudents,  val:ANALYTICS.overall.students, color:"#22c55e", Icon:Users        },
    { label:an.testsCompleted, val:ANALYTICS.overall.tests,    color:"#3b82f6", Icon:ClipboardCheck},
    { label:an.avgScore,       val:ANALYTICS.overall.avg+"%",  color:"#7c3aed", Icon:Award         },
    { label:an.passRate,       val:ANALYTICS.overall.pass+"%", color:"#f97316", Icon:CheckCircle2  },
  ];
  const diffColor = r => r>=80?"#22c55e":r>=60?"#eab308":"#ef4444";
  const diffLabel = (d,t) => {
    if(t.an.easy) return d==="Easy"?t.an.easy||"Easy":d==="Medium"?t.an.medium||"Medium":t.an.hard||"Hard";
    return d;
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Header */}
      <div style={{ ...card(), border:"2px solid #93c5fd" }}>
        <div style={{ ...cardHeader("#eff6ff","#dbeafe"), borderBottom:"2px solid #93c5fd", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <BarChart3 size={24} color="#2563eb" />
            <div>
              <div style={{ fontWeight:800, fontSize:18, color:"#1e3a8a" }}>{an.title}</div>
              <div style={{ fontSize:13, color:"#1d4ed8", marginTop:2 }}>{an.desc}</div>
            </div>
          </div>
          <span style={{ ...badge("#2563eb"), fontSize:12 }}>{an.live}</span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
        {kpis.map(({ label, val, color })=>(
          <div key={label} style={{ ...card(), padding:"16px 14px" }}>
            <div style={{ fontSize:26, fontWeight:900, color, lineHeight:1, marginBottom:5 }}>{val}</div>
            <div style={{ fontSize:11.5, color:"#6b7280", fontWeight:500, lineHeight:1.4 }}>{label}</div>
            <div style={{ marginTop:10, height:2, background:color+"22", borderRadius:2 }}>
              <div style={{ height:"100%", width:"70%", background:color, borderRadius:2 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Stats */}
      <div style={{ ...card(), border:"2px solid #5eead4" }}>
        <div style={{ ...cardHeader("#f0fdfa","#ccfbf1"), borderBottom:"2px solid #5eead4", padding:"16px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <BookOpen size={20} color="#0d9488" />
            <span style={{ fontWeight:700, fontSize:15, color:"#134e4a" }}>{an.lessonPerf}: Unit I, Lesson 1: Let's Have Fun</span>
          </div>
        </div>
        <div style={{ padding:"16px 20px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
            {[[an.attempts,ANALYTICS.lesson.attempts],[an.avgScore,ANALYTICS.lesson.avg+"%"],[an.passRate,ANALYTICS.lesson.pass+"%"]].map(([l,v])=>(
              <div key={l} style={{ padding:"12px 14px", background:"#f9fafb", border:"1px solid #e8eaed", borderRadius:8 }}>
                <div style={{ fontSize:10.5, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:26, fontWeight:800, color:"#111827" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:16 }}>
            {[[an.highest,ANALYTICS.lesson.highest,"#059669"],[an.median,ANALYTICS.lesson.median,"#6b7280"],[an.lowest,ANALYTICS.lesson.lowest,"#dc2626"]].map(([l,v,c])=>(
              <div key={l} style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontWeight:700, fontSize:18, color:c }}>{v}</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Difficulty */}
      <div style={{ ...card(), border:"2px solid #f9a8d4" }}>
        <div style={{ ...cardHeader("#fdf4ff","#fce7f3"), borderBottom:"2px solid #f9a8d4", padding:"16px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Brain size={20} color="#a21caf" />
            <span style={{ fontWeight:700, fontSize:15, color:"#701a75" }}>{an.qDiff}</span>
          </div>
          <div style={{ fontSize:12, color:"#9d174d", marginTop:2 }}>{an.qDiffSub}</div>
        </div>
        <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:10 }}>
          {ANALYTICS.qDiff.map(q=>(
            <div key={q.num} style={{ padding:"12px 0", borderBottom:"1px solid #f3f4f6" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"#9ca3af", minWidth:22 }}>Q{q.num}</span>
                  <span style={{ fontWeight:500, fontSize:13, color:"#374151" }}>{q.topic}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{q.rate}%</span>
                  <span style={{ fontSize:10, fontWeight:600, color:q.diff==="Easy"?"#059669":q.diff==="Medium"?"#d97706":"#dc2626", background:q.diff==="Easy"?"#f0fdf4":q.diff==="Medium"?"#fefce8":"#fef2f2", border:`1px solid ${q.diff==="Easy"?"#86efac":q.diff==="Medium"?"#fcd34d":"#f87171"}`, borderRadius:4, padding:"1px 7px" }}>
                    {diffLabel(q.diff, t)}
                  </span>
                </div>
              </div>
              {progressBar(q.rate, diffColor(q.rate))}
            </div>
          ))}
          <div style={{ background:"#fefce8", border:"2px solid #fcd34d", borderRadius:12, padding:"14px 16px" }}>
            <div style={{ fontWeight:700, color:"#92400e", marginBottom:6 }}>{an.q3alert}</div>
            <div style={{ fontSize:12.5, color:"#78350f" }}>{an.q3text}</div>
          </div>
        </div>
      </div>

      {/* Learning Progress */}
      <div style={{ ...card(), border:"2px solid #a5b4fc" }}>
        <div style={{ ...cardHeader("#eef2ff","#e0e7ff"), borderBottom:"2px solid #a5b4fc", padding:"16px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <TrendingUp size={20} color="#4f46e5" />
            <span style={{ fontWeight:700, fontSize:15, color:"#312e81" }}>{an.progress}</span>
          </div>
          <div style={{ fontSize:12, color:"#3730a3", marginTop:2 }}>{an.progressSub}</div>
        </div>
        <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
          {ANALYTICS.progress.map((w,i)=>(
            <div key={w.week}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:accent, flexShrink:0 }} />
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, color:"#111827" }}>{w.week}</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{w.students} {an.studentsActive||"students active"}</div>
                  </div>
                </div>
                <div style={{ fontSize:18, fontWeight:800, color:"#111827" }}>{w.avg}%
                  {i>0&&<span style={{ fontSize:11, color:"#059669", marginLeft:6 }}>+{(w.avg-ANALYTICS.progress[i-1].avg).toFixed(1)}%</span>}
                </div>
              </div>
              {progressBar(w.avg, accent)}
            </div>
          ))}
          <div style={{ background:"#eef2ff", border:"2px solid #c7d2fe", borderRadius:10, padding:"12px 16px" }}>
            <div style={{ fontWeight:700, color:"#312e81" }}>📈 {an.positiveTrend||"Positive Learning Trend"}</div>
            <div style={{ fontSize:12.5, color:"#3730a3", marginTop:4 }}>{an.trendText||"Average scores improved +13.4% over 4 weeks (65.2% → 78.6%)."}</div>
          </div>
        </div>
      </div>

      {/* Student Improvement + Content Quality */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ ...card() }}>
          <div style={{ padding:"13px 16px", borderBottom:"1px solid #f0f0f0" }}>
            <div style={{ fontWeight:700, color:"#111827", fontSize:13 }}>{an.improvement}</div>
            <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{an.improvementSub}</div>
          </div>
          <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
            {[[an.improved,ANALYTICS.improvement.improved,"#22c55e"],[an.stable,ANALYTICS.improvement.stable,"#6b7280"],[an.declined,ANALYTICS.improvement.declined,"#ef4444"]].map(([l,v,c])=>(
              <div key={l}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:12.5, color:"#374151" }}>{l}</span>
                  <span style={{ fontSize:12.5, fontWeight:700, color:c }}>{v}%</span>
                </div>
                {progressBar(v,c)}
              </div>
            ))}
            <div style={{ marginTop:4, fontSize:12.5, fontWeight:600, color:accent }}>
              {an.avgImprovement}: {ANALYTICS.improvement.avgImprove}
            </div>
          </div>
        </div>
        <div style={{ ...card() }}>
          <div style={{ padding:"13px 16px", borderBottom:"1px solid #f0f0f0" }}>
            <div style={{ fontWeight:700, color:"#111827", fontSize:13 }}>{an.content}</div>
            <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{an.contentSub}</div>
          </div>
          <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:7 }}>
            {[[an.lessonsCreated,ANALYTICS.content.lessons],[an.aiTests,ANALYTICS.content.aiTests],[an.vaultTests,ANALYTICS.content.vaultTests],[an.avgQ,ANALYTICS.content.avgQ],[an.approvalRate,ANALYTICS.content.approval+"%"]].map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:"1px solid #f9fafb" }}>
                <span style={{ fontSize:12, color:"#6b7280" }}>{l}</span>
                <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{v}</span>
              </div>
            ))}
            <div style={{ fontSize:11, color:"#9ca3af", fontStyle:"italic", marginTop:4, lineHeight:1.5 }}>{an.approvalNote}</div>
          </div>
        </div>
      </div>

      {/* Complete */}
      <div style={{ padding:"20px 22px", background:accent+"0d", border:`1px solid ${accent}22`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div style={{ fontWeight:700, fontSize:15, color:accent }}>{an.complete}</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {an.badges.map(b=><span key={b} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:5, padding:"4px 12px", fontSize:11.5, fontWeight:600, color:"#374151" }}>{b}</span>)}
        </div>
      </div>
    </div>
  );
};

// ─── Step 6: Parent Portal ────────────────────────────────────────────────────
const Step6 = ({ t, accent="#0d9488" }) => {
  const [tab, setTab] = useState(0);
  const pp = t.pp;
  const tabs = [pp.tabOverview, pp.tabTests, pp.tabAttendance, pp.tabMessages];
  const xpPct = Math.round((pp.xp % 500) / 500 * 100);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* Child profile card */}
      <div style={{ ...card(), padding:"18px 20px", display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ width:52, height:52, borderRadius:14, background:accent+"18", border:`1px solid ${accent}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ fontSize:22, fontWeight:800, color:accent }}>{pp.childName[0]}</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:15, color:"#111827" }}>{pp.childName}</div>
          <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{pp.childGrade}</div>
          <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ flex:1, background:"#f0f0f0", borderRadius:4, height:5, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${xpPct}%`, background:accent, borderRadius:4 }} />
            </div>
            <span style={{ fontSize:11, color:accent, fontWeight:700, whiteSpace:"nowrap" }}>{pp.xp} XP · {pp.level} {t.nb?.level||"Lv"}</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:16, flexShrink:0 }}>
          {[["🔥", pp.streak, pp.streakLabel],["📝", 4, pp.testsCount]].map(([icon,val,lbl])=>(
            <div key={lbl} style={{ textAlign:"center" }}>
              <div style={{ fontSize:18 }}>{icon}</div>
              <div style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{val}</div>
              <div style={{ fontSize:10, color:"#9ca3af" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, background:"#f9fafb", border:"1px solid #e8eaed", borderRadius:9, padding:3 }}>
        {tabs.map((tb,i)=>(
          <button key={i} onClick={()=>setTab(i)} style={{
            flex:1, padding:"8px 4px", border:"none", borderRadius:7, cursor:"pointer",
            background:tab===i?"#fff":"transparent",
            color:tab===i?accent:"#6b7280",
            fontWeight:tab===i?700:500, fontSize:12.5,
            boxShadow:tab===i?"0 1px 4px rgba(0,0,0,0.07)":"none",
            transition:"all 0.15s",
          }}>{tb}</button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.22}}>

          {/* Overview */}
          {tab===0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {[[pp.avgScore,"73.7%"],[pp.testsCount,"4"],[pp.attendRate,"88%"],[pp.streakLabel,`${pp.streak}`]].map(([l,v])=>(
                  <div key={l} style={{ ...card(), padding:"13px 12px" }}>
                    <div style={{ fontWeight:800, fontSize:20, color:"#111827" }}>{v}</div>
                    <div style={{ fontSize:11, color:"#9ca3af", marginTop:3, lineHeight:1.4 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...card(), padding:"14px 16px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>{pp.recentTests}</div>
                {pp.tests.slice(0,2).map((ts,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:i<1?10:0, borderBottom:i<1?"1px solid #f3f4f6":"none", marginBottom:i<1?10:0 }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13, color:"#111827" }}>{ts.name}</div>
                      <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{ts.date}</div>
                    </div>
                    <span style={{ fontWeight:700, fontSize:15, color:ts.score>=60?accent:"#dc2626" }}>{ts.score}%</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"#f0fdf4", border:"1px solid #86efac", borderRadius:8 }}>
                <ShieldCheck size={14} color="#059669" />
                <span style={{ fontSize:12.5, color:"#374151" }}>{pp.noIssues}</span>
              </div>
            </div>
          )}

          {/* Test Results */}
          {tab===1 && (
            <div style={{ ...card() }}>
              <div style={{ padding:"14px 16px", borderBottom:"1px solid #f0f0f0" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase" }}>{pp.recentTests}</div>
              </div>
              {pp.tests.map((ts,i)=>(
                <div key={i} style={{ padding:"13px 16px", borderBottom:i<pp.tests.length-1?"1px solid #f3f4f6":"none", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:13, color:"#111827" }}>{ts.name}</div>
                    <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{ts.date}</div>
                    <div style={{ marginTop:6, background:"#f0f0f0", borderRadius:3, height:4, maxWidth:180, overflow:"hidden" }}>
                      <motion.div initial={{width:0}} animate={{width:`${ts.score}%`}} transition={{duration:0.7,delay:i*0.08}}
                        style={{ height:"100%", background:ts.score>=70?accent:"#f87171", borderRadius:3 }} />
                    </div>
                  </div>
                  <div style={{ textAlign:"right", marginLeft:16, flexShrink:0 }}>
                    <div style={{ fontWeight:800, fontSize:18, color:ts.score>=70?accent:"#dc2626" }}>{ts.score}%</div>
                    <div style={{ fontSize:10, fontWeight:600, marginTop:2, color:ts.status==="passed"?"#059669":"#dc2626" }}>
                      {ts.status==="passed"?"✓ passed":"✗ failed"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Attendance */}
          {tab===2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ ...card(), padding:"14px 16px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:12 }}>{pp.attendanceSummary}</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6 }}>
                  {pp.attendance.map((d,i)=>(
                    <div key={i} style={{ textAlign:"center" }}>
                      <div style={{
                        width:36, height:36, borderRadius:8, margin:"0 auto 4px",
                        background: d.status==="present"?accent+"15":d.status==="late"?"#fef9c3":"#fef2f2",
                        border: `1px solid ${d.status==="present"?accent+"30":d.status==="late"?"#fcd34d":"#f87171"}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:14,
                      }}>
                        {d.status==="present"?"✓":d.status==="late"?"↻":"✗"}
                      </div>
                      <div style={{ fontSize:9.5, color:"#9ca3af" }}>{d.day}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:12 }}>
                {[[pp.presentLabel,pp.attendance.filter(d=>d.status==="present").length,"#059669",accent+"15",accent+"30"],
                  [pp.lateLabel,  pp.attendance.filter(d=>d.status==="late"   ).length,"#d97706","#fef9c3","#fcd34d"],
                  [pp.absentLabel,pp.attendance.filter(d=>d.status==="absent" ).length,"#dc2626","#fef2f2","#f87171"]].map(([l,v,c,bg,br])=>(
                  <div key={l} style={{ flex:1, ...card(), padding:"12px 14px", background:bg, borderColor:br }}>
                    <div style={{ fontWeight:800, fontSize:22, color:c }}>{v}</div>
                    <div style={{ fontSize:11, color:c, marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {tab===3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {pp.messages.map((msg,i)=>(
                <div key={i} style={{ ...card(), padding:"14px 16px", borderLeft:`3px solid ${msg.unread?accent:"#e8eaed"}` }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontWeight:700, fontSize:13, color:"#374151" }}>{msg.teacher[0]}</span>
                      </div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13, color:"#111827" }}>{msg.teacher}</div>
                        <div style={{ fontSize:11, color:"#9ca3af" }}>{msg.subject}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      {msg.unread && <span style={{ fontSize:10, fontWeight:700, color:accent, background:accent+"15", border:`1px solid ${accent}28`, borderRadius:4, padding:"1px 7px" }}>{pp.unreadBadge}</span>}
                      <span style={{ fontSize:11, color:"#9ca3af" }}>{msg.date}</span>
                    </div>
                  </div>
                  <p style={{ fontSize:13, color:"#374151", lineHeight:1.65, margin:0 }}>{msg.msg}</p>
                </div>
              ))}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─── Step 7: Student Notebook ─────────────────────────────────────────────────
const Step7 = ({ t, accent="#db2777" }) => {
  const nb = t.nb;
  const xp = 1240;
  const xpPct = Math.round((xp % 500) / 500 * 100);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* Profile header */}
      <div style={{ ...card(), padding:"18px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:14 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:accent+"18", border:`1px solid ${accent}28`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontSize:22, fontWeight:800, color:accent }}>{nb.studentName[0]}</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:"#9ca3af" }}>{nb.greeting}</div>
            <div style={{ fontWeight:800, fontSize:17, color:"#111827" }}>{nb.studentName}</div>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            {[["🔥","12",nb.streakLabel],["🏅","3",nb.badgesLabel],["📖","17",nb.lessonsLabel]].map(([icon,val,lbl])=>(
              <div key={lbl} style={{ textAlign:"center" }}>
                <div style={{ fontSize:18 }}>{icon}</div>
                <div style={{ fontWeight:700, fontSize:13, color:"#111827" }}>{val}</div>
                <div style={{ fontSize:10, color:"#9ca3af" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        {/* XP bar */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:11, fontWeight:700, color:accent, minWidth:56 }}>{nb.level} 8</span>
          <div style={{ flex:1, background:"#f0f0f0", borderRadius:4, height:8, overflow:"hidden" }}>
            <motion.div initial={{width:0}} animate={{width:`${xpPct}%`}} transition={{duration:0.9, ease:"easeOut"}}
              style={{ height:"100%", background:accent, borderRadius:4 }} />
          </div>
          <span style={{ fontSize:11, color:"#9ca3af", minWidth:64, textAlign:"right" }}>{xp % 500}/500 {nb.xpLabel}</span>
        </div>
      </div>

      {/* Subject performance */}
      <div style={{ ...card() }}>
        <div style={{ padding:"12px 16px", borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase" }}>{nb.recentActivity}</div>
        </div>
        <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          {nb.subjects.map(s=>(
            <div key={s.name}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:s.color, flexShrink:0 }} />
                  <span style={{ fontSize:13, color:"#374151", fontWeight:500 }}>{s.name}</span>
                  <span style={{ fontSize:11, color:"#9ca3af" }}>· {s.lessons} {nb.lessonsLabel}</span>
                </div>
                <span style={{ fontWeight:700, fontSize:13, color:"#111827" }}>{s.score}%</span>
              </div>
              {progressBar(s.score, s.color)}
            </div>
          ))}
        </div>
      </div>

      {/* Badges + Recent lessons side by side */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {/* Badges */}
        <div style={{ ...card(), padding:"14px 16px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:12 }}>{nb.badgesLabel}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {nb.badges.map(b=>(
              <div key={b.label} style={{ textAlign:"center", opacity:b.earned?1:0.3 }}>
                <div style={{ fontSize:24 }}>{b.icon}</div>
                <div style={{ fontSize:10, color:b.earned?"#374151":"#9ca3af", marginTop:3, lineHeight:1.3 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent lessons */}
        <div style={{ ...card(), padding:"14px 16px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:12 }}>{nb.lessonsLabel}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {nb.recentLessons.map((l,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:l.done?accent+"18":"#f3f4f6", border:`1px solid ${l.done?accent+"35":"#e5e7eb"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {l.done ? <CheckCircle2 size={11} color={accent} /> : <span style={{ fontSize:9, color:"#9ca3af" }}>→</span>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11.5, color:l.done?"#374151":"#9ca3af", fontWeight:l.done?500:400, lineHeight:1.35 }}>{l.name}</div>
                  {!l.done && <div style={{ fontSize:10, color:accent, marginTop:1 }}>{nb.upcoming}</div>}
                </div>
                {l.score!=null && <span style={{ fontSize:12, fontWeight:700, color:accent }}>{l.score}%</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

// ─── Step metadata ────────────────────────────────────────────────────────────
const STEP_META = [
  { Icon:Sparkles,       from:"#0d6e5c", to:"#0d9488", accent:"#0d6e5c", glow:"rgba(13,110,92,0.18)"  },
  { Icon:BookOpen,       from:"#0a5a8f", to:"#1a7abd", accent:"#0a5a8f", glow:"rgba(10,90,143,0.16)"  },
  { Icon:ClipboardCheck, from:"#1a6b5a", to:"#16a085", accent:"#1a6b5a", glow:"rgba(26,107,90,0.16)"  },
  { Icon:Brain,          from:"#2c5282", to:"#3b6cb7", accent:"#2c5282", glow:"rgba(44,82,130,0.16)"  },
  { Icon:BarChart3,      from:"#0d6e5c", to:"#0d9488", accent:"#0d6e5c", glow:"rgba(13,110,92,0.18)"  },
  { Icon:Users,          from:"#1a5276", to:"#2471a3", accent:"#1a5276", glow:"rgba(26,82,118,0.16)"  },
  { Icon:NotebookPen,    from:"#145a32", to:"#1e8449", accent:"#145a32", glow:"rgba(20,90,50,0.16)"   },
];

const STEP_COMPONENTS = [Step1, Step2, Step3, Step4, Step5, Step6, Step7];

// ─── Slide variants (directional) ─────────────────────────────────────────────
const slideVariants = {
  enter: d => ({ opacity:0, x: d > 0 ? 72 : -72, scale:0.97 }),
  show:  () => ({ opacity:1, x:0, scale:1 }),
  exit:  d => ({ opacity:0, x: d > 0 ? -72 : 72, scale:0.97 }),
};

// ─── Stagger text fade-up ─────────────────────────────────────────────────────
const fadeUp = (delay=0) => ({
  initial:    { opacity:0, y:14 },
  animate:    { opacity:1, y:0  },
  transition: { duration:0.42, delay, ease:[0.4,0,0.2,1] },
});

// ─── Step Timeline (header) ────────────────────────────────────────────────────
const StepTimeline = ({ step, go }) => (
  <div style={{ display:"flex", alignItems:"center" }}>
    {STEP_META.map((m, i) => {
      const done   = i < step;
      const active = i === step;
      const isLast = i === STEP_META.length - 1;
      return (
        <div key={i} style={{ display:"flex", alignItems:"center" }}>
          <button
            onClick={() => go(i)}
            style={{
              width:  active ? 38 : 28,
              height: active ? 38 : 28,
              borderRadius:"50%", border:"none", cursor:"pointer",
              background: active
                ? `linear-gradient(135deg,${m.from},${m.to})`
                : done ? m.accent+"33" : "#e5e7eb",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow: active ? `0 0 0 4px ${m.from}28, 0 4px 16px ${m.glow}` : "none",
              transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
              position:"relative", flexShrink:0,
            }}
          >
            <m.Icon size={active ? 16 : 12} color={active ? "#fff" : done ? m.accent : "#9ca3af"} strokeWidth={2} />
          </button>
          {!isLast && (
            <div style={{ width:22, height:2, margin:"0 2px", borderRadius:2, background:"#e5e7eb", overflow:"hidden" }}>
              <motion.div
                animate={{ width: done ? "100%" : "0%" }}
                transition={{ duration:0.5, ease:[0.4,0,0.2,1] }}
                style={{ height:"100%", background:`linear-gradient(90deg,${m.accent},${STEP_META[i+1].accent})` }}
              />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ─── Main Demo component ──────────────────────────────────────────────────────
export default function Demo({ lang, setLang, onBack }) {
  const [step, setStep] = useState(0);
  const [dir,  setDir]  = useState(1);
  const rtl      = lang === "ar";
  const bodyFont = rtl ? "'Cairo','Segoe UI',system-ui,sans-serif" : "'Inter',system-ui,sans-serif";
  const t        = TR[lang];
  const meta     = STEP_META[step];
  const StepComp = STEP_COMPONENTS[step];

  const go = next => { setDir(next > step ? 1 : -1); setStep(next); };

  return (
    <div dir={rtl?"rtl":"ltr"} style={{ minHeight:"100vh", fontFamily:bodyFont, position:"relative", overflow:"hidden" }}>

      {/* ── Static official background ── */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", background:"#f5f7f9" }} />

      {/* Top accent bar */}
      <div style={{ position:"fixed", top:0, left:0, right:0, height:4, zIndex:200, background:"linear-gradient(90deg,#0d6e5c,#1a7abd)" }} />

      {/* ── Header ── */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"#fff", borderBottom:"1.5px solid #e2e8f0", padding:"12px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>

          <button onClick={onBack} style={{
            display:"inline-flex", alignItems:"center", gap:6,
            background:"transparent", color:"#374151",
            border:"1.5px solid #e5e7eb", borderRadius:10,
            padding:"7px 14px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:bodyFont,
          }}>
            {rtl ? <ArrowRight size={14}/> : <ArrowLeft size={14}/>}
            {t.backToHome}
          </button>

          <StepTimeline step={step} go={go} />

          <div style={{ display:"flex", background:"rgba(255,255,255,0.6)", border:"1.5px solid rgba(226,232,240,0.8)", borderRadius:12, padding:3 }}>
            {[["en","EN"],["ar","عر"]].map(([l,label])=>(
              <button key={l} onClick={()=>setLang(l)} style={{
                width:48, height:32, background:lang===l?"#fff":"transparent",
                border:lang===l?"1.5px solid #d1d5db":"1.5px solid transparent",
                borderRadius:9, boxShadow:lang===l?"0 1px 4px rgba(0,0,0,0.08)":"none",
                color:lang===l?"#111827":"#9ca3af", fontWeight:700, fontSize:12,
                cursor:"pointer", transition:"all 0.18s",
                fontFamily:l==="ar"?"'Cairo',sans-serif":"'Inter',sans-serif",
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 40px 140px", position:"relative", zIndex:1 }}>

        {/* Step hero */}
        <div style={{ padding:"44px 0 24px", display:"flex", alignItems:"flex-end", gap:20, position:"relative" }}>

          {/* Ghost step number */}
          <motion.div
            key={step+"ghost"}
            initial={{ opacity:0, scale:0.8 }}
            animate={{ opacity:0.042, scale:1 }}
            transition={{ duration:0.6 }}
            style={{
              position:"absolute",
              ...(rtl ? { left:-20 } : { right:-20 }),
              bottom:-16,
              fontSize:200, fontWeight:900, lineHeight:1,
              color: meta.accent, userSelect:"none", pointerEvents:"none",
              fontFamily:"'Inter',system-ui,sans-serif",
            }}
          >
            {step+1}
          </motion.div>

          {/* Icon */}
          <motion.div
            key={step+"icon"}
            initial={{ scale:0.5, opacity:0, rotate: rtl ? 12 : -12 }}
            animate={{ scale:1, opacity:1, rotate:0 }}
            transition={{ type:"spring", stiffness:280, damping:22, delay:0.04 }}
            style={{
              width:72, height:72, flexShrink:0,
              background:`linear-gradient(135deg,${meta.from},${meta.to})`,
              borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 16px 48px ${meta.glow}, 0 2px 8px rgba(0,0,0,0.06)`,
            }}
          >
            <meta.Icon size={32} color="#fff" strokeWidth={1.6} />
          </motion.div>

          <div style={{ flex:1, position:"relative", zIndex:1 }}>
            <motion.div key={step+"lbl"} {...fadeUp(0.06)}
              style={{ fontSize:11, fontWeight:700, color:meta.accent, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>
              {lang==="ar" ? `خطوة ${step+1} من ${STEP_META.length}` : `Step ${step+1} of ${STEP_META.length}`}
            </motion.div>
            <motion.div key={step+"ttl"} {...fadeUp(0.12)}
              style={{ fontWeight:900, fontSize:30, color:"#111827", letterSpacing:"-0.025em", lineHeight:1.15, marginBottom:8 }}>
              {t.steps[step].title}
            </motion.div>
            <motion.div key={step+"dsc"} {...fadeUp(0.18)}
              style={{ fontSize:14, color:"#6b7280", lineHeight:1.7 }}>
              {t.steps[step].desc}
            </motion.div>
          </div>
        </div>

        {/* Animated gradient divider */}
        <motion.div
          key={step+"div"}
          initial={{ scaleX:0, opacity:0 }}
          animate={{ scaleX:1, opacity:1 }}
          transition={{ duration:0.55, delay:0.2, ease:[0.4,0,0.2,1] }}
          style={{
            height:2, borderRadius:2, marginBottom:28,
            background:`linear-gradient(${rtl?"270deg":"90deg"},${meta.from},${meta.to},transparent)`,
            transformOrigin: rtl ? "right" : "left",
          }}
        />

        {/* Directional slide transition */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="show"
            exit="exit"
            transition={{ duration:0.38, ease:[0.4,0,0.2,1] }}
          >
            <StepComp t={t} accent={meta.accent} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom nav ── */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:100,
        background:"#fff", borderTop:"1.5px solid #e2e8f0", padding:"14px 40px",
      }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>

          <motion.button
            onClick={() => go(step-1)} disabled={step===0}
            whileTap={{ scale:0.95 }}
            style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:step===0?"#f9fafb":"#fff", color:step===0?"#9ca3af":"#374151",
              border:`1.5px solid ${step===0?"#e5e7eb":"#d1d5db"}`, borderRadius:12,
              padding:"10px 22px", fontSize:14, fontWeight:700,
              cursor:step===0?"default":"pointer", fontFamily:bodyFont,
              opacity:step===0?0.45:1, transition:"all 0.18s",
            }}
          >
            {rtl ? <ArrowRight size={15}/> : <ArrowLeft size={15}/>}
            {t.prev}
          </motion.button>

          {/* Morphing dots */}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {STEP_META.map((m,i)=>(
              <motion.button
                key={i} onClick={() => go(i)}
                animate={{
                  width: i===step ? 32 : 8,
                  background: i < step ? m.accent : i===step ? `linear-gradient(90deg,${m.from},${m.to})` : "#d1d5db",
                  opacity: i > step ? 0.38 : 1,
                }}
                transition={{ duration:0.28, ease:[0.4,0,0.2,1] }}
                style={{ height:8, borderRadius:4, border:"none", cursor:"pointer", flexShrink:0 }}
              />
            ))}
          </div>

          {step < STEP_META.length - 1 ? (
            <motion.button
              onClick={() => go(step+1)}
              whileTap={{ scale:0.96 }}
              style={{
                display:"inline-flex", alignItems:"center", gap:8,
                background:`linear-gradient(135deg,${meta.from},${meta.to})`,
                color:"#fff", border:"none", borderRadius:12,
                padding:"10px 26px", fontSize:14, fontWeight:700,
                cursor:"pointer", fontFamily:bodyFont,
                boxShadow:`0 4px 20px ${meta.glow}`,
              }}
            >
              {t.next}
              {rtl ? <ArrowLeft size={15}/> : <ArrowRight size={15}/>}
            </motion.button>
          ) : (
            <motion.button
              onClick={onBack}
              whileTap={{ scale:0.96 }}
              style={{
                display:"inline-flex", alignItems:"center", gap:8,
                background:"linear-gradient(135deg,#059669,#10b981)",
                color:"#fff", border:"none", borderRadius:12,
                padding:"10px 26px", fontSize:14, fontWeight:700,
                cursor:"pointer", fontFamily:bodyFont,
                boxShadow:"0 4px 20px rgba(5,150,105,0.28)",
              }}
            >
              {rtl ? <ArrowRight size={15}/> : <ArrowLeft size={15}/>}
              {t.backToHome}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
