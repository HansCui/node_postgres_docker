# Stage 1: Build & Compile (Development dependencies included)
FROM node:20-slim AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build


# Stage 2: Production (Production dependencies only)
FROM node:20-slim AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=Production

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start"]
