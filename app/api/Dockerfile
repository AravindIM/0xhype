FROM node:24.12.0-alpine3.23 as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

FROM build-deps as development
ENV NODE_ENV=development \
    NPM_CONFIG_LOGLEVEL=warn
COPY . .

EXPOSE 3000 9229
CMD ["npm","run","start:dev"]