// the path '/api' is a proxy to the backend server for RESTful API
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_http_server,
      changeOrigin: true,
    })
  );
};