# TECH360

TECH360 is a modern mobility discovery portal built with React, TanStack Router, Vite, and Tailwind CSS. It helps users browse vehicles across cars, EVs, bikes, and scooters, compare models, read curated news and reviews, and explore a polished vehicle detail experience.

## What It Does

- Browse a catalog of vehicles with filters for category, brand, body type, fuel type, and budget.
- View detailed vehicle pages with specs, features, safety info, pros, cons, and image galleries.
- Compare vehicles side by side.
- Explore editorial news and user reviews.
- Use a responsive, modern UI designed for desktop and mobile.

## Tech Stack

- React 19
- TanStack Router
- TanStack Start
- Vite
- TypeScript
- Tailwind CSS
- Radix UI components
- Lucide icons

## Project Structure

- `src/routes/` - App routes for home, listings, search, comparison, reviews, and details.
- `src/components/` - Shared UI components and vehicle cards.
- `src/data/vehicles.ts` - Vehicle catalog, categories, news, and review data.
- `public/images/vehicles/` - Vehicle image assets used throughout the app.

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm, pnpm, or bun

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Notes

- Vehicle images are stored locally under `public/images/vehicles/` and are mapped from `src/data/vehicles.ts`.
- Temporary files used during checks should not be committed.
