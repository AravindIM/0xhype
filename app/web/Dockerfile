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