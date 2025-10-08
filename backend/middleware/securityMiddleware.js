const cors = require('cors') //imports cors to allow access into the frontend from backend api
const helmet = require('helmet') //import helmet to protect the frontend

const corsOptions = {
    origin: 'https://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}

const securityMiddleware = (app) => {
app.use(helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                'default-src': ["'self'"], //allows scripts from the website itself but nowhere else
                'script-src': ["'self'"],
                'style-src': ["'self'", "'unsafe-inline'"], //allows inline styling where needed
                'img-src': ["'self'", "data:"], //allows images and base64 date
                'object-src': ["'none'"],
                'frame-ancestors': ["'none'"] //prevents this webiste from being embedded in another website to prevent clickjacking
            }
        },
        crossOriginOpenerPolicy: { 
            policy: "same-origin" 
        },
        crossOriginResourcePolicy: { 
            policy: "same-origin"
        },
        permissionsPolicy: {
            features: {
                geolocation: ["'none'"], //block access to location apis in website, prevents access to physical devices
                microphone: ["'none'"]
            }
        },
        hidePoweredBy: true, //stop api from revealing it is an express api making it harder to look up vulnerabilities
        frameguard: { //prevent website from being put in an iframe 
            action: 'deny'
        },
        ieNoOpen: true,
        noSniff: true,
        xssFilter: true //basic xss protection enabled
    }))

    app.use(cors(corsOptions))
}

module.exports = {securityMiddleware}