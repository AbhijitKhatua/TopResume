import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

// Load Next.js-style env files for the drizzle-kit CLI (.env.local takes
// precedence, falling back to .env).
config({ path: [".env.local", ".env"] })

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
