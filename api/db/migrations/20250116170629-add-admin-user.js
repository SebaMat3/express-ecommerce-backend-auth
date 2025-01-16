'use strict';
const bcrypt = require('bcrypt');

const USER_TABLE = 'users';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash('powerPilgrim', 10);
    
    await queryInterface.bulkInsert(USER_TABLE, [{
      email: process.env.ADMIN_EMAIL,
      password: hash,
      role: 'admin',
      created_at: new Date(),
    }], {});
  },

  async down(queryInterface) {
    // Remove the admin user in case of rollback
    await queryInterface.bulkDelete(USER_TABLE, {
      email: process.env.ADMIN_EMAIL
    }, {});
  }
};
