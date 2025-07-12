import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    GOOGLE_API_KEY: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    DASHBOARD_URL: z.string().min(1),
  },
  runtimeEnv: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DASHBOARD_URL: process.env.DASHBOARD_URL,
  },
})
