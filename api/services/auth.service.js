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