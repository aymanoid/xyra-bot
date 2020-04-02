const Sequelize = require('sequelize');
const path = require('path');

const readdir = require('util').promisify(require('fs').readdir);
const Logger = require('../util/Logger');

const db = new Sequelize(process.env.DBURL, { logging: false });

class Database {
  static get db() {
    return db;
  }

  static async authenticate() {
    try {
      await db.authenticate();
      Logger.info('Connection to database has been established successfully.', {
        tag: 'Postgres',
      });
      await this.loadModels(path.join(__dirname, '..', 'models'));
    } catch (err) {
      Logger.error('Unable to connect to the database:', { tag: 'Postgres' });
      Logger.stacktrace(err, { tag: 'Postgres' });
      Logger.info('Attempting to connect again in 5 seconds...', {
        tag: 'Postgres',
      });
      setTimeout(this.authenticate, 5000);
    }
  }

  static async loadModels(modelsPath) {
    const files = await readdir(modelsPath);

    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      const filePath = path.join(modelsPath, file);
      // eslint-disable-next-line no-continue
      if (!filePath.endsWith('.js')) continue;
      // eslint-disable-next-line global-require, import/no-dynamic-require
      await require(filePath).sync(); // eslint-disable-line no-await-in-loop
    }
  }
}

module.exports = Database;
