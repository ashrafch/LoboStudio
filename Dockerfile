# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --include=dev --no-audit --no-fund

FROM dependencies AS source
COPY . .
RUN mkdir -p public

FROM source AS preview
ENV LOBO_LOCAL_PREVIEW=1
RUN mkdir -p .local-media .next docs /data && chown node:node /app .local-media .next docs /data
USER node
EXPOSE 3000
CMD ["sh", "-ec", "node scripts/preview-media.mjs && exec node node_modules/next/dist/bin/next dev --hostname 0.0.0.0"]

FROM source AS build
ARG SITE_URL
ARG LOBO_INDEXING=0
ARG LOBO_CLIENT_PREVIEW=0
ENV LOBO_STANDALONE=1
RUN npm run build

FROM base AS production
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
RUN mkdir -p .next/cache /data && chown node:node .next/cache /data
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","server.js"]
