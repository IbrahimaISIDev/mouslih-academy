import { clientApiFetch } from "@/lib/client-fetch";

export const MESSAGE_SEGMENTS = [
  "all",
  "noPurchase",
  "notStarted",
  "inProgress",
  "completed",
] as const;
export type MessageSegment = (typeof MESSAGE_SEGMENTS)[number];

export interface CampaignDraft {
  subject: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  segment: MessageSegment;
}

export interface CampaignSummary {
  id: string;
  subject: string;
  segment: MessageSegment;
  status: "sending" | "sent";
  recipientCount: number;
  sent: number;
  failed: number;
  skipped: number;
  queued: number;
  createdAt: string;
  completedAt: string | null;
}

export interface MessagesOverview {
  /** Effectifs : `learners` = tous les inscrits, les autres = inscrits ayant accepté les offres. */
  segments: Record<MessageSegment, number> & { learners: number };
  campaigns: CampaignSummary[];
  automations: {
    configured: boolean;
    remindersEnabled: boolean;
    dailyLimit: number;
    sentLastDay: number;
    last30Days: {
      welcome: number;
      completion: number;
      reminderStart: number;
      reminderResume: number;
    };
  };
}

/** Champs facultatifs vides retirés (le backend refuse un bouton sans texte ou sans lien). */
function clean(draft: CampaignDraft): CampaignDraft {
  return {
    subject: draft.subject.trim(),
    body: draft.body.trim(),
    segment: draft.segment,
    ...(draft.ctaLabel?.trim() ? { ctaLabel: draft.ctaLabel.trim() } : {}),
    ...(draft.ctaUrl?.trim() ? { ctaUrl: draft.ctaUrl.trim() } : {}),
  };
}

export function getMessagesOverview(): Promise<MessagesOverview> {
  return clientApiFetch<MessagesOverview>("/api/admin/messages");
}

export function previewCampaign(
  draft: CampaignDraft,
): Promise<{ subject: string; html: string }> {
  return clientApiFetch("/api/admin/messages/preview", {
    method: "POST",
    body: JSON.stringify(clean(draft)),
  });
}

export function sendTestCampaign(
  draft: CampaignDraft,
): Promise<{ to: string }> {
  return clientApiFetch("/api/admin/messages/test", {
    method: "POST",
    body: JSON.stringify(clean(draft)),
  });
}

export function sendCampaign(
  draft: CampaignDraft,
): Promise<{ id: string; recipientCount: number }> {
  return clientApiFetch("/api/admin/messages/campaigns", {
    method: "POST",
    body: JSON.stringify(clean(draft)),
  });
}
