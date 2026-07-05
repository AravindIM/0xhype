FROM node:20-alpine AS dev-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
COPY --from=dev-deps /app/node_modules ./node_modules
RUN npm run build


FROM node:20-alpine AS production
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
CMD ["npm", "run", "start"]

FROM node:20-alpine AS development
WORKDIR /app
ENV NODE_ENV=development
COPY package.json package-lock.json ./
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev"]