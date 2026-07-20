import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add your Neon connection string to the environment.")
}

// Neon's HTTP driver: ideal for serverless/edge one-shot queries. Note it does
// not support multi-statement transactions -- if you later need those, switch
// to `drizzle-orm/neon-serverless` with a Pool.
const sql = neon(connectionString)

export const db = drizzle(sql, { schema })

export { schema }
