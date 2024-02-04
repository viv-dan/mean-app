const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log(req.header.authorization);
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    req.userData = { email: decodedToken.email, userId: decodedToken.userid };
    next();
  } catch (err) {
    res.status(401).json({
      message: "Auth Failed",
    });
  }
};
