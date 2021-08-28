const winstone = require('winston');

const options = {
    file: {
        level: 'info',
        filename: './logs/server.log',
        handleException: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleException: true,
        json: true,
        colorize: true,
    },
};

const logger = winstone.createLogger({
    levels: winstone.config.npm.levels,
    transports: [
        new winstone.transports.File(options.file),
    ],
    exitOnError: false
});

module.exports = logger;