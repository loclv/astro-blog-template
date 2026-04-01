/* eslint-disable no-console */

/**
 * Copy blog posts to public/blog for LLM training.
 * Usage: `bun scripts/copy-blog-posts-for-llm.ts`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const BLOG_PATH = path.join(ROOT, "src/data/blog");
const PUBLIC_PATH = path.join(ROOT, "public/blog");

const mdPattern = /\.md$/;

function shouldExclude(filePath: string): boolean {
  const relativePath = path.relative(BLOG_PATH, filePath);
  const parts = relativePath.split(path.sep);
  return parts.some((part: string) => part.startsWith("_"));
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getSlug(filePath: string, basePath: string): string {
  const relativePath = path.relative(basePath, filePath);
  const withoutExt = relativePath.replace(/\.md$/, "");
  return withoutExt;
}

function copyBlogPosts(): void {
  ensureDir(PUBLIC_PATH);

  function walkDir(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && mdPattern.test(entry.name) && !shouldExclude(fullPath)) {
        const slug = getSlug(fullPath, BLOG_PATH);
        const destPath = path.join(PUBLIC_PATH, `${slug}.md`);
        const destDir = path.dirname(destPath);
        ensureDir(destDir);
        fs.copyFileSync(fullPath, destPath);
        console.log(`Copied: ${slug}.md`);
      }
    }
  }

  walkDir(BLOG_PATH);
  console.log(`\nDone! Blog posts copied to ${PUBLIC_PATH}`);
}

copyBlogPosts();
