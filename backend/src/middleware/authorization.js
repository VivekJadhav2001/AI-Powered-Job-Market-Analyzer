import jwt from "jsonwebtoken";

function authorization(req, res, next) {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME];

    if (!token) {
      return res.error(401, "Please login to access this request");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded?.id) {
      return res.error(403, "Token not valid, You Are Forbidden To Access This Request !!");
    }

    req.userDecoded = decoded;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.error(401, "Invalid or expired token");
    }

    next(error);
  }
}

export { authorization };
