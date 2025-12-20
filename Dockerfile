# Stage 1: install dependents (cached)
FROM node:20-slim AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Stage 2: build
FROM node:20-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: production runtime
FROM node:20-slim AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit-dev && npm cache clean --force

COPY --from=build /app/dist ./dist

# security: run as non-root
USER node

# the port the app listens on
EXPOSE 3000

CMD ["node", "dist/index.js"]


# Legacy version
# # Stage 1: Build & Compile (Development dependencies included)
# FROM node:20-slim AS build

# WORKDIR /app

# COPY . .

# RUN npm install
# RUN npm run build


# # Stage 2: Production (Production dependencies only)
# FROM node:20-slim AS production

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci --only=Production

# COPY --from=build /app/dist ./dist

# CMD ["node", "dist/index.js"]
