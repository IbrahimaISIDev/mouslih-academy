"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { BookOpen, MessageCircleQuestion, Send } from "lucide-react";
import type { Course, Locale, Order, OrderStatus } from "@/lib/types";
import type { LearnerProfile } from "@/mocks/learner";
import { formatPrice } from "@/lib/format";
import { getOrderClient } from "@/features/checkout/api/get-order-client";
import { useCart } from "@/lib/use-cart";
import { SuccessState } from "@/features/checkout/components/success-state";
import { PendingState } from "@/features/checkout/components/pending-state";
import { FailedState } from "@/features/checkout/components/failed-state";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 20;

export interface PaymentResultProps {
  locale: Locale;
  course: Course;
  profile: LearnerProfile;
  initialOrder: Order;
  statusOverride?: "success" | "pending" | "failed";
}

function firstLessonSlug(course: Course): string | null {
  for (const courseModule of course.modules) {
    for (const subModule of courseModule.subModules) {
      const lesson = subModule.lessons[0];
      if (lesson) return lesson.slug;
    }
  }
  return null;
}

function toDisplayStatus(status: OrderStatus): "success" | "pending" | "failed" {
  if (status === "paid") return "success";
  if (status === "pending") return "pending";
  return "failed";
}

function PaymentResult({ locale, course, profile, initialOrder, statusOverride }: PaymentResultProps) {
  const t = useTranslations("checkout.confirmation");
  const [order, setOrder] = useState(initialOrder);
  const [refreshing, setRefreshing] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const attemptsRef = useRef(0);

  const displayStatus = statusOverride ?? toDisplayStatus(order.status);
  const amountLabel = formatPrice(order.amountXof, locale);
  const title = course.title[locale];

  const { cartItem, clearCart } = useCart();
  useEffect(() => {
    // Sans ça, le rappel "commande en cours" (voir CartNotification) continuerait d'apparaître
    // sur d'autres pages alors que l'achat est déjà finalisé.
    if (displayStatus === "success" && cartItem?.courseSlug === course.slug) {
      clearCart();
    }
  }, [displayStatus, cartItem, clearCart, course.slug]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const fresh = await getOrderClient(order.ref);
    if (fresh) setOrder(fresh);
    setRefreshing(false);
  }, [order.ref]);

  useEffect(() => {
    if (statusOverride || order.status !== "pending") return;

    const interval = setInterval(async () => {
      attemptsRef.current += 1;
      const fresh = await getOrderClient(order.ref);
      if (fresh) setOrder(fresh);
      if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
        setTimedOut(true);
        clearInterval(interval);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [statusOverride, order.status, order.ref]);

  if (displayStatus === "success") {
    const startLessonSlug = firstLessonSlug(course);
    return (
      <SuccessState
        orderRef={order.ref}
        amountLabel={amountLabel}
        blessing={t("success.blessing")}
        title={t("success.title")}
        body={t("success.body", { amount: amountLabel, course: title })}
        startLessonLabel={t("success.startLesson")}
        startLessonHref={startLessonSlug ? `/formations/${course.slug}/lecons/${startLessonSlug}` : `/formations/${course.slug}`}
        goDashboardLabel={t("success.goDashboard")}
        getStartedTitle={t("success.getStartedTitle")}
        tips={[
          { icon: BookOpen, title: t("success.tip1Title"), body: t("success.tip1Body") },
          { icon: Send, title: t("success.tip2Title"), body: t("success.tip2Body") },
          { icon: MessageCircleQuestion, title: t("success.tip3Title"), body: t("success.tip3Body") },
        ]}
        receiptTitle={t("success.receiptTitle")}
        paidBadge={t("success.paidBadge")}
        reference={t("success.reference")}
        refValue={order.ref}
        dateLabel={t("success.date")}
        dateValue={new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(order.createdAt))}
        methodLabel={t("success.method")}
        methodValue="Wave"
        amountPaidLabel={t("success.amountPaid")}
        downloadReceiptLabel={t("success.downloadReceipt")}
        downloadReceiptErrorToast={t("success.downloadReceiptErrorToast")}
        emailedToLabel={t("success.emailedTo", { email: profile.email })}
      />
    );
  }

  if (displayStatus === "failed") {
    return (
      <FailedState
        title={t("failed.title")}
        noDebit={t("failed.noDebit")}
        retryNote={t("failed.retryNote")}
        reasonTitle={t("failed.reasonTitle")}
        reasonText={t("failed.reasonText", { phone: profile.phone })}
        referenceLine={t("failed.referenceLine", {
          ref: order.ref,
          date: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(order.createdAt)),
        })}
        checklistTitle={t("failed.checklistTitle")}
        checks={[
          t("failed.check1", { amount: amountLabel }),
          t("failed.check2"),
          t("failed.check3"),
        ]}
        retryButtonLabel={t("failed.retryButton")}
        retryHref={`/${locale}/commande/${course.slug}`}
        contactSupportLabel={t("failed.contactSupport")}
        whatsappHref="https://wa.me/221770000000"
      />
    );
  }

  return (
    <PendingState
      title={t("pending.title")}
      body={t("pending.body")}
      transactionLabel={t("pending.transactionLabel")}
      statusBadge={t("pending.statusBadge")}
      reference={t("pending.reference")}
      refValue={order.ref}
      courseLabel={t("pending.course")}
      courseValue={title}
      amountLabel={t("pending.amount")}
      amountValue={amountLabel}
      refreshLabel={t("pending.refresh")}
      onRefresh={refresh}
      refreshing={refreshing}
      backToDashboardLabel={t("pending.backToDashboard")}
      timeoutNote={timedOut ? t("pending.timeoutNote") : undefined}
    />
  );
}

export { PaymentResult };
