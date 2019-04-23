const mssqlUser: string = process.env.DB_USER;
const mssqlPassword: string = process.env.DB_PASSWORD;
const mssqlHost: string = process.env.DB_HOST;
const mssqlSchema: string = process.env.DB_SCHEMA;
const mssqlPort: number = Number( process.env.DB_PORT );

export const SqlConfig = {
    user: mssqlUser,
    password: mssqlPassword,
    server: mssqlHost,
    database: mssqlSchema,
    port: mssqlPort
}
