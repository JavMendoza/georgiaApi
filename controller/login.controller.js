import dao from '../model/login.dao.js'

export function findUser(req, res){
    dao.findUser(req.body)
    .then(function(usuario){
        res.status(200).json(usuario)
    })
    .catch(function(err){
        res.status(500).json({err: 500, msg: err.message })
    })
}

export default {
  findUser,
}