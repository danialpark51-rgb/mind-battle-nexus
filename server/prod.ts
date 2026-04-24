import express from "express";
import path from "node:path";
import { buildBackendApp } from "./index";

// Bundled as CJS; __dirname is the dist/ directory at runtime.
const distDir = __dirname;

const PORT = Number(process.env.PORT ?? 5000);

const app = buildBackendApp();

const publicDir = path.join(distDir, "public");
app.use(express.static(publicDir));

// SPA fallback — anything not matched by /api/* serves index.html
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AegisMind X server listening on :${PORT}`);
});
