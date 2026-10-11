import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import { getCourse } from "@/features/catalog/api/get-course";
import { getLessonQuestions } from "@/features/learning/api/get-lesson-questions";
import { findLessonLocation } from "@/features/learning/find-lesson";
import { getLessonPlayback } from "@/features/learning/api/get-lesson-playback";
import { LessonPlayerView } from "@/features/learning/components/lesson-player-view";

interface LessonPageProps {
  params: Promise<{ locale: string; slug: string; lessonSlug: string }>;
}

export const metadata: Metadata = { title: "Vidéo — Mouslih Academy" };

export default async function LessonPage({ params }: LessonPageProps) {
  const { locale: rawLocale, slug, lessonSlug } = await params;
  const locale = rawLocale as Locale;

  const course = await getCourse(slug);
  if (!course) notFound();

  const flatLessons = course.modules.flatMap((module) =>
    module.subModules.flatMap((sub) => sub.lessons),
  );
  const currentLesson = flatLessons.find(
    (lesson) => lesson.slug === lessonSlug,
  );
  if (!currentLesson) notFound();

  const location = findLessonLocation(course, currentLesson.id);
  if (!location) notFound();

  const previousLesson = flatLessons[location.lessonIndex - 2] ?? null;
  const nextLesson = flatLessons[location.lessonIndex] ?? null;

  const [questions, playback] = await Promise.all([
    getLessonQuestions(currentLesson.id),
    getLessonPlayback(currentLesson.id),
  ]);

  // Numérotation continue des erreurs sur toute la formation (01 → 10).
  const firstMistakeNumber =
    flatLessons
      .slice(0, location.lessonIndex - 1)
      .reduce((n, lesson) => n + lesson.mistakes.length, 0) + 1;

  return (
    <LessonPlayerView
      course={course}
      location={location}
      locale={locale}
      playback={playback}
      firstMistakeNumber={firstMistakeNumber}
      questions={questions}
      previousHref={
        previousLesson
          ? `/formations/${course.slug}/lecons/${previousLesson.slug}`
          : null
      }
      nextHref={
        nextLesson
          ? `/formations/${course.slug}/lecons/${nextLesson.slug}`
          : null
      }
    />
  );
}
