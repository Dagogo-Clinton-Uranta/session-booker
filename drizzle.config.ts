import {defineConfig} from 'drizzle-kit'


export default  defineConfig({
    schema:"./src/drizzle/schema.ts",
    out:"./src/drizzle/migrations",
    dialect:'postgresql',
    strict:true,
    verbose:true,
    dbCredentials:{
       url: process.env.DRIZZLE_DATABASE_URL as string
    }
})