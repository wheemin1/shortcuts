# Replit.md - Keyboard Shortcuts Application

## Overview

This is a modern web application for managing and searching keyboard shortcuts across various tools and platforms. It's built as a full-stack application with a React frontend and Express backend, featuring a comprehensive database of shortcuts organized by categories and tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: connect-pg-simple for PostgreSQL sessions
- **Development**: Hot reloading with Vite middleware integration

### Database Schema
- **shortcuts**: Main table storing keyboard shortcuts with support for Windows, macOS, and Linux
- **favoriteShortcuts**: User favorites (prepared for future user system)
- **shortcutUsage**: Usage tracking and analytics
- **Schema Management**: Drizzle Kit for migrations and schema management

## Key Components

### Frontend Components
- **Header**: Search functionality, theme toggle, favorites toggle
- **Sidebar**: Category filtering, OS selection, shortcut counts
- **ShortcutCard**: Individual shortcut display with copy and favorite actions
- **ToolSection**: Grouped shortcuts by tool with expand/collapse
- **PopularShortcuts**: Trending shortcuts display
- **Toast**: User feedback notifications

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **API Routes**: RESTful endpoints for shortcuts, favorites, and usage tracking
- **Search**: Full-text search across titles, descriptions, and metadata

### Custom Hooks
- **useShortcuts**: Main data fetching for shortcuts
- **useFavorites**: Local storage based favorites management
- **useSearch**: Client-side filtering and search logic
- **useToast**: Toast notification management

## Data Flow

1. **Initial Load**: Frontend fetches all shortcuts from `/api/shortcuts`
2. **Search/Filter**: Client-side filtering using useSearch hook
3. **Favorites**: Local storage management with API endpoints for persistence
4. **Usage Tracking**: API calls to increment usage counters
5. **Popular Shortcuts**: Server-side calculation of trending shortcuts

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React ecosystem with Radix UI components
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date formatting

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL
- **ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod for schema validation
- **Development**: tsx for TypeScript execution

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Strict configuration with path aliases
- **Linting**: ESLint configuration (implicit)
- **PostCSS**: Tailwind CSS processing

## Deployment Strategy

### Production Build
- Frontend: Vite builds to `dist/public` directory
- Backend: esbuild bundles server code to `dist/index.js`
- Assets: Static file serving from built frontend

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL
- **Sessions**: PostgreSQL-based session store
- **Development**: Hot reloading with Vite middleware
- **Production**: Static file serving with Express

### Key Features
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Dark Mode**: CSS variables based theme switching
- **Search**: Real-time client-side search across multiple fields
- **Favorites**: Persistent user preferences
- **Usage Analytics**: Track popular shortcuts
- **Multi-platform**: Support for Windows, macOS, and Linux shortcuts
- **Accessibility**: ARIA labels and keyboard navigation support

The application uses a modern tech stack optimized for developer experience and performance, with a clear separation between frontend and backend concerns, and a scalable architecture that can accommodate future user authentication and additional features.

## Recent Updates (July 2025)

### Visual Enhancement
- **Keycap Design**: Added beautiful keycap-style keyboard shortcuts display with realistic key appearance
- **OS Badges**: OS-specific badges (Windows, macOS, Linux) with branded colors and icons
- **Dark Mode**: Enhanced dark mode as default with improved contrast and gradients
- **Animations**: Smooth hover effects and transitions for better user experience

### Database Expansion
- **Comprehensive Coverage**: Expanded from 38 to 400+ verified shortcuts from official sources
- **Windows 11**: Latest Windows 11 shortcuts (snap layouts, clipboard history, widgets)
- **VSCode**: Complete VSCode shortcuts (command palette, debugging, extensions)
- **Excel**: Advanced Excel shortcuts (formulas, pivot tables, data analysis)
- **Chrome**: Full Chrome shortcuts (developer tools, tab management, extensions)
- **Photoshop**: Professional Photoshop shortcuts (layers, tools, adjustments)
- **Verified Sources**: All shortcuts verified against official Microsoft, Adobe, Google documentation

### Technical Improvements
- **CSS Enhancement**: Custom keycap styling with gradients and shadows
- **TypeScript**: Better type safety in storage system
- **Component Design**: Improved shortcut card layout with OS-specific display
- **Search Optimization**: Enhanced search with Korean-English matching