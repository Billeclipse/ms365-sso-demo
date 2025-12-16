// Configuration for database and Azure AD authentication.
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    database: process.env.DB_NAME || 'ms365db',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'mysql',
    dialect: 'mysql'
  },
  auth: {
    tenantID: process.env.AZURE_AD_TENANT_ID || 'your-tenant-id-here',
    clientID: process.env.AZURE_AD_CLIENT_ID || 'your-server-client-id',
    audience: process.env.AZURE_AD_API_AUDIENCE || 'api://your-server-client-id',
    // For multi-tenant applications you can allow multiple issuers separated by comma.
    issuer: process.env.AZURE_AD_ISSUER || `https://sts.windows.net/${process.env.AZURE_AD_TENANT_ID}/`
  }
};