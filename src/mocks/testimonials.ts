import type { Testimonial } from "@/lib/types";

export const testimonials: Testimonial[] = [
  {
    id: "t-aminata-diallo",
    authorName: "Aminata Diallo",
    authorCity: "Dakar",
    courseId: "c-rectification-fatiha",
    kind: "text",
    quote: {
      fr: "Je récitais la Fatiha depuis vingt ans avec trois erreurs que personne ne m'avait signalées. Onze leçons ont suffi.",
      en: "I had been reciting Al-Fatiha for twenty years with three mistakes no one had ever pointed out. Eleven lessons were enough.",
      ar: "كنت أتلو الفاتحة منذ عشرين عامًا بثلاثة أخطاء لم ينبهني إليها أحد. كفتني أحد عشر درسًا.",
    },
  },
  {
    id: "t-moussa-ba",
    authorName: "Moussa Bâ",
    authorCity: "Kaolack",
    courseId: "c-memorisation-cinq-lignes",
    kind: "text",
    quote: {
      fr: "La méthode des cinq lignes m'a fait tenir six mois là où j'abandonnais après deux semaines. Le secret, c'est la révision imposée.",
      en: "The five-lines method kept me going for six months, when I used to give up after two weeks. The secret is the mandatory revision.",
      ar: "منهج الأسطر الخمسة جعلني أستمر ستة أشهر بينما كنت أتوقف بعد أسبوعين. السر هو المراجعة الإلزامية.",
    },
  },
  {
    id: "t-ibrahima-sarr",
    authorName: "Ibrahima Sarr",
    authorCity: "Thiès",
    courseId: "c-regles-tajwid",
    kind: "video",
    videoDuration: "1 min 05",
    quote: {
      fr: "Les corrections vocales par WhatsApp changent tout — on entend son erreur, on ne la lit pas.",
      en: "Voice corrections over WhatsApp change everything — you hear your mistake, you don't just read it.",
      ar: "التصحيحات الصوتية عبر واتساب تغيّر كل شيء — تسمع خطأك، لا تكتفي بقراءته.",
    },
  },
  {
    id: "t-fatou-ndiaye",
    authorName: "Fatou Ndiaye",
    authorCity: "Saint-Louis",
    courseId: "c-initiation-nourania",
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
    courseId: "c-fiqh-priere",
    kind: "text",
    highlighted: true,
    quote: {
      fr: "Je vis à Milan. Trouver un enseignant sénégalais rigoureux qui corrige vraiment, c'était impossible avant.",
      en: "I live in Milan. Finding a rigorous Senegalese teacher who truly corrects you was impossible before.",
      ar: "أعيش في ميلانو. كان إيجاد أستاذ سنغالي صارم يصحّح فعليًا أمرًا مستحيلاً من قبل.",
    },
  },
  {
    id: "t-seynabou-gueye",
    authorName: "Seynabou Gueye",
    authorCity: "Rufisque",
    courseId: "c-initiation-nourania",
    kind: "video",
    videoDuration: "2 min 20",
    quote: {
      fr: "Mon fils de neuf ans suit la Nourania avec moi le soir.",
      en: "My nine-year-old son follows the Nourania course with me in the evening.",
      ar: "ابني البالغ من العمر تسع سنوات يتابع معي درس النورانية في المساء.",
    },
  },
];
