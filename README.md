<div align="center">

# iBuiltThis

**A community launch platform where builders showcase apps, AI tools, SaaS products, and side projects, and get discovered through community voting.**
 
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F)](https://orm.drizzle.team)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF)](https://clerk.com)
 
[Live Demo](https://i-built-this-wheat.vercel.app/) 
 
</div>
 
## Overview

**iBuiltThis** It handles the full lifecycle of a listing:

1. **Submission:** A signed-in user, acting as a member of a Clerk organization, submits a product including its name, slug, tagline, description, website URL, and relevant tags.
2. **Moderation Queue:** The submission initially lands in a `pending` state, remaining invisible to the public until an admin reviews it.
3. **Admin Controls:** Through a secure admin dashboard, submissions can be approved, rejected, or deleted. Approved products instantly go live on the landing page and explore views.
4. **Community Voting:** Once live, users can upvote (or revoke their upvote). The system strictly enforces a one-vote-per-user policy at the database level, dynamically updating vote counts transactionally to prevent race conditions.



https://github.com/user-attachments/assets/da3ee0e6-2b87-4eca-b02c-598472d757c0



## Features

- **Product Showcase** — Browse featured and recently-launched products on the landing page with real-time updates via Next.js cache tags.
- **Submit a Project** — Authenticated users (within a Clerk organization) can submit their own products with name, slug, tagline, description, website URL, and tags.
- **Upvoting System** — One-vote-per-user enforcement at the database level using a unique index on `(userId, productId)`. Votes can also be removed. Vote counts are updated transactionally to prevent race conditions.
- **Explore Page** — Browse all approved products, filterable and paginated.
- **Product Detail Pages** — Dedicated pages at `/products/[slug]` for each approved project with a dedicated voting section.
- **Admin Dashboard** — Role-protected page (`/admin`) for reviewing submissions. Admins can approve, reject, or delete products. Stats grid shows counts across all statuses.
- **Authentication** — Full auth flow (sign in, sign up, user button) powered by Clerk, including organization membership gating for submissions.
- **Dark / Light Mode** — Theme switching via `next-themes`.
- **Graceful UX** — `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`, and `<Suspense>` skeletons throughout every route.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React Server Components) |
| Language | TypeScript 5 |
| UI Components | [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + `tw-animate-css` |
| Icons | [Lucide React](https://lucide.dev) |
| Authentication | [Clerk](https://clerk.com) (`@clerk/nextjs`) |
| Database | [Neon](https://neon.tech) (serverless PostgreSQL) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) + Drizzle Kit |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Deployment | [Vercel](https://vercel.com) |

---

## Project Structure

```
.
├── app/                        # Next.js App Router
│   ├── admin/                  # Admin dashboard (role-protected)
│   ├── explore/                # Browse all approved products
│   ├── products/[slug]/        # Individual product detail page
│   ├── submit/                 # Submit a new product
│   ├── layout.tsx              # Root layout (fonts, theme, Clerk)
│   ├── page.tsx                # Landing page (Hero + Featured + Recent)
│   ├── globals.css             # Global styles & design tokens
│   └── icon.svg                # Favicon (matches header logo)
│
├── components/
│   ├── admin/                  # Admin product card, stats grid, action buttons
│   ├── forms/                  # Reusable form field wrapper
│   ├── landing-page/           # Hero, featured products, recently launched, stats
│   ├── products/               # Product card, explorer, submit form, voting button/section, skeleton
│   ├── shared/                 # Header, footer, custom user button, section header, empty state
│   └── ui/                     # shadcn/ui primitives (button, card, badge, input, …)
│
├── db/
│   ├── schema.ts               # Drizzle schema: products & votes tables + relations
│   ├── index.ts                # Neon DB client + Drizzle instance
│   ├── data.ts                 # Seed data helpers
│   └── seeds.ts                # Database seeding script
│
├── drizzle/                    # Auto-generated SQL migrations
│
├── lib/
│   ├── admin/
│   │   ├── admin-actions.ts    # Server Actions: approve, reject, delete
│   │   └── assert-admin.ts     # Auth guard for admin-only operations
│   ├── products/
│   │   ├── product-actions.ts  # Server Actions: submit, upvote, remove vote
│   │   ├── product-selection.ts# Data-fetching helpers (all products, by slug, …)
│   │   └── product-validation.ts # Zod schema for product form
│   └── utils.ts                # cn() class merging utility
│
├── types/
│   └── index.ts                # Inferred Drizzle types (ProductType, VoteType, FormState)
│
├── drizzle.config.ts           # Drizzle Kit configuration
└── next.config.ts              # Next.js configuration
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A [Neon](https://neon.tech) PostgreSQL database
- A [Clerk](https://clerk.com) application with organization support enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/i-built-this.git
cd i-built-this

# 2. Install dependencies
npm install

# 3. Set up environment variables (see section below)
cp .env.example .env.local   # then fill in your values

# 4. Push the database schema
npx drizzle-kit push

# 5. (Optional) Seed the database with sample data
npx tsx db/seeds.ts

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Environment Variables

Create a `.env.local` file in the project root with the following keys:

```env
# Clerk – https://dashboard.clerk.com → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Neon PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

### Setting Up an Admin User

Admin access is controlled by a Clerk `publicMetadata` flag. To grant admin rights to a user, set the following in the Clerk dashboard under **Users → [user] → Public Metadata**:

```json
{ "isAdmin": true }
```

---

## Database

Migrations are managed with Drizzle Kit:

```bash
# Generate a new migration after schema changes
npx drizzle-kit generate

# Apply migrations to the database
npx drizzle-kit push

# Open Drizzle Studio (visual DB browser)
npx drizzle-kit studio
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |


##  Contact
For questions, suggestions, or collaboration:


#### Author: Abdelrhman Elsafty


- GitHub: github.com/abdelrahmanelsafty75

- Email: abdelrhmanelsafty74@gmail.com

- LinkedIn: www.linkedin.com/in/abdelrahmanelsafty75

---

<div align="center">

  <strong>Made with ❤️ by Abdelrahman Elsafty</strong>
  
</div>
