import jwt from "jsonwebtoken";

export function validator(req, res, next) {
  const token = req.header("auth-token");

  if (token) {
    try {
      jwt.verify(token, "25D757B6DCB2415EDF5A2C2327316D1D7F02D86C");
      next();
    } catch (err) {
      return res.status(400).json({ error: 400, msg: "Acceso no autorizado." });
    }
  } else {
    return res.status(400).json({ error: 400, msg: "Acceso no autorizado." });
  }
}

export function generate(data) {
  return jwt.sign(data, "25D757B6DCB2415EDF5A2C2327316D1D7F02D86C");
}

export default {
  validator,
  generate,
};
