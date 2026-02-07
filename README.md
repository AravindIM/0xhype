# 0xhype

Real-time tech news aggregation platform with intelligent link previews and a modern, responsive interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running with Docker](#running-with-docker)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About

0xhype is a real-time tech news aggregation platform designed to bring the latest updates from the tech community to your fingertips. The platform fetches tech news, generates rich link previews with OpenGraph metadata, and presents them in an elegant, user-friendly interface.

Whether you're a developer, tech enthusiast, or startup founder, 0xhype keeps you informed about the latest trends, announcements, and breakthroughs in the technology space. The platform combines a powerful backend API with a modern frontend to deliver a seamless news browsing experience.

## Features

### Current Features

- **Real-time News Aggregation**: Fetch and display the latest tech news from multiple sources
- **Intelligent Link Previews**: Automatically generate rich previews with titles, descriptions, and images using OpenGraph metadata
- **Responsive Design**: Fully responsive UI that works seamlessly on desktop, tablet, and mobile devices
- **Trending Panel**: Discover trending topics and most-discussed tech news
- **Fast and Lightweight**: Optimized performance with instant page loads and smooth interactions
- **Modern UI Components**: Built with accessible, reusable component library
- **Error Handling**: Graceful error states with user-friendly messages
- **Skeleton Loading States**: Beautiful loading states for better perceived performance

### Upcoming Features

- **User Authentication**: Sign up, login, and maintain user profiles
- **User Interactions**: Upvotes, bookmarks, and shares
- **Comments & Discussions**: Add comments to posts and discuss with other users
- **Advanced Search**: Full-text search across news articles
- **User Profiles**: Personalized profiles with reading history and saved articles
- **Notifications**: Real-time notifications for breaking tech news
- **Social Features**: Follow topics, authors, and other users
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

### Backend

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework for building efficient server-side applications
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript for robust development
- **[TypeORM](https://typeorm.io/)** - Modern ORM for database management and migrations
- **[PostgreSQL](https://www.postgresql.org/)** - Reliable and advanced relational database
- **[Docker](https://www.docker.com/)** - Containerization for consistent deployments

### Frontend

- **[React](https://react.dev/)** - UI library for building interactive user interfaces
- **[React Router v7](https://reactrouter.com/)** - Client-side routing for seamless navigation
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe React components
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn](https://shadcn.com/)** - High-quality, reusable React components built on Radix UI
- **[motion.dev](https://motion.dev/)** - Animation library for smooth, performant visual effects

### DevOps & Tools

- **Docker Compose** - Multi-container application orchestration
- **ESLint** - Code quality and consistency
- **Jest** - Testing framework for unit and integration tests

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Docker** and **Docker Compose** (optional, for containerized setup) - [Download](https://www.docker.com/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/0xhype.git
   cd 0xhype
   ```

2. **Install backend dependencies**

   ```bash
   cd app/api
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../web
   npm install
   cd ../..
   ```

4. **Configure environment variables**

   Create a `.env` file in the `app/api` directory:

   ```bash
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=0xhype
   DB_SYNCHRONIZE=true

   # API Configuration
   API_PORT=3000
   API_HOST=0.0.0.0

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

5. **Set up the database**

   Ensure PostgreSQL is running, then run migrations:

   ```bash
   cd app/api
   npm run typeorm migration:run
   ```

6. **Start the development servers**

   **Backend** (Terminal 1):

   ```bash
   cd app/api
   npm run start:dev
   ```

   **Frontend** (Terminal 2):

   ```bash
   cd app/web
   npm run dev
   ```

   The application will be available at:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

### Running with Docker

The easiest way to run 0xhype is with Docker Compose, which sets up all services automatically.

1. **Ensure Docker is running**

   ```bash
   docker --version
   docker-compose --version
   ```

2. **Build and start all services**

   ```bash
   docker-compose up --build
   ```

   This will start:
   - PostgreSQL database
   - Backend API (NestJS)
   - Frontend (React)

3. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

4. **Stop the services**

   ```bash
   docker-compose down
   ```

   To also remove volumes:

   ```bash
   docker-compose down -v
   ```

## Usage

### Viewing News

1. Open the application in your browser (`http://localhost:5173`)
2. The homepage displays the latest aggregated tech news
3. Click on any news item to view the full link preview with metadata
4. Browse the trending panel to see what's popular in the tech community

### Creating a Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New JavaScript Framework Released",
    "link": "https://example.com/article"
  }'
```

### Fetching Posts

```bash
# Get all posts (ordered by date, newest first)
curl http://localhost:3000/api/posts

# Get a specific post
curl http://localhost:3000/api/posts/1
```

### Getting Link Preview

```bash
# Fetch OpenGraph preview for a post's link
curl http://localhost:3000/api/posts/1/preview
```

### Expected Post Response

```json
{
  "postid": 1,
  "title": "Article Title",
  "link": "https://example.com/article",
  "date": "2026-02-07T10:00:00Z"
}
```

### Expected Preview Response

```json
{
  "title": "Article Title",
  "description": "Article description",
  "image": "https://example.com/image.jpg",
  "url": "https://example.com",
  "siteName": "Example",
  "siteUrl": "example.com",
  "favicon": "https://example.com/favicon.ico"
}
```

## Project Structure

```text
0xhype/
├── app/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── posts/         # Posts module
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts
│   │   ├── test/              # E2E tests
│   │   └── package.json
│   │
│   └── web/                    # React Frontend
│       ├── app/
│       │   ├── components/    # React components
│       │   ├── routes/        # Page components
│       │   ├── hooks/         # Custom hooks
│       │   └── lib/           # Utilities
│       ├── public/            # Static assets
│       └── package.json
│
├── docker-compose.yml          # Docker orchestration
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## Roadmap

### Phase 1: Core Features (Current)

- [x] Real-time news aggregation
- [x] Link previews with OpenGraph
- [x] Responsive UI
- [ ] Error handling improvements
- [ ] Dark mode support

### Phase 2: User Features

- [ ] User authentication and registration
- [ ] User profiles and reading history
- [ ] User interactions (upvotes, downvotes)
- [ ] Comments and discussions on posts

### Phase 3: Advanced Features

- [ ] Trending panel
- [ ] Full-text search functionality
- [ ] Topic and author following
- [ ] Personalized news feed
- [ ] Push notifications
- [ ] Email digests

### Phase 4: Social & Analytics

- [ ] Social sharing features
- [ ] Community ranking system
- [ ] Analytics dashboard

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Getting Started with Development

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Coding Standards

- **Use TypeScript**: All code should be written in TypeScript for type safety
- **Follow ESLint rules**: Run `npm run lint` and fix any issues
- **Write tests**: Include unit tests for new features
- **Document changes**: Update README and comments as needed
- **Use meaningful commit messages**: Follow conventional commits

### Running Tests

```bash
# Backend tests
cd app/api
npm run test

# E2E tests
npm run test:e2e

# Frontend tests
cd ../web
npm run test
```

### Linting and Formatting

```bash
# Check linting issues
npm run lint

# Fix linting issues
npm run lint:fix
```

### Pull Request Process

1. Update the README.md with any new features or changes
2. Ensure all tests pass: `npm run test`
3. Ensure linting passes: `npm run lint`
4. Provide a clear description of your changes in the PR
5. Link any related issues

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License is a permissive open-source license that allows you to:

- Use the software commercially
- Modify the software
- Distribute the software
- Use it privately

With the conditions that you:

- Include the original license and copyright notice

## Contact

- **Project Repository**: [0xhype on GitHub](https://github.com/yourusername/0xhype)
- **Report Issues**: [GitHub Issues](https://github.com/yourusername/0xhype/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/0xhype/discussions)

For questions, suggestions, or feedback, please open an issue or start a discussion on GitHub.

---

## Made with ❤️ by the 0xhype community
