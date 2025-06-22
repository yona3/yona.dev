# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

ユーザーへは日本語で答えてください。
コード中では、英語を使ってください。

## Project Overview

This is a personal homepage and blog for yona.dev built with Next.js 15 (App Router), TypeScript, and microCMS. The main source code is located in the `web/` directory.

## Development Commands

### Requirements
- Node.js 18.18.0 or higher (required for Next.js 15)
- Yarn package manager

### Setup and Development
```bash
cd web
yarn install           # Install dependencies
yarn dev              # Start development server at http://localhost:3000
yarn build            # Build for production
yarn start            # Start production server
```

### Code Quality
```bash
yarn lint             # Run ESLint on all TypeScript/JavaScript files
yarn format           # Format code with Prettier and fix linting issues
```

### Performance Analysis
```bash
ANALYZE=true yarn build  # Build with bundle analysis report
```

## Architecture

### Directory Structure
- `web/src/components/` - React components organized by purpose
  - `shared/` - Reusable components (Layout, Article, Header, Footer, ShareButtons, Author, MyLinks, SectionLayout)
  - `icons/` - Icon components (GitHub, Twitter, Zenn)
  - Root level - Page-specific components (About, Works, WorkItem, Top)
- `web/src/app/` - Next.js App Router file-based routing
  - `layout.tsx` - Root layout with metadata and global styles
  - `page.tsx` - Homepage
  - `blog/` - Blog-related pages
    - `page.tsx` - Blog listing page
    - `[articleId]/page.tsx` - Dynamic route for individual articles
  - `api/` - API routes (health check)
- `web/src/lib/` - External service integrations (microCMS client, date utilities)
- `web/src/types/` - TypeScript type definitions
- `web/src/constants/` - Static data (works portfolio, links, likes, etc.)
- `web/src/utils/` - Utility functions (age calculation, OGP generation, Google Analytics)
- `web/src/hooks/` - Custom React hooks (page view tracking)

### Key Technologies
- **Framework**: Next.js 15 with App Router (React 19)
- **Content Management**: microCMS headless CMS for blog articles
- **Styling**: Tailwind CSS with custom configuration and next/font for optimized fonts
- **Code Highlighting**: highlight.js for blog syntax highlighting
- **Social Sharing**: react-share for article sharing
- **Security**: DOMPurify with jsdom for XSS protection and content sanitization
- **Data Processing**: cheerio for HTML parsing, dayjs for date manipulation
- **Development**: TypeScript, ESLint, Prettier for code quality
- **Performance**: @next/bundle-analyzer for webpack bundle analysis

## Content Management

### microCMS Integration
- API client configured in `src/lib/microcms.ts`
- Content types defined in `src/types/index.ts`
- Blog articles are fetched and statically generated

### Environment Variables
- `NEXT_PUBLIC_API_KEY` - microCMS API key (required)
- `GA_ID` - Google Analytics tracking ID (optional)
- `ANALYZE` - Bundle analyzer enable flag (optional, set to "true")
- Environment file: `.env.local` (gitignored)

## Development Notes

### Personal Data
- Age is dynamically calculated in `src/utils/age.ts`
- University status and personal info in `src/components/About.tsx`
- Portfolio projects defined in `src/constants/works.ts`

### Styling Approach
- Uses Tailwind CSS with dark theme (gray-900 backgrounds)
- Optimized font loading with next/font for Noto Sans JP
- Mobile-first responsive design

### Blog System (App Router)
- Server Components for improved performance
- Static generation with generateStaticParams
- Dynamic metadata generation with generateMetadata
- ISR (Incremental Static Regeneration) with revalidate
- OG image generation for social sharing
- Client Components for interactive features (ShareButtons)

### Security Features
- **XSS Protection**: DOMPurify sanitization for all user-generated content
- **Content Sanitization**: Three-stage sanitization process:
  1. Initial microCMS content sanitization
  2. highlight.js output sanitization
  3. Final HTML output sanitization
- **Safe HTML Rendering**: Restricted HTML tags and attributes
- **Script Prevention**: All script tags and dangerous elements are blocked
- **Server-side Processing**: JSDOM enables secure server-side sanitization

## Performance & Security

### Next.js Configuration (next.config.ts)
- TypeScript configuration file for type safety
- Image optimization for microCMS assets via remotePatterns
- Package import optimization (react-share, highlight.js, cheerio, dayjs)
- Bundle analysis with webpack-bundle-analyzer
- Security enhancements (X-Powered-By header disabled)
- Production optimizations (gzip compression, source maps disabled)

### Code Quality Standards
- TypeScript strict mode with ES2022 target
- Comprehensive ESLint rules (78+ rules)
  - Core JavaScript quality rules
  - React/Next.js specific rules
  - TypeScript type safety rules
  - Import organization (simple-import-sort)
  - Tailwind CSS optimization rules
  - Accessibility compliance checks
- Prettier for consistent code formatting