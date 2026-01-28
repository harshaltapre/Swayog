# Swayog Energy - Solar Installation Company Website

## Overview

This is a modern, conversion-focused website for **Swayog Energy**, a solar installation company based in India. The application is a full-stack TypeScript project featuring a React frontend with a clean, mobile-first design and an Express backend with PostgreSQL database for storing customer inquiries. The site focuses on lead generation through strategically placed "Get Free Quote" call-to-action buttons throughout all pages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **Styling**: Tailwind CSS with custom theme (solar yellow #FDB813, nature green #2E8B57)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for smooth page transitions
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query for server state

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts`
- **Build Tool**: esbuild for production, Vite for development

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains table definitions
- **Migrations**: Drizzle Kit with `db:push` command
- **Current Tables**: `inquiries` table for lead capture (name, email, phone, project type, message)

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages (Home, Services, Projects, etc.)
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database connection
├── shared/           # Shared code between frontend/backend
│   ├── schema.ts     # Drizzle table definitions
│   └── routes.ts     # API contract definitions
```

### Key Design Decisions
1. **Shared Schema Validation**: Zod schemas generated from Drizzle tables ensure type safety across the stack
2. **API Contract Pattern**: Routes defined in `shared/routes.ts` provide type-safe API contracts
3. **Component Library**: shadcn/ui provides accessible, customizable components without heavy dependencies
4. **Mobile-First**: Tailwind configured for responsive design prioritizing mobile experience

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### UI/UX Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, forms)
- **Framer Motion**: Animation library for page transitions
- **Embla Carousel**: Lightweight carousel for testimonials/gallery
- **Lucide React**: Icon library

### Form Handling
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Zod integration for validation
- **Zod**: Schema validation library

### Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Production server bundling
- **Drizzle Kit**: Database migration tooling