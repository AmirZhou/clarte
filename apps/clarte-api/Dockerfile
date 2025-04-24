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

# Debug: Verify files and pnpm version
RUN pnpm --version
RUN cat /app/pnpm-workspace.yaml
RUN pnpm config get inject-workspace-packages
RUN find /app -name ".npmrc" || echo "No .npmrc files found"
RUN pnpm list --filter '*'

# Use pnpm deploy to create the final package in /app/deploy/api
# --prod ensures only production dependencies are included
RUN pnpm --filter=clarte-api deploy --prod ./deploy/api

# Stage 3: Copy the artifacts, into the final runner
FROM node:18-alpine AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder --chown=nestjs:nodejs /app/deploy/api ./

USER nestjs

CMD ["node", "dist/main.js"]
