const jwt = require("jsonwebtoken");
const secret = "$uperMan@123";

// fn will take user object & generate user token
function createTokenForUser(user) {
  const payload = {
    _id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

// fn will take token & validate the token
// decode token and return payload as a decoded token
function validateToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
