const winston = require('winston')

const logger = winston.createLogger({
    format: winston.format.simple(),
    level: 'info',
    transports: [
        new winston.transports.Console()
        // new winston.transports.File( { filename: '../logs/error.log', level: 'error' } ), 
        // new winston.transports.File( { filename: '../logs/app.log' } )
    ]
})


module.exports = logger 