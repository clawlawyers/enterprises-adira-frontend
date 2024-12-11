const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");
const path = require("path");

// Define your static routes
const staticRoutes = [
  "/",
  "/Prompt",
  "/DocType",
  "/Drafter/DrafterArgs",
  "/Drafter",
  "/Direction/:id",
  "/Favour/:id",
  "/Neutral/:id",
  "/Summary/:id",
  "/Snippets",
  "/Summary",
  "/DocPreview",
  "/upload",
];

(async () => {
  // Create a stream to write to
  const sitemapStream = new SitemapStream({
    hostname: "https://www.adira.clawlaw.in",
  });

  // Pipe the stream to a file
  const writeStream = createWriteStream(
    path.resolve(__dirname, "public", "sitemap.xml")
  );
  sitemapStream.pipe(writeStream);

  // Add static routes
  staticRoutes.forEach((route) =>
    sitemapStream.write({ url: route, changefreq: "daily", priority: 0.7 })
  );

  // Add dynamic routes
  // const dynamicRoutes = await fetchDynamicRoutes();
  // dynamicRoutes.forEach(route => sitemapStream.write({ url: route, changefreq: 'daily', priority: 0.7 }));

  // End the stream
  sitemapStream.end();

  // Convert the stream to a promise and resolve it
  await streamToPromise(sitemapStream);
  console.log("Sitemap generated successfully.");
})();
