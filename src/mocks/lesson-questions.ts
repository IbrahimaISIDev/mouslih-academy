import type { LessonQuestion } from "@/lib/types";

export const lessonQuestions: LessonQuestion[] = [
  {
    id: "q-ibrahima-l6",
    lessonId: "l6",
    authorName: "Ibrahima Sarr",
    authorInitials: "IS",
    timeAgoLabel: { fr: "il y a 3 jours", en: "3 days ago", ar: "قبل 3 أيام" },
    body: {
      fr: "Quand je prononce le ع, j'ai l'impression de forcer et ma voix se casse au bout de trois répétitions. Est-ce normal au début ?",
      en: "When I pronounce ʿAyn, I feel like I'm forcing it and my voice breaks after three repetitions. Is that normal at the start?",
      ar: "عندما أنطق العين، أشعر أنني أُجهد صوتي وينقطع بعد ثلاث محاولات. هل هذا طبيعي في البداية؟",
    },
    answer: {
      authorName: "Oustaz Mouslih",
      authorInitials: "OM",
      timeAgoLabel: { fr: "il y a 2 jours", en: "2 days ago", ar: "قبل يومين" },
      body: {
        fr: "C'est le signe que vous serrez la gorge. Reprenez à 06:40 : le son doit venir sans effort, comme un souffle retenu. Trois répétitions puis une pause suffisent la première semaine.",
        en: "That's a sign you're tensing your throat. Go back to 06:40: the sound should come effortlessly, like a held breath. Three repetitions then a pause are enough for the first week.",
        ar: "هذا يدل على أنك تشد حلقك. عد إلى الدقيقة 06:40: يجب أن يخرج الصوت دون جهد، كنفَس محبوس. تكفي ثلاث محاولات ثم توقف في الأسبوع الأول.",
      },
    },
  },
  {
    id: "q-fatou-l6",
    lessonId: "l6",
    authorName: "Fatou Ndiaye",
    authorInitials: "FN",
    timeAgoLabel: {
      fr: "il y a 5 heures",
      en: "5 hours ago",
      ar: "قبل 5 ساعات",
    },
    body: {
      fr: "Le PDF du tableau des gutturales ne s'ouvre pas sur mon téléphone. Une autre version est-elle possible ?",
      en: "The guttural letters table PDF won't open on my phone. Could another version be made available?",
      ar: "لا يفتح ملف PDF لجدول الحروف الحلقية على هاتفي. هل يمكن توفير نسخة أخرى؟",
    },
  },
];
