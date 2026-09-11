import type { I18nText } from "@/lib/types";

export interface LessonOverviewContent {
  paragraph: I18nText;
  keyPoints: I18nText[];
  verseText?: string;
}

export const lessonOverviewContent: Record<string, LessonOverviewContent> = {
  l6: {
    paragraph: {
      fr: "Le ع et le ح sortent du milieu de la gorge, à un endroit que la plupart des non-arabophones n'utilisent jamais en parlant. Cette leçon isole le point d'articulation, puis le replace dans « نَسْتَعِينُ » et « الرَّحْمَٰنِ ».",
      en: 'ʿAyn and Ḥāʾ come from the middle of the throat, a place most non-Arabic speakers never use when speaking. This lesson isolates the articulation point, then places it back within "نَسْتَعِينُ" and "الرَّحْمَٰنِ".',
      ar: "يخرج العين والحاء من وسط الحلق، من موضع لا يستخدمه معظم غير الناطقين بالعربية عند الكلام. يعزل هذا الدرس مخرج الحرف، ثم يعيده إلى موضعه في «نَسْتَعِينُ» و«الرَّحْمَٰنِ».",
    },
    keyPoints: [
      {
        fr: "Localiser le milieu de la gorge sans forcer les cordes vocales",
        en: "Locate the middle of the throat without straining the vocal cords",
        ar: "تحديد وسط الحلق دون إجهاد الأحبال الصوتية",
      },
      {
        fr: "Distinguer le ع du ء et le ح du هـ",
        en: "Distinguish ʿAyn from Hamza and Ḥāʾ from Hāʾ",
        ar: "التمييز بين العين والهمزة، وبين الحاء والهاء",
      },
      {
        fr: "Trois exercices de répétition à faire avant la leçon suivante",
        en: "Three repetition exercises to do before the next lesson",
        ar: "ثلاثة تمارين تكرار يجب إنجازها قبل الدرس التالي",
      },
    ],
    verseText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
  },
};
