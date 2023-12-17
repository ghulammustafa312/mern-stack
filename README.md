# Mern Stack Project

Mern Stack project Test.

## Getting Started

### Backend Setup

1. Navigate to the `backend` folder.

   ```bash
   cd backend
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. If you have a local MongoDB, you can skip this step. Otherwise, update the MongoDB connection URL in the configuration files (`src/app.module.ts`) to your own URL.

4. Run the seeder file to populate the database with random user data.

   ```bash
   npm run seed
   ```

5. In the database, change the role of one user to `ADMIN` and password for all users is "Test111@" by default.

6. Start the backend server.
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Navigate to the `frontend` folder.

   ```bash
   cd frontend
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Start the frontend application.

   ```bash
   npm run dev
   ```

4. Access the application in your browser at [http://localhost:5173](http://localhost:3000).

## Usage

With the backend and frontend running, you can now create, modify, and list users using the admin user.
