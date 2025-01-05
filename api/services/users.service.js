//api/services/users.services.js
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');

const { models } = require( '../libs/sequelize');

class UserService {
  constructor() {}

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password:hash,
    });
    delete newUser.dataValues.password
    return newUser;
  }

  async find() {
    const res = await models.User.findAll({
      include: ['customer']
    });
    return res;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('User not found');
    };
    return user;
  }
  
  async findByEmail(email) {
    const user = await models.User.findOne({
      where: { email }
    });
    if (!user) {
      throw boom.notFound('User not found');
    };
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const res = await user.update(changes);
    return res;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

module.exports = UserService;
