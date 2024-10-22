# TechX Backend Next App Documentation

The TechX Backend is built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. It provides RESTful APIs for handling user authentication, post management, comments, categories, and analytics, as well as integrating payment services.

---

## Features

- **User Authentication & Authorization**: Handles user login, registration, and role-based access control.
- **Post Management**: Supports creation, reading, updating, and deleting of posts.
- **Comment Management**: Allows users to create, read, update, and delete comments on posts.
- **Category Management**: Handles category creation, updates, and management.
- **Payment Integration**: Supports payment processing for premium content or services.
- **Analytics**: Provides insights on user interactions, post views, and other platform metrics.

---

## Getting Started

To set up the TechX Backend locally, follow the steps below:

### 1. Clone the Repository

```bash
git clone https://github.com/ferdousalam007/TecX-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a `.env` File

Create a `.env` file in the root directory of the project to configure your environment variables.

### 4. Set Environment Variables

Add the following environment variables in your `.env` file:

- **`NODE_ENV`**: Set to `development` or `production`.
- **`PORT`**: The port number for running the server (e.g., `3000`).
- **`DATABASE_URL`**: The URL of your MongoDB instance.
- **`BCRYPT_SALT_ROUNDS`**: The number of salt rounds for hashing passwords (e.g., `12`).
- **`JWT_SECRET`**: The secret key for signing JSON Web Tokens (JWTs).
- **`JWT_EXPIRES_IN`**: The expiration time for the JWT (e.g., `7d`).
- **`JWT_COOKIE_EXPIRES_IN`**: The expiration time for cookies storing JWTs (e.g., `90d`).

### 5. Start the Server

To start the backend server, run the following command:

```bash
npm start
```

The server will start running on the port defined in the `.env` file (default: `http://localhost:3000`).

---

## Development

### 1. Start the Server in Development Mode

To run the server in development mode (with hot-reloading), use:

```bash
npm run dev
```

### 2. Build the Project

To compile the TypeScript code into JavaScript, run the build command:

```bash
npm run build
```

This will output the compiled files into the `dist/` directory.

---

## License

The TechX backend is open-source and released under the MIT License. See the `LICENSE` file for more details.

---

For additional information on API routes, database models, and specific project details, refer to the inline documentation and relevant files within the repository.