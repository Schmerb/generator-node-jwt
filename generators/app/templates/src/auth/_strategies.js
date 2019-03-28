import { BasicStrategy } from "passport-http";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { User } from "models/users";
import { JWT_SECRET } from "config";

export const basicStrategy = new BasicStrategy((username, password, fn) => {
  let user;
  User.findOne({ username: username })
    .then(_user => {
      user = _user;
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: "LoginError",
          message: "Incorrect username or password"
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: "LoginError",
          message: "Incorrect username or password"
        });
      }
      return fn(null, user);
    })
    .catch(err => {
      if (err.reason === "LoginError") {
        return fn(null, false, err);
      }
      return fn(err, false);
    });
});

export const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ["HS256"]
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

export default {
  basicStrategy,
  jwtStrategy
};
