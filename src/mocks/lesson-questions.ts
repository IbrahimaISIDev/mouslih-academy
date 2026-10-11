import type { LessonQuestion } from "@/lib/types";

/** Questions de démo sur la vidéo 2 (fidèle au seed backend). */
export const lessonQuestions: LessonQuestion[] = [
  {
    id: "q-ibrahima-v02",
    lessonId: "fatiha-v02",
    authorName: "Ibrahima Sarr",
    authorInitials: "IS",
    timeAgoLabel: { fr: "il y a 3 jours", en: "3 days ago", ar: "قبل 3 أيام" },
    body: {
      fr: "Quand je prononce le ع, j'ai l'impression de forcer et ma voix se casse au bout de trois répétitions. Est-ce normal au début ?",
      en: "When I pronounce the ع, I feel like I'm forcing it and my voice breaks after three repetitions. Is that normal at the start?",
      ar: "عندما أنطق العين، أشعر أنني أُجهد صوتي وينقطع بعد ثلاث محاولات. هل هذا طبيعي في البداية؟",
    },
    answer: {
      authorName: "Oustaz Mouslih",
      authorInitials: "OM",
      timeAgoLabel: { fr: "il y a 2 jours", en: "2 days ago", ar: "قبل يومين" },
      body: {
        fr: "C'est le signe que vous serrez la gorge. Reprenez la démonstration lente : le son doit venir sans effort. Trois répétitions puis une pause suffisent les premiers jours.",
        en: "That's a sign you're tensing your throat. Go back to the slow demonstration: the sound should come effortlessly. Three repetitions then a pause are enough for the first few days.",
        ar: "هذا يدل على أنك تشدّ حلقك. عُد إلى العرض البطيء: يجب أن يخرج الصوت دون جهد. تكفي ثلاث محاولات ثم توقّف في الأيام الأولى.",
      },
    },
  },
  {
    id: "q-fatou-v02",
    lessonId: "fatiha-v02",
    authorName: "Fatou Ndiaye",
    authorInitials: "FN",
    timeAgoLabel: {
      fr: "il y a 5 heures",
      en: "5 hours ago",
      ar: "قبل 5 ساعات",
    },
    body: {
      fr: "À la fin du verset, sur الْعَالَمِينَ, faut-il toujours allonger six temps ?",
      en: "At the end of the verse, on الْعَالَمِينَ, must the prolongation always be six counts?",
      ar: "في آخر الآية، عند «الْعَالَمِينَ»، هل يجب المدّ ستّ حركات دائمًا؟",
    },
  },
];
