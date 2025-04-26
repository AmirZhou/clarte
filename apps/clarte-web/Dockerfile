# Stage 1: Base setup and dependency installation
FROM node:18-alpine AS base
# Enable corepack for pnpm
RUN corepack enable pnpm && corepack install -g pnpm@latest-10
RUN apk add --no-cache libc6-compat

# ---- Builder Stage ----
# Stage 2: Dependency caching and build
FROM base AS builder
WORKDIR /app

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL

# Copy root files to leverage pnpm workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml  ./
# Copy shared package and front-end app manifests
COPY apps/clarte-web/package.json ./apps/clarte-web/
COPY packages/clarte-dto/package.json ./packages/clarte-dto/

# Install ALL monorepo dependencies
RUN pnpm install -r --frozen-lockfile

# Bundle app source
ADD . ./

# Build the shared package
RUN pnpm --filter=@clarte/dto... build
# Build the web
RUN pnpm --filter=clarte-web... build


# ---- Final Stage ----
FROM node:18-alpine AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

WORKDIR /app

# what this do
ENV NODE_ENV=production
ENV PORT=3000

# Copy the built shared package output from the builder stage
# remove for now because i got transpile package in the config
# COPY --from=builder --chown=nextjs:nodejs /app/packages/clarte-dto/dist ./packages/clarte-dto/dist

# Copy the built frontend application output from the builder stage, 
# enabling standalong mode, it got its file structure handled, so just to root folder.
COPY --from=builder --chown=nextjs:nodejs /app/apps/clarte-web/.next/standalone ./
# Copy static
COPY --from=builder --chown=nextjs:nodejs /app/apps/clarte-web/.next/static ./apps/clarte-web/.next/static/
# Copy the public
COPY --from=builder --chown=nextjs:nodejs /app/apps/clarte-web/public ./apps/clarte-web/public/



EXPOSE 3000



# server.js will be in the root of the standalone folder, which got copied to the app working folder.
CMD ["node", "apps/clarte-web/server.js"]