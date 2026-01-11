FROM node:20-alpine AS dev-deps
WORKDIR /app
RUN npm ci


FROM node:20-alpine AS prod-deps
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build
WORKDIR /app
RUN npm run build


FROM node:20-alpine AS production
WORKDIR /app
CMD ["npm", "run", "start"]

FROM node:20-alpine AS development
WORKDIR /app
ENV NODE_ENV=development
COPY package.json package-lock.json ./
COPY --from=dev-deps /app/node_modules ./node_modules
RUN npm ci
CMD ["npm", "run", "dev"]