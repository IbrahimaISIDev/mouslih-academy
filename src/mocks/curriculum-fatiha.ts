import type { Module } from "@/lib/types";

export const fatihaModules: Module[] = [
  {
    id: "m1-avant-de-reciter",
    order: 1,
    title: {
      fr: "Avant de réciter",
      en: "Before reciting",
      ar: "قبل التلاوة",
    },
    subModules: [
      {
        id: "m1-sm1",
        title: null,
        lessons: [
          {
            id: "l1",
            slug: "pourquoi-rectifier-la-fatiha",
            title: {
              fr: "Pourquoi la Fatiha doit être rectifiée",
              en: "Why Al-Fatiha must be corrected",
              ar: "لماذا يجب تصحيح الفاتحة",
            },
            durationSeconds: 492,
            isFreePreview: true,
            resources: [],
          },
          {
            id: "l2",
            slug: "poser-sa-respiration",
            title: {
              fr: "Poser sa respiration et son souffle",
              en: "Settling your breath",
              ar: "ضبط النفَس والتنفّس",
            },
            durationSeconds: 700,
            isFreePreview: true,
            resources: [],
          },
          {
            id: "l3",
            slug: "intention-posture-concentration",
            title: {
              fr: "L'intention, la posture, la concentration",
              en: "Intention, posture, concentration",
              ar: "النية والجلسة والتركيز",
            },
            durationSeconds: 545,
            isFreePreview: false,
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: "m2-les-lettres-qui-trahissent",
    order: 2,
    title: {
      fr: "Les lettres qui trahissent",
      en: "The letters that betray the reciter",
      ar: "الحروف التي تخون القارئ",
    },
    subModules: [
      {
        id: "m2-sm-emphatiques",
        title: {
          fr: "Les emphatiques",
          en: "The emphatics",
          ar: "الحروف المفخّمة",
        },
        lessons: [
          {
            id: "l4",
            slug: "le-sad-le-dad-et-la-machoire",
            title: {
              fr: "Le ص, le ض et la mâchoire",
              en: "Ṣād, Ḍād and the jaw",
              ar: "الصاد والضاد والفك",
            },
            durationSeconds: 980,
            isFreePreview: false,
            resources: [],
          },
          {
            id: "l5",
            slug: "le-ta-et-le-za-distinguer-sans-forcer",
            title: {
              fr: "Le ط et le ظ : distinguer sans forcer",
              en: "Ṭāʾ and Ẓāʾ: distinguishing without straining",
              ar: "الطاء والظاء : التمييز دون إجهاد",
            },
            durationSeconds: 895,
            isFreePreview: false,
            resources: [],
          },
        ],
      },
      {
        id: "m2-sm-gutturales",
        title: {
          fr: "Les gutturales",
          en: "The gutturals",
          ar: "الحروف الحلقية",
        },
        lessons: [
          {
            id: "l6",
            slug: "le-ayn-et-le-ha-ouvrir-la-gorge",
            title: {
              fr: "Le ع et le ح : ouvrir la gorge",
              en: "ʿAyn and Ḥāʾ: opening the throat",
              ar: "العين والحاء : فتح الحلق",
            },
            durationSeconds: 1090,
            isFreePreview: false,
            resources: [
              {
                id: "res-carte-articulation",
                title: {
                  fr: "Carte des points d'articulation",
                  en: "Map of articulation points",
                  ar: "خريطة مخارج الحروف",
                },
                description: {
                  fr: "Schéma annoté de la gorge et de la bouche",
                  en: "Annotated diagram of the throat and mouth",
                  ar: "رسم توضيحي مشروح للحلق والفم",
                },
                sizeKb: 420,
                url: "#",
              },
              {
                id: "res-tableau-gutturales",
                title: {
                  fr: "Tableau des lettres gutturales",
                  en: "Table of guttural letters",
                  ar: "جدول الحروف الحلقية",
                },
                description: {
                  fr: "Les six lettres, leur sortie, les confusions courantes",
                  en: "The six letters, their articulation point, common confusions",
                  ar: "الحروف الستة، مخارجها، الأخطاء الشائعة",
                },
                sizeKb: 180,
                url: "#",
              },
              {
                id: "res-exercices-module-2",
                title: {
                  fr: "Exercices de répétition — module 2",
                  en: "Repetition exercises — module 2",
                  ar: "تمارين التكرار — الوحدة 2",
                },
                description: {
                  fr: "À réciter puis enregistrer avant la leçon 7",
                  en: "To recite then record before lesson 7",
                  ar: "تُتلى ثم تُسجَّل قبل الدرس 7",
                },
                sizeKb: 90,
                url: "#",
              },
            ],
          },
          {
            id: "l7",
            slug: "le-qaf-et-le-kaf-le-point-dappui",
            title: {
              fr: "Le ق et le ك : le point d'appui",
              en: "Le ق et le ك : le point d'appui",
              ar: "القاف والكاف : نقطة الارتكاز",
            },
            durationSeconds: 1115,
            isFreePreview: false,
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: "m3-les-prolongations-et-les-arrets",
    order: 3,
    title: {
      fr: "Les prolongations et les arrêts",
      en: "Les prolongations et les arrêts",
      ar: "المدود والوقوف",
    },
    subModules: [
      {
        id: "m3-sm1",
        title: null,
        lessons: [
          {
            id: "l8",
            slug: "compter-les-temps-de-prolongation",
            title: {
              fr: "Compter les temps de prolongation",
              en: "Compter les temps de prolongation",
              ar: "عدّ حركات المد",
            },
            durationSeconds: 1185,
            isFreePreview: false,
            resources: [],
          },
          {
            id: "l9",
            slug: "ou-sarreter-sans-briser-le-sens",
            title: {
              fr: "Où s'arrêter sans briser le sens",
              en: "Où s'arrêter sans briser le sens",
              ar: "أين نقف دون كسر المعنى",
            },
            durationSeconds: 1110,
            isFreePreview: false,
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: "m4-reciter-la-sourate-en-entier",
    order: 4,
    title: {
      fr: "Réciter la sourate en entier",
      en: "Réciter la sourate en entier",
      ar: "تلاوة السورة كاملة",
    },
    subModules: [
      {
        id: "m4-sm1",
        title: null,
        lessons: [
          {
            id: "l10",
            slug: "recitation-guidee-verset-par-verset",
            title: {
              fr: "Récitation guidée, verset par verset",
              en: "Récitation guidée, verset par verset",
              ar: "تلاوة موجّهة، آية بآية",
            },
            durationSeconds: 1450,
            isFreePreview: false,
            resources: [],
          },
          {
            id: "l11",
            slug: "enregistrer-et-envoyer-votre-recitation",
            title: {
              fr: "Enregistrer et envoyer votre récitation",
              en: "Enregistrer et envoyer votre récitation",
              ar: "تسجيل تلاوتك وإرسالها",
            },
            durationSeconds: 1070,
            isFreePreview: false,
            resources: [],
          },
        ],
      },
    ],
  },
];
