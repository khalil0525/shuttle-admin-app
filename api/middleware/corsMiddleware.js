const cors = require('cors');

const corsOptions = {
  origin: [
    'https://occtransport.org',
    'https://occt-dispatch-website-006ef2bb4dfc.herokuapp.com',
    'http://localhost:3000',
    'https://portal.occtransport.org',
  ],
};

const routesWithoutCredentials = [
  '/auth/user/create',
  '/auth/password/recover',
  '/auth/password/check-auth',
  '/auth/password/set',
  '/api/service-updates',
  '/api/service-updates/:routeId',
  '/api/routes',
  '/auth/password/check-auth/:token',
];

const shouldAllowCredentials = (req) => {
  // Check if the route path matches any of the routes that should allow credentials
  return !routesWithoutCredentials.some((route) => {
    const routePattern = new RegExp(`^${route.replace(/:\w+/g, '\\w+')}$`);
    return routePattern.test(req.path);
  });
};

const corsMiddleware = (req, res, next) => {
  // Determine whether to allow credentials based on the custom logic
  const allowCredentials = shouldAllowCredentials(req);
  console.log(allowCredentials);

  // Set credentials option based on the determination
  const options = {
    ...corsOptions,
    credentials: allowCredentials,
  };

  // Allow credentials by setting the appropriate headers
  res.header('Access-Control-Allow-Credentials', 'true');

  // Apply CORS middleware with the updated options
  cors(options)(req, res, next);
};

module.exports = corsMiddleware;
