# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

ユーザーへは日本語で答えてください。
コード中では、英語を使ってください。

## Project Overview

This is a personal homepage and blog for yona.dev built with Next.js, TypeScript, and microCMS. The main source code is located in the `web/` directory.

## Development Commands

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

## Architecture

### Directory Structure
- `web/src/components/` - React components organized by purpose
  - `shared/` - Reusable components (Layout, Article, Header, Footer)
  - `icons/` - Icon components
  - Root level - Page-specific components (About, Works, Top)
- `web/src/pages/` - Next.js file-based routing
  - `blog/` - Blog-related pages ([articleId].tsx for dynamic routes)
- `web/src/lib/` - External service integrations (microCMS client)
- `web/src/types/` - TypeScript type definitions
- `web/src/constants/` - Static data (works portfolio, links, etc.)
- `web/src/utils/` - Utility functions

### Key Technologies
- **Content Management**: microCMS headless CMS for blog articles
- **Styling**: Tailwind CSS with custom configuration
- **Code Highlighting**: highlight.js for blog syntax highlighting
- **Social Sharing**: react-share for article sharing

## Content Management

### microCMS Integration
- API client configured in `src/lib/microcms.ts`
- Content types defined in `src/types/index.ts`
- Blog articles are fetched and statically generated

### Environment Variables
- `NEXT_PUBLIC_API_KEY` - microCMS API key (required)
- Environment file: `.env.local` (gitignored)

## Development Notes

### Personal Data
- Age is dynamically calculated in `src/utils/age.ts`
- University status and personal info in `src/components/About.tsx`
- Portfolio projects defined in `src/constants/works.ts`

### Styling Approach
- Uses Tailwind CSS with dark theme (gray-900 backgrounds)
- Custom font configuration for Noto Sans JP
- Mobile-first responsive design

### Blog System
- Static generation for performance
- Dynamic routes for individual articles
- OG image generation for social sharing
- Tag system for content organization