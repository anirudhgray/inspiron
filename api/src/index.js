import express from 'express';
import './db/mongoose.js';
import courtCaseRouter from './routers/courtcase.js';
import userRouter from './routers/user.js';

const app = express();
const port = process.env.PORT;

app.use(function (req, res, next) {
  const allowedOrigins = [
    'https://inspiron-speculo.netlify.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Expose-Headers', 'Authorization');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  );
  next();
});
app.use(express.json());
app.use(courtCaseRouter);
app.use(userRouter);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
