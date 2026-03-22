---
name: astro-development
description: Astro framework development guidance - components, content collections, routing, and best practices
---
# astro-development

Comprehensive guide for Astro framework development. Covers Astro 5.x patterns, content collections, component architecture, routing, and integration with Tailwind CSS.

## When to Use This Skill

Use this skill when working with Astro projects:

- Creating or modifying `.astro` components
- Working with content collections and Markdown/MDX
- Setting up dynamic routes and pagination
- Configuring Astro integrations (Tailwind, MDX, etc.)
- Implementing OG image generation
- Setting up RSS, sitemap, or search

---

## Core Concepts

### Astro Components (.astro)

Astro components are the building blocks of an Astro site. They use a special file format with two parts:

1. **Component Script** (between `---` fences) - Server-side TypeScript/JavaScript
2. **Component Template** - HTML-like syntax with Astro expressions

```astro
---
// Component Script (runs at build time)
const title = "My Page";
---

<!-- Component Template -->
<html>
  <head><title>{title}</title></head>
  <body><slot /></body>
</html>
```

### Content Collections

Content collections provide type-safe access to your content (Markdown/MDX files).

**Schema Definition** (`src/content.config.ts`):

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/data/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDatetime: z.date(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
    }),
});

export const collections = { blog };
```

**Querying Content**:

```typescript
import { getCollection } from "astro:content";

const posts = await getCollection("blog", ({ data }) => {
  return !data.draft; // Filter out drafts
});
```

### Dynamic Routing

Astro uses file-based routing with brackets for dynamic segments:

| File | Route |
| --- | --- |
| `pages/posts/[slug].astro` | `/posts/:slug` |
| `pages/posts/[...slug].astro` | `/posts/*` (catch-all) |
| `pages/tags/[tag]/[page].astro` | `/tags/:tag/:page` |

Get static paths for dynamic routes:

```typescript
export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}
```

---

## Component Development

### Component File Structure

src/components/ contains:

- Card.astro - Reusable card component
- Header.astro - Site header
- Footer.astro - Site footer
- Tag.astro - Tag badge component
- Pagination.astro - Pagination controls
- Other .astro components

### Props in Astro

Define props using TypeScript interface:

```astro
---
interface Props {
  title: string;
  href?: string;
  variant?: "primary" | "secondary";
}

const { title, href = "#", variant = "primary" } = Astro.props;
---

<a href={href} class:list={["btn", `btn-${variant}`]}>
  {title}
</a>
```

### Slot and Named Slots

Slots allow content projection:

```astro
<!-- BaseLayout.astro -->
<html>
  <body>
    <header><slot name="header" /></header>
    <main><slot /></main>
    <footer><slot name="footer" /></footer>
  </body>
</html>

<!-- Usage -->
<BaseLayout>
  <h1 slot="header">Page Title</h1>
  <p>Main content</p>
  <p slot="footer">Footer content</p>
</BaseLayout>
```

### Passing Styles and Scripts

```astro
<style>
  .component { color: blue; }
</style>

<script>
  console.log("Client-side JavaScript");
</script>
```

---

## Content Collections Reference

### Blog Post Frontmatter Schema

```yaml
---
author: string # Author name (default: SITE.author)
pubDatetime: date # Publication date (required)
modDatetime: date # Modification date (optional)
title: string # Post title (required)
featured: boolean # Featured post flag (optional)
draft: boolean # Draft status (optional)
tags: string[] # Tags array (default: ["others"])
ogImage: string|Image # OG image path or URL (optional)
description: string # Post description (required)
canonicalURL: string # Canonical URL (optional)
hideEditPost: boolean # Hide edit link (optional)
timezone: string # Post-specific timezone (optional)
---
```

### Filtering Posts

```typescript
import { getCollection } from "astro:content";

// Get all non-draft posts
const posts = await getCollection("blog", ({ data }) => {
  return !data.draft;
});

// Get posts by tag
const tagPosts = posts.filter((post) =>
  post.data.tags.includes("astro")
);

// Sort by date
const sorted = posts.sort(
  (a, b) => b.data.pubDatetime.valueOf() - a.data.pubDatetime.valueOf()
);
```

---

## Layouts

### Layout Hierarchy

Layout hierarchy:

1. Main.astro - Base layout with header/footer
2. Layout.astro - SEO layout (meta tags, OG images)
3. PostDetails.astro - Individual post layout (child of Layout.astro)
4. AboutLayout.astro - About page layout (child of Layout.astro)

### Layout Pattern

```astro
---
// src/layouts/Layout.astro
import { SEO } from "astro-seo";
import type { SEOProps } from "astro-seo";

interface Props extends SEOProps {}

const { ...props } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <SEO {...props} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## Styling with Tailwind CSS

### Tailwind Setup in Astro 5.x

Using `@tailwindcss/vite` plugin:

```typescript
// astro.config.mjs
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Typography Plugin

```typescript
// Add to vite.plugins
import typography from "@tailwindcss/typography";

// In your CSS
@plugin "@tailwindcss/typography";
```

### Using Tailwind Classes

```astro
<div class="max-w-prose mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
    Title
  </h1>
  <article class="prose dark:prose-invert">
    <slot />
  </article>
</div>
```

---

## Utility Functions

Key utilities in `src/utils/`:

| File | Purpose |
| --- | --- |
| `getSortedPosts.ts` | Sort posts by date |
| `getUniqueTags.ts` | Extract unique tags from posts |
| `getPostsByTag.ts` | Filter posts by tag |
| `slugify.ts` | Convert strings to URL-safe slugs |
| `generateOgImages.ts` | Generate OG images with Satori |

---

## API Endpoints

Astro supports serverless-style API endpoints:

```typescript
// src/pages/rss.xml.ts
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: "My Blog",
    description: "Blog description",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDatetime,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
  });
}
```

---

## Common Patterns

### Image Handling

```astro
---
import { Image } from "astro:assets";
import myImage from "../assets/images/example.png";
---

<Image
  src={myImage}
  alt="Description"
  width={800}
  height={600}
  format="webp"
/>
```

### Conditional Classes

```astro
---
const { featured = false } = Astro.props;
---

<article class:list={["card", { "card-featured": featured }]}>
  <slot />
</article>
```

### Environment Variables

```typescript
const apiKey = import.meta.env.API_KEY;
const isDev = import.meta.env.DEV;
```

---

## Commands Reference

| Command | Description |
| --- | --- |
| `bun dev` | Start dev server |
| `bun run build` | Build for production |
| `bun preview` | Preview production build |
| `bun sync` | Sync content collections |
| `bun astro -- <cmd>` | Run Astro CLI directly |
| `bun format` | Format with Prettier |
| `bun lint` | Lint with ESLint |

---

## Troubleshooting

### Content not updating

Run `bun sync` to regenerate content collection types.

### Type errors with content

Check `src/content.config.ts` schema matches your frontmatter exactly.

### Styles not applying

Ensure Tailwind vite plugin is configured in `astro.config.mjs`.

### OG images not generating

Verify `@resvg/resvg-js` and `satori` are installed and templates in `src/utils/og-templates/` are valid.
