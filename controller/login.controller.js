import dao from '../model/login.dao.js';
import { generate } from "../middleware/tokenValidator.js";

export function findUser(req, res){
    dao.findUser(req.body)
    .then(function(usuario) {
      const token = generate(usuario);
      res.status(200).json({
        token,
        usuario
      });
    })
    .catch(function(err) {
        if (err.code) {
          res.status(err.code).json({err: err.code, msg: err.message });
        } else {
          res.status(500).json({err: 500, msg: err.message })
        }
    })
}

export default {
  findUser,
}