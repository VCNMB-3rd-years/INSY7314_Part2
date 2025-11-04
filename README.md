# PayNow — Project Overview
Welcome to payNow, Payment Portals that enable a smooth, secure handoff of payments to SWIFT (our South African provider). 

## Updates to PayNow
- New Frontend
  - Employees and Customers are separated into 2 separate frontends still communicating with the same backend.
  - Admins are a newly introduced user role.

## Video of the Website

### Full Demo:
Link: https://youtu.be/-cv2imDU6cY

## Quick map

- Customer frontend: [customer_frontend/src](customer_frontend/src) — UI for customers and the customer-facing SPA
  - Pages: [registerCustomer.jsx](customer_frontend/src/pages/registerCustomer.jsx), [login.jsx](customer_frontend/src/pages/login.jsx), [makePayment.jsx](customer_frontend/src/pages/makePayment.jsx), [viewPayments.jsx](customer_frontend/src/pages/viewPayments.jsx), [welcomePage.jsx](customer_frontend/src/pages/welcomePage.jsx)
  - API client: [`api` / `setAuthToken`](customer_frontend/src/interfaces/axiosInstance.js)
  - Vite + CSP + HTTPS dev server: [customer_frontend/vite.config.js](customer_frontend/vite.config.js)

- Employee frontend: [employee_frontend/src](employee_frontend/src) — UI for employees and admins
  - Pages: [login.jsx](employee_frontend/src/pages/login.jsx), [paymentPortal.jsx](employee_frontend/src/pages/paymentPortal.jsx), [paymentHistory.jsx](employee_frontend/src/pages/paymentHistory.jsx), [allEmployees.jsx](employee_frontend/src/pages/allEmployees.jsx), [welcomePage.jsx](employee_frontend/src/pages/welcomePage.jsx)
  - API client: [`api` / `setAuthToken`](employee_frontend/src/interfaces/axiosInstance.js)
  - Vite + CSP + HTTPS dev server: [employee_frontend/vite.config.js](employee_frontend/vite.config.js)
  - Roles & capabilities:
    - Employee: view pending payments, verify or reject payments via the Payment Portal, and view payment history.
    - Admin: same capabilities as an employee, plus ability to delete employee accounts.
    - Super Admin (single account): full admin privileges and the ability to register new employee accounts.

- Backend: [backend](backend) — API and DB  
  - Controllers: [`register`, `login`, `logout`](backend/controllers/customerController.js); [`registerEmployee`, `loginEmployee`](backend/controllers/employeeController.js); [`createPayment`, `getCustomerPayments`, `getPendingPayments`, `verifyPayment`](backend/controllers/paymentController.js)  
  - Auth helpers / middleware: [`generateJwt`](backend/controllers/authController.js), [`verifyToken`, `invalidateToken`](backend/middleware/authMiddleware.js)  
  - Security middleware: [`securityMiddleware`](backend/middleware/securityMiddleware.js)  
  - Routes: [customerRoutes.js](backend/routes/customerRoutes.js), [paymentRoutes.js](backend/routes/paymentRoutes.js), [employeeRoutes.js](backend/routes/employeeRoutes.js)  
  - Models: [customerModel.js](backend/models/customerModel.js), [employeeModel.js](backend/models/employeeModel.js), [paymentModel.js](backend/models/paymentModel.js)  
  - DB: [`connectToMongo`](backend/services/dbService.js)  
  - HTTPS server & certs: [app.js](backend/app.js) and certs under [backend/certs/](backend/certs)

## Main functionality

-- Register customers
  - Frontend form: [registerCustomer.jsx](customer_frontend/src/pages/registerCustomer.jsx)  
  - Backend registration logic: [`register`](backend/controllers/customerController.js) — input validation, sanitization, password hashing via Mongoose pre‑save hook in [customerModel.js](backend/models/customerModel.js).

- Login (customers & employees)
  - Customer login form: [login.jsx](customer_frontend/src/pages/login.jsx) — customer accounts authenticate via the customer frontend and receive JWT in an HTTP‑only cookie.
  - Employee/Admin login form: [login.jsx](employee_frontend/src/pages/login.jsx) — employees and admins authenticate via the employee frontend and receive JWTs as appropriate.
  - Customer login logic: [`login`](backend/controllers/customerController.js) — validates, matches hashed password, then issues JWT and sets an HTTP‑only cookie.
  - Employee login logic: [`loginEmployee`](backend/controllers/employeeController.js) — validates and returns JWT in response for employee flows.
  - Admin login logic: [`loginEmployee`](backend/controllers/adminController.js) — validates and returns JWT in response for admin flows.

-- Create payment (customers)
  - Frontend create payment page: [makePayment.jsx](customer_frontend/src/pages/makePayment.jsx)  
  - Backend: [`createPayment`](backend/controllers/paymentController.js) — requires authenticated user (`verifyToken`), validates/sanitizes inputs, stores payment document in MongoDB ([paymentModel.js](backend/models/paymentModel.js)) with `verified: PENDING`.

- View payments
  - Customer view their payments: customer frontend [viewPayments.jsx](customer_frontend/src/pages/viewPayments.jsx) calling [apiService.getCustomerPayments](customer_frontend/src/services/apiService.js) -> backend [`getCustomerPayments`](backend/controllers/paymentController.js) (requires `verifyToken`).
  - Employees and Admins view all pending payments: employee frontend [paymentPortal.jsx](employee_frontend/src/pages/paymentPortal.jsx) calling [apiService.getPendingPayments](employee_frontend/src/services/apiService.js) -> backend [`getPendingPayments`](backend/controllers/paymentController.js). Employees can verify or reject payments via [`verifyPayment`](backend/controllers/paymentController.js) (route wired in [paymentRoutes.js](backend/routes/paymentRoutes.js)). 
  - Employees and Admins view all past processed payments: employee frontend [paymentHistory.jsx](employee_frontend/src/pages/paymentHistory.jsx) calling [apiService.getProcessedPayments](employee_frontend/src/services/apiService.js) -> backend [`getProcessedPayments`](backend/controllers/paymentController.js). Admins can also manage employee accounts by deleting the accounts.

## Security features implemented (what and where)

- SSL / HTTPS (local dev)
  - Backend serves HTTPS using certs: [backend/app.js](backend/app.js) reads `./certs/localhost+1-key.pem` and `./certs/localhost+1.pem` and runs an HTTPS server. Cert files: [backend/certs/localhost+1.pem](backend/certs/localhost+1.pem), [backend/certs/localhost+1-key.pem](backend/certs/localhost+1-key.pem).
  - Frontend dev servers also configured for HTTPS using the same certs: [customer_frontend/vite.config.js](customer_frontend/vite.config.js) and [employee_frontend/vite.config.js](employee_frontend/vite.config.js).

- Helmet and Content Security Policy (CSP)
  - Backend CSP & other headers via [`securityMiddleware`](backend/middleware/securityMiddleware.js). Helmet is configured with CSP directives (default-src, script-src, style-src, img-src, object-src, frame-ancestors, upgrade-insecure-requests), frameguard, crossOriginOpenerPolicy and crossOriginResourcePolicy, permissionsPolicy, noSniff, xssFilter, and hidePoweredBy. See [`securityMiddleware`](backend/middleware/securityMiddleware.js).
  - Frontend build uses `vite-plugin-csp` to enforce CSP in dev/build: see [customer_frontend/vite.config.js](customer_frontend/vite.config.js) and [employee_frontend/vite.config.js](employee_frontend/vite.config.js).

- CORS
  - Backend CORS policy in [`securityMiddleware`](backend/middleware/securityMiddleware.js) restricts origin to `https://localhost:5173` (updateable via env) and enables credentials (cookies). See `corsOptions` in [securityMiddleware.js](backend/middleware/securityMiddleware.js).

- XSS protection & input sanitization
  - Backend uses `xss` to sanitize critical fields in [`createPayment`](backend/controllers/paymentController.js). See usage in [paymentController.js](backend/controllers/paymentController.js).
  - Input escaping & validation using `validator` across controllers: [`customerController.js`](backend/controllers/customerController.js) and [`paymentController.js`](backend/controllers/paymentController.js).

- Mongo / server-side sanitisation & safe responses
  - Models hash passwords and hide password fields: [customerModel.js](backend/models/customerModel.js), [employeeModel.js](backend/models/employeeModel.js) and [adminModel.js](backend/models/adminModel.js) (pre-save hooks and `.select` usage). See the `.pre('save')` hooks and `select: false`.
  - Controllers remove password fields before returning created/queried documents (e.g., `delete safe.userPassword` / `delete safe.password`).

- Regex patterns & client + server validation
  - Client-side patterns (HTML input `pattern`) in [registerCustomer.jsx](customer_frontend/src/pages/registerCustomer.jsx), [login.jsx](customer_frontend/src/pages/login.jsx), [makePayment.jsx](customer_frontend/src/pages/makePayment.jsx).  
  - Server-side regex checks mirror client rules using `validator.matches` in controllers: [`customerController.js`](backend/controllers/customerController.js) and [`paymentController.js`](backend/controllers/paymentController.js). Examples include account format `^acc\d{9}$`, currency `^[A-Z]{3}$`, SWIFT pattern, and password complexity.

- Frame busting / clickjacking protection
  - CSP `frame-ancestors` and Helmet `frameguard` configured in [`securityMiddleware`](backend/middleware/securityMiddleware.js).

- JWT tokens, HTTP-only cookies, session timeout & token invalidation
  - Tokens issued by [`generateJwt`](backend/controllers/authController.js) (expiresIn: `"3h"`). See [authController.js](backend/controllers/authController.js).
  - Customer login sets JWT as an HTTP‑only, Secure, SameSite Strict cookie with `maxAge` 3 hours in [`login`](backend/controllers/customerController.js). Cookie creation and options: see [customerController.js](backend/controllers/customerController.js).
  - Server verifies cookie token via [`verifyToken`](backend/middleware/authMiddleware.js) (reads `req.cookies.token`). See [authMiddleware.js](backend/middleware/authMiddleware.js).
  - Logout invalidates token using an in‑memory blacklist (`invalidateToken`) and clears cookie in [`logout`](backend/controllers/customerController.js). See [`invalidateToken`](backend/middleware/authMiddleware.js) and logout flow in [customerController.js](backend/controllers/customerController.js).

 - HSTS (HTTP Strict Transport Security)
  - The backend sends HSTS headers via Helmet (configured in [`securityMiddleware`](backend/middleware/securityMiddleware.js)) in production so browsers remember to only use HTTPS for the site.
  - Auth cookies and sensitive endpoints should then be served only over HTTPS; ensure NODE_ENV=production and secure cookie flags are set in production.

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
- Frontend API clients:
  - Customer: [`api`, `setAuthToken`](customer_frontend/src/interfaces/axiosInstance.js) — [customer_frontend/src/interfaces/axiosInstance.js](customer_frontend/src/interfaces/axiosInstance.js)
  - Employee and Admin: [`api`, `setAuthToken`](employee_frontend/src/interfaces/axiosInstance.js) — [employee_frontend/src/interfaces/axiosInstance.js](employee_frontend/src/interfaces/axiosInstance.js)
- Frontend pages:
  - Customer frontend: [registerCustomer.jsx](customer_frontend/src/pages/registerCustomer.jsx), [login.jsx](customer_frontend/src/pages/login.jsx), [makePayment.jsx](customer_frontend/src/pages/makePayment.jsx), [viewPayments.jsx](customer_frontend/src/pages/viewPayments.jsx)
  - Employee frontend: [login.jsx](employee_frontend/src/pages/login.jsx), [paymentPortal.jsx](employee_frontend/src/pages/paymentPortal.jsx), [paymentHistory.jsx](employee_frontend/src/pages/paymentHistory.jsx), [allEmployees.jsx](employee_frontend/src/pages/allEmployees.jsx), [registerEmployee.jsx](employee_frontend/src/pages/registerEmployee.jsx) 

---

For any code-level questions about a particular file or symbol above, open the file link and reference the symbol name (e.g., see [`createPayment`](backend/controllers/paymentController.js) in [backend/controllers/paymentController.js](backend/controllers/paymentController.js)).


---


## Images of the Testing

![Image](https://github.com/user-attachments/assets/7fc9e014-cea6-409a-8c0f-c319891d1c74)

![Image](https://github.com/user-attachments/assets/bb921d18-b51c-4c05-9cc4-c3e12d0ddbd6)

![Image](https://github.com/user-attachments/assets/3a99d416-2810-4af8-a186-19aa90d64cc9)

![Image](https://github.com/user-attachments/assets/da39db1d-8442-4d34-8fdb-d3ce7da8426f)

https://github.com/user-attachments/assets/0ea96dbd-1230-4086-b80e-adf69308e9a0 




