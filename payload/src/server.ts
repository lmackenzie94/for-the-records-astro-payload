import express from 'express';
import path from 'path';
import payload from 'payload';

require('dotenv').config();
const app = express();

// we can serve assets from the same express app as Payload is using...
app.use('/assets', express.static(path.resolve(__dirname, './assets')));

app.get('/', (_, res) => {
  res.redirect('/admin');
});

payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,
  express: app,
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
  }
});

app.use('/media', express.static('media'));
app.listen(process.env.PAYLOAD_PORT);
