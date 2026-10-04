# 0xhype

A news aggregator for tech enthusiasts, built from links people submit.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E.svg?logo=nestjs&logoColor=white)](https://nestjs.com)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245.svg?logo=reactrouter&logoColor=white)](https://reactrouter.com)

0xhype is a news aggregator for tech enthusiasts. People share the links they find worth reading (articles, release notes, blog posts, repos, videos), and everyone gets one feed with the newest at the top. Accounts tie every post to a person, so you can see who shared something and browse the rest of what they've posted.

## Features

- One feed of everything the community has shared, newest first. Older posts load as you scroll.
- Submit a link with a title. It takes a few seconds.
- Every account gets a profile: a photo, a banner, a short bio, a website, and the posts that person has shared.
- Delete anything you posted.
- Sign up with an email and password, and stay signed in between visits.

## Tech stack

| Backend | Frontend | Infrastructure |
| --- | --- | --- |
| NestJS 11 (TypeScript) | React Router v7 (SSR) + React 19 | PostgreSQL 18 |
| TypeORM + PostgreSQL | Vite 7 + Tailwind CSS 4 | Redis 7 |
| passport-jwt + bcryptjs | Radix UI / shadcn-style | MinIO |
| Redis cache + MinIO storage | TanStack Query + Virtual, motion | Docker Compose |

## Getting started

**Prerequisites:** Docker with Compose v2. Or Node.js 20+ and npm if you'd rather run things locally.

### Docker (recommended)

The fastest way in:

```bash
docker compose up --build
```

Open http://localhost:5173 when it finishes. Run `docker compose watch` in a second terminal to rebuild on changes. `docker compose down` stops the stack, and `down -v` also drops the database and object storage volumes.

| Service | URL |
| --- | --- |
| Web | http://localhost:5173 |
| API | http://localhost:3000 |
| MinIO console | http://localhost:9001 |

Postgres and Redis stay on the internal Compose network, so they aren't reachable from the host. Compose reads optional overrides such as `JWT_SECRET` and `POSTGRES_PASSWORD` from a `.env` file at the repo root.

### Local development

Start Postgres, Redis, and MinIO yourself, export the variables below, then run each app in its own terminal:

```bash
cd app/api && npm install && npm run start:dev
```

```bash
cd app/web && npm install && npm run dev
```

The API reads config straight from the environment and never loads a `.env` file. Required: `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`. Optional: `PORT` (3000), `ALLOWED_ORIGINS`, `JWT_SECRET`, `REDIS_URL` (`redis://localhost:6379`), and the `MINIO_*` variables (endpoint, port, TLS, access key, secret key, bucket, public URL).

The Vite dev server proxies `/api` to `http://api-dev:3000`, a hostname that only exists inside Compose. Running the web app outside Docker means changing that proxy target.

## Project structure

- `app/api`: the backend, built with NestJS.
- `app/web`: the frontend, built with React Router.
- `docker-compose.yml`: the local stack for Postgres, Redis, MinIO, and both apps.
- `LICENSE`: Apache 2.0.

## Contributing

Fork the repo, branch off, and make your change. Before opening a pull request, run the API linter and tests (`cd app/api && npm run lint && npm run test`) and the web type check (`cd app/web && npm run typecheck`). Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`).

## License

[Apache-2.0](./LICENSE)
