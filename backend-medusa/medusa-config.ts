import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      trustProxy: true,
    } as any,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server" || "shared",
  },
  admin: {
    path: "/",
    disable: !process.env.VERCEL,
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-s3",
            id: "s3",
            options: {
              file_url: process.env.B2_S3_URL,
              bucket: process.env.B2_BUCKET,
              endpoint: process.env.B2_ENDPOINT,
              region: process.env.B2_REGION,
              access_key_id: process.env.B2_KEY_ID,
              secret_access_key: process.env.B2_KEY_SECRET,
              
              s3ForcePathStyle: true,
            },
          },
        ],
      },
    },
]
})