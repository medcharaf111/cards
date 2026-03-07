# MinisterDemo.tsx — Full Recreation Prompt

> **Purpose**: This document contains the complete specification and source code of the `MinisterDemo` page — a 5-step interactive ministry demonstration of the NATIVE OS Education Platform. Use this as a prompt to faithfully recreate the component from scratch.

---

## 1. Overview

**Route**: `/demo`
**File**: `frontend/src/pages/MinisterDemo.tsx`
**Export**: `export default MinisterDemo` (default export)
**Imported in**: `App.tsx` as `<Route path="/demo" element={<MinisterDemo />} />`

The page is a self-contained, bilingual (English/Arabic) 5-step guided walkthrough demonstrating:

| Step | Title (EN) | Title (AR) | Component |
|------|-----------|-----------|-----------|
| 1 | AI Lesson Plan Generation | توليد خطة الدرس بالذكاء الاصطناعي | `LessonPlanGenerationStep` |
| 2 | Lesson Creation | إنشاء الدرس التفاعلي | `LessonCreationStep` |
| 3 | Gamified Test | اختبار تفاعلي للطالب | `GamifiedTestStep` |
| 4 | AI-Assisted Grading | التصحيح بمساعدة الذكاء الاصطناعي | `AIGradingStep` |
| 5 | Analytics & Insights | تحليلات في الوقت الفعلي | `AnalyticsStep` |

---

## 2. Dependencies & Imports

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, ArrowLeft, Sparkles, BookOpen, ClipboardCheck,
  Award, TrendingUp, CheckCircle2, Brain, Users, BarChart3,
  Languages, Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
```

**UI framework**: shadcn/ui components (`Button`, `Card`, `Badge`, `Progress`)
**Icons**: lucide-react
**Routing**: react-router-dom (`useNavigate`)
**Styling**: Tailwind CSS (gradients, responsive grid, animations)

---

## 3. Architecture

```
MinisterDemo (main component)
├── translations object (en + ar)
├── DEMO_STEPS config array
├── LessonPlanGenerationStep  — Step 1
├── LessonCreationStep        — Step 2
├── GamifiedTestStep           — Step 3
├── AIGradingStep              — Step 4
└── AnalyticsStep              — Step 5
```

- Each step component receives `{ language: 'en' | 'ar', t: typeof translations.en }`.
- The main component manages `currentStep` (1-5) and `language` state.
- All content is fully bilingual — hardcoded in the `translations` object.
- The page supports RTL via `dir={language === 'ar' ? 'rtl' : 'ltr'}`.
- Language toggle button switches between EN and AR.
- "Back to Home" button navigates to `/`.

---

## 4. Complete Source Code

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  ClipboardCheck,
  Award,
  TrendingUp,
  CheckCircle2,
  Brain,
  Users,
  BarChart3,
  Languages,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Translation Data
const translations = {
  en: {
    backToHome: "Back to Home",
    previousStep: "Previous Step",
    nextStep: "Next Step",
    mainTitle: "NATIVE OS Education Platform",
    mainSubtitle: "AI-Powered Language Learning System - Ministry Demonstration",
    stepTitle: "Step",
    of: "of",
    steps: [
      {
        title: 'AI Lesson Plan Generation',
        description: 'Teacher uses AI to generate comprehensive lesson plans',
      },
      {
        title: 'Interactive Lesson Creation',
        description: 'Build engaging activities with drag & drop',
      },
      {
        title: 'Gamified Student Test',
        description: 'Student takes an engaging, gamified assessment',
      },
      {
        title: 'AI-Assisted Grading',
        description: 'Teacher grades with AI suggestions and feedback',
      },
      {
        title: 'Real-Time Analytics',
        description: 'View comprehensive performance insights and trends',
      }
    ],
    // Step 1: Lesson Plan Generation
    lessonPlan: {
      teacherInputs: "Teacher Inputs for AI Generation",
      ministerViews: "Minister views the teacher's lesson planning interface",
      subject: "Subject",
      gradeLevel: "Grade Level",
      unitNumber: "Unit Number",
      lessonNumber: "Lesson Number",
      lessonTopic: "Lesson Topic",
      learningObjectives: "Learning Objectives",
      useVault: "Use NATIVE OS Lesson Vault (approved curriculum content)",
      generateBtn: "Generate Lesson Plan with AI",
      generating: "AI is generating your lesson plan...",
      analyzingStandards: "Analyzing curriculum standards...",
      accessingVault: "Accessing lesson vault...",
      creatingActivities: "Creating interactive activities...",
      generatedTitle: "AI-Generated Lesson Plan",
      success: "Successfully Generated!",
      readyToUse: "Ready to use in classroom",
      lessonTitle: "Lesson Title",
      objectives: ["Learn vocabulary related to leisure activities", "Practice expressing likes and dislikes", "Use gerunds (verb + -ing) correctly"],
      warmUp: "Warm-up Activity",
      warmUpDesc: "Ice-breaker discussion about favorite activities",
      mainActivity: "Main Activity",
      mainActivityDesc: "Interactive vocabulary matching game with leisure activities",
      practice: "Practice Exercise",
      practiceDesc: "Students create sentences using gerunds to describe their hobbies",
      assessment: "Assessment",
      assessmentDesc: "5-question multiple choice quiz about gerunds and leisure vocabulary",
      materials: "Materials & Resources",
      materialsItems: ["Vocabulary flashcards (digital)", "Interactive whiteboard presentation", "Student worksheets (printable)", "Audio recordings of native speakers"],
      duration: "Duration",
      minutes: "minutes",
      englishLanguage: "English Language",
      grade7: "Grade 7",
      unit1: "Unit 1",
      lesson1: "Lesson 1",
      letshavefun: "Let's Have Fun - Leisure Activities"
    },
    // Step 2: Lesson Creation
    lessonCreation: {
      title: "Interactive Lesson Activities",
      subtitle: "Build engaging content with drag-and-drop tools",
      activity1Title: "Activity 1: Vocabulary Matching",
      activity1Desc: "Drag vocabulary cards to matching definitions",
      activity2Title: "Activity 2: Preference Table",
      activity2Desc: "Students fill interactive preference table",
      activity3Title: "Activity 3: Grammar Practice",
      activity3Desc: "Fill in the blanks with correct gerund forms",
      dragHere: "Drag here",
      complete: "Complete!",
      activityComplete: "Activity Complete! 🎉",
      allMatched: "All vocabulary matched correctly!",
      selectPreferences: "Click cells to select preferences",
      checkAnswer: "Check Answer",
      correct: "Correct!",
      tryAgain: "Try again",
      fillBlank: "Type your answer...",
      vocabulary: {
        reading: "Reading",
        swimming: "Swimming",
        dancing: "Dancing",
        cooking: "Cooking",
        painting: "Painting",
        gaming: "Gaming",
        hiking: "Hiking",
        singing: "Singing"
      },
      hobbies: ["Reading books", "Playing sports", "Watching movies", "Listening to music", "Drawing/Painting", "Playing video games", "Cooking", "Traveling"]
    },
    // Step 3: Gamified Test
    test: {
      welcomeTitle: "Ready for Your Test?",
      welcomeDesc: "Answer 5 multiple choice questions about gerunds and leisure activities. Good luck!",
      startTest: "Start Test",
      question: "Question",
      selectAnswer: "Select your answer:",
      previous: "Previous",
      next: "Next",
      submit: "Submit Test",
      resultsTitle: "Test Results",
      yourScore: "Your Score",
      outOf: "out of",
      correct: "Correct",
      incorrect: "Incorrect",
      motivation: "Great job! You're making excellent progress in your English learning journey!",
      backToOverview: "Back to Overview"
    },
    // Step 4: AI Grading
    grading: {
      title: "AI-Assisted Grading System",
      submissionReview: "Submission Review",
      studentName: "Student Name",
      testCompleted: "Test Completed",
      autoScore: "Automatic Score",
      answerGrid: "Answer Grid",
      analyzeBtn: "Analyze with AI",
      analyzing: "AI is analyzing the submission...",
      processingAnswers: "Processing student answers...",
      evaluatingPatterns: "Evaluating learning patterns...",
      generatingInsights: "Generating personalized insights...",
      detailedAnalysis: "Detailed AI Analysis",
      aiVerified: "AI Verified",
      score: "Score",
      questionAnalysis: "Question-by-Question Analysis",
      studentAnswer: "Student Answer",
      correctAnswer: "Correct Answer",
      aiFeedback: "AI Feedback:",
      aiSays: "AI says",
      learningInsights: "AI Learning Insights",
      strengths: "Strengths Identified",
      areasForImprovement: "Areas for Improvement",
      nextSteps: "Recommended Next Steps",
      confirmed: "AI Grading Confirmed!",
      clickNext: "Click \"Next\" for Analytics",
      analysisComplete: "Analysis Complete! AI has verified the student's performance and provided personalized learning recommendations.",
      strengthsList: [
        "Strong understanding of basic gerund structures with 'like' and 'enjoy'",
        "Excellent vocabulary recognition for leisure activities",
        "Good grasp of sentence completion with gerunds"
      ],
      improvementsList: [
        "Needs practice with 'because' clauses for expressing reasons",
        "Review subject-verb agreement with 'dislike' (he dislikes vs he dislike)"
      ],
      nextStepsList: [
        "Practice writing sentences explaining WHY they enjoy activities",
        "Complete interactive exercises on third-person singular verb forms",
        "Review lesson videos focusing on expressing reasons and opinions"
      ]
    },
    // Step 5: Analytics
    analytics: {
      title: "Real-Time Analytics Dashboard",
      subtitle: "Comprehensive insights derived from live database",
      description: "Comprehensive insights derived from live database - Test submissions, portfolios, and progress tracking",
      liveData: "Live Data",
      totalStudents: "Total Students",
      testsCompleted: "Tests Completed",
      averageScore: "Average Score",
      passRate: "Pass Rate",
      fromTable: "From",
      lessonPerformance: "Lesson-Specific Performance",
      dataFrom: "Performance statistics for this lesson",
      totalAttempts: "Total Attempts",
      highestScore: "Highest Score",
      medianScore: "Median Score",
      lowestScore: "Lowest Score",
      questionDifficulty: "Question Difficulty Analysis",
      questionDifficultyDesc: "Analyzing correct answer rate per question",
      questionReview: "AI Recommendation: Question 3 Needs Review",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      aiRecommendation: "AI Recommendation: Question 3 Needs Review",
      recommendationText: "Only 53.6% of students answered correctly. This indicates the 'expressing reasons with because' concept needs better explanation in the lesson or question rewording.",
      learningProgress: "Learning Progress Trajectory",
      learningProgressDesc: "Average scores grouped by week",
      week: "Week",
      studentsActive: "students active",
      positiveTrend: "Positive Learning Trend Detected",
      trendText: "Average scores improved by +13.4% over 4 weeks (from 65.2% to 78.6%).",
      studentImprovement: "Student Improvement Rates",
      studentImprovementDesc: "Comparing first vs. latest attempt",
      improved: "Improved Performance",
      improvedPerformance: "Improved Performance",
      stable: "Stable Performance",
      stablePerformance: "Stable Performance",
      declined: "Declined Performance",
      declinedPerformance: "Declined Performance",
      avgImprovement: "Average Improvement",
      contentQuality: "Content & System Quality",
      contentQualityDesc: "Content quality metrics",
      lessonsCreated: "Lessons Created",
      aiTests: "AI Tests",
      vaultTests: "Vault Tests",
      avgQuestions: "Avg Questions",
      approvalRate: "Test Approval Rate",
      highApproval: "High approval rate (94.7%) indicates strong AI content quality. Teachers rarely need to reject or heavily edit AI-generated tests.",
      demoComplete: "Complete Analytics System Demo",
      demoCompleteDesc: "Comprehensive education analytics and insights",
      systemComplete: "Demo Complete!",
      complete: "Demo Complete!",
      badges: {
        realtime: "✓ Real-time Dashboards",
        sql: "✓ Data Analytics",
        json: "✓ Advanced Analysis",
        ai: "✓ AI Insights",
        trends: "✓ Trend Detection"
      }
    }
  },
  ar: {
    backToHome: "العودة للرئيسية",
    previousStep: "الخطوة السابقة",
    nextStep: "الخطوة التالية",
    mainTitle: "منصة NATIVE OS التعليمية",
    mainSubtitle: "نظام تعلم اللغات بالذكاء الاصطناعي - عرض توضيحي للوزارة",
    stepTitle: "الخطوة",
    of: "من",
    steps: [
      {
        title: 'توليد خطة الدرس بالذكاء الاصطناعي',
        description: 'المعلم يستخدم الذكاء الاصطناعي لإنشاء خطط دروس شاملة',
      },
      {
        title: 'إنشاء الدرس التفاعلي',
        description: 'بناء أنشطة جذابة بالسحب والإفلات',
      },
      {
        title: 'اختبار تفاعلي للطالب',
        description: 'الطالب يخضع لتقييم تفاعلي جذاب',
      },
      {
        title: 'التصحيح بمساعدة الذكاء الاصطناعي',
        description: 'المعلم يصحح مع اقتراحات وملاحظات الذكاء الاصطناعي',
      },
      {
        title: 'تحليلات في الوقت الفعلي',
        description: 'عرض رؤى شاملة عن الأداء والاتجاهات',
      }
    ],
    // Step 1: Lesson Plan Generation
    lessonPlan: {
      teacherInputs: "مدخلات المعلم لتوليد الذكاء الاصطناعي",
      ministerViews: "الوزير يشاهد واجهة تخطيط الدرس للمعلم",
      subject: "المادة",
      gradeLevel: "المستوى الدراسي",
      unitNumber: "رقم الوحدة",
      lessonNumber: "رقم الدرس",
      lessonTopic: "موضوع الدرس",
      learningObjectives: "أهداف التعلم",
      useVault: "استخدام مخزن دروس NATIVE OS (محتوى منهجي معتمد)",
      generateBtn: "إنشاء خطة الدرس بالذكاء الاصطناعي",
      generating: "الذكاء الاصطناعي يقوم بإنشاء خطة درسك...",
      analyzingStandards: "تحليل معايير المناهج الدراسية...",
      accessingVault: "الوصول إلى مخزن الدروس...",
      creatingActivities: "إنشاء أنشطة تفاعلية...",
      generatedTitle: "خطة الدرس المُولدة بالذكاء الاصطناعي",
      success: "تم التوليد بنجاح!",
      readyToUse: "جاهز للاستخدام في الفصل الدراسي",
      lessonTitle: "عنوان الدرس",
      objectives: ["تعلم المفردات المتعلقة بأنشطة أوقات الفراغ", "ممارسة التعبير عن الإعجاب وعدم الإعجاب", "استخدام الأفعال المصدرية (verb + -ing) بشكل صحيح"],
      warmUp: "نشاط التمهيد",
      warmUpDesc: "مناقشة تفاعلية حول الأنشطة المفضلة",
      mainActivity: "النشاط الرئيسي",
      mainActivityDesc: "لعبة مطابقة المفردات التفاعلية مع أنشطة أوقات الفراغ",
      practice: "تمرين الممارسة",
      practiceDesc: "التلاميذ ينشئون جملاً باستخدام الأفعال المصدرية لوصف هواياتهم",
      assessment: "التقييم",
      assessmentDesc: "اختبار متعدد الخيارات من 5 أسئلة حول الأفعال المصدرية ومفردات أوقات الفراغ",
      materials: "المواد والموارد",
      materialsItems: ["بطاقات المفردات التعليمية (رقمية)", "عرض تقديمي على اللوحة التفاعلية", "أوراق عمل التلاميذ (قابلة للطباعة)", "تسجيلات صوتية لمتحدثين أصليين"],
      duration: "المدة",
      minutes: "دقيقة",
      englishLanguage: "اللغة الإنجليزية",
      grade7: "الصف السابع",
      unit1: "الوحدة الأولى",
      lesson1: "الدرس الأول",
      letshavefun: "لنستمتع - أنشطة أوقات الفراغ"
    },
    // Step 2: Lesson Creation
    lessonCreation: {
      title: "أنشطة الدرس التفاعلية",
      subtitle: "بناء محتوى جذاب بأدوات السحب والإفلات",
      activity1Title: "النشاط 1: مطابقة المفردات",
      activity1Desc: "اسحب بطاقات المفردات إلى التعريفات المطابقة",
      activity2Title: "النشاط 2: جدول التفضيلات",
      activity2Desc: "التلاميذ يملؤون جدول التفضيلات التفاعلي",
      activity3Title: "النشاط 3: ممارسة القواعد",
      activity3Desc: "املأ الفراغات بأشكال الأفعال المصدرية الصحيحة",
      dragHere: "اسحب هنا",
      complete: "مكتمل!",
      activityComplete: "النشاط مكتمل! 🎉",
      allMatched: "تمت مطابقة جميع المفردات بشكل صحيح!",
      selectPreferences: "انقر على الخلايا لتحديد التفضيلات",
      checkAnswer: "تحقق من الإجابة",
      correct: "صحيح!",
      tryAgain: "حاول مجدداً",
      fillBlank: "اكتب إجابتك...",
      vocabulary: {
        reading: "القراءة",
        swimming: "السباحة",
        dancing: "الرقص",
        cooking: "الطبخ",
        painting: "الرسم",
        gaming: "ألعاب الفيديو",
        hiking: "المشي لمسافات طويلة",
        singing: "الغناء"
      },
      hobbies: ["قراءة الكتب", "ممارسة الرياضة", "مشاهدة الأفلام", "الاستماع للموسيقى", "الرسم/التلوين", "ألعاب الفيديو", "الطبخ", "السفر"]
    },
    // Step 3: Gamified Test
    test: {
      welcomeTitle: "هل أنت مستعد للاختبار؟",
      welcomeDesc: "أجب عن 5 أسئلة متعددة الخيارات حول الأفعال المصدرية وأنشطة أوقات الفراغ. حظاً موفقاً!",
      startTest: "بدء الاختبار",
      question: "السؤال",
      selectAnswer: "اختر إجابتك:",
      previous: "السابق",
      next: "التالي",
      submit: "إرسال الاختبار",
      resultsTitle: "نتائج الاختبار",
      yourScore: "درجتك",
      outOf: "من",
      correct: "صحيح",
      incorrect: "خطأ",
      motivation: "عمل رائع! أنت تحرز تقدماً ممتازاً في رحلة تعلم اللغة الإنجليزية!",
      backToOverview: "العودة للنظرة العامة"
    },
    // Step 4: AI Grading
    grading: {
      title: "نظام التصحيح بمساعدة الذكاء الاصطناعي",
      submissionReview: "مراجعة التسليم",
      studentName: "اسم الطالب",
      testCompleted: "اكتمل الاختبار",
      autoScore: "الدرجة التلقائية",
      answerGrid: "شبكة الإجابات",
      analyzeBtn: "تحليل بالذكاء الاصطناعي",
      analyzing: "الذكاء الاصطناعي يقوم بتحليل التسليم...",
      processingAnswers: "معالجة إجابات الطالب...",
      evaluatingPatterns: "تقييم أنماط التعلم...",
      generatingInsights: "توليد رؤى شخصية...",
      detailedAnalysis: "التحليل التفصيلي للذكاء الاصطناعي",
      aiVerified: "تم التحقق بالذكاء الاصطناعي",
      score: "الدرجة",
      questionAnalysis: "تحليل سؤال بسؤال",
      studentAnswer: "إجابة الطالب",
      correctAnswer: "الإجابة الصحيحة",
      aiFeedback: "ملاحظات الذكاء الاصطناعي:",
      aiSays: "يقول الذكاء الاصطناعي",
      learningInsights: "رؤى التعلم بالذكاء الاصطناعي",
      strengths: "نقاط القوة المحددة",
      areasForImprovement: "مجالات التحسين",
      nextSteps: "الخطوات الموصى بها",
      confirmed: "تأكيد التصحيح بالذكاء الاصطناعي!",
      clickNext: 'انقر على "التالي" لعرض التحليلات',
      analysisComplete: "اكتمل التحليل! الذكاء الاصطناعي تحقق من أداء الطالب وقدم توصيات تعلم شخصية.",
      strengthsList: [
        "فهم قوي لبنية الأفعال المصدرية الأساسية مع 'like' و 'enjoy'",
        "تمييز ممتاز للمفردات المتعلقة بأنشطة أوقات الفراغ",
        "إتقان جيد لإكمال الجمل بالأفعال المصدرية"
      ],
      improvementsList: [
        "يحتاج إلى ممارسة جمل 'because' للتعبير عن الأسباب",
        "مراجعة التوافق بين الفاعل والفعل مع 'dislike' (he dislikes مقابل he dislike)"
      ],
      nextStepsList: [
        "ممارسة كتابة جمل تشرح لماذا يستمتعون بالأنشطة",
        "إكمال تمارين تفاعلية حول صيغ الفعل للضمير الغائب المفرد",
        "مراجعة مقاطع فيديو الدرس التي تركز على التعبير عن الأسباب والآراء"
      ]
    },
    // Step 5: Analytics
    analytics: {
      title: "لوحة التحليلات في الوقت الفعلي",
      subtitle: "رؤى شاملة مستمدة من قاعدة البيانات المباشرة",
      description: "رؤى شاملة مستمدة من قاعدة البيانات المباشرة - تسليمات الاختبارات، الملفات الشخصية، وتتبع التقدم",
      liveData: "بيانات مباشرة",
      totalStudents: "إجمالي التلاميذ",
      testsCompleted: "الاختبارات المكتملة",
      averageScore: "متوسط الدرجات",
      passRate: "معدل النجاح",
      fromTable: "من",
      lessonPerformance: "أداء الدرس المحدد",
      dataFrom: "إحصائيات الأداء لهذا الدرس",
      totalAttempts: "إجمالي المحاولات",
      highestScore: "أعلى درجة",
      medianScore: "الدرجة الوسطى",
      lowestScore: "أقل درجة",
      questionDifficulty: "تحليل صعوبة الأسئلة",
      questionDifficultyDesc: "تحليل معدل الإجابات الصحيحة لكل سؤال",
      questionReview: "توصية الذكاء الاصطناعي: السؤال 3 يحتاج لمراجعة",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      aiRecommendation: "توصية الذكاء الاصطناعي: السؤال 3 يحتاج لمراجعة",
      recommendationText: "فقط 53.6% من التلاميذ أجابوا بشكل صحيح. هذا يشير إلى أن مفهوم 'التعبير عن الأسباب بـ because' يحتاج شرحاً أفضل في الدرس أو إعادة صياغة السؤال.",
      learningProgress: "مسار التقدم في التعلم",
      learningProgressDesc: "متوسط الدرجات مجمع حسب الأسبوع",
      week: "الأسبوع",
      studentsActive: "طالب نشط",
      positiveTrend: "اكتُشف اتجاه تعلم إيجابي",
      trendText: "تحسنت متوسط الدرجات بنسبة +13.4% على مدار 4 أسابيع (من 65.2% إلى 78.6%).",
      studentImprovement: "معدلات تحسن التلاميذ",
      studentImprovementDesc: "مقارنة المحاولة الأولى مقابل الأخيرة",
      improved: "أداء محسّن",
      improvedPerformance: "أداء محسّن",
      stable: "أداء مستقر",
      stablePerformance: "أداء مستقر",
      declined: "أداء منخفض",
      declinedPerformance: "أداء منخفض",
      avgImprovement: "متوسط التحسن",
      contentQuality: "جودة المحتوى والنظام",
      contentQualityDesc: "مقاييس جودة المحتوى",
      lessonsCreated: "دروس تم إنشاؤها",
      aiTests: "اختبارات الذكاء الاصطناعي",
      vaultTests: "اختبارات المخزن",
      avgQuestions: "متوسط الأسئلة",
      approvalRate: "معدل الموافقة على الاختبارات",
      highApproval: "معدل الموافقة المرتفع (94.7%) يشير إلى جودة عالية لمحتوى الذكاء الاصطناعي. نادراً ما يحتاج المدرسون إلى رفض أو تعديل كبير للاختبارات المُولدة بالذكاء الاصطناعي.",
      demoComplete: "عرض نظام التحليلات الكامل",
      demoCompleteDesc: "تحليلات تعليمية شاملة ورؤى متعمقة",
      systemComplete: "اكتمل العرض!",
      complete: "اكتمل العرض!",
      badges: {
        realtime: "✓ لوحات معلومات فورية",
        sql: "✓ تحليلات البيانات",
        json: "✓ تحليل متقدم",
        ai: "✓ رؤى الذكاء الاصطناعي",
        trends: "✓ اكتشاف الاتجاهات"
      }
    }
  }
};

// Demo steps
const DEMO_STEPS = [
  {
    id: 1,
    title: 'AI Lesson Plan Generation',
    description: 'Teacher uses AI to generate comprehensive lesson plans',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'Lesson Creation',
    description: 'Review and customize the generated lesson content',
    icon: BookOpen,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    title: 'Gamified Test',
    description: 'Student takes an engaging, gamified assessment',
    icon: ClipboardCheck,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    title: 'AI-Assisted Grading',
    description: 'Teacher grades with AI suggestions and feedback',
    icon: Brain,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 5,
    title: 'Analytics & Insights',
    description: 'View comprehensive student performance analytics',
    icon: BarChart3,
    color: 'from-indigo-500 to-purple-500'
  }
];

// Step 1: Lesson Plan Generation
const LessonPlanGenerationStep = ({ language, t }: { language: 'en' | 'ar', t: typeof translations.en }) => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {!isGenerated && !isGenerating && (
        <div className="space-y-6">
          {/* Teacher Input Form */}
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardTitle className="text-2xl flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <span>{t.lessonPlan.teacherInputs}</span>
              </CardTitle>
              <CardDescription>{t.lessonPlan.ministerViews}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.lessonPlan.subject}</label>
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-3 text-blue-900 font-medium">
                    {t.lessonPlan.englishLanguage}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.lessonPlan.gradeLevel}</label>
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg px-4 py-3 text-green-900 font-medium">
                    {t.lessonPlan.grade7}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.lessonPlan.unitNumber}</label>
                  <div className="bg-orange-50 border-2 border-orange-300 rounded-lg px-4 py-3 text-orange-900 font-medium">
                    {t.lessonPlan.unit1}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.lessonPlan.lessonNumber}</label>
                  <div className="bg-pink-50 border-2 border-pink-300 rounded-lg px-4 py-3 text-pink-900 font-medium">
                    {t.lessonPlan.lesson1}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t.lessonPlan.lessonTopic}</label>
                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg px-4 py-3 text-purple-900 font-medium">
                  {t.lessonPlan.letshavefun}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t.lessonPlan.learningObjectives}</label>
                <div className="bg-teal-50 border-2 border-teal-300 rounded-lg px-4 py-3 text-teal-900">
                  <ul className="list-disc list-inside space-y-1">
                    {t.lessonPlan.objectives.map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2 bg-yellow-50 border-2 border-yellow-300 rounded-lg px-4 py-3`}>
                <input type="checkbox" checked readOnly className="w-5 h-5 text-yellow-600" />
                <label className="text-sm font-medium text-yellow-900">
                  {t.lessonPlan.useVault}
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <div className="text-center">
            <Button
              onClick={handleGenerate}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:scale-105 transition-transform"
            >
              <Sparkles className={`h-6 w-6 animate-pulse ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
              {t.lessonPlan.generateBtn}
              <Sparkles className={`h-6 w-6 animate-pulse ${language === 'ar' ? 'mr-3' : 'ml-3'}`} />
            </Button>
          </div>
        </div>
      )}

      {/* Loading Animation */}
      {isGenerating && (
        <div className="space-y-6">
          <Card className="border-2 border-purple-400">
            <CardContent className="p-12">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <Sparkles className="h-24 w-24 text-purple-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{t.lessonPlan.generating}</h3>
                <div className="space-y-2 text-center">
                  <p className="text-gray-600 animate-pulse">{t.lessonPlan.analyzingStandards}</p>
                  <p className="text-gray-600 animate-pulse delay-100">{t.lessonPlan.accessingVault}</p>
                  <p className="text-gray-600 animate-pulse delay-200">{t.lessonPlan.creatingActivities}</p>
                </div>
                <Progress value={66} className="w-96 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generated Lesson Plan */}
      {isGenerated && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="border-2 border-green-400 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl flex items-center space-x-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {t.lessonPlan.generatedTitle}
                  </span>
                </CardTitle>
                <Badge className="bg-yellow-600 text-white border-0">Aziz Advisor</Badge>
              </div>
              <CardDescription className="text-lg">
                {t.lessonPlan.success} - {t.lessonPlan.readyToUse}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Lesson Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className={`text-xl font-bold text-blue-900 mb-4 flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                  <BookOpen className="h-6 w-6" />
                  <span>{t.lessonPlan.lessonTitle}</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t.lessonPlan.subject}</p>
                    <p className="font-bold text-gray-900">{t.lessonPlan.englishLanguage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.lessonPlan.gradeLevel}</p>
                    <p className="font-bold text-gray-900">{t.lessonPlan.grade7}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.lessonPlan.unitNumber}</p>
                    <p className="font-bold text-gray-900">{t.lessonPlan.unit1}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.lessonPlan.lessonNumber}</p>
                    <p className="font-bold text-gray-900">{t.lessonPlan.lesson1}: {t.lessonPlan.letshavefun}</p>
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
                <h3 className={`text-xl font-bold text-teal-900 mb-4 flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                  <Award className="h-6 w-6" />
                  <span>{t.lessonPlan.learningObjectives}</span>
                </h3>
                <ul className="space-y-2">
                  {t.lessonPlan.objectives.map((obj, idx) => (
                    <li key={idx} className={`flex items-start ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-800">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lesson Activities */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                <h3 className={`text-xl font-bold text-orange-900 mb-4 flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                  <Users className="h-6 w-6" />
                  <span>{language === 'ar' ? 'الأنشطة التفاعلية (6 أنشطة)' : 'Interactive Activities (6 Activities)'}</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { num: 1, title: language === 'ar' ? "لنبدأ" : "Let's Get Started", desc: language === 'ar' ? 'مطابقة المفردات مع الصور' : 'Vocabulary matching with pictures', icon: '🎯', color: 'bg-orange-100' },
                    { num: 2, title: language === 'ar' ? "لنتحدث" : "Let's Speak", desc: language === 'ar' ? 'جدول التفضيلات (أحب/أحب جداً/لا أحب/أكره)' : 'Preference table (like/love/dislike/hate)', icon: '💬', color: 'bg-blue-100' },
                    { num: 3, title: language === 'ar' ? 'قاعدة النحو' : 'Grammar Rule', desc: language === 'ar' ? 'ممارسة الأفعال المصدرية مع ملء الفراغات' : 'Gerunds practice with fill-in-the-blanks', icon: '📝', color: 'bg-pink-100' },
                    { num: 4, title: language === 'ar' ? "لنكتب" : "Let's Write", desc: language === 'ar' ? 'كتابة إبداعية عن الهوايات' : 'Creative writing about hobbies', icon: '✍️', color: 'bg-purple-100' },
                    { num: 5, title: language === 'ar' ? "لننطق" : "Let's Pronounce", desc: language === 'ar' ? 'ممارسة النطق الصوتي' : 'Audio pronunciation practice', icon: '🗣️', color: 'bg-green-100' },
                    { num: 6, title: language === 'ar' ? "لنلعب" : "Let's Play", desc: language === 'ar' ? 'لعبة مطابقة تفاعلية' : 'Interactive matching game', icon: '🎮', color: 'bg-yellow-100' },
                  ].map((activity) => (
                    <div key={activity.num} className={`${activity.color} p-4 rounded-lg border border-gray-300`}>
                      <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2 mb-2`}>
                        <span className="text-2xl">{activity.icon}</span>
                        <span className="font-bold text-gray-900">{language === 'ar' ? `النشاط ${activity.num}` : `Activity ${activity.num}`}</span>
                      </div>
                      <p className="font-semibold text-gray-800">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vocabulary & Grammar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
                  <h3 className="text-xl font-bold text-pink-900 mb-4">📚 {language === 'ar' ? 'المفردات الرئيسية' : 'Key Vocabulary'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {['swimming', 'dancing', 'playing sports', 'playing computer games', 
                      'gardening', 'fishing', 'drawing', 'visiting museums',
                      'going to the cinema', 'listening to music', 'reading books', 'riding a bike'].map((word, idx) => (
                      <Badge key={idx} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 text-sm">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4">✨ {language === 'ar' ? 'التركيز النحوي' : 'Grammar Focus'}</h3>
                  <div className="space-y-2">
                    <p className="text-gray-800"><span className="font-bold">Enjoy</span> + verb + <span className="bg-yellow-200 px-2 py-1 rounded font-bold">-ing</span></p>
                    <p className="text-gray-800"><span className="font-bold">Like</span> + verb + <span className="bg-yellow-200 px-2 py-1 rounded font-bold">-ing</span></p>
                    <p className="text-sm text-gray-600 italic mt-2">{language === 'ar' ? 'مثال: I enjoy swimming. They like dancing.' : 'Example: I enjoy swimming. They like dancing.'}</p>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 border-2 border-green-300">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-3`}>
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                    <div>
                      <h4 className="text-lg font-bold text-green-900">{language === 'ar' ? 'اكتملت خطة الدرس!' : 'Lesson Plan Complete!'}</h4>
                      <p className="text-green-700">{language === 'ar' ? 'جاهز لإنشاء محتوى الدرس التفاعلي' : 'Ready to create interactive lesson content'}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white text-lg px-4 py-2 border-0">
                    {language === 'ar' ? 'انقر "التالي" لرؤية إنشاء الدرس' : 'Click "Next" to see Lesson Creation'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Step 2: Lesson Creation
const LessonCreationStep = ({ language, t }: { language: 'en' | 'ar', t: typeof translations.en }) => {
  const [selectedActivities, setSelectedActivities] = useState<Record<number, string>>({});
  const [tableSelections, setTableSelections] = useState<Record<string, string>>({});
  const [grammarAnswers, setGrammarAnswers] = useState<Record<number, string>>({
    0: 'riding a bike',
    1: '',
    2: '',
    3: '',
    4: '',
  });
  const [isDragging, setIsDragging] = useState(false);

  const activities = [
    'swimming', 'dancing', 'playing sports', 'playing computer games',
    'gardening', 'fishing', 'drawing', 'visiting museums',
    'going to the cinema', 'listening to music', 'reading books', 'riding a bike'
  ];

  const activityCards = [
    { num: 1, emoji: '🏊', color: 'bg-blue-200', correctAnswer: 'swimming' },
    { num: 2, emoji: '🤸', color: 'bg-purple-200', correctAnswer: 'dancing' },
    { num: 3, emoji: '⚽', color: 'bg-green-200', correctAnswer: 'playing sports' },
    { num: 4, emoji: '💻', color: 'bg-gray-200', correctAnswer: 'playing computer games' },
    { num: 5, emoji: '🌱', color: 'bg-green-300', correctAnswer: 'gardening' },
    { num: 6, emoji: '🌳', color: 'bg-green-400', correctAnswer: 'fishing' },
    { num: 7, emoji: '🎨', color: 'bg-pink-200', correctAnswer: 'drawing' },
    { num: 8, emoji: '🏛️', color: 'bg-orange-200', correctAnswer: 'visiting museums' },
  ];

  const hobbyList = [
    'Going to a museum', 'Reading books', 'Playing computer games', 'Gardening',
    'Going to the cinema', 'Dancing', 'Drawing', 'Fishing'
  ];

  const practiceExamples = [
    { name: 'William', activity: 'ride a bike', emoji: '🚴', answer: 'William enjoys riding a bike.' },
    { name: 'Rex and Kate', activity: 'dance', emoji: '💃', answer: 'Rex and Kate enjoy dancing.' },
    { name: 'Carla', activity: 'fish', emoji: '🎣', answer: 'Carla enjoys fishing.' },
    { name: 'Steve', activity: 'swim', emoji: '🏊', answer: 'Steve enjoys swimming.' },
    { name: 'Henry', activity: 'read books', emoji: '📚', answer: 'Henry enjoys reading books.' },
  ];

  const handleDrop = (cardNum: number, activity: string) => {
    setSelectedActivities(prev => ({ ...prev, [cardNum]: activity }));
    setIsDragging(false);
  };

  const handleTableClick = (hobby: string, preference: string) => {
    setTableSelections(prev => ({ ...prev, [hobby]: preference }));
  };

  const handleGrammarFill = (index: number, value: string) => {
    setGrammarAnswers(prev => ({ ...prev, [index]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="bg-gradient-to-r from-orange-400 via-teal-400 to-orange-400 p-6 rounded-xl text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2 mb-2`}>
              <Badge className="bg-teal-600 text-white border-0">{t.lessonPlan.unit1}</Badge>
              <Badge className="bg-orange-600 text-white border-0">{t.lessonPlan.lesson1}</Badge>
            </div>
            <h2 className="text-3xl font-bold mb-2">{t.lessonPlan.letshavefun}</h2>
            <p className="text-white/90 text-lg">
              {t.lessonCreation.subtitle}
            </p>
          </div>
          <div className="text-6xl font-bold text-white/30">1</div>
        </div>
        <div className={`mt-4 flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-4 text-sm`}>
          <span className="bg-white/20 px-3 py-1 rounded-full">📚 By aziz advisor</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">🏫 Virtual School</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">🎮 {language === 'ar' ? 'تفاعلي' : 'Interactive'}</span>
        </div>
      </div>

      {/* Activity 1: Drag & Drop - Let's Get Started */}
      <Card className="border-l-4 border-orange-500">
        <CardHeader className="bg-orange-50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-3`}>
              <div className="bg-orange-500 p-3 rounded-full">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <div>
                <CardTitle className="text-2xl text-orange-900">{t.lessonCreation.activity1Title}</CardTitle>
                <CardDescription>{t.lessonCreation.activity1Desc}</CardDescription>
              </div>
            </div>
            <Badge className="bg-orange-600 text-white border-0">
              {Object.keys(selectedActivities).length}/8 {t.lessonCreation.complete}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Draggable Words Bank */}
          <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
            <p className="text-sm text-orange-900 font-medium mb-3">📝 {t.lessonCreation.dragHere}:</p>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={() => setIsDragging(false)}
                  className="bg-white border-2 border-orange-300 text-orange-800 px-4 py-2 rounded-lg cursor-move hover:bg-orange-100 hover:scale-105 transition-all shadow-sm hover:shadow-md"
                >
                  {activity}
                </div>
              ))}
            </div>
          </div>

          {/* Drop Zones Grid */}
          <div className="grid grid-cols-4 gap-4">
            {activityCards.map((item) => (
              <div
                key={item.num}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(item.num, item.correctAnswer);
                }}
                onClick={() => !selectedActivities[item.num] && handleDrop(item.num, item.correctAnswer)}
                className={`${item.color} p-4 rounded-xl relative cursor-pointer transition-all hover:scale-105 ${
                  selectedActivities[item.num] ? 'ring-4 ring-green-500' : isDragging ? 'ring-2 ring-orange-400 ring-dashed' : ''
                }`}
              >
                <span className="absolute top-2 left-2 bg-white/80 w-8 h-8 rounded-full flex items-center justify-center font-bold text-green-700">
                  {item.num}
                </span>
                {selectedActivities[item.num] && (
                  <CheckCircle2 className="absolute top-2 right-2 h-6 w-6 text-green-600" />
                )}
                <div className="text-4xl text-center mt-6 mb-2">{item.emoji}</div>
                <div className={`text-center text-xs font-medium px-2 py-1 rounded ${
                  selectedActivities[item.num] 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-white/50 text-gray-400'
                }`}>
                  {selectedActivities[item.num] || 'Drop here'}
                </div>
              </div>
            ))}
          </div>

          {Object.keys(selectedActivities).length === 8 && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 animate-in fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <span className="font-bold text-green-900">Perfect! All activities matched correctly! 🎉</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity 2: Interactive Table - Let's Speak */}
      <Card className="border-l-4 border-blue-500">
        <CardHeader className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-3 rounded-full">
                <span className="text-white text-2xl">💬</span>
              </div>
              <div>
                <CardTitle className="text-2xl text-blue-900">{t.lessonCreation.activity2Title}</CardTitle>
                <CardDescription>{t.lessonCreation.activity2Desc}</CardDescription>
              </div>
            </div>
            <Badge className="bg-blue-600 text-white border-0">
              {Object.keys(tableSelections).length}/8 {language === 'ar' ? 'مُجاب' : 'answered'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-teal-100">
                  <th className="border border-teal-300 p-3 text-left font-semibold text-teal-900">{language === 'ar' ? 'الهواية/النشاط' : 'Hobby/Activity'}</th>
                  <th className="border border-teal-300 p-3 text-center font-semibold text-teal-900">{language === 'ar' ? 'أحب +' : 'Like +'}</th>
                  <th className="border border-teal-300 p-3 text-center font-semibold text-teal-900">{language === 'ar' ? 'أحب جداً ++' : 'Love ++'}</th>
                  <th className="border border-teal-300 p-3 text-center font-semibold text-teal-900">{language === 'ar' ? 'لا أحب -' : "Don't like -"}</th>
                  <th className="border border-teal-300 p-3 text-center font-semibold text-teal-900">{language === 'ar' ? 'أكره --' : 'Hate --'}</th>
                </tr>
              </thead>
              <tbody>
                {hobbyList.map((hobby, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 p-3 font-medium text-gray-700">{language === 'ar' ? t.lessonCreation.hobbies[idx] : hobby}</td>
                    {['like', 'love', 'dislike', 'hate'].map((pref) => (
                      <td key={pref} className="border border-gray-300 p-3 text-center">
                        <div
                          onClick={() => handleTableClick(hobby, pref)}
                          className={`w-8 h-8 border-2 rounded mx-auto cursor-pointer transition-all ${
                            tableSelections[hobby] === pref
                              ? 'bg-blue-500 border-blue-600 scale-110'
                              : 'border-gray-400 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          {tableSelections[hobby] === pref && (
                            <CheckCircle2 className="h-full w-full text-white p-1" />
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {Object.keys(tableSelections).length === 8 && (
            <div className={`mt-4 bg-blue-50 border-2 border-blue-300 rounded-lg p-4 animate-in fade-in`}>
              <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-blue-900">{language === 'ar' ? 'رائع! تم تحديد جميع التفضيلات! 🎯' : 'Great! All preferences selected! 🎯'}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity 3: Fill-in Grammar - Let's Complete the Rule */}
      <Card className="border-l-4 border-pink-500">
        <CardHeader className="bg-pink-50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-3`}>
              <div className="bg-pink-500 p-3 rounded-full">
                <span className="text-white text-2xl">📝</span>
              </div>
              <div>
                <CardTitle className="text-2xl text-pink-900">{t.lessonCreation.activity3Title}</CardTitle>
                <CardDescription>{t.lessonCreation.activity3Desc}</CardDescription>
              </div>
            </div>
            <Badge className="bg-pink-600 text-white border-0">
              {language === 'ar' ? 'قواعد تفاعلية' : 'Interactive Grammar'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="bg-pink-100 border-2 border-pink-300 rounded-xl p-6">
            <h4 className="font-bold text-pink-900 text-lg mb-4">Grammar Rule:</h4>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p className="text-gray-800 text-lg">
                Enjoy + verb + <span className="bg-yellow-200 px-3 py-1 rounded font-bold">-ing</span>
              </p>
              <p className="text-gray-800 text-lg">
                Like + verb + <span className="bg-yellow-200 px-3 py-1 rounded font-bold">-ing</span>
              </p>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
            <h4 className="font-bold text-green-900 text-lg mb-4">📚 Practice: What does he/she enjoy doing?</h4>
            
            <div className="space-y-4">
              {practiceExamples.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-bold text-green-600">{String.fromCharCode(97 + idx)}.</span> {item.name} / {item.activity}
                      </p>
                      
                      {idx === 0 ? (
                        <p className="text-gray-800 font-medium italic bg-green-50 p-2 rounded">
                          ✓ {item.answer}
                        </p>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={grammarAnswers[idx]}
                            onChange={(e) => handleGrammarFill(idx, e.target.value)}
                            placeholder="Type the answer here..."
                            className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                          />
                          {grammarAnswers[idx] && grammarAnswers[idx].toLowerCase().includes('enjoy') && (
                            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                      )}
                      
                      {grammarAnswers[idx] && grammarAnswers[idx].toLowerCase().includes('enjoy') && idx !== 0 && (
                        <p className="text-xs text-green-600 mt-1">✓ Correct! {item.answer}</p>
                      )}
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                      {item.emoji}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-green-900 text-lg">Interactive Lesson Complete! 🎉</h4>
                <p className="text-sm text-green-700">Student engagement through drag-and-drop, clickable interactions, and fill-in exercises</p>
              </div>
            </div>
            <Badge className="bg-green-600 text-white text-lg px-4 py-2 border-0">
              Click "Next" for Student Test
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Step 3: Gamified Test
const GamifiedTestStep = ({ language, t }: { language: 'en' | 'ar', t: typeof translations.en }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const questions = [
    {
      question: "Which sentence correctly uses the grammar rule for expressing a preference learned in the lesson?",
      options: [
        "I like to fishing at the river.",
        "I like fishing at the river.",
        "I am liking fish at the river.",
        "I like fish at the river."
      ],
      correct_answer: 1
    },
    {
      question: "Read the short conversation. Which option correctly completes the dialogue?\n\nMaria: \"What do you enjoy doing in your free time?\"\nTom: \"I really enjoy ______ stories because I love imagining new worlds.\"",
      options: [
        "write",
        "to writing",
        "wrote",
        "writing"
      ],
      correct_answer: 3
    },
    {
      question: "Which sentence best explains *why* someone likes an activity, using the structures from the lesson?",
      options: [
        "My favourite activity is dancing.",
        "I dislike cleaning my room.",
        "He enjoys playing the guitar because it is creative.",
        "She goes swimming every Saturday."
      ],
      correct_answer: 2
    },
    {
      question: "A student wrote four sentences about their hobbies. Which sentence has a grammatical mistake?",
      options: [
        "We love playing board games together.",
        "My sister hates washing the dishes.",
        "He dislike reading long books.",
        "Do you enjoy listening to music?"
      ],
      correct_answer: 2
    },
    {
      question: "If someone's favourite leisure activity involves moving their body to music, how would they correctly express their enjoyment?",
      options: [
        "I enjoy to dance with my friends.",
        "I enjoy dance with my friends.",
        "I enjoy dancing with my friends.",
        "I am enjoy dancing with my friends."
      ],
      correct_answer: 2
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setAnsweredQuestions({ ...answeredQuestions, [currentQuestion]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answeredQuestions[currentQuestion + 1] ?? null);
      setShowResult(!!answeredQuestions[currentQuestion + 1]);
    } else {
      setTestCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answeredQuestions[currentQuestion - 1] ?? null);
      setShowResult(!!answeredQuestions[currentQuestion - 1]);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    Object.entries(answeredQuestions).forEach(([questionIndex, answer]) => {
      if (questions[parseInt(questionIndex)].correct_answer === answer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const currentQ = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correct_answer;
  const score = calculateScore();

  if (testCompleted) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-green-400 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="text-center">
              <div className="mb-4">
                <Award className="h-24 w-24 mx-auto text-yellow-500 animate-bounce" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {t.test.resultsTitle} 🎉
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {t.lessonPlan.unit1}, {t.lessonPlan.lesson1}: {t.lessonPlan.letshavefun}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-6">
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {score.percentage}%
                </div>
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  {score.correct} {t.test.outOf} {score.total} {t.test.correct}
                </p>
                <div className={`flex items-center justify-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2 mt-4`}>
                  {score.percentage >= 80 ? (
                    <>
                      <span className="text-4xl">🌟</span>
                      <span className="text-xl font-bold text-green-600">{language === 'ar' ? 'عمل ممتاز!' : 'Excellent Work!'}</span>
                      <span className="text-4xl">🌟</span>
                    </>
                  ) : score.percentage >= 60 ? (
                    <>
                      <span className="text-4xl">👍</span>
                      <span className="text-xl font-bold text-blue-600">{language === 'ar' ? 'عمل جيد!' : 'Good Job!'}</span>
                      <span className="text-4xl">👍</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl">📚</span>
                      <span className="text-xl font-bold text-orange-600">{language === 'ar' ? 'استمر في الممارسة!' : 'Keep Practicing!'}</span>
                      <span className="text-4xl">📚</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-6">
              {questions.map((_, index) => {
                const userAnswer = answeredQuestions[index];
                const isCorrectAnswer = userAnswer === questions[index].correct_answer;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center font-bold ${
                      isCorrectAnswer
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-red-100 border-2 border-red-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{isCorrectAnswer ? '✅' : '❌'}</div>
                    <div className="text-sm text-gray-600">Q{index + 1}</div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-10 w-10 text-orange-600" />
                  <div>
                    <h4 className="text-lg font-bold text-orange-900">Student Performance Tracked</h4>
                    <p className="text-orange-700">Results automatically saved to portfolio for AI analysis</p>
                  </div>
                </div>
                <Badge className="bg-orange-600 text-white text-lg px-4 py-2 border-0">
                  Click "Next" for AI Grading
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`text-2xl flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                <ClipboardCheck className="h-6 w-6 text-purple-600" />
                <span>{language === 'ar' ? 'اختبار متعدد الخيارات تفاعلي' : 'Gamified MCQ Test'}</span>
              </CardTitle>
              <CardDescription className="text-lg">
                {t.lessonPlan.unit1}, {t.lessonPlan.lesson1}: {t.lessonPlan.letshavefun}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">{language === 'ar' ? 'التقدم' : 'Progress'}</div>
              <div className="text-3xl font-bold text-purple-600">
                {currentQuestion + 1}/{questions.length}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-3" />
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="border-2 border-blue-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-blue-600 text-white mb-3 border-0">
                {t.test.question} {currentQuestion + 1}
              </Badge>
              <CardTitle className="text-xl leading-relaxed whitespace-pre-wrap">
                {currentQ.question}
              </CardTitle>
            </div>
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold">
              {currentQuestion + 1}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQ.correct_answer;
              const showCorrect = showResult && isCorrectOption;
              const showIncorrect = showResult && isSelected && !isCorrectOption;

              return (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    showCorrect
                      ? 'bg-green-100 border-green-500 ring-4 ring-green-200'
                      : showIncorrect
                      ? 'bg-red-100 border-red-500 ring-4 ring-red-200'
                      : isSelected
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  } ${!showResult ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        showCorrect
                          ? 'bg-green-500 text-white'
                          : showIncorrect
                          ? 'bg-red-500 text-white'
                          : isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 font-medium text-gray-800">{option}</span>
                    {showCorrect && <CheckCircle2 className="h-6 w-6 text-green-600" />}
                    {showIncorrect && <span className="text-2xl">❌</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div
              className={`mt-6 p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2 ${
                isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-orange-50 border-2 border-orange-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl">
                  {isCorrect ? '🎉' : '💡'}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-900' : 'text-orange-900'}`}>
                    {isCorrect ? 'Correct! Well done!' : 'Not quite right!'}
                  </h4>
                  <p className={isCorrect ? 'text-green-700' : 'text-orange-700'}>
                    {isCorrect 
                      ? `Great job! "${currentQ.options[currentQ.correct_answer]}" is the correct answer.`
                      : `The correct answer is: "${currentQ.options[currentQ.correct_answer]}"`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
          size="lg"
        >
          {language === 'ar' ? <ArrowRight className="h-5 w-5 ml-2" /> : <ArrowLeft className="h-5 w-5 mr-2" />}
          {t.test.previous}
        </Button>

        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">{language === 'ar' ? 'أجبت' : 'Answered'}</div>
          <div className="text-2xl font-bold text-purple-600">
            {Object.keys(answeredQuestions).length}/{questions.length}
          </div>
        </div>

        {currentQuestion === questions.length - 1 && showResult ? (
          <Button
            onClick={handleNext}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
          >
            {t.test.submit}
            <Award className={`h-5 w-5 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!showResult}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Next Question
            {language === 'ar' ? <ArrowLeft className="h-5 w-5 mr-2" /> : <ArrowRight className="h-5 w-5 ml-2" />}
          </Button>
        )}
      </div>
    </div>
  );
};

// Step 4: AI-Assisted Grading
const AIGradingStep = ({ language, t }: { language: 'en' | 'ar', t: typeof translations.en }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const quizResults = {
    studentName: "Ahmad Ali",
    lessonTitle: "Unit I, Lesson 1: Let's Have Fun",
    testType: "MCQ - Grammar & Usage",
    totalQuestions: 5,
    answers: [
      {
        questionNum: 1,
        question: "Which sentence correctly uses the grammar rule for expressing a preference learned in the lesson?",
        studentAnswer: 1,
        correctAnswer: 1,
        options: [
          "I like to fishing at the river.",
          "I like fishing at the river.",
          "I am liking fish at the river.",
          "I like fish at the river."
        ],
        isCorrect: true
      },
      {
        questionNum: 2,
        question: "Read the short conversation. Which option correctly completes the dialogue?\n\nMaria: \"What do you enjoy doing in your free time?\"\nTom: \"I really enjoy ______ stories because I love imagining new worlds.\"",
        studentAnswer: 3,
        correctAnswer: 3,
        options: ["write", "to writing", "wrote", "writing"],
        isCorrect: true
      },
      {
        questionNum: 3,
        question: "Which sentence best explains *why* someone likes an activity, using the structures from the lesson?",
        studentAnswer: 1,
        correctAnswer: 2,
        options: [
          "My favourite activity is dancing.",
          "I dislike cleaning my room.",
          "He enjoys playing the guitar because it is creative.",
          "She goes swimming every Saturday."
        ],
        isCorrect: false
      },
      {
        questionNum: 4,
        question: "A student wrote four sentences about their hobbies. Which sentence has a grammatical mistake?",
        studentAnswer: 2,
        correctAnswer: 2,
        options: [
          "We love playing board games together.",
          "My sister hates washing the dishes.",
          "He dislike reading long books.",
          "Do you enjoy listening to music?"
        ],
        isCorrect: true
      },
      {
        questionNum: 5,
        question: "If someone's favourite leisure activity involves moving their body to music, how would they correctly express their enjoyment?",
        studentAnswer: 2,
        correctAnswer: 2,
        options: [
          "I enjoy to dance with my friends.",
          "I enjoy dance with my friends.",
          "I enjoy dancing with my friends.",
          "I am enjoy dancing with my friends."
        ],
        isCorrect: true
      }
    ],
    correctCount: 4,
    totalCount: 5,
    score: 80
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Initial State - Show Quiz Summary */}
      {!isAnalyzing && !showAnalysis && (
        <div className="space-y-6">
          <Card className="border-2 border-orange-300">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
              <CardTitle className={`text-2xl flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                <Brain className="h-6 w-6 text-orange-600" />
                <span>{t.grading.title}</span>
              </CardTitle>
              <CardDescription className="text-lg">
                {language === 'ar' ? 'المعلم يراجع تسليم اختبار الطالب مع تحليل واقتراحات الذكاء الاصطناعي' : 'Teacher reviews student test submission with AI analysis and suggestions'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-4">📋 {t.grading.submissionReview}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t.grading.studentName}</p>
                    <p className="font-bold text-gray-900">{quizResults.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'الدرس' : 'Lesson'}</p>
                    <p className="font-bold text-gray-900">{quizResults.lessonTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'نوع الاختبار' : 'Test Type'}</p>
                    <p className="font-bold text-gray-900">{quizResults.testType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.grading.autoScore}</p>
                    <p className="font-bold text-2xl text-blue-600">{quizResults.score}%</p>
                  </div>
                </div>
                <div className={`mt-4 flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                  <Badge className="bg-green-600 text-white border-0">
                    {quizResults.correctCount} {t.test.correct}
                  </Badge>
                  <Badge className="bg-red-600 text-white border-0">
                    {quizResults.totalCount - quizResults.correctCount} {t.test.incorrect}
                  </Badge>
                  <Badge className="bg-blue-600 text-white border-0">
                    {quizResults.totalCount} {language === 'ar' ? 'إجمالي الأسئلة' : 'Total Questions'}
                  </Badge>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 {t.grading.answerGrid}</h3>
                <div className="grid grid-cols-5 gap-3">
                  {quizResults.answers.map((answer) => (
                    <div
                      key={answer.questionNum}
                      className={`p-4 rounded-lg text-center ${
                        answer.isCorrect
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-red-100 border-2 border-red-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">{answer.isCorrect ? '✅' : '❌'}</div>
                      <div className="text-sm font-bold text-gray-700">{language === 'ar' ? `س${answer.questionNum}` : `Q${answer.questionNum}`}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {String.fromCharCode(65 + answer.studentAnswer)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4">
                <Button
                  onClick={handleStartAnalysis}
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:scale-105 transition-transform"
                >
                  <Brain className={`h-6 w-6 animate-pulse ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                  {t.grading.analyzeBtn}
                  <Sparkles className={`h-6 w-6 animate-pulse ${language === 'ar' ? 'mr-3' : 'ml-3'}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Analysis in Progress */}
      {isAnalyzing && (
        <Card className="border-2 border-orange-400">
          <CardContent className="p-12">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <Brain className="h-24 w-24 text-orange-600 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-red-600 animate-spin" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{t.grading.analyzing}</h3>
              <div className="space-y-2 text-center max-w-md">
                <p className="text-gray-600 animate-pulse">{t.grading.processingAnswers}</p>
                <p className="text-gray-600 animate-pulse delay-100">{language === 'ar' ? 'فحص فهم القواعد...' : 'Checking grammar understanding...'}</p>
                <p className="text-gray-600 animate-pulse delay-200">{t.grading.evaluatingPatterns}</p>
                <p className="text-gray-600 animate-pulse delay-300">{t.grading.generatingInsights}</p>
              </div>
              <Progress value={66} className="w-96 h-4" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Results */}
      {showAnalysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* AI Confirmation Header */}
          <Card className="border-2 border-green-400 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`text-3xl flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {language === 'ar' ? 'اكتمل التحليل بالذكاء الاصطناعي' : 'AI Analysis Complete'}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    {language === 'ar' ? 'تم تأكيد التصحيح التلقائي مع ملاحظات ذكية' : 'Automated grading confirmed with intelligent feedback'}
                  </CardDescription>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-600">{quizResults.score}%</div>
                  <Badge className="bg-green-600 text-white text-sm mt-2 border-0">{t.grading.aiVerified} ✓</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Detailed Question-by-Question Analysis */}
          <Card className="border-2 border-blue-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className={`text-2xl flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                <ClipboardCheck className="h-6 w-6 text-blue-600" />
                <span>{t.grading.questionAnalysis}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {quizResults.answers.map((answer) => (
                <div
                  key={answer.questionNum}
                  className={`p-5 rounded-xl border-2 ${
                    answer.isCorrect
                      ? 'bg-green-50 border-green-300'
                      : 'bg-orange-50 border-orange-300'
                  }`}
                >
                  <div className={`flex items-start ${language === 'ar' ? 'space-x-reverse' : ''} space-x-4`}>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        answer.isCorrect ? 'bg-green-500' : 'bg-orange-500'
                      } text-white font-bold text-lg`}
                    >
                      {language === 'ar' ? `س${answer.questionNum}` : `Q${answer.questionNum}`}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2 leading-relaxed">
                        {answer.question}
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{language === 'ar' ? 'إجابة الطالب:' : "Student's Answer:"}</p>
                          <div
                            className={`px-3 py-2 rounded-lg font-medium ${
                              answer.isCorrect
                                ? 'bg-green-200 text-green-900'
                                : 'bg-red-200 text-red-900'
                            }`}
                          >
                            {String.fromCharCode(65 + answer.studentAnswer)}. {answer.options[answer.studentAnswer]}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{language === 'ar' ? 'الإجابة الصحيحة:' : 'Correct Answer:'}</p>
                          <div className="px-3 py-2 rounded-lg bg-green-200 text-green-900 font-medium">
                            {String.fromCharCode(65 + answer.correctAnswer)}. {answer.options[answer.correctAnswer]}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          answer.isCorrect ? 'bg-green-100' : 'bg-orange-100'
                        }`}
                      >
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          🤖 {t.grading.aiFeedback}
                        </p>
                        <p className={`text-sm ${answer.isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                          {answer.isCorrect ? (
                            language === 'ar' ? (
                              <>
                                <strong>ممتاز!</strong> أظهر الطالب فهمًا قويًا لاستخدام المصدر بعد أفعال "like/enjoy". 
                                يدل هذا على إتقان المفهوم النحوي الأساسي.
                              </>
                            ) : (
                              <>
                                <strong>Excellent!</strong> Student demonstrated strong understanding of gerund usage 
                                after "like/enjoy" verbs. This shows mastery of the core grammar concept.
                              </>
                            )
                          ) : (
                            language === 'ar' ? (
                              <>
                                <strong>فرصة للتعلم:</strong> يحتاج الطالب إلى تعزيز استخدام العبارات التفسيرية مع "because". 
                                الإجابة الصحيحة تشمل تفضيل النشاط والتفسير، وهو هدف تعليمي رئيسي. يُنصح بمراجعة أمثلة التعبير عن أسباب التفضيلات.
                              </>
                            ) : (
                              <>
                                <strong>Learning opportunity:</strong> Student needs reinforcement on using explanatory 
                                phrases with "because". The correct answer includes both the activity preference and 
                                an explanation, which is a key learning objective. Consider reviewing examples of 
                                expressing reasons for preferences.
                              </>
                            )
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-4xl flex-shrink-0">
                      {answer.isCorrect ? '✅' : '❌'}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights & Recommendations */}
          <Card className="border-2 border-purple-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className={`text-2xl flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                <Brain className="h-6 w-6 text-purple-600" />
                <span>{t.grading.learningInsights}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                <h4 className={`font-bold text-green-900 mb-2 flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                  <span className="text-2xl">💪</span>
                  <span>{t.grading.strengths}</span>
                </h4>
                <ul className="space-y-2 text-green-800">
                  <li className={`flex items-start ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      {language === 'ar' 
                        ? 'فهم قوي لتشكيل المصدر (verb + -ing) بعد أفعال like/enjoy (4/4 صحيحة)'
                        : 'Strong grasp of gerund formation (verb + -ing) after like/enjoy verbs (4/4 correct)'}
                    </span>
                  </li>
                  <li className={`flex items-start ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      {language === 'ar'
                        ? 'يمكنه تحديد الأخطاء النحوية في الجمل (دقة 100%)'
                        : 'Can identify grammatical errors in sentences (100% accuracy)'}
                    </span>
                  </li>
                  <li className={`flex items-start ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      {language === 'ar'
                        ? 'يفهم بنية الجملة الصحيحة للتعبير عن التفضيلات'
                        : 'Understands correct sentence structure for expressing preferences'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-5 border-2 border-orange-200">
                <h4 className={`font-bold text-orange-900 mb-2 flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                  <span className="text-2xl">📚</span>
                  <span>{t.grading.areasForImprovement}</span>
                </h4>
                <ul className="space-y-2 text-orange-800">
                  <li className={`flex items-start ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                    <span className="text-orange-600 font-bold mt-0.5">→</span>
                    <span>
                      {language === 'ar' ? (
                        <>
                          <strong>التعبير عن الأسباب:</strong> يحتاج إلى ممارسة استخدام "because" لشرح سبب إعجاب 
                          شخص ما بنشاط معين. يُوصى بتمارين إضافية على تقديم التفسيرات.
                        </>
                      ) : (
                        <>
                          <strong>Expressing reasons:</strong> Needs practice using "because" to explain why someone 
                          likes an activity. Recommend additional exercises on giving explanations.
                        </>
                      )}
                    </span>
                  </li>
                  <li className={`flex items-start ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                    <span className="text-orange-600 font-bold mt-0.5">→</span>
                    <span>
                      {language === 'ar' ? (
                        <>
                          <strong>الأنشطة المقترحة:</strong> تمارين للجمع بين التفضيلات والأسباب 
                          (مثل: "أستمتع بالقراءة لأنها مريحة")
                        </>
                      ) : (
                        <>
                          <strong>Suggested activities:</strong> Practice exercises combining preferences with reasons 
                          (e.g., "I enjoy reading because it's relaxing")
                        </>
                      )}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                <h4 className={`font-bold text-blue-900 mb-2 flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                  <span className="text-2xl">🎯</span>
                  <span>{t.grading.nextSteps}</span>
                </h4>
                <div className="space-y-3 text-blue-800">
                  <div className={`flex items-start ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                    <Badge className="bg-blue-600 text-white border-0">1</Badge>
                    <span>
                      {language === 'ar'
                        ? 'الانتقال إلى الوحدة الأولى، الدرس 2 - الطالب مستعد للموضوع التالي'
                        : 'Move to Unit I, Lesson 2 - Student shows readiness for next topic'}
                    </span>
                  </div>
                  <div className={`flex items-start ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                    <Badge className="bg-blue-600 text-white border-0">2</Badge>
                    <span>
                      {language === 'ar'
                        ? 'توفير تمرين تكميلي على "التعبير عن الأسباب" قبل التقدم'
                        : 'Provide supplementary exercise on "expressing reasons" before advancing'}
                    </span>
                  </div>
                  <div className={`flex items-start ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                    <Badge className="bg-blue-600 text-white border-0">3</Badge>
                    <span>
                      {language === 'ar' ? (
                        <>الأداء العام: <strong>جيد (80%)</strong> - لا حاجة لإجراءات علاجية</>
                      ) : (
                        <>Overall performance: <strong>GOOD (80%)</strong> - No remedial action required</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final Confirmation */}
          <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-3`}>
                  <div className="bg-green-500 p-3 rounded-full">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900 text-xl">{t.grading.confirmed}</h4>
                    <p className="text-sm text-green-700">
                      {language === 'ar' ? (
                        <>
                          الدرجة: {quizResults.score}% ({quizResults.correctCount}/{quizResults.totalCount}) • 
                          تم حفظ النتيجة تلقائيًا في ملف الطالب • 
                          يمكن للمعلم إضافة ملاحظات إضافية إذا لزم الأمر
                        </>
                      ) : (
                        <>
                          Score: {quizResults.score}% ({quizResults.correctCount}/{quizResults.totalCount}) • 
                          Result automatically saved to student portfolio • 
                          Teacher can add additional feedback if needed
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white text-lg px-4 py-2 border-0">
                  {t.grading.clickNext}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Step 5: Analytics Dashboard
const AnalyticsStep = ({ language, t }: { language: 'en' | 'ar', t: typeof translations.en }) => {
  const analyticsData = {
    overallPerformance: {
      totalStudents: 156,
      totalTests: 342,
      averageScore: 76.5,
      passRate: 82.3,
      excellenceRate: 45.2,
    },
    currentLessonStats: {
      lessonTitle: "Unit I, Lesson 1: Let's Have Fun",
      totalAttempts: 28,
      averageScore: 78.6,
      highestScore: 100,
      lowestScore: 40,
      medianScore: 80,
      passRate: 85.7,
    },
    questionDifficulty: [
      { questionNum: 1, topic: "Gerund with 'like'", correctRate: 92.8, difficulty: "Easy" },
      { questionNum: 2, topic: "Gerund completion", correctRate: 89.3, difficulty: "Easy" },
      { questionNum: 3, topic: "Expressing reasons", correctRate: 53.6, difficulty: "Hard" },
      { questionNum: 4, topic: "Error identification", correctRate: 82.1, difficulty: "Medium" },
      { questionNum: 5, topic: "Gerund with dancing", correctRate: 85.7, difficulty: "Medium" },
    ],
    learningProgress: [
      { week: "Week 1", avgScore: 65.2, students: 28 },
      { week: "Week 2", avgScore: 71.8, students: 28 },
      { week: "Week 3", avgScore: 76.4, students: 27 },
      { week: "Week 4", avgScore: 78.6, students: 28 },
    ],
    teacherActivity: {
      totalReviews: 342,
      avgReviewTime: "4.2 minutes",
      pendingReviews: 12,
      teachersActive: 8,
      mostActiveTeacher: "aziz advisor",
    },
    studentImprovement: {
      improved: 72.3,
      stable: 21.4,
      declined: 6.3,
      averageImprovement: "+12.4%",
    },
    contentQuality: {
      totalLessonsCreated: 45,
      aiGeneratedTests: 38,
      vaultTests: 7,
      avgQuestionsPerTest: 8.5,
      approvalRate: 94.7,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`text-3xl flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {t.analytics.title}
                </span>
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {t.analytics.description}
              </CardDescription>
            </div>
            <Badge className="bg-blue-600 text-white text-sm px-4 py-2 border-0">
              {t.analytics.liveData} 🔴
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-green-600" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-900 mb-1">
              {analyticsData.overallPerformance.totalStudents}
            </div>
            <div className="text-sm text-green-700 font-medium">{t.analytics.totalStudents}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <ClipboardCheck className="h-8 w-8 text-blue-600" />
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-1">
              {analyticsData.overallPerformance.totalTests}
            </div>
            <div className="text-sm text-blue-700 font-medium">{t.analytics.testsCompleted}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8 text-purple-600" />
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-900 mb-1">
              {analyticsData.overallPerformance.averageScore}%
            </div>
            <div className="text-sm text-purple-700 font-medium">{t.analytics.averageScore}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-8 w-8 text-orange-600" />
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-900 mb-1">
              {analyticsData.overallPerformance.passRate}%
            </div>
            <div className="text-sm text-orange-700 font-medium">{t.analytics.passRate}</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Lesson Performance */}
      <Card className="border-2 border-teal-300">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
          <CardTitle className={`text-2xl flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
            <BookOpen className="h-6 w-6 text-teal-600" />
            <span>{t.analytics.lessonPerformance}: {analyticsData.currentLessonStats.lessonTitle}</span>
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'إحصائيات الأداء لهذا الدرس'
              : 'Performance statistics for this lesson'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
              <div className="text-sm text-blue-700 mb-1">{t.analytics.totalAttempts}</div>
              <div className="text-4xl font-bold text-blue-900 mb-2">
                {analyticsData.currentLessonStats.totalAttempts}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
              <div className="text-sm text-green-700 mb-1">{t.analytics.averageScore}</div>
              <div className="text-4xl font-bold text-green-900 mb-2">
                {analyticsData.currentLessonStats.averageScore}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
              <div className="text-sm text-purple-700 mb-1">{t.analytics.passRate}</div>
              <div className="text-4xl font-bold text-purple-900 mb-2">
                {analyticsData.currentLessonStats.passRate}%
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-900">{analyticsData.currentLessonStats.highestScore}</div>
              <div className="text-sm text-orange-700">{t.analytics.highestScore}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{analyticsData.currentLessonStats.medianScore}</div>
              <div className="text-sm text-blue-700">{t.analytics.medianScore}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-900">{analyticsData.currentLessonStats.lowestScore}</div>
              <div className="text-sm text-red-700">{t.analytics.lowestScore}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question-Level Difficulty Analysis */}
      <Card className="border-2 border-pink-300">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
          <CardTitle className={`text-2xl flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
            <Brain className="h-6 w-6 text-pink-600" />
            <span>{t.analytics.questionDifficulty}</span>
          </CardTitle>
          <CardDescription>
            {language === 'ar'
              ? 'تحليل معدل الإجابات الصحيحة لكل سؤال'
              : 'Analyzing correct answer rate per question'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {analyticsData.questionDifficulty.map((q) => (
              <div key={q.questionNum} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-3`}>
                    <div className="bg-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {language === 'ar' ? `س${q.questionNum}` : `Q${q.questionNum}`}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{q.topic}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{q.correctRate}%</div>
                    <Badge
                      className={`${
                        q.difficulty === 'Easy'
                          ? 'bg-green-600'
                          : q.difficulty === 'Medium'
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      } text-white border-0`}
                    >
                      {language === 'ar' 
                        ? (q.difficulty === 'Easy' ? 'سهل' : q.difficulty === 'Medium' ? 'متوسط' : 'صعب')
                        : q.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      q.correctRate >= 80
                        ? 'bg-green-500'
                        : q.correctRate >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${q.correctRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5">
            <h4 className={`font-bold text-yellow-900 mb-2 flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
              <span className="text-2xl">⚠️</span>
              <span>{t.analytics.questionReview}</span>
            </h4>
            <p className="text-yellow-800 text-sm">
              {language === 'ar' ? (
                <>
                  أجاب 53.6% فقط من التلاميذ بشكل صحيح. يشير هذا إلى أن مفهوم "التعبير عن الأسباب بـ because" 
                  يحتاج إلى شرح أفضل في الدرس أو إعادة صياغة السؤال. يُنصح بإضافة المزيد من الأمثلة في المواد التعليمية.
                </>
              ) : (
                <>
                  Only 53.6% of students answered correctly. This indicates the "expressing reasons with because" 
                  concept needs better explanation in the lesson or question rewording. Consider adding more examples 
                  in the teaching materials.
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Learning Progress Over Time */}
      <Card className="border-2 border-indigo-300">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className={`text-2xl flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <span>{t.analytics.learningProgress}</span>
          </CardTitle>
          <CardDescription>
            {language === 'ar'
              ? 'متوسط الدرجات مجمع حسب الأسبوع'
              : 'Average scores grouped by week'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {analyticsData.learningProgress.map((week, index) => (
              <div key={week.week} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-3`}>
                    <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{week.week}</div>
                      <div className="text-sm text-gray-600">
                        {language === 'ar' ? `${week.students} طالب نشط` : `${week.students} students active`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-900">{week.avgScore}%</div>
                    {index > 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        +{(week.avgScore - analyticsData.learningProgress[index - 1].avgScore).toFixed(1)}% ⬆️
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{ width: `${week.avgScore}%` }}
                  >
                    <span className="text-white text-xs font-bold">{week.avgScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-green-50 border-2 border-green-300 rounded-xl p-5">
            <h4 className={`font-bold text-green-900 mb-2 flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <span>{t.analytics.positiveTrend}</span>
            </h4>
            <p className="text-green-800 text-sm">
              {language === 'ar' ? (
                <>
                  تحسنت متوسط الدرجات بنسبة <strong>+13.4%</strong> على مدى 4 أسابيع (من 65.2% إلى 78.6%).
                </>
              ) : (
                <>
                  Average scores improved by <strong>+13.4%</strong> over 4 weeks (from 65.2% to 78.6%).
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Student Improvement Tracking */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-2 border-emerald-300">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
            <CardTitle className={`text-xl flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
              <Award className="h-6 w-6 text-emerald-600" />
              <span>{t.analytics.studentImprovement}</span>
            </CardTitle>
            <CardDescription>
              {language === 'ar'
                ? 'مقارنة أول محاولة مع الأخيرة'
                : 'Comparing first vs. latest attempt'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div>
                  <div className="text-sm text-green-700">{t.analytics.improved}</div>
                </div>
                <div className="text-3xl font-bold text-green-900">{analyticsData.studentImprovement.improved}%</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div>
                  <div className="text-sm text-blue-700">{t.analytics.stable}</div>
                </div>
                <div className="text-3xl font-bold text-blue-900">{analyticsData.studentImprovement.stable}%</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <div>
                  <div className="text-sm text-red-700">{t.analytics.declined}</div>
                </div>
                <div className="text-3xl font-bold text-red-900">{analyticsData.studentImprovement.declined}%</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300">
                <div className="text-sm text-green-700 mb-1">{t.analytics.avgImprovement}</div>
                <div className="text-4xl font-bold text-green-900">{analyticsData.studentImprovement.averageImprovement}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-cyan-300">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardTitle className={`text-xl flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-2`}>
              <Sparkles className="h-6 w-6 text-cyan-600" />
              <span>{t.analytics.contentQuality}</span>
            </CardTitle>
            <CardDescription>
              {language === 'ar'
                ? 'مقاييس جودة المحتوى'
                : 'Content quality metrics'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="text-3xl font-bold text-purple-900">
                    {analyticsData.contentQuality.totalLessonsCreated}
                  </div>
                  <div className="text-sm text-purple-700">{t.analytics.lessonsCreated}</div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="text-3xl font-bold text-blue-900">
                    {analyticsData.contentQuality.aiGeneratedTests}
                  </div>
                  <div className="text-sm text-blue-700">{t.analytics.aiTests}</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-3xl font-bold text-green-900">
                    {analyticsData.contentQuality.vaultTests}
                  </div>
                  <div className="text-sm text-green-700">{t.analytics.vaultTests}</div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="text-3xl font-bold text-orange-900">
                    {analyticsData.contentQuality.avgQuestionsPerTest}
                  </div>
                  <div className="text-sm text-orange-700">{t.analytics.avgQuestions}</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-5 border-2 border-green-300">
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-900 mb-2">
                    {analyticsData.contentQuality.approvalRate}%
                  </div>
                  <div className="text-sm text-green-700 font-medium">{t.analytics.approvalRate}</div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  {language === 'ar' ? (
                    <>
                      <strong>معدل موافقة عالٍ (94.7%)</strong> يشير إلى جودة محتوى الذكاء الاصطناعي القوية. 
                      نادرًا ما يحتاج المدرسون إلى رفض أو تعديل الاختبارات التي تم إنشاؤها بواسطة الذكاء الاصطناعي بشكل كبير.
                    </>
                  ) : (
                    <>
                      <strong>High approval rate (94.7%)</strong> indicates strong AI content quality. 
                      Teachers rarely need to reject or heavily edit AI-generated tests.
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Summary */}
      <Card className="border-2 border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-4`}>
              <div className="bg-blue-600 p-4 rounded-full">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-blue-900 mb-1">
                  {t.analytics.demoComplete} 🎉
                </h4>
                <p className="text-blue-700">
                  {language === 'ar' ? (
                    <>
                      تحليلات شاملة مستمدة من بيانات تعليمية حقيقية تغطي التلاميذ والتقييمات والملفات الشخصية 
                      وتتبع التقدم والدروس والاختبارات ومكتبات التمارين.
                    </>
                  ) : (
                    <>
                      Comprehensive analytics derived from real educational data covering students, assessments, 
                      portfolios, progress tracking, lessons, tests, and exercise libraries.
                    </>
                  )}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="bg-green-600 text-white border-0">{t.analytics.badges.realtime}</Badge>
                  <Badge className="bg-blue-600 text-white border-0">{t.analytics.badges.sql}</Badge>
                  <Badge className="bg-purple-600 text-white border-0">{t.analytics.badges.json}</Badge>
                  <Badge className="bg-orange-600 text-white border-0">{t.analytics.badges.ai}</Badge>
                  <Badge className="bg-pink-600 text-white border-0">{t.analytics.badges.trends}</Badge>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-sm text-blue-700 font-medium mt-2">{t.analytics.complete}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Demo Component
const MinisterDemo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const navigate = useNavigate();
  const t = translations[language];

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <LessonPlanGenerationStep language={language} t={t} />;
      case 2:
        return <LessonCreationStep language={language} t={t} />;
      case 3:
        return <GamifiedTestStep language={language} t={t} />;
      case 4:
        return <AIGradingStep language={language} t={t} />;
      case 5:
        return <AnalyticsStep language={language} t={t} />;
      default:
        return <LessonPlanGenerationStep language={language} t={t} />;
    }
  };

  const progressPercentage = (currentStep / DEMO_STEPS.length) * 100;
  const currentStepConfig = DEMO_STEPS[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        {/* Header with Language Toggle */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4" dir="ltr">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="bg-white shadow-md hover:shadow-lg"
            >
              <Home className="h-4 w-4 mr-2" />
              {t.backToHome}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600"
            >
              <Languages className="h-4 w-4 mr-2" />
              {language === 'en' ? 'عربي' : 'English'}
            </Button>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            {t.mainTitle}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{t.mainSubtitle}</p>

          {/* Progress Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {t.stepTitle} {currentStep} {t.of} {DEMO_STEPS.length}
              </span>
              <span className="text-sm font-medium text-purple-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between items-center mb-8 gap-2">
          {DEMO_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  isActive ? 'scale-110' : 'opacity-60 hover:opacity-80'
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-8 w-8" />
                  ) : (
                    <Icon className="h-8 w-8" />
                  )}
                </div>
                <p
                  className={`text-xs text-center font-medium ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {t.steps[step.id - 1].title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="mb-8 shadow-xl">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            size="lg"
            className="px-8"
          >
            {language === 'ar' ? <ArrowRight className="h-5 w-5 ml-2" /> : <ArrowLeft className="h-5 w-5 mr-2" />}
            {t.previousStep}
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === DEMO_STEPS.length}
            size="lg"
            className={`px-8 bg-gradient-to-r ${DEMO_STEPS[currentStep - 1].color} text-white hover:opacity-90`}
          >
            {t.nextStep}
            {language === 'ar' ? <ArrowLeft className="h-5 w-5 mr-2" /> : <ArrowRight className="h-5 w-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MinisterDemo;
```

---

## 5. Key Behavioral Details

### Step 1: Lesson Plan Generation
- **States**: Input form → Loading (2s timeout) → Generated plan
- Shows a teacher input form with pre-filled values (English, Grade 7, Unit 1, Lesson 1)
- "Generate" button triggers a 2-second simulated AI generation with animated loading
- Generated plan shows 6 activities with emojis, vocabulary badges, grammar focus

### Step 2: Lesson Creation
- **3 interactive sub-activities**:
  1. **Drag & Drop vocabulary matching** — 12 word bank items → 8 emoji drop zones (4x2 grid). Click also works as fallback.
  2. **Preference table** — 8 hobbies × 4 columns (Like/Love/Don't like/Hate). Click to select.
  3. **Grammar fill-in** — 5 sentences using "enjoy + verb-ing". First is pre-filled as example. Validates presence of "enjoy" in answer.

### Step 3: Gamified Test
- **5 MCQ questions** about gerunds and leisure activities
- Correct answers (0-indexed): `[1, 3, 2, 2, 2]`
- Shows immediate feedback per question (correct/incorrect)
- Progress bar and question counter
- Results page with percentage, emoji feedback tiers (≥80% / ≥60% / <60%)

### Step 4: AI Grading
- **States**: Quiz summary → Loading (3s timeout) → Detailed AI analysis
- Hardcoded student "Ahmad Ali" with score 80% (4/5 correct, Q3 wrong)
- Question-by-question breakdown with bilingual AI feedback
- Strengths, Areas for Improvement, and Next Steps sections

### Step 5: Analytics Dashboard
- All data is hardcoded (simulated)
- **KPI cards**: 156 students, 342 tests, 76.5% avg, 82.3% pass rate
- **Lesson stats**: 28 attempts, 78.6% avg, highest 100, lowest 40
- **Question difficulty**: horizontal bar chart with color-coded difficulty badges
- **Learning progress**: 4-week trajectory with percentage bars
- **Student improvement**: 72.3% improved, 21.4% stable, 6.3% declined
- **Content quality**: 45 lessons, 38 AI tests, 94.7% approval rate

### RTL Support
- `dir` attribute toggles on outer container
- `space-x-reverse` class applied conditionally throughout
- Arrow icons swap (ArrowLeft ↔ ArrowRight) based on language

### Animation Classes Used
- `animate-in fade-in slide-in-from-bottom-4 duration-700`
- `animate-pulse`, `animate-spin`, `animate-bounce`
- `hover:scale-105`, `transition-all`, `transition-transform`

---

## 6. Recreation Checklist

- [ ] Single-file React component with default export
- [ ] Full `translations` object (EN + AR) with all nested keys
- [ ] `DEMO_STEPS` config with icons and gradient colors
- [ ] 5 step components with exact state management
- [ ] Simulated loading delays (2s for lesson gen, 3s for AI grading)
- [ ] All interactive elements (drag/drop, click table, fill-in, MCQ)
- [ ] RTL support with `dir` and `space-x-reverse`
- [ ] Language toggle button
- [ ] Back to Home navigation
- [ ] Progress bar and step indicators (clickable)
- [ ] All hardcoded data (quiz questions, analytics, grading results)
- [ ] Tailwind gradient styling and shadcn/ui components
- [ ] lucide-react icons matching exact imports
