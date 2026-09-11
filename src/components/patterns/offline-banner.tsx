"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";

function OfflineBanner() {
  const t = useTranslations("states.offline");
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    function handleOnline() {
      setOffline(false);
    }
    function handleOffline() {
      setOffline(true);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2.5 border-b border-warning-border bg-warning-bg px-4 py-2.5 text-sm text-warning">
      <WifiOff className="size-4 shrink-0" strokeWidth={1.8} />
      {t("message")}
    </div>
  );
}

export { OfflineBanner };
