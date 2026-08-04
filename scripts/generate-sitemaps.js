/**
 * Auto-Generate XML, JSON, and TXT Sitemaps
 * Sparkle Oklahoma — https://sparkleoklahoma.com
 */

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://sparkleoklahoma.com";

const pages = [
  { loc: "/", priority: 1.0, changefreq: "weekly" },
  { loc: "/#about", priority: 0.9, changefreq: "monthly" },
  { loc: "/#services", priority: 0.95, changefreq: "weekly" },
  { loc: "/#reviews", priority: 0.7, changefreq: "monthly" },
  { loc: "/#faq", priority: 0.85, changefreq: "monthly" },
  { loc: "/#contact", priority: 0.9, changefreq: "weekly" },
  { loc: "/sitemap.txt", priority: 0.5, changefreq: "monthly" },
  { loc: "/.well-known/security.txt", priority: 0.4, changefreq: "yearly" },
  { loc: "/.well-known/ai.txt", priority: 0.4, changefreq: "yearly" },
  { loc: "/.well-known/humans.txt", priority: 0.4, changefreq: "yearly" }
];

/* ---------------- XML SITEMAP ---------------- */

function generateXML() {
  const xmlItems = pages
    .map(
      (p) => `
  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <priority>${p.priority}</priority>
    <changefreq>${p.changefreq}</changefreq>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, "../sitemap.xml"), xml);
}

/* ---------------- JSON SITEMAP ---------------- */

function generateJSON() {
  const json = {
    site: BASE_URL,
    generated_at: new Date().toISOString(),
    pages: pages.map((p) => ({
      loc: BASE_URL + p.loc,
      priority: p.priority,
      changefreq: p.changefreq
    }))
  };

  fs.writeFileSync(
    path.join(__dirname, "../sitemap.json"),
    JSON.stringify(json, null, 2)
  );
}

/* ---------------- TXT SITEMAP ---------------- */

function generateTXT() {
  const txt = pages.map((p) => BASE_URL + p.loc).join("\n");
  fs.writeFileSync(path.join(__dirname, "../sitemap.txt"), txt);
}

/* ---------------- EXECUTE ---------------- */

generateXML();
generateJSON();
generateTXT();

console.log("Sitemaps updated successfully!");

