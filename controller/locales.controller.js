import dao from '../model/locales.dao.js'

export function findAll(req, res){
    dao.findAll()
    .then(function(locales) {
        res.status(200).json(locales)
    })
    .catch(function(err){
        res.status(500).json({err: 500, msg: err.message })
    })
}

export function create(req, res){
    dao.insert(req.body)
    .then(function(local){
        res.status(200).json(local)
    })
    .catch(function(err){
        res.status(500).json({err: 500, msg: err.message })
    })
}

export function findById(req, res) {
    dao.findById(req.params.id)
    .then(function(local){
        res.status(200).json(local)
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

export function findMatafuegosInLocal(req, res) {
    dao.findMatafuegosByLocalId(req.params.id)
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
    findMatafuegosInLocal,
}