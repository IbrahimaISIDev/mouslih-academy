import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import { getInitials } from "@/lib/format";
import { adminUsers } from "@/mocks/admin-users";
import { recentSignups } from "@/mocks/admin-recent-signups";

export interface AdminRecentSignup {
  id: string;
  name: string;
  initials: string;
  city: string;
  hoursAgo?: number;
  yesterday?: boolean;
}

export async function getRecentSignups(): Promise<AdminRecentSignup[]> {
  if (!USE_MOCKS) {
    return apiFetch<AdminRecentSignup[]>("/api/admin/users/recent-signups");
  }

  await sleep(400);

  return recentSignups.flatMap((entry) => {
    const user = adminUsers.find((u) => u.id === entry.userId);
    if (!user) return [];
    return [
      {
        id: user.id,
        name: user.name,
        initials: getInitials(user.name),
        city: user.city,
        hoursAgo: entry.hoursAgo,
        yesterday: entry.yesterday,
      },
    ];
  });
}
