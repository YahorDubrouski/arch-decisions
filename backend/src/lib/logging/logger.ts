// Logger: Production-ready logging (Winston)

import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stack: true}),
        winston.format.json()
    ),
    defaultMeta: {service: 'arch-decisions-api'},
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        // Write errors to file (in production)
        ...(process.env.NODE_ENV === 'production'
            ? [
                new winston.transports.File({filename: 'error.log', level: 'error'}),
                new winston.transports.File({filename: 'combined.log'}),
            ]
            : []),
    ],
});

export default logger;
