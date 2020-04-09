const Sequelize = require('sequelize');
const path = require('path');

const readdir = require('util').promisify(require('fs').readdir);
const Logger = require('../util/Logger');

const db = new Sequelize(
  `postgres://postgres:postgres@127.0.0.1:5432/xyra-db`,
  { logging: false }
);

class Database {
  static get db() {
    return db;
  }

  static async connect() {
    await db.authenticate();
    Logger.info('Connection to database has been established successfully.', {
      tag: 'Postgres',
    });
    await this.loadModels(path.join(__dirname, '..', 'models'));
  }

  static async authenticate() {
    let retries = 30;
    while (retries) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await this.connect();
        break;
      } catch (err) {
        Logger.error('Unable to connect to the database:', { tag: 'Postgres' });
        Logger.stacktrace(err, { tag: 'Postgres' });
        Logger.info('Attempting to connect again in 10 seconds...', {
          tag: 'Postgres',
        });
        retries -= 1;
        Logger.info(`Retries left: ${retries}`, {
          tag: 'Postgres',
        });
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => setTimeout(res, 10000));
      }
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
