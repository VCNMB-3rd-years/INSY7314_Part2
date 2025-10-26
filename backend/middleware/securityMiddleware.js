const cors = require('cors') //imports cors to allow access into the frontend from backend api
const helmet = require('helmet') //import helmet to protect the frontend
const csurf = require('csurf') //import csurf for csrf protection
const cookieParser = require('cookie-parser')

const corsOptions = {
    origin: 'https://localhost:5173', //(Goode, 2025)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], //(Goode, 2025)
    credentials: true
}

const csrfProtection = csurf({
    cookie: {
        key: 'csrfToken',
        httpOnly: false,      
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3 * 60 * 60   //same as JWT
    }
})

const securityMiddleware = (app) => {
app.use(cookieParser()) //(Srivastava, 2024)

app.use(helmet({ //(NpmJs, 2025)
        contentSecurityPolicy: { //(AppSecEngineer, 2024)
            useDefaults: true,
            directives: {
                'default-src': ["'self'"], //allows scripts from the website itself but nowhere else (AppSecEngineer, 2024)
                'script-src': ["'self'"], //(AppSecEngineer, 2024; Next, 2025)
                'style-src': ["'self'"], //allows inline styling where needed (NpmJs, 2025) (csp headers)
                'img-src': ["'self'", "data:"], //allows images and base64 date (NpmJs, 2025)
                'object-src': ["'none'"],
                'frame-ancestors': ["'self'"], //prevents this webiste from being embedded in another website to prevent clickjacking (Patel, 2024; Koziy, 2025)
                'upgrade-insecure-requests': [], //(Next, 2025; StackHawk, 2025 ) Forces http websites to be HTTPs (csp headers)
            }
        },
        crossOriginOpenerPolicy: { //(NpmJs, 2025)
            policy: "same-origin" 
        },
        crossOriginResourcePolicy: {  //(NpmJs, 2025)
            policy: "same-origin"
        },
        permissionsPolicy: { //(NpmJs, 2025)
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
        xssFilter: true //basic xss protection enabled (NpmJs, 2025)
    }))

    app.use(cors(corsOptions))

    app.use(csrfProtection)
}

module.exports = {securityMiddleware, csrfProtection}

/* REFERENCES:
    AppSecEngineer. 18 December 2024. NO MORE Stored XSS Flaws in Your NodeJS Apps. [online video]. Available at: <https://www.youtube.com/watch?v=N8uKFarFZAQ> [Accessed 8 October 2025]
    Gavaudan, L. 17 June 2022. react button onClick redirect page. [Online]. Available at: <https://stackoverflow.com/questions/50644976/react-button-onclick-redirect-page> [Accessed 8 October 2025]
    Goode, T. 2025. cors. [Online]. Available at: <https://expressjs.com/en/resources/middleware/cors.html> [Accessed 8 October 2025]
    Kpziy, S. 2025. Clickjacking Attacks and Protecting Your Web Products. [Online]. Available at:  https://serhiikoziy.medium.com/understanding-clickjacking-attacks-and-protecting-your-react-application-c32c953d0812
    IIE Emeris School of Computer Science. 19 July 2024. APDS7311 - Setting up CircleCi and SonarQube. [online video]. Available at: <https://youtu.be/I4CyzX5rhLU?si=x5jZT_zkXDjKekRo> [Accessed 8 October 2025]
    Next, 2025. How to set a Content Security Policy (CSP) for your Next.js application. [Online]. Available at: https://nextjs.org/docs/app/guides/content-security-policy [Accessed 9 October 2025]
    NpmJs. March 2025. Helmet. [Online]. Available at: <https://www.npmjs.com/package/helmet> [Accessed 8 October 2025]
    Patel, R. 2024. [Online]. Available at: https://dev.to/rigalpatel001/preventing-clickjacking-attacks-in-javascript-39pj [Accessed 8 October 2025]
    SquahLabs. 21 October 2023. How To Use A Regex To Only Accept Numbers 0-9. [Online]. Available at: <https://www.squash.io/how-to-use-a-regex-to-only-accept-numbers-0-9/> [Accessed 8 October 2025]
    StackHawk, 2025. React Content Security Policy Guide: What It Is and How to Enable It. [Online]. Available at: https://www.stackhawk.com/blog/react-content-security-policy-guide-what-it-is-and-how-to-enable-it/ [Accessed 9 October 2025]
    Srivastava, P. 29 February 2024. Implementing Csurf Middleware in Node.js. [Online]. Available at: < https://www.geeksforgeeks.org/node-js/implementing-csurf-middleware-in-node-js/ > [Accessed 26 October 2025]
    */