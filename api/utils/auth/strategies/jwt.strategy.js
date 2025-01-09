//api/utils/auth/strategies/jwt.strategy.js

const { Strategy, ExtractJwt } = require('passport-jwt');
const { config } = require('../../../config/config.js')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}

const JwtStrategy = new Strategy(options, (payload, done) =>{
    console.log(payload);
    done(null, payload);
})

module.exports = JwtStrategy;