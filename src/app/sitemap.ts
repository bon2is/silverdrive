import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://silverdrive.andxo.com";
  const now = new Date();

  return [
    { url: base,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/test`,          lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/test/memory`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/test/trail`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/test/reaction`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/test/signs`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/test/hazard`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
