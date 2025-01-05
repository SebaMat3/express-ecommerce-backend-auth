//routes/index.js
const express = require('express');

const productsRouter = require('./products.router');
const usersRouter = require('./users.router');
const categoriesRouter = require('./categories.router');
const customersRouter = require('./customers.router');
const ordersRouter = require('./orders.router');
const authRouter = require('./auth.router');

//http://localhost:3000/api/v1
function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/products', productsRouter);
  router.use('/categories', categoriesRouter);
  router.use('/users', usersRouter);
  router.use('/customers', customersRouter);
  router.use('/orders', ordersRouter);
  router.use('/auth', authRouter);
}

module.exports = routerApi;
