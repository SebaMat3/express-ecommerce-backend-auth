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

    async sendMail(email){
        const user = await service.findByEmail(email);
        if (!user) {
            throw boom.unauthorized();
        }
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: config.adminEmail,
                pass: config.emailPassword,
            }
        });

        await transporter.sendMail({
            from: config.adminEmail, 
            to: `${user.email}`, 
            subject: "Password Recovery Email", 
            text: "Hello world?", 
            html: "<b>Hello world?</b>",
        });
        return { message: 'mail sent'};
    }
}

module.exports = AuthService;