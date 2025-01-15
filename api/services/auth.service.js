//api/services/auth.service.js
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { config } = require('../config/config.js');

const UserService = require('./users.service');
const service = new UserService();

class AuthService {

    async getUser(email, password){
        const user = await service.findByEmail(email);
        if (!user) {
            throw boom.unauthorized();
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw boom.unauthorized();
        }
        delete user.dataValues.password;
        delete user.dataValues.recoveryToken;
        return user;
    }

    signToken(user){
        const payload = {
            sub : user.id,
            role: user.role
        }
        const token = jwt.sign(payload, config.jwtSecret);
        return{
            user,
            token
        };
    };

    async sendRecovery(email){
        const user = await service.findByEmail(email);
        if (!user) {
            throw boom.unauthorized();
        }

        // Check for existing valid token
        if (user.recoveryToken) {
            try {
                jwt.verify(user.recoveryToken, config.jwtSecret);
                throw boom.conflict('You already have an active recovery token. Please wait before requesting a new one.');
            } catch (error) {
                // If token verification fails (expired), continue with new token generation
                if (error.name !== 'JsonWebTokenError') {
                    throw error;
                }
            }
        }

        const payload = {sub : user.id}
        const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'});
        const link = `http://www.myfrontend.com/recovery?token=${token}`;
        await service.update(user.id, {recoveryToken: token});
        const mail = {
            from: config.adminEmail, 
            to: `${user.email}`, 
            subject: "Email para recuperar contraseña", 
            html: `<b>Ingresa al link para resetear tu contraseña=> ${link}</b>`,
        }
        const result = await this.sendMail(mail);
        return result;
    } 

    async changePassword(token, newPassword) {
        try {
            const payload = jwt.verify(token, config.jwtSecret);
            const user = await service.findOne(payload.sub);
            if (user.recoveryToken !== token) {
                throw boom.unauthorized();
            }
            const hash = await bcrypt.hash(newPassword, 10);
            await service.update(user.id, {recoveryToken: null, password: hash});
            return { message: 'Password changed.' };
        } catch (error) {
            throw boom.unauthorized();
        }
    }

    async sendMail(infoMail){
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: config.adminEmail,
                pass: config.emailPassword,
            }
        });
        await transporter.sendMail(infoMail);
        return { message: 'mail sent'};
    }
}

module.exports = AuthService;