# NestJS Starter Template

## How to run the project locally

1. Clone the repository:
   ```bash
   https://github.com/Fadyy22/nestjs-starter-template.git
   ```
2. Navigate to the project directory:
   ```bash
   cd nestjs-starter-template
   ```
3. Install the dependencies:
   ```bash
   pnpm install
   ```
4. Setup the database if not already done:
   ```bash
   docker-compose -p "APP_NAME" -f ./infrastructure/docker-compose.yml up -d
   ```
5. Create a `.env.local` file in the root directory and configure it with your environment variables. You can use the `.env.example` as a reference.

   Example `.env.local` content:

   ```plaintext
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
   JWT_SECRET=your_jwt_secret
   ```

6. Build the project:
   ```bash
   pnpm run build
   ```
7. Run migrations:
   ```bash
    pnpm run migration:run
   ```
8. Start the application:
   ```bash
   pnpm run start:dev
   ```
