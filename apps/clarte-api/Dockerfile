# Stage 1: Base setup and dependency installation
FROM node:18-alpine AS base
RUN corepack enable pnpm && corepack install -g pnpm@latest-10
RUN apk add --no-cache libc6-compat


# Stage 2: Builder Stage, Dependency and build
FROM base AS builder
ENV NODE_ENV=production
WORKDIR /app

## copy manifests and install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/clarte-dto/package.json ./packages/clarte-dto/
COPY apps/clarte-api/package.json ./apps/clarte-api/

RUN pnpm install -r --frozen-lockfile --prod=false
# === DEBUG 1: Check right after install ===
RUN echo "--- Builder: After install ---" && ls -la node_modules/typeorm || echo "Builder: TypeORM NOT FOUND after install"

## Bundle up app source
COPY . ./

## Build the shared package first, then the nestjs app
RUN pnpm --filter=@clarte/dto... build
RUN pnpm --filter=clarte-api... build


# Stage 3: Copy the artifacts, into the final runner
FROM node:18-alpine AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

WORKDIR /app

ENV NODE_ENV=production


## since in nestjs, there's no transpile package configuration like Nextjs, I gotta copy the dto build artifact

COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules/


COPY --from=builder --chown=nestjs:nodejs /app/packages/clarte-dto/dist ./packages/clarte-dto/dist/

COPY --from=builder --chown=nestjs:nodejs /app/apps/clarte-api/dist/ ./apps/clarte-api/dist/
COPY --from=builder --chown=nestjs:nodejs /app/apps/clarte-api/fr*.json ./app/clarte-api/

COPY --from=builder --chown=nestjs:nodejs /app/apps/clarte-api/fr_FR.json ./
COPY --from=builder --chown=nestjs:nodejs /app/apps/clarte-api/fr_FR_tiny.json ./

RUN echo "--- Runner: After node_modules copy ---" && ls -la node_modules/typeorm || echo "Runner: TypeORM NOT FOUND after copy"
CMD ["node", "apps/clarte-api/dist/main.js"]