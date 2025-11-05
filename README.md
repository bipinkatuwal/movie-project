# Spectaculum - Movie Project

A modern movie management dashboard built with Next.js, TypeScript, and Tailwind CSS. Features include movie listing, reviews, admin panel, and CSV export capabilities.

## Features

- Movie browsing with filtering and sorting
- Star rating system
- User reviews
- Search functionality
- Genre-based filtering
- Admin dashboard
- CSV export
- Responsive design

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Data Storage**: Local JSON files
- **Authentication**: Basic password protection for admin

## Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

## Local Development Setup

1. Clone the repository:

```bash
git clone https://github.com/bipinkatuwal/movie-project.git
cd movie-project
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
# Create .env.local file
cp .env.example .env.local

# Add required variables
ADMIN_PASSWORD=your_admin_password
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
movie-project/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin panel routes
│   ├── api/               # API routes
│   └── movies/            # Movie details pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── lib/                  # Utilities and helpers
├── data/                 # JSON data storage
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Routes

### Movies

- `GET /api/movies` - List movies with pagination and filters
- `POST /api/movies` - Create new movie (admin only)
- `GET /api/movies/[id]` - Get movie details
- `PUT /api/movies/[id]` - Update movie (admin only)
- `DELETE /api/movies/[id]` - Delete movie (admin only)

### Reviews

- `GET /api/reviews` - List reviews for a movie
- `POST /api/reviews` - Create new review

### Admin

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

## Environment Variables

```env
# Required
ADMIN_PASSWORD=your_admin_password  # Password for admin access

# Optional
NEXT_PUBLIC_API_URL=http://localhost:3000  # API base URL
```

## Deployment

### Deploy to Vercel (Recommended)

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Import your forked repository
4. Add environment variables in Vercel project settings
5. Deploy

### Manual Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start
```

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make changes and commit: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request
