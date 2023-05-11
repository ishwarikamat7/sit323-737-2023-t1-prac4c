const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
};

const strategy = new JWTStrategy(jwtOptions, (jwtPayload, next) => {
    // Here you can add your own code to check if the user is authorized
    // based on the data in the JWT payload
    if (jwtPayload.username === 'test') {
        return next(null, { username: 'test' });
    } else {
        return next(null, false);
    }
});

passport.use(strategy);

const authenticate = passport.authenticate('jwt', { session: false });

module.exports = { authenticate };
