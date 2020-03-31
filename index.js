import 'dotenv/config';
import moment from 'moment-timezone';
import XyraClient from './client';

moment.tz.setDefault('UTC');

const client = new XyraClient();
const token = process.env.TOKEN;
client.start(token);

process.on('unhandledRejection', (err) => console.error(err)); // eslint-disable-line no-console
