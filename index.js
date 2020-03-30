import 'dotenv/config';
import XyraClient from './client';

const client = new XyraClient();
const token = process.env.TOKEN;
client.start(token);

process.on('unhandledRejection', (err) => console.error(err)); // eslint-disable-line no-console
