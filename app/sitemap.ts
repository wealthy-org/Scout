import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://scout.wealthypeople.org";
  const now = new Date();

  const routes = [
    { path: "/", changeFrequency: "always" as const, priority: 1.0 },
    { path: "/feed", changeFrequency: "always" as const, priority: 0.9 },
    { path: "/census", changeFrequency: "hourly" as const, priority: 0.8 },
    { path: "/dossiers", changeFrequency: "daily" as const, priority: 0.7 },
    { path: "/map", changeFrequency: "daily" as const, priority: 0.7 },
    { path: "/watchlist", changeFrequency: "daily" as const, priority: 0.6 },
    { path: "/how", changeFrequency: "weekly" as const, priority: 0.6 },
    { path: "/docs", changeFrequency: "weekly" as const, priority: 0.6 },
    { path: "/demo/active", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/demo/passed", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/demo/rugged", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/demo/hold", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path === "/" ? "/" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
