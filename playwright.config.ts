import { defineConfig } from '@playwright/test'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local' })

export default defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
})
