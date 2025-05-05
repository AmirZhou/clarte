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

RUN echo "--- Builder: After API build ---" && \
    ls -la /app/apps/clarte-api/dist/main.js || echo "!!! Builder: /app/apps/clarte-api/dist/main.js NOT FOUND after build !!!"



# Use pnpm deploy to create the final package in /app/deploy/api
# --prod ensures only production dependencies are included
RUN pnpm --filter=clarte-api deploy --legacy --prod ./deploy/api

# add some debug
RUN echo "--- Builder: DEBUGGING after pnpm deploy ---" && \
    echo "--- Checking existence of deploy target dir: /app/deploy/api ---" && \
    ls -lad /app/deploy/api || echo "!!! /app/deploy/api NOT FOUND !!!" && \
    echo "--- Listing contents of /app/deploy/api ---" && \
    ls -la /app/deploy/api || echo "!!! Cannot list /app/deploy/api contents !!!" && \
    echo "--- Checking existence of /app/deploy/api/dist ---" && \
    ls -lad /app/deploy/api/dist || echo "!!! /app/deploy/api/dist NOT FOUND !!!" && \
    echo "--- Checking existence of /app/deploy/api/dist/main.js ---" && \
    ls -la /app/deploy/api/dist/main.js || echo "!!! /app/deploy/api/dist/main.js NOT FOUND !!!" && \
    echo "--- Checking existence of /app/deploy/api/node_modules ---" && \
    ls -lad /app/deploy/api/node_modules || echo "!!! /app/deploy/api/node_modules NOT FOUND !!!" && \
    echo "--- End DEBUGGING after pnpm deploy ---"

# Stage 3: Copy the artifacts, into the final runner
FROM node:18-alpine AS runner
RUN corepack enable pnpm && corepack install -g pnpm@10.5.2

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder --chown=nestjs:nodejs /app/deploy/api ./

USER nestjs

CMD ["node", "dist/main.js"]

