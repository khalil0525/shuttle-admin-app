const cors = require('cors');

const corsOptions = {
  origin:
    process.env.env === 'production'
      ? [
          'https://bus-routing-portal-prod-18d532a8f2ff.herokuapp.com',
          'https://passenger-site.netlify.app',
        ]
      : ['http://localhost:3000', 'http://localhost:3001'],
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
