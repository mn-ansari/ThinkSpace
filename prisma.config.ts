import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// .env is gitignored, so it's absent on fresh installs and deploys where postinstall runs `prisma generate`.
if (existsSync(".env")) process.loadEnvFile();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // The Prisma CLI runs migrations, which need a direct connection rather than the pooled DATABASE_URL.
    url: process.env.DIRECT_URL,
  },
});
