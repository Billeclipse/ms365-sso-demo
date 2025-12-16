const passport = require('passport');
const { BearerStrategy } = require('passport-azure-ad');
const config = require('./config');

// Configure the BearerStrategy used by Passport.
// This will validate tokens issued by Azure AD for our API.
const bearerStrategy = new BearerStrategy(
  {
    identityMetadata: `https://login.microsoftonline.com/${config.auth.tenantID}/v2.0/.well-known/openid-configuration`,
    clientID: config.auth.clientID,
    audience: config.auth.audience,
    validateIssuer: true,
    loggingLevel: 'info',
    passReqToCallback: false
  },
  (token, done) => {
    // Called when a token has been validated. You can perform additional
    // authorization checks here, such as verifying scopes.
    return done(null, token);
  }
);

passport.use(bearerStrategy);

// Initialize Passport. Should be added to Express app.
function initialize(app) {
  app.use(passport.initialize());
}

// Middleware to require authentication for API routes.
function requireAuth(scopes = []) {
  return (req, res, next) => {
    passport.authenticate('oauth-bearer', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // If scopes were provided, ensure the token contains required scopes.
      if (scopes.length) {
        const tokenScopes = user.scp ? user.scp.split(' ') : [];
        const hasAllScopes = scopes.every(scope => tokenScopes.includes(scope));
        if (!hasAllScopes) {
          return res.status(403).json({ error: 'Forbidden: insufficient scopes' });
        }
      }
      // Attach user (token) to request for downstream use
      req.user = user;
      return next();
    })(req, res, next);
  };
}

module.exports = {
  initialize,
  requireAuth
};