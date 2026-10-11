import type { Testimonial } from "@/lib/types";

/** Témoignages FICTIFS (démonstration) — à remplacer par de vrais témoignages avant mise en ligne. */
export const testimonials: Testimonial[] = [
  {
    id: "t-aminata-diallo",
    authorName: "Aminata Diallo",
    authorCity: "Dakar",
    courseId: "c-rectification-fatiha",
    kind: "text",
    quote: {
      fr: "Je récitais la Fâtiḥah depuis vingt ans avec des erreurs que personne ne m'avait signalées. Cinq vidéos ont suffi à les corriger.",
      en: "I had been reciting Al-Fâtiḥah for twenty years with mistakes no one had ever pointed out. Five videos were enough to correct them.",
      ar: "كنت أتلو الفاتحة منذ عشرين عامًا بأخطاء لم ينبهني إليها أحد. كفتني خمسة دروس مرئية لتصحيحها.",
    },
  },
  {
    id: "t-moussa-ba",
    authorName: "Moussa Bâ",
    authorCity: "Kaolack",
    courseId: "c-rectification-fatiha",
    kind: "text",
    quote: {
      fr: "Je confondais le ذ et le ز sans même m'en rendre compte. La quatrième vidéo m'a appris à placer ma langue.",
      en: "I was confusing ذ and ز without even realising it. The fourth video taught me where to place my tongue.",
      ar: "كنت أخلط بين الذال والزاي دون أن أنتبه، فعلّمني الدرس الرابع أين أضع لساني.",
    },
  },
  {
    id: "t-ibrahima-sarr",
    authorName: "Ibrahima Sarr",
    authorCity: "Thiès",
    courseId: "c-rectification-fatiha",
    kind: "video",
    videoDuration: "1 min 05",
    quote: {
      fr: "Entendre l'erreur puis la bonne prononciation, l'une après l'autre : c'est ce qui m'a enfin fait comprendre le ض.",
      en: "Hearing the mistake and then the correct pronunciation, one after the other, is what finally made me understand the ض.",
      ar: "سماع الخطأ ثم النطق الصحيح، الواحد تلو الآخر، هو ما جعلني أفهم الضاد أخيرًا.",
    },
  },
  {
    id: "t-fatou-ndiaye",
    authorName: "Fatou Ndiaye",
    authorCity: "Saint-Louis",
    courseId: "c-rectification-fatiha",
    kind: "text",
    quote: {
      fr: "Payé avec Wave en trente secondes, la formation était débloquée avant que je range mon téléphone.",
      en: "Paid with Wave in thirty seconds, the course was unlocked before I even put my phone away.",
      ar: "دفعت عبر Wave خلال ثلاثين ثانية، وانفتحت الدورة قبل أن أضع هاتفي جانبًا.",
    },
  },
  {
    id: "t-khadija-fall",
    authorName: "Khadija Fall",
    authorCity: "Milan",
    courseId: "c-rectification-fatiha",
    kind: "text",
    highlighted: true,
    quote: {
      fr: "Je vis à Milan. Trouver un enseignement rigoureux de la récitation, en français, était impossible avant.",
      en: "I live in Milan. Finding rigorous recitation teaching, in French, was impossible before.",
      ar: "أعيش في ميلانو. كان إيجاد تعليم دقيق للتلاوة باللغة الفرنسية أمرًا مستحيلاً من قبل.",
    },
  },
  {
    id: "t-seynabou-gueye",
    authorName: "Seynabou Gueye",
    authorCity: "Rufisque",
    courseId: "c-rectification-fatiha",
    kind: "video",
    videoDuration: "2 min 20",
    quote: {
      fr: "Mon fils de neuf ans regarde les vidéos avec moi le soir.",
      en: "My nine-year-old son watches the videos with me in the evening.",
      ar: "ابني البالغ من العمر تسع سنوات يشاهد الدروس معي في المساء.",
    },
  },
];
