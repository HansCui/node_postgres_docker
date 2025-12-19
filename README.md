# Node.js + TypeScript + PostgreSQL (Docker)

A backend API project built with **Node.js**, **TypeScript**, **Express**, and **PostgreSQL**, using **Docker Compose** for local development and **hot-reload** in dev mode.

This repository demonstrates a modern, production-aligned setup with:
- ESM-based TypeScript
- Persistent Postgres storage via Docker volumes
- Auto-reloading development workflow
- Clean separation between application code and infrastructure

---

## Tech Stack

- **Node.js** (ES Modules)
- **TypeScript**
- **Express**
- **PostgreSQL**
- **Docker & Docker Compose**
- **nodemon + ts-node (ESM loader)** for dev hot reload

---

## Prerequisites

- **Node.js** version 18 or higher
- **Docker** and **Docker Compose**
- **npm**

---

## Environment Variables

Create a `.env` file in the project root.

```env
DB_HOST=localhost
DB_PORT=3002
DB_USER=app_user
DB_PASSWORD=passw
DB_NAME=app_db
```

## How to Start the Project (Development)

### 1. Install dependencies

```bash
npm install
```

---

### 2. Start PostgreSQL using Docker

Start the database container in detached mode.

```bash
docker compose up -d postgres
```

PostgreSQL will:
- Run in its own container
- Expose port `3002`
- Persist data using a named Docker volume

To stop the database without deleting data:

```bash
docker compose down
```

---

### 3. Start the Node.js server in development mode

```bash
npm run dev
```

This will:

- Watch files inside the `src/` directory
- Automatically restart the server on file changes
- Execute TypeScript directly using Node’s ESM loader

---

## Database Persistence

PostgreSQL data is stored in a Docker volume.

- **Volume name:** `pgdata`
- **Mounted at:** `/var/lib/postgresql` (PostgreSQL 18+ compatible)

This ensures:

- Database data survives container restarts
- Moving or renaming the project directory does not affect the data
- Local development closely mirrors production architecture

---

## Example API Endpoint

```http
GET /users
```

Returns a list of users stored in PostgreSQL.

---

## Connecting to PostgreSQL Manually

### Connect from inside the container

```bash
docker exec -it node_ts_postgres psql -U app_user -d app_db
```

### Connect from your host machine or a GUI client

```
Host: localhost
Port: 3002
Database: app_db
User: app_user
Password: passw
```

---

## Useful Docker Commands

List all Docker volumes:

```bash
docker volume ls
```

Inspect the Postgres volume:

```bash
docker volume inspect pgdata
```

Remove unused Docker volumes:

```bash
docker volume prune
```
