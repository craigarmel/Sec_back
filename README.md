# Blog App API

This is a NestJS-based Blog App API. It provides endpoints to create, read, update, and delete blog posts and users. The app can be run locally for development or inside a Docker container for production or isolated environments.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Manual Setup](#manual-setup-yarn-or-npm)
  - [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)
- [License](#license)

---

## Features

- User registration and authentication
- CRUD operations for blog posts
- JWT-based authentication
- RESTful API design
- Easy deployment via Docker
- Password hashing with PBKDF2 (salted, 150k iterations)
- Role-based access control (user/admin) enforced server-side
- HttpOnly cookies for session token with 20 min TTL by default
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`) set globally
- Validation via `class-validator` on auth DTOs

---

## Getting Started

### Manual Setup (Yarn or NPM)

1. **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2. **Install dependencies:**

    Using Yarn:
    ```bash
    yarn install
    ```

    or, using NPM:
    ```bash
    npm install
    ```

3. **Configure environment variables:**

    Copy `.env.example` to `.env` and fill in your configurations.

    ```bash
    cp .env.example .env
    ```

4. **Start the application:**

    Using Yarn:
    ```bash
    yarn start
    ```

    or, using NPM:
    ```bash
    npm run start
    ```

    The API will usually be available at [http://localhost:4000](http://localhost:4000).

### Environment

- Copy `.env.example` to `.env` and set `JWT_SECRET` (long random string) and `ACCESS_TOKEN_TTL_MINUTES` (default 20).
- `FRONTEND_ORIGIN` should point to your Next.js UI (e.g. `http://localhost:3000`).

---

### Running with Docker

Make sure you have [Docker](https://docs.docker.com/get-docker/) installed.

1. **Build the Docker image:**
    ```bash
    docker compose --build 
    ```

Replace `.env` with your actual environment file if different.

---

## API Documentation

After the server starts, visit:

- Swagger docs: [http://localhost:3000/api](http://localhost:3000/api) *(if enabled in your project)*

Check the Swagger page for detailed API endpoints and request details.

---

## License

This project is licensed under the MIT License.

---
