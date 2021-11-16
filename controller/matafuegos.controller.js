import dao from '../model/matafuegos.dao.js'

export function findAll(req, res){
    dao.findAll()
    .then(function(matafuegos) {
        res.status(200).json(matafuegos)
    })
    .catch(function(err){
        res.status(500).json({err: 500, msg: err.message })
    })
}

export function create(req, res){
    dao.insert(req.body)
    .then(function(matafuego){
        res.status(200).json(matafuego)
    })
    .catch(function(err){
        if (err.code === 404) {
            res.status(err.code).json({err: err.code, msg: err.message })
        } else {
            res.status(500).json({err: 500, msg: err.message })
        }
    })
}

export function findById(req, res) {
    dao.findById(req.params.id)
    .then(function(matafuego){
        res.status(200).json(matafuego)
    })
    .catch(function(err) {
        if (err.code === 404) {
            res.status(err.code).json({err: err.code, msg: err.message })
        } else {
            res.status(500).json({err: 500, msg: err.message })
        }
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


export default {
    findAll,
    create,
    findById,
    putById,
    patchById,
    deleteById,
}