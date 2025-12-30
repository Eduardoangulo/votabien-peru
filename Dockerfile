# frontend/Dockerfile
FROM node:20-alpine AS base

# ==========================================
# STAGE 1: Dependencies
# ==========================================
FROM base AS deps
RUN apk add --no-cache libc6-compat

# Instalar pnpm (versión específica)
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# ==========================================
# STAGE 2: Builder
# ==========================================
FROM base AS builder

# Instalar pnpm en esta etapa también
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPABASE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# ==========================================
# Runner (NO necesita las vars en runtime)
# ==========================================
FROM base AS runner
WORKDIR /app
ENV NEXT_PUBLIC_ENVIRONMENT=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]