# PayNow — Project Overview
Welcome to payNow, a Payment Portal that enables a smooth, secure handoff of payments to SWIFT (our South African provider). 

## Quick map
- Frontend: [frontend/src](frontend/src) — UI and API client  
  - Pages: [registerCustomer.jsx](frontend/src/pages/registerCustomer.jsx), [login.jsx](frontend/src/pages/login.jsx), [makePayment.jsx](frontend/src/pages/makePayment.jsx), [viewPayments.jsx](frontend/src/pages/viewPayments.jsx), [paymentPortal.jsx](frontend/src/pages/paymentPortal.jsx)  
  - API client: [`api` / `setAuthToken`](frontend/src/interfaces/axiosInstance.js)  
  - Vite + CSP + HTTPS dev server: [vite.config.js](frontend/vite.config.js)

- Backend: [backend](backend) — API and DB  
  - Controllers: [`register`, `login`, `logout`](backend/controllers/customerController.js); [`registerEmployee`, `loginEmployee`](backend/controllers/employeeController.js); [`createPayment`, `getCustomerPayments`, `getPendingPayments`, `verifyPayment`](backend/controllers/paymentController.js)  
  - Auth helpers / middleware: [`generateJwt`](backend/controllers/authController.js), [`verifyToken`, `invalidateToken`](backend/middleware/authMiddleware.js)  
  - Security middleware: [`securityMiddleware`](backend/middleware/securityMiddleware.js)  
  - Routes: [customerRoutes.js](backend/routes/customerRoutes.js), [paymentRoutes.js](backend/routes/paymentRoutes.js), [employeeRoutes.js](backend/routes/employeeRoutes.js)  
  - Models: [customerModel.js](backend/models/customerModel.js), [employeeModel.js](backend/models/employeeModel.js), [paymentModel.js](backend/models/paymentModel.js)  
  - DB: [`connectToMongo`](backend/services/dbService.js)  
  - HTTPS server & certs: [app.js](backend/app.js) and certs under [backend/certs/](backend/certs)

## Main functionality

- Register customers
  - Frontend form: [registerCustomer.jsx](frontend/src/pages/registerCustomer.jsx)  
  - Backend registration logic: [`register`](backend/controllers/customerController.js) — input validation, sanitization, password hashing via Mongoose pre‑save hook in [customerModel.js](backend/models/customerModel.js).

- Login (customers & employees)
  - Shared frontend login form: [login.jsx](frontend/src/pages/login.jsx) — chooses customer vs employee based on account number field and calls API via [apiService.js](frontend/src/services/apiService.js).  
  - Customer login: [`login`](backend/controllers/customerController.js) — validates, matches hashed password, then issues JWT and sets an HTTP‑only cookie.  
  - Employee login: [`loginEmployee`](backend/controllers/employeeController.js) — validates and returns JWT in response.

- Create payment (customers)
  - Frontend create payment page: [makePayment.jsx](frontend/src/pages/makePayment.jsx)  
  - Backend: [`createPayment`](backend/controllers/paymentController.js) — requires authenticated user (`verifyToken`), validates/sanitizes inputs, stores payment document in MongoDB ([paymentModel.js](backend/models/paymentModel.js)) with `verified: false`.

- View payments
  - Customer view their payments: frontend [viewPayments.jsx](frontend/src/pages/viewPayments.jsx) calling [apiService.getCustomerPayments](frontend/src/services/apiService.js) -> backend [`getCustomerPayments`](backend/controllers/paymentController.js) (requires `verifyToken`).  
  - Employee view pending payments: frontend [paymentPortal.jsx](frontend/src/pages/paymentPortal.jsx) calling [apiService.getPendingPayments](frontend/src/services/apiService.js) -> backend [`getPendingPayments`](backend/controllers/paymentController.js). Employees can verify payments via [`verifyPayment`](backend/controllers/paymentController.js) (route wired in [paymentRoutes.js](backend/routes/paymentRoutes.js)).

## Security features implemented (what and where)

- SSL / HTTPS (local dev)
  - Backend serves HTTPS using certs: [backend/app.js](backend/app.js) reads `./certs/localhost+1-key.pem` and `./certs/localhost+1.pem` and runs an HTTPS server. Cert files: [backend/certs/localhost+1.pem](backend/certs/localhost+1.pem), [backend/certs/localhost+1-key.pem](backend/certs/localhost+1-key.pem).
  - Frontend dev server also configured for HTTPS using same certs: [frontend/vite.config.js](frontend/vite.config.js).

- Helmet and Content Security Policy (CSP)
  - Backend CSP & other headers via [`securityMiddleware`](backend/middleware/securityMiddleware.js). Helmet is configured with CSP directives (default-src, script-src, style-src, img-src, object-src, frame-ancestors, upgrade-insecure-requests), frameguard, crossOriginOpenerPolicy and crossOriginResourcePolicy, permissionsPolicy, noSniff, xssFilter, and hidePoweredBy. See [`securityMiddleware`](backend/middleware/securityMiddleware.js).
  - Frontend build uses `vite-plugin-csp` to enforce CSP in dev/build: [frontend/vite.config.js](frontend/vite.config.js).

- CORS
  - Backend CORS policy in [`securityMiddleware`](backend/middleware/securityMiddleware.js) restricts origin to `https://localhost:5173` and enables credentials (cookies). See `corsOptions` in [securityMiddleware.js](backend/middleware/securityMiddleware.js).

- XSS protection & input sanitization
  - Backend uses `xss` to sanitize critical fields in [`createPayment`](backend/controllers/paymentController.js). See usage in [paymentController.js](backend/controllers/paymentController.js).
  - Input escaping & validation using `validator` across controllers: [`customerController.js`](backend/controllers/customerController.js) and [`paymentController.js`](backend/controllers/paymentController.js).

- Mongo / server-side sanitisation & safe responses
  - Models hash passwords and hide password fields: [customerModel.js](backend/models/customerModel.js) and [employeeModel.js](backend/models/employeeModel.js) (pre-save hooks and `.select` usage). See the `.pre('save')` hooks and `select: false`.
  - Controllers remove password fields before returning created/queried documents (e.g., `delete safe.userPassword` / `delete safe.password`).

- Regex patterns & client + server validation
  - Client-side patterns (HTML input `pattern`) in [registerCustomer.jsx](frontend/src/pages/registerCustomer.jsx), [login.jsx](frontend/src/pages/login.jsx), [makePayment.jsx](frontend/src/pages/makePayment.jsx).  
  - Server-side regex checks mirror client rules using `validator.matches` in controllers: [`customerController.js`](backend/controllers/customerController.js) and [`paymentController.js`](backend/controllers/paymentController.js). Examples include account format `^acc\d{9}$`, currency `^[A-Z]{3}$`, SWIFT pattern, and password complexity.

- Frame busting / clickjacking protection
  - CSP `frame-ancestors` and Helmet `frameguard` configured in [`securityMiddleware`](backend/middleware/securityMiddleware.js).

- JWT tokens, HTTP-only cookies, session timeout & token invalidation
  - Tokens issued by [`generateJwt`](backend/controllers/authController.js) (expiresIn: `"3h"`). See [authController.js](backend/controllers/authController.js).
  - Customer login sets JWT as an HTTP‑only, Secure, SameSite Strict cookie with `maxAge` 3 hours in [`login`](backend/controllers/customerController.js). Cookie creation and options: see [customerController.js](backend/controllers/customerController.js).
  - Server verifies cookie token via [`verifyToken`](backend/middleware/authMiddleware.js) (reads `req.cookies.token`). See [authMiddleware.js](backend/middleware/authMiddleware.js).
  - Logout invalidates token using an in‑memory blacklist (`invalidateToken`) and clears cookie in [`logout`](backend/controllers/customerController.js). See [`invalidateToken`](backend/middleware/authMiddleware.js) and logout flow in [customerController.js](backend/controllers/customerController.js).

- CSRF mitigation
  - Using `SameSite: 'Strict'` on auth cookie and requiring `withCredentials: true` in the frontend axios instance reduces cross‑site cookie sending. Axios config: [frontend/src/interfaces/axiosInstance.js](frontend/src/interfaces/axiosInstance.js) (`withCredentials: true`).

- Rate limiting & brute-force protection
  - Route-level rate limiting using `express-rate-limit` in [paymentRoutes.js](backend/routes/paymentRoutes.js), [employeeRoutes.js](backend/routes/employeeRoutes.js), [customerRoutes.js](backend/routes/customerRoutes.js).
  - Additional brute-force mitigations for customer login using `express-brute` in [customerRoutes.js](backend/routes/customerRoutes.js).

- Other protections
  - Password hashing (bcrypt) for customers and employees: [customerModel.js](backend/models/customerModel.js), [employeeModel.js](backend/models/employeeModel.js).
  - `helmet` options like `noSniff` and `hidePoweredBy` are enabled in [`securityMiddleware`](backend/middleware/securityMiddleware.js).

## Key files & symbols (quick links)
- Controllers: [`register`, `login`, `logout`](backend/controllers/customerController.js) — [backend/controllers/customerController.js](backend/controllers/customerController.js)  
- Employee controller: [`registerEmployee`, `loginEmployee`](backend/controllers/employeeController.js) — [backend/controllers/employeeController.js](backend/controllers/employeeController.js)  
- Payments: [`createPayment`, `getCustomerPayments`, `getPendingPayments`, `verifyPayment`](backend/controllers/paymentController.js) — [backend/controllers/paymentController.js](backend/controllers/paymentController.js)  
- Auth: [`generateJwt`](backend/controllers/authController.js) — [backend/controllers/authController.js](backend/controllers/authController.js)  
- Middleware: [`verifyToken`, `invalidateToken`](backend/middleware/authMiddleware.js) — [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js)  
- Security middleware: [`securityMiddleware`](backend/middleware/securityMiddleware.js) — [backend/middleware/securityMiddleware.js](backend/middleware/securityMiddleware.js)  
- Frontend API client: [`api`, `setAuthToken`](frontend/src/interfaces/axiosInstance.js) — [frontend/src/interfaces/axiosInstance.js](frontend/src/interfaces/axiosInstance.js)  
- Frontend pages: [registerCustomer.jsx](frontend/src/pages/registerCustomer.jsx), [login.jsx](frontend/src/pages/login.jsx), [makePayment.jsx](frontend/src/pages/makePayment.jsx), [viewPayments.jsx](frontend/src/pages/viewPayments.jsx), [paymentPortal.jsx](frontend/src/pages/paymentPortal.jsx)

---

For any code-level questions about a particular file or symbol above, open the file link and reference the symbol name (e.g., see [`createPayment`](backend/controllers/paymentController.js) in [backend/controllers/paymentController.js](backend/controllers/paymentController.js)).


---


## Videos of the Website

### Customer Side:
Link: https://youtu.be/X78mEi2oRfY

### Employee Side:
Link: https://youtu.be/WRk0WtzKrOc

### Testing of Tokens
Link: https://youtu.be/47AGMXM_2ws

## Images of the Testing

![Image](https://github.com/user-attachments/assets/7fc9e014-cea6-409a-8c0f-c319891d1c74)

![Image](https://github.com/user-attachments/assets/bb921d18-b51c-4c05-9cc4-c3e12d0ddbd6)

![Image](https://github.com/user-attachments/assets/3a99d416-2810-4af8-a186-19aa90d64cc9)

![Image](https://github.com/user-attachments/assets/da39db1d-8442-4d34-8fdb-d3ce7da8426f)




