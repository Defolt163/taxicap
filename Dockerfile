FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

ARG API_SERVER_URL=http://api:8080
ARG NEXT_PUBLIC_LAT_UP
ARG NEXT_PUBLIC_LON_UP
ARG NEXT_PUBLIC_LAT_BOTTOM
ARG NEXT_PUBLIC_LON_BOTTOM
ARG NEXT_PUBLIC_MAP_API_KEY
ARG NEXT_PUBLIC_MYSQL_API
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY

ENV API_SERVER_URL=${API_SERVER_URL} \
    NEXT_PUBLIC_LAT_UP=${NEXT_PUBLIC_LAT_UP} \
    NEXT_PUBLIC_LON_UP=${NEXT_PUBLIC_LON_UP} \
    NEXT_PUBLIC_LAT_BOTTOM=${NEXT_PUBLIC_LAT_BOTTOM} \
    NEXT_PUBLIC_LON_BOTTOM=${NEXT_PUBLIC_LON_BOTTOM} \
    NEXT_PUBLIC_MAP_API_KEY=${NEXT_PUBLIC_MAP_API_KEY} \
    NEXT_PUBLIC_MYSQL_API=${NEXT_PUBLIC_MYSQL_API} \
    NEXT_PUBLIC_VAPID_PUBLIC_KEY=${NEXT_PUBLIC_VAPID_PUBLIC_KEY}

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ARG API_SERVER_URL=http://api:8080
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    API_SERVER_URL=${API_SERVER_URL} \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
RUN mkdir -p /app/public/users && chown node:node /app/public/users

USER node
EXPOSE 3000
CMD ["node", "server.js"]
