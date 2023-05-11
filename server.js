const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { authenticate } = require('./auth');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
};

const strategy = new JWTStrategy(jwtOptions, (jwtPayload, next) => {
  if (jwtPayload.username === 'test') {
      return next(null, { username: 'test' });
  } else {
      return next(null, false);
  }
});

passport.use(strategy);

app.get('/', (req, res) => {
    res.json({ message: 'Hello world' });
});

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'You have access to this protected route' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'test' && password === 'test') {
      const token = jwt.sign({ username: 'test' }, 'secret');
      res.json({ token });
  } else {
      res.status(401).json({ message: 'Unauthorized' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});