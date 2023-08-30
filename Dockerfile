ARG NODE_VERSION=node:18-alpine
FROM $NODE_VERSION AS build-stage

WORKDIR /app
RUN corepack enable

COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

FROM $NODE_VERSION AS production-stage

WORKDIR /app
COPY --from=build-stage /app/.output /app/.output

ENV NODE_ENV=production
ENV PORT=8050
ENV NUXT_SECRET="chaoxing-sign"
ENV AUTH_ORIGIN="http://localhost:8050"
ENV NEXTAUTH_URL="http://localhost:8050"

ENV DATABASE_URL="postgresql://username:password@localhost:5432/chaoxing"

EXPOSE 8050

CMD [ "node", "/app/.output/server/index.mjs" ]