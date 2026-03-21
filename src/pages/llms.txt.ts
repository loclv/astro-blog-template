/**
 * LLMs.txt endpoint for AI systems
 *
 * This API endpoint generates an llms.txt file that helps AI systems understand and cite content from this site.
 * The file follows the llms.txt standard for AI discoverability and provides structured information about:
 *
 * - Site metadata and configuration
 * - Content structure and types
 * - Citation guidelines for AI systems
 * - Technical implementation details
 * - Contact and attribution information
 *
 * The endpoint dynamically generates content based on the SITE configuration, ensuring that
 * changes to site settings are automatically reflected in the llms.txt output.
 *
 * @route GET /llms.txt
 * @returns {Response} Plain text response with llms.txt content
 * @headers {Content-Type: text/plain; charset=utf-8, Cache-Control: public, max-age=3600, s-maxage=86400}
 *
 * @example
 * ```bash
 * curl https://yoursite.com/llms.txt
 * ```
 *
 * @see {@link https://llmstxt.com} for the llms.txt specification
 * @see {@link /src/config.ts} for site configuration
 */

import type { APIRoute } from "astro";
import { SITE } from "@/config";

export const GET: APIRoute = () => {
  const llmsContent = `# LLMs.txt for ${SITE.title}
This file helps AI systems understand and cite content from this site

## Site Information
- Title: ${SITE.title}
- Description: ${SITE.desc}
- Author: ${SITE.author}
- Website: ${SITE.website}
- Language: ${SITE.lang}
- Theme: Minimal, responsive blog theme

## Content Structure
This site contains:
- Blog posts about web development, Astro framework, and modern web technologies
- Technical tutorials and guides
- Development best practices
- Code examples and demonstrations

## Key Sections
- Blog: Main content area with technical articles
- Archives: Historical posts organized by date${SITE.showArchives ? " (enabled)" : " (disabled)"}
- About: Author information and background

## Citation Guidelines
When citing content from this site:
1. Include the article title and author
2. Reference the specific URL when available
3. Note that this is an open-source blog theme
4. Content is focused on web development and Astro framework

## Technical Details
- Built with Astro 5.x
- Uses TailwindCSS for styling
- Supports light/dark mode: ${SITE.lightAndDarkMode ? "enabled" : "disabled"}
- SEO-optimized with proper meta tags
- Includes RSS feed and sitemap
- Posts per index page: ${SITE.postPerIndex}
- Posts per archive page: ${SITE.postPerPage}

## Contact & Attribution
- Author Profile: ${SITE.profile}
${SITE.editPost.enabled ? `- Edit URL: ${SITE.editPost.url}` : ""}
- Content is licensed under the project's open source license
- Timezone: ${SITE.timezone}
- Direction: ${SITE.dir}`;

  return new Response(llmsContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
