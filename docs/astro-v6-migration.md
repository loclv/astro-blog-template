# Astro v5 → v6 Migration Checklist

Project: AstroPaper Blog Theme
Current Version: Astro ^5.16.6
Target Version: Astro ^6.1.2
Date: 2026-04-02

## References

- [Upgrade to Astro v6 Guide](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [Astro Changelog](https://astro-changelog.netlify.app/)

## Pre-Upgrade Analysis

### Findings

| Check | Status | Notes |
|-------|--------|-------|
| `Astro.glob()` usage | ✅ Not used | Only mentioned in blog post markdown content |
| `<ViewTransitions />` | ✅ Not used | Only mentioned in blog post markdown content |
| `astro:schema` import | ✅ Not used | Not found in codebase |
| `z from astro:content` | ✅ Not used | Using `z from astro/zod` pattern already |
| Content Collections API | ✅ Using new API | Already using Content Layer API with `glob` loader |
| Legacy collections flag | ✅ Not present | No `legacy.collections` in config |

### astro.config.ts Required Changes

| Current Config | v6 Change | Action |
|----------------|-----------|--------|
| `experimental.fonts` | Stabilized → `fonts` | Move to top-level `fonts` config |
| `experimental.preserveScriptOrder` | Now default | Remove from experimental |

## Dependency Changes

### Core Dependencies to Upgrade

| Package | Current | Target |
|---------|---------|--------|
| astro | ^5.16.6 | ^6.1.2 |
| @astrojs/rss | ^4.0.14 | Check compatibility |
| @astrojs/sitemap | ^3.6.0 | Check compatibility |
| @astrojs/check | ^0.9.6 | Check compatibility |

### Related Dependencies

| Package | Current | Target |
|---------|---------|--------|
| vite | ^7.x | Vite 7.0 (bundled with Astro v6) |
| zod | ^3.x | Zod 4 (bundled with Astro v6) |
| shiki | ^3.20.0 | Shiki 4 (via @shikijs/transformers) |

## Breaking Changes Checklist

### Dependency Upgrades

- [ ] Node.js 22.12.0+ required
  - Check local: `node -v`
  - Check deployment environment (Cloudflare Pages supports Node 22)

- [ ] Vite 7.0
  - Project uses custom Vite config with `@tailwindcss/vite` plugin
  - Comment in config mentions Vite 7 fix - verify this is resolved

### Astro Configuration

- [ ] Move `experimental.fonts` to `fonts`
  ```diff
  - experimental: {
  -   fonts: [...]
  - }
  + fonts: [...]
  ```

- [ ] Remove `experimental.preserveScriptOrder`
  - Now default behavior in v6

### Content Collections

- [ ] Verify glob loader still works
  - Current: `loader: glob({ pattern: "**/[^_]*.md", base: "./src/data/blog" })`
  - Should continue working in v6

### Schema Validation (Zod 4)

- [ ] Test content collection validation
  - Zod 4 has stricter validation
  - Check for any schema errors after upgrade

## Testing Checklist

- [ ] `bun install` - Install upgraded dependencies
- [ ] `bun sync` - Sync Astro content types
- [ ] `bun dev` - Test dev server starts
- [ ] `bun run build` - Test production build
- [ ] `bun preview` - Test preview of built site
- [ ] Check all blog posts load correctly
- [ ] Check search functionality (Pagefind)
- [ ] Check OG image generation
- [ ] Check responsive images
- [ ] Verify no console errors

## Post-Upgrade Verification

| Feature | Status | Notes |
|---------|--------|-------|
| Dev server | ⬜ |  |
| Build | ⬜ |  |
| Content collections | ⬜ |  |
| Images | ⬜ |  |
| Search | ⬜ |  |
| OG Images | ⬜ |  |
| Fonts | ⬜ |  |

## Rollback Plan

If issues occur:
1. Revert `package.json` changes
2. Run `bun install`
3. Restore `astro.config.ts` from git
4. Investigate specific issue before retrying

## Migration Notes

- The project is already well-prepared for v6
- Main changes are configuration cleanup (moving experimental fonts to stable)
- No code changes needed for `Astro.glob()` or `ViewTransitions`
- Content Layer API already in use

## Commands to Run

```bash
# 1. Upgrade dependencies
bun install astro@latest

# 2. Update config
# - Move fonts from experimental to top-level
# - Remove preserveScriptOrder

# 3. Sync and test
bun sync
bun dev
bun run build
```

Restart the TypeScript server to read the new configuration types.
