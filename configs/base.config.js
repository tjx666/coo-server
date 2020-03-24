exports.server = {
    host: '127.0.0.1',
    port: 3600,
    // 最大上传图片大小为 10 兆
    maxAvatarSize: 1024 * 1024 * 5,
    maxMessageImageSize: 1024 * 1024 * 2,
    maxGroupCountPerUser: 10,
    apiVersion: 'v1',
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
