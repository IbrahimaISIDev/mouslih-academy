"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle2, Eye, Mail, Send, TriangleAlert } from "lucide-react";
import { ClientApiError } from "@/lib/client-fetch";
import { cn } from "@/lib/utils";
import {
  getMessagesOverview,
  MESSAGE_SEGMENTS,
  previewCampaign,
  sendCampaign,
  sendTestCampaign,
  type CampaignDraft,
  type MessageSegment,
  type MessagesOverview,
} from "@/features/admin/api/admin-messages-client";
import { SectionError } from "@/components/patterns/section-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const QUERY_KEY = ["admin-messages"];

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ClientApiError ? error.message : fallback;
}

function MessagesManager() {
  const tError = useTranslations("states.sectionError");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getMessagesOverview,
    // Suit l'avancement d'une campagne en cours d'envoi.
    refetchInterval: (query) =>
      query.state.data?.campaigns.some((c) => c.status === "sending")
        ? 15_000
        : false,
  });

  if (isError) {
    return (
      <SectionError
        title={tError("title")}
        body={tError("body")}
        retryLabel={tError("retry")}
        onRetry={() => refetch()}
      />
    );
  }
  if (isPending) {
    return (
      <div className="h-96 animate-pulse rounded-sm border border-border-subtle bg-surface" />
    );
  }

  return (
    <div className="grid grid-cols-[1fr_380px] items-start gap-6">
      <Composer overview={data} />
      <div className="flex flex-col gap-6">
        <AutomationsCard automations={data.automations} />
        <HistoryCard overview={data} />
      </div>
    </div>
  );
}

function Composer({ overview }: { overview: MessagesOverview }) {
  const t = useTranslations("admin.messages");
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<CampaignDraft>({
    subject: "",
    body: "Salam {prenom},\n\n",
    ctaLabel: "",
    ctaUrl: "",
    segment: "all",
  });
  const [preview, setPreview] = useState<{
    subject: string;
    html: string;
  } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const recipients = overview.segments[draft.segment];
  const ready =
    draft.subject.trim().length >= 3 && draft.body.trim().length >= 10;

  const update = (changes: Partial<CampaignDraft>) => {
    setDraft((d) => ({ ...d, ...changes }));
    setPreview(null);
    setConfirming(false);
  };

  const previewMutation = useMutation({
    mutationFn: previewCampaign,
    onSuccess: setPreview,
    onError: (e) => toast.error(errorMessage(e, t("toast.error"))),
  });
  const testMutation = useMutation({
    mutationFn: sendTestCampaign,
    onSuccess: ({ to }) => toast.success(t("toast.testSent", { email: to })),
    onError: (e) => toast.error(errorMessage(e, t("toast.error"))),
  });
  const sendMutation = useMutation({
    mutationFn: sendCampaign,
    onSuccess: ({ recipientCount }) => {
      toast.success(t("toast.queued", { count: recipientCount }));
      setDraft({
        subject: "",
        body: "Salam {prenom},\n\n",
        ctaLabel: "",
        ctaUrl: "",
        segment: draft.segment,
      });
      setPreview(null);
      setConfirming(false);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (e) => toast.error(errorMessage(e, t("toast.error"))),
  });

  return (
    <section className="rounded-sm border border-border-subtle bg-surface p-5.5">
      <h2 className="mb-1 font-serif text-xl font-medium">
        {t("compose.title")}
      </h2>
      <p className="mb-5 text-sm leading-[1.55] text-text-muted">
        {t("compose.help", {
          optedIn: overview.segments.all,
          learners: overview.segments.learners,
        })}
      </p>

      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-semibold">
          {t("compose.segment")}
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {MESSAGE_SEGMENTS.map((segment) => (
            <label
              key={segment}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-sm border px-3.5 py-2.5 text-sm",
                draft.segment === segment
                  ? "border-green-700 bg-green-100 text-green-ink"
                  : "border-border-strong text-text-soft hover:bg-row-hover",
              )}
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="segment"
                  value={segment}
                  checked={draft.segment === segment}
                  onChange={() => update({ segment })}
                  className="accent-green-800"
                />
                {t(`segments.${segment}`)}
              </span>
              <span className="font-semibold tabular-nums">
                {overview.segments[segment]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="message-subject" className="mb-2 block">
            {t("compose.subject")}
          </Label>
          <Input
            id="message-subject"
            maxLength={150}
            placeholder={t("compose.subjectPlaceholder")}
            value={draft.subject}
            onChange={(e) => update({ subject: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="message-body" className="mb-2 block">
            {t("compose.body")}
          </Label>
          <Textarea
            id="message-body"
            rows={9}
            maxLength={5000}
            value={draft.body}
            onChange={(e) => update({ body: e.target.value })}
          />
          <p className="mt-1.5 text-xs text-text-faint">
            {t("compose.bodyHelp")}
          </p>
        </div>
        <div className="grid grid-cols-[1fr_1.4fr] gap-3">
          <div>
            <Label htmlFor="message-cta-label" className="mb-2 block">
              {t("compose.ctaLabel")}
            </Label>
            <Input
              id="message-cta-label"
              maxLength={60}
              placeholder={t("compose.ctaLabelPlaceholder")}
              value={draft.ctaLabel}
              onChange={(e) => update({ ctaLabel: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="message-cta-url" className="mb-2 block">
              {t("compose.ctaUrl")}
            </Label>
            <Input
              id="message-cta-url"
              type="url"
              dir="ltr"
              placeholder="https://mouslih-academy.vercel.app/fr/formations/rectification-fatiha"
              value={draft.ctaUrl}
              onChange={(e) => update({ ctaUrl: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-hairline pt-5">
        <Button
          variant="secondary"
          size="sm"
          disabled={!ready}
          loading={previewMutation.isPending}
          onClick={() => previewMutation.mutate(draft)}
        >
          <Eye className="size-4" />
          {t("actions.preview")}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!ready}
          loading={testMutation.isPending}
          onClick={() => testMutation.mutate(draft)}
        >
          <Mail className="size-4" />
          {t("actions.test")}
        </Button>
        <div className="ms-auto flex items-center gap-2.5">
          {confirming ? (
            <>
              <span className="text-sm text-text-soft">
                {t("actions.confirmQuestion", { count: recipients })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirming(false)}
              >
                {t("actions.cancel")}
              </Button>
              <Button
                size="sm"
                loading={sendMutation.isPending}
                onClick={() => sendMutation.mutate(draft)}
              >
                {t("actions.confirm")}
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              disabled={
                !ready || recipients === 0 || !overview.automations.configured
              }
              onClick={() => setConfirming(true)}
            >
              <Send className="size-4" />
              {t("actions.send", { count: recipients })}
            </Button>
          )}
        </div>
      </div>

      {preview && (
        <div className="mt-5 overflow-hidden rounded-sm border border-border-subtle">
          <div className="border-b border-border-subtle bg-bg px-4 py-2.5 text-sm">
            <span className="text-text-muted">{t("preview.subject")} </span>
            <span className="font-semibold">{preview.subject}</span>
          </div>
          {/* sandbox vide : aucun script, aucun formulaire, aucune navigation depuis l'aperçu. */}
          <iframe
            title={t("preview.title")}
            sandbox=""
            srcDoc={preview.html}
            className="h-[560px] w-full bg-bg"
          />
        </div>
      )}
    </section>
  );
}

function AutomationsCard({
  automations,
}: {
  automations: MessagesOverview["automations"];
}) {
  const t = useTranslations("admin.messages.automations");
  const rows = [
    { key: "welcome", value: automations.last30Days.welcome },
    { key: "completion", value: automations.last30Days.completion },
    { key: "reminderStart", value: automations.last30Days.reminderStart },
    { key: "reminderResume", value: automations.last30Days.reminderResume },
  ] as const;

  return (
    <section className="rounded-sm border border-border-subtle bg-surface p-5.5">
      <h2 className="mb-1 font-serif text-xl font-medium">{t("title")}</h2>
      <p className="mb-4 text-sm text-text-muted">{t("subtitle")}</p>
      {!automations.configured && (
        <p className="mb-4 flex gap-2 rounded-sm border border-warning-border bg-warning-bg px-3 py-2.5 text-[13px] text-warning">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {t("notConfigured")}
        </p>
      )}
      <ul className="flex flex-col">
        {rows.map((row) => (
          <li
            key={row.key}
            className="flex items-start justify-between gap-4 border-b border-hairline py-2.5 last:border-0"
          >
            <div>
              <p className="text-sm font-semibold">
                {t(`kinds.${row.key}.label`)}
              </p>
              <p className="text-xs leading-[1.5] text-text-muted">
                {t(`kinds.${row.key}.when`)}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums">
              {row.value}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-[1.5] text-text-muted">
        {automations.remindersEnabled ? t("remindersOn") : t("remindersOff")}{" "}
        {t("quota", {
          sent: automations.sentLastDay,
          limit: automations.dailyLimit,
        })}
      </p>
    </section>
  );
}

function HistoryCard({ overview }: { overview: MessagesOverview }) {
  const t = useTranslations("admin.messages.history");
  const tSegments = useTranslations("admin.messages.segments");
  const locale = useLocale();
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="rounded-sm border border-border-subtle bg-surface p-5.5">
      <h2 className="mb-4 font-serif text-xl font-medium">{t("title")}</h2>
      {overview.campaigns.length === 0 ? (
        <p className="text-sm text-text-muted">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col">
          {overview.campaigns.map((c) => (
            <li
              key={c.id}
              className="border-b border-hairline py-3 last:border-0"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">{c.subject}</p>
                {c.status === "sent" ? (
                  <CheckCircle2
                    className="size-4 shrink-0 text-success"
                    aria-label={t("done")}
                  />
                ) : (
                  <span className="shrink-0 rounded-full border border-warning-border bg-warning-bg px-2 py-0.5 text-xs font-semibold text-warning">
                    {t("sending")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-text-muted">
                {date.format(new Date(c.createdAt))} ·{" "}
                {tSegments(c.segment as MessageSegment)}
              </p>
              <p className="mt-1 text-xs text-text-soft tabular-nums">
                {t("counts", { sent: c.sent, total: c.recipientCount })}
                {c.failed > 0 && ` · ${t("failed", { count: c.failed })}`}
                {c.skipped > 0 && ` · ${t("skipped", { count: c.skipped })}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export { MessagesManager };
