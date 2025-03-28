## Prerequisites

- **Node.js**: v18 or later
- **pnpm**: Install globally with `npm install -g pnpm`
- **PostgreSQL**: Installed and running locally (or adjust for your database)
- **Git**: To clone the repository

## Setup Instructions

Follow these steps to set up and run the application locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd my-movie-app
```

### 2. Install Dependencies

From the root directory, install dependencies for all packages:

```bash
pnpm install
```

### 3. Set Up the Database

The app uses PostgreSQL. Ensure the database is created before running the app.

- **Create the Database**:

```bash
CREATE DATABASE dom;
```

> Replace `postgres` with your PostgreSQL username if different. The app auto-creates tables via TypeORM’s `synchronize: true` (development only).

### 4. Configure Environment Variables

Copy the example `.env` file and update it:

- **Copy the Example**:

```bash
cp apps/back/.env.example apps/back/.env
```

- **Edit `.env`**:

and update the variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=movie_app_db
PORT=5000
```

Adjust values as needed (e.g., password, port).

Populate the database with initial data:

- Navigate to the backend:

```bash
cd apps/back
```

- Run the seed script:

```bash
pnpm seed
```

### 6. Run the Application

Start both the backend and frontend:

- From the root directory:

```bash
cd ../.. # Back to root
pnpm dev
```
