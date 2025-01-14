//api/libs/sequelize.js

const { Sequelize } = require('sequelize');
require('dotenv').config();
const { config } = require('./../config/config');
const { setupModels } = require('./../db/models');
const path = require('path');

const options = {
  dialect: 'postgres',
  logging: config.isProd ? false : console.log,
  migrationStorageTableName: 'migrations',
  migrationPath: path.resolve('api/db/migrations')
}

if (config.isProd) {
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

const sequelize = new Sequelize (config.dbUrl, options)

setupModels(sequelize);

module.exports = sequelize;
