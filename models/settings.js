const Sequelize = require('sequelize');
const Database = require('../struct/Database');

const Setting = Database.db.define('settings', {
  guildID: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  settings: {
    type: Sequelize.JSONB,
    allowNull: false,
    default: {},
  },
});

module.exports = Setting;
