import dao from '../model/usuarios.dao.js'

export function findAll(req, res){
    dao.findAll()
    .then(function(usuarios) {
        res.status(200).json(usuarios)
    })
    .catch(function(err){
        res.status(500).json({err: 500, msg: err.message })
    })
}

export function create(req, res){
    dao.insert(req.body)
    .then(function(usuario){
        res.status(200).json(usuario);
    })
    .catch(function(err) {
        res.status(err.code).json({ err: err.code, msg: err.message })
    })
}

export function findById(req, res) {
    dao.findById(req.params.id)
    .then(function(usuario){
        res.status(200).json(usuario)
    })
    .catch(function(err) {
        res.status(500).json({err: 500, msg: err.message })
    })
}

export function putById(req, res){
    dao.replaceById(req.params.id, req.body)
    .then(function(result){
        res.status(200).json(result)
    })
    .catch(function(err){
        res.status(500).json({err: 500, msg: err.message })
    })
}

export function patchById(req, res){
    dao.updateById(req.params.id, req.body)
    .then(function(result){
        res.status(200).json(result)
    })
    .catch(function(err){
        res.status(500).json({err: 500, msg: err.message })
    })
}

export function deleteById(req, res){
    dao.deleteById(req.params.id)
    .then(function(result){
        res.status(200).json(result)
    })
    .catch(function(err){
        res.status(500).json({err: 500, msg: err.message })
    })
}

export function findPedidosFromUser(req, res) {
    dao.findPedidosByUserId(req.params.id)
    .then(function(pedidos){
        res.status(200).json(pedidos)
    })
    .catch(function(err){
        res.status(500).json({err: 500, msg: err.message })
    })
}

export function findMatafuegosFromUser(req, res) {
    dao.findMatafuegosByUserId(req.params.id)
    .then(function(matafuegos){
        res.status(200).json(matafuegos)
    })
    .catch(function(err){
        res.status(500).json({err: 500, msg: err.message })
    })
}


export default {
    findAll,
    create,
    findById,
    putById,
    patchById,
    deleteById,
    findPedidosFromUser,
    findMatafuegosFromUser,
}