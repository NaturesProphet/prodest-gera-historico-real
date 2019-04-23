const mssqlUser: string = process.env.REAL_DB_USER;
const mssqlPassword: string = process.env.REAL_DB_PASSWORD;
const mssqlHost: string = process.env.REAL_DB_HOST;
const mssqlSchema: string = process.env.REAL_DB_SCHEMA;
const mssqlPort: number = Number( process.env.REAL_DB_PORT );

export const SqlConfig = {
    user: mssqlUser,
    password: mssqlPassword,
    server: mssqlHost,
    database: mssqlSchema,
    port: mssqlPort
}
