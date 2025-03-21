const passport = require('passport');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'adminloop123'

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);

      
      const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, {
        expiresIn: '1h'
      });

      return res.json({ message: 'Login successful', user: { id: user.id, username: user.username, token: token  } });
    });
  })(req, res, next);
};
