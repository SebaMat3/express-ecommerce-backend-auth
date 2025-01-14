//api/routes/auth.router.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

const AuthService = require('../services/auth.service');
const service = new AuthService();

router.post('/login',
  passport.authenticate('local', {session: false}),
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
  async (req, res, next) => {
    try{
      const { email } = req.body;
      res.json(service.sendRecovery(email));
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
