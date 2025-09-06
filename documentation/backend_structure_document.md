# Backend Structure Document for Finance Dashboard Starter

This document explains how the backend of the finance-dashboard-starter is organized, hosted, and maintained. It’s written in everyday language so anyone can understand the setup, even without a deep technical background.

## 1. Backend Architecture

Overall, the backend is built right into the same project as the frontend, using Next.js API Routes. Here’s how it hangs together:

- **Next.js API Routes**: Files under `/app/api/` become HTTP endpoints automatically. For example, `route.ts` in `/app/api/auth` handles all the signup and login requests.
- **Node.js Runtime**: Under the hood, these API routes run on Node.js—JavaScript on the server—so you don’t need a separate server framework.
- **TypeScript**: Both frontend and backend code use TypeScript. It adds checks that catch mistakes early and makes the code easier to read.

Why this architecture works:

- **Scalability**: Each API route can scale independently (for example, as serverless functions), so it can handle more users without rewriting the code.
- **Maintainability**: Keeping API files next to their related frontend code makes it easy to find and update logic.
- **Performance**: Next.js handles server-side rendering (SSR) and lets you split code so users only download what they need.

## 2. Database Management

### Current Setup (V1)
- We use a simple `data.json` file to store and serve financial data. This is great for prototyping because you can start building the dashboard right away without setting up a database.

### Future Plan (V2+)
- We intend to move to a real database. Two popular choices are:
  - **PostgreSQL (SQL)**: A reliable, widely used relational database.
  - **MongoDB (NoSQL)**: A flexible document store that handles changing data structures easily.
- To interact with the database, we’ll use an ORM (Object-Relational Mapper) such as **Prisma** or **TypeORM**. This makes it easier to read and write data without writing raw SQL all the time.
- **Environment variables** will hold the database connection details (address, username, password) so sensitive information never lives in the code.

## 3. Database Schema

### For the Static JSON (Current)

Our `data.json` might look something like this in human-readable form:

- An array of **transaction records**
  - `id`: Unique identifier
  - `userId`: References which user saw or created this record
  - `date`: When the transaction happened
  - `amount`: How much money moved (positive or negative)
  - `category`: e.g., "Food", "Rent"
  - `description`: Free-text note
- Summary objects for **key metrics**
  - `totalBalance`
  - `monthlySpending`
  - `recentTransactions`

### Proposed SQL Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Financial transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Example index for faster lookups
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
```  

If we choose MongoDB instead, the `transaction` documents would store the same fields (userId, date, amount, category, description) inside a JSON-like document.

## 4. API Design and Endpoints

We follow a RESTful style where each endpoint does one clear job. Here are the key routes:

- **POST `/api/auth`**
  - Purpose: Handle both **sign-up** and **sign-in** requests.
  - How it works:
    - Checks if email is already registered.
    - Hashes passwords with **bcrypt**.
    - Issues a **JWT** or sets a secure cookie for sessions.

- **GET `/api/data`** (future)
  - Purpose: Fetch financial data for the logged-in user.
  - Returns: Transaction list and summary metrics.

- **POST `/api/data`** (future)
  - Purpose: Add or update financial records.
  - Body: Transaction details (date, amount, category, description).

Each endpoint:

- Validates inputs to prevent bad data or injection attacks.
- Sends meaningful success or error messages.
- Checks authentication (except the auth route).

## 5. Hosting Solutions

We recommend using a cloud provider that supports serverless functions and static site hosting. A popular choice is **Vercel** (the team behind Next.js):

- **Seamless Deployments**: Push to GitHub, and Vercel builds + publishes your app automatically.
- **Serverless API Routes**: Your Next.js API routes run as isolated functions without server setup.
- **Global CDN**: Static assets (CSS, images) are cached around the world for fast loads.
- **Custom Domains & HTTPS**: Easy to configure and free.

Alternatives include Netlify, AWS Lambda + S3, or DigitalOcean App Platform. The key is support for Node.js and environment variables.

## 6. Infrastructure Components

Even in a starter template, several pieces work together to keep things smooth:

- **Load Balancer / Edge Network** (provided by Vercel)
  - Routes incoming requests to the nearest serverless function or static asset cache.
- **Content Delivery Network (CDN)**
  - Caches CSS, images, and JavaScript files close to users.
- **Serverless Functions**
  - Each API route lives in a function that scales automatically based on demand.
- **Environment Variables Management**
  - Stored securely in the hosting dashboard (never in code).
- **CI/CD Pipeline** (e.g., GitHub Actions)
  - Runs linting, type checks, and tests before merging code.

Together, these components ensure reliability, fast response times, and minimal manual operations.

## 7. Security Measures

To protect user data and keep everything compliant:

- **Authentication & Authorization**
  - **bcrypt** for hashing passwords so they’re never stored in plain text.
  - **JWT** or HTTP-only cookies to keep sessions secure.
- **Input Validation**
  - Check all data coming into the server for correct format and length.
- **Rate Limiting**
  - Prevent brute-force attacks on the `/api/auth` endpoint.
- **CORS Configuration**
  - Only allow approved origins to talk to your API.
- **HTTPS Everywhere**
  - All traffic is encrypted in transit.
- **Environment Variable Secrets**
  - Keys and passwords live outside code in a secure vault.

## 8. Monitoring and Maintenance

Keeping an eye on performance and errors is vital. Here’s how:

- **Error Tracking**
  - Tools like **Sentry** or **LogRocket** catch and report runtime errors.
- **Performance Monitoring**
  - Vercel Analytics or third-party services (Datadog, New Relic) track response times and throughput.
- **Logging**
  - Structured logs for each API invocation, stored or forwarded to a service like LogDNA.
- **Regular Updates**
  - Dependabot or similar tools can open pull requests when library updates or security patches are available.
- **Automated Tests**
  - Unit tests for critical logic (authentication, data validation).
  - Integration tests for API routes.

Maintenance involves reviewing logs, fixing errors, and updating dependencies on a regular schedule.

## 9. Conclusion and Overall Backend Summary

In this finance dashboard starter, the backend lives alongside the frontend using Next.js API Routes and TypeScript. We start simple with a static JSON file and plan to evolve into a full-fledged database-backed system (PostgreSQL or MongoDB) using an ORM.

Key takeaways:

- The architecture is **scalable**, **maintainable**, and **fast** thanks to serverless functions and SSR.
- **Security** is built in from the ground up: hashed passwords, JWTs, rate limiting, and HTTPS.
- **Hosting** on platforms like Vercel gives us automatic deployments, a global CDN, and easy secret management.
- **Monitoring** and **CI/CD** ensure we catch issues early and keep the app healthy.

This setup aligns with the project’s goals—making it quick to start, easy to extend, and ready to handle real user data in future phases.