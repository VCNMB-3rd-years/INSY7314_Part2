const cors = require('cors')

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}

const securityMiddleware = (app) => {
    app.use(cors(corsOptions))
}

module.exports = {securityMiddleware}