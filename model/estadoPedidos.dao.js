import mongodb from 'mongodb'
import { conexion } from './database.js'

export async function findAll() {
    return conexion(async function(db){
        return await db.collection("estado_pedidos").find({}).toArray()
    })
}

export async function insert(entity) {
    return conexion(async function(db){
        await db.collection("estado_pedidos").insertOne(entity)
        return entity
    })
}

export async function findById(id) {
    return conexion(async function(db){
        return await db.collection("estado_pedidos").findOne({ _id: mongodb.ObjectId(id)})
    })
}

export async function replaceById(id, entity) {
    return conexion(async function(db){
        return await db.collection("estado_pedidos").replaceOne(
            { _id: mongodb.ObjectId(id)},
            entity
        )
    })
}

export async function updateById(id, field) {
    return conexion(async function(db){
        return await db.collection("estado_pedidos").updateOne(
            { _id: mongodb.ObjectId(id)},
            { $set: field }
        )
    })
}

export async function deleteById(id) {
    return conexion(async function(db){
        return await db.collection("estado_pedidos").updateOne(
            { _id: mongodb.ObjectId(id)},
            { $set: { "deleted": true } }
        )
    })
}


export default {
    findAll,
    insert,
    findById,
    replaceById,
    updateById,
    deleteById
}


