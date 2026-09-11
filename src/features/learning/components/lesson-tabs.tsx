"use client";

import { useRef } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { Check, Download, MessageCircleQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import type { LessonOverviewContent } from "@/mocks/lesson-content";
import type { LessonQuestion, Locale, Resource } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/patterns/empty-state";

const TAB_VALUES = ["overview", "resources", "questions"] as const;
type TabValue = (typeof TAB_VALUES)[number];

export interface LessonTabsProps {
  overview: LessonOverviewContent | null;
  resources: Resource[];
  questions: LessonQuestion[];
  locale: Locale;
}

function LessonTabs({
  overview,
  resources,
  questions,
  locale,
}: LessonTabsProps) {
  const t = useTranslations("player");
  const questionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum<TabValue>([...TAB_VALUES]).withDefault("overview"),
  );

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)}>
      <TabsList>
        <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
        <TabsTrigger value="resources">{t("tabs.resources")}</TabsTrigger>
        <TabsTrigger value="questions" className="gap-2">
          {t("tabs.questions")}
          {questions.length > 0 && (
            <span className="rounded-sm bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-ink">
              {questions.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="min-h-[280px] pt-6.5">
        {overview && (
          <>
            <p className="mb-5 max-w-[68ch] text-[15px] leading-[1.7] text-text-soft lg:text-[17px] lg:leading-[1.75]">
              {overview.paragraph[locale]}
            </p>
            <div className="max-w-[68ch] border border-border-subtle bg-bg p-5.5">
              <p className="mb-3.5 text-xs font-semibold tracking-[0.16em] text-gold-600 uppercase">
                {t("overview.keyPointsTitle")}
              </p>
              <div className="flex flex-col gap-2.5">
                {overview.keyPoints.map((point) => (
                  <div
                    key={point[locale]}
                    className="flex gap-2.5 text-[15px] text-text-soft"
                  >
                    <Check
                      className="mt-0.5 size-[18px] shrink-0 text-green-ink"
                      strokeWidth={1.7}
                    />
                    {point[locale]}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </TabsContent>

      <TabsContent value="resources" className="min-h-[280px] pt-6.5">
        <div className="flex max-w-[68ch] flex-col gap-3">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              className="flex items-center gap-4 border border-border-subtle p-4 transition-colors hover:border-green-700"
            >
              <div className="grid h-12 w-10 shrink-0 place-items-center border border-border-strong bg-bg text-[10px] font-bold tracking-[0.06em] text-error">
                PDF
              </div>
              <div className="flex-1">
                <p className="mb-0.5 text-[15px] font-semibold">
                  {resource.title[locale]}
                </p>
                <p className="text-[13px] text-text-muted">
                  {resource.description[locale]} ·{" "}
                  {t("resources.sizeUnit", { size: resource.sizeKb })}
                </p>
              </div>
              <Download
                className="size-5 shrink-0 text-green-ink"
                strokeWidth={1.7}
              />
            </a>
          ))}
          {resources.length > 0 && (
            <div className="flex items-center gap-2.5 border border-border-subtle bg-bg px-4 py-3.5 text-sm text-text-muted">
              {t("resources.downloadNote")}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="questions" className="min-h-[280px] pt-6.5">
        <div className="max-w-[68ch]">
          <div className="mb-6 border border-border-strong p-4">
            <Textarea
              ref={questionTextareaRef}
              placeholder={t("questions.placeholder")}
              className="mb-3.5 border-none p-0 shadow-none focus-visible:shadow-none"
            />
            <div className="flex items-center justify-between border-t border-hairline pt-3.5">
              <span className="text-[13px] text-text-muted">
                {t("questions.responseTime")}
              </span>
              <Button size="sm">{t("questions.send")}</Button>
            </div>
          </div>

          {questions.length === 0 && (
            <EmptyState
              icon={MessageCircleQuestion}
              title={t("questions.emptyTitle")}
              description={t("questions.emptyDescription")}
              action={
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => questionTextareaRef.current?.focus()}
                >
                  {t("questions.emptyAction")}
                </Button>
              }
            />
          )}

          <div className="flex flex-col gap-5.5">
            {questions.map((question) => (
              <div key={question.id}>
                <div className="flex gap-3">
                  <Avatar size="sm" className="shrink-0 bg-hairline">
                    <AvatarFallback className="bg-hairline text-text-muted">
                      {question.authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="mb-1 flex items-baseline gap-2.5">
                      <span className="text-sm font-semibold">
                        {question.authorName}
                      </span>
                      <span className="text-xs text-text-faint">
                        {question.timeAgoLabel[locale]}
                      </span>
                    </div>
                    <p className="text-[15px] leading-[1.65] text-text-soft">
                      {question.body[locale]}
                    </p>
                    {!question.answer && (
                      <span className="mt-2.5 inline-block text-[13px] font-semibold text-warning">
                        {t("questions.pendingAnswer")}
                      </span>
                    )}
                  </div>
                </div>

                {question.answer && (
                  <div className="ms-7.5 mt-3.5 flex gap-3 border-s-2 border-green-100 ps-4.5">
                    <Avatar size="sm" className="shrink-0">
                      <AvatarFallback>
                        {question.answer.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="mb-1 flex flex-wrap items-baseline gap-2">
                        <span className="text-sm font-semibold">
                          {question.answer.authorName}
                        </span>
                        <span className="rounded-sm bg-green-100 px-1.5 py-0.5 text-[11px] font-semibold tracking-[0.06em] text-green-ink uppercase">
                          {t("questions.teacherBadge")}
                        </span>
                        <span className="text-xs text-text-faint">
                          {question.answer.timeAgoLabel[locale]}
                        </span>
                      </div>
                      <p className="text-[15px] leading-[1.65] text-text-soft">
                        {question.answer.body[locale]}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export { LessonTabs };
