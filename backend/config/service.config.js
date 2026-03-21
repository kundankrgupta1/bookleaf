export const config = {
    environment: process.env.NODE_ENV || 'development',
    host: process.env.HOST,
    port: process.env.PORT,
    applicationName: process.env.APPLICATION_NAME,

    ai: {
        geminiAPIKey: process.env.GEMINI_API_KEY
    },

    app: {
        frontendURL: process.env.FRONTEND_URL,
        logoURL: process.env.LOGO_URL
    },

    encrypt: {
        saltRound: process.env.SALT_ROUND
    },

    oauth: {
        google: {
            webClientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            androidClientId: process.env.CLIENT_ID_ANDROID
        }
    },

    jwt: {
        accessTokenKey: process.env.ACCESS_TOKEN_SECRET_KEY,
        accessTokenExpiresIn: process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY,
        refreshTokenKey: process.env.REFRESH_TOKEN_SECRET_KEY,
        refreshTokenExpiresIn: process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY,
        inviteSecret: process.env.INVITE_SECRET,
        inviteExpiresIn: process.env.INVITE_SECRET_EXPIRY
    },

    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 200
    },

    postgresql: {
        serverURI: process.env.DB_SERVER_URI,
        name: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT,
        logging: process.env.DB_LOGGING,
        ssl: process.env.DB_CERTIFICATE
    },

    email: {
        smtp: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
            password: process.env.SMTP_PASS,
            from: process.env.SMTP_FROM
        }
    }
}