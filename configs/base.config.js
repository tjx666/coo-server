exports.server = {
    host: '127.0.0.1',
    port: 3600,
};

exports.security = {
    jwtSecret: 'development_jwt_secret',
    passwordHashSaltRounds: 10,
};

exports.db = {
    dbName: 'coo-dev',
    hostname: '127.0.0.1',
    port: 27017,
    connectOptions: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};
