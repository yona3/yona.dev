# yona.dev

This is my personal homepage and blog built with modern web technologies.

## Tech Stack

### Core Framework
- **Next.js 15** with App Router and React 19
- **TypeScript** with strict mode for type safety
- **Tailwind CSS** for styling with dark theme design

### Content Management
- **microCMS** headless CMS for blog articles
- Server-side content processing with syntax highlighting

### Development Tools
- **ESLint** with comprehensive rules (78+ checks)
- **Prettier** for code formatting
- **Bundle analyzer** for performance optimization

### Security & Performance
- **DOMPurify** for XSS protection
- **Content sanitization** for safe HTML rendering
- **Image optimization** with Next.js built-in features
- **Static generation** with ISR (Incremental Static Regeneration)

## Quick Start

```bash
cd web
yarn install
yarn dev
```

Visit http://localhost:3000 to see the development server.

## Build & Deploy

```bash
yarn build    # Production build
yarn start    # Start production server
yarn lint     # Code quality check
yarn format   # Format code and fix linting issues
```

## Architecture

The project uses Next.js App Router with Server Components for optimal performance and SEO. Content is managed through microCMS and statically generated with dynamic metadata support.
