# AGENTS.md - AstroPaper Blog Project

## Project Overview

This is the AstroPaper blog theme - a minimal, responsive and SEO-friendly Astro blog. Built with Astro 5.x, Tailwind CSS 4.x, and TypeScript.

Website: https://astro-paper.pages.dev/

## Tech Stack

- Framework: Astro 5.x
- Styling: Tailwind CSS 4.x with @tailwindcss/typography
- Content: Markdown/MDX with Astro Content Collections
- OG Images: Satori + @resvg/resvg-js
- Search: Pagefind
- Language: TypeScript

## Project Structure

- src/:
  - components/: Astro components (.astro files)
  - layouts/: Page layouts
  - pages/: Dynamic routes and pages
    - posts/: Post detail routes [...slug]
    - tags/: Tag filtering routes
    - archives/: Archive page
    - *.astro/*.ts: RSS, search, OG image endpoints
  - data/blog/: Blog posts (Markdown)
  - utils/: Utility functions
  - styles/: Global CSS files
  - assets/: Images and icons
  - config.ts: Site configuration
  - constants.ts: Social links, share links
  - content.config.ts: Content collection schema
- public/: Static assets
- .opencode/skills/: OpenCode skills
- package.json: Package configuration

## Commands

```bash
bun dev # Start dev server
bun run build # Build for production (includes astro check, pagefind)
bun preview # Preview production build
bun sync # Sync Astro content types
bun astro # Run Astro CLI directly
bun format # Format code with Prettier
bun format:check # Check formatting
bun lint # Lint with ESLint
```

## Configuration

Site settings are in `src/config.ts`:

```typescript
SITE.website // Deployed URL
SITE.author // Author name
SITE.title // Site title
SITE.desc // Site description
SITE.lightAndDarkMode // Enable/disable dark mode
SITE.postPerIndex // Posts on homepage
SITE.postPerPage // Posts per pagination page
SITE.showArchives // Show archives page
SITE.showBackButton // Show back button in posts
SITE.editPost.enabled // Enable edit links
SITE.dynamicOgImage // Enable dynamic OG images
SITE.timezone // IANA timezone
```

## Blog Post Schema

Posts are in `src/data/blog/` with frontmatter:

```yaml
---
author: string # Default: SITE.author
pubDatetime: date # Publication date
modDatetime: date # Modification date (optional)
title: string # Post title
featured: boolean # Featured post (optional)
draft: boolean # Draft status (optional)
tags: string[] # Tags, default: Array of tag strings
ogImage: string|Image # OG image (optional)
description: string # Post description
canonicalURL: string # Canonical URL (optional)
hideEditPost: boolean # Hide edit link (optional)
timezone: string # Post-specific timezone (optional)
---
```

Note: Posts starting with `_` in filename are ignored (e.g., `_releases/` folder).

## Content Collection

Defined in `src/content.config.ts`:

- `BLOG_PATH = "src/data/blog"` - Base path for blog posts
- Uses `glob` loader with pattern `**/[^_]*.md` (excludes `_` prefixed files)
- Schema validation with Zod

## Adding New Posts

1. Create a `.md` file in `src/data/blog/`
2. Follow the blog post schema above
3. Filenames starting with `_` are ignored

Example post file: `src/data/blog/my-new-post.md`

## Dynamic Routes

- `/posts/[...slug]` - Individual post pages
- `/posts/[...slug]/` - Also supports trailing slash
- `/tags/[tag]/[...page]` - Posts by tag with pagination
- `/tags/[tag]/` - First page of tag

## Styling

- Global styles: `src/styles/global.css`
- Typography: `src/styles/typography.css`
- Tailwind CSS 4.x with Typography plugin
- CSS variables defined in global.css for theming

## OG Image Generation

Dynamic OG images via `/og.png.ts` using Satori. Templates in `src/utils/og-templates/`.

## Search

Powered by Pagefind. Built during `bun run build` and served from `/public/pagefind/`.

## Linting & Formatting

- ESLint with eslint-plugin-astro
- Prettier with prettier-plugin-astro and prettier-plugin-tailwindcss

## Development Conventions

1. Use `astro:content` imports for content collections
2. Use `@/` path alias for imports (configured in tsconfig)
3. Use SVG icons from `src/assets/icons/`
4. Components are `.astro` files
5. Utility functions in `src/utils/`

## Path Aliases

```typescript
@import "@/config";     // -> src/config.ts
@import "@/constants"; // -> src/constants.ts
@import "@/components/*"; // -> src/components/*
```

## AI Agent / LLM for development Guidelines

### Logs

Whenever you finish a task or change codes, always log your work using the l-log bash command (llm-lean-log-cli package) with the following format:

`l-log add ./logs/chat.csv "<Task Name>" --tags="<tags>" --problem="<problem>" --solution="<solution>" --action="<action>" --files="<files>" --tech-stack="<tech>" --created-by-agent="<agent-name>"`

Note: `--last-commit-short-sha` is optional and will be auto-populated by the CLI if not provided.

Before run:

- Install the l-log CLI if not already installed: `bun add -g llm-lean-log-cli`.
- If need, run CLI help command: `l-log -h` for more information.
- log path: `./logs/chat.csv`.

### When write markdown files

- No bold text: **bold** and __bold__ are rejected (errors), except in code blocks
- Heading structure: Multiple H1 headings and skipped heading levels are rejected (errors)
- Table syntax: Complex table attributes and incorrect separator format are rejected (errors)
- Simple table syntax: Very wide tables and inline formatting in cells are rejected (errors)
- No ASCII graphs: Box drawing characters and visual patterns are rejected, even in code blocks - (errors)
- Code block best practices: Code blocks without language specification are rejected (errors)
- Space indentation: Excessive indentation (more than 2 spaces) in regular text is rejected (errors) (code blocks exempt)
