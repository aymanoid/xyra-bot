import 'dotenv/config';
import './extenders/GuildMember';
import moment from 'moment-timezone';
import * as Sentry from '@sentry/node';
import XyraClient from './struct/XyraClient';
import Logger from './util/Logger';

moment.tz.setDefault('UTC');

const client = new XyraClient(process.env);

if (process.env.SENTRY_KEY) {
  Sentry.init({ dsn: process.env.SENTRY_KEY });
}

client
  .on('disconnect', () => Logger.warn('Connection lost...'))
  .on('reconnect', () => Logger.info('Attempting to reconnect...'))
  .on('error', (err) => Logger.error(err))
  .on('warn', (info) => Logger.warn(info));

client.start();

process.on('unhandledRejection', (err) => {
  Logger.error('An unhandled promise rejection occured');
  Logger.stacktrace(err);
});
