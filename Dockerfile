# -------- Stage 1: Builder --------
FROM node:12.16.1-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Accept build-time arguments for public envs
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_NODE_ENV

# Set as env so Next.js picks them up during build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_NODE_ENV=$NEXT_PUBLIC_NODE_ENV

RUN yarn build

# -------- Stage 2: Runner --------
FROM node:12.16.1-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN yarn install --frozen-lockfile --omit=dev

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./

EXPOSE 3000

CMD ["yarn", "start"]