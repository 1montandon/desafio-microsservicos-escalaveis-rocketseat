import { defineConfig } from 'drizzle-kit'

if(!process.env.DATABASE_URL){
    throw new Error("DATABASE_URL must be configured")
}

export default defineConfig({
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL
    },
    schema: 'src/database/schema/*',
    out: 'src/database/migrations',
    casing: 'snake_case'
})