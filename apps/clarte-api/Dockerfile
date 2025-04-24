# Stage 1: Base setup and dependency installation
FROM node:18-alpine AS base
RUN corepack enable pnpm && corepack install -g pnpm@10.5.2
RUN apk add --no-cache libc6-compat

# Stage 2: Builder Stage, Dependency and build
FROM base AS builder
ENV NODE_ENV=production
WORKDIR /app

## copy manifests and install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/clarte-dto/package.json ./packages/clarte-dto/
COPY apps/clarte-api/package.json ./apps/clarte-api/

RUN pnpm install -r --prod=false

# copy src codes
COPY . ./

# Build shared package and API
RUN pnpm --filter=@clarte/dto... build
RUN pnpm --filter=clarte-api... build

# Stage 3: Copy the artifacts, into the final runner
FROM node:18-alpine AS runner
RUN corepack enable pnpm && corepack install -g pnpm@10.5.2

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=nestjs:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY --chown=nestjs:nodejs apps/clarte-api/package.json ./apps/clarte-api/
COPY --chown=nestjs:nodejs packages/clarte-dto/package.json ./packages/clarte-dto/ 

RUN pnpm install --prod --frozen-lockfile 


WORKDIR /app

COPY --from=builder --chown=nestjs:nodejs /app/apps/clarte-api/dist/ ./apps/clarte-api/dist/
COPY --from=builder --chown=nestjs:nodejs /app/apps/clarte-api/fr_FR.json ./apps/clarte-api/
COPY --from=builder --chown=nestjs:nodejs /app/apps/clarte-api/fr_FR_tiny.json ./apps/clarte-api/

USER nestjs

CMD ["node", "apps/clarte-api/dist/main.js"]

