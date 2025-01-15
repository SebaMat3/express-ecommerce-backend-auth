//api/routes/auth.router.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

const AuthService = require('../services/auth.service');
const service = new AuthService();
const validatorHandler = require('./../middlewares/validator.handler');
const { loginSchema, recoverySchema, changePasswordSchema } = require('./../schemas/auth.schema');

router.post('/login',
  passport.authenticate('local', {session: false}),
  validatorHandler(loginSchema, 'body'),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json(service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

router.post('/recovery',
  validatorHandler(recoverySchema, 'body'),
  async (req, res, next) => {
    try{
      const { email } = req.body;
      const result = await service.sendRecovery(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/change-password',
  //add data validation layer (using joi)
  validatorHandler(changePasswordSchema, 'body'),
  async (req, res, next) => {
    try{
      const { token, newPassword } = req.body;
      const result = await service.changePassword(token, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
