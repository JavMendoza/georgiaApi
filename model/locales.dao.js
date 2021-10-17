import mongodb from 'mongodb'
import { conexion } from './database.js'

export async function findAll() {
    return conexion(async function(db){
        return await db.collection("locales").find({}).toArray()
    })
}

export async function insert(entity) {
    return conexion(async function(db){
        await db.collection("locales").insertOne(entity)
        return entity
    })
}

export async function findById(id) {
    return conexion(async function(db){
        return await db.collection("locales").findOne({ _id: mongodb.ObjectId(id)})
    })
}

export async function replaceById(id, entity) {
    return conexion(async function(db){
        return await db.collection("locales").replaceOne(
            { _id: mongodb.ObjectId(id)},
            entity
        )
    })
}

export async function updateById(id, field) {
    return conexion(async function(db){
        return await db.collection("locales").updateOne(
            { _id: mongodb.ObjectId(id)},
            { $set: field }
        )
    })
}

export async function deleteById(id) {
    return conexion(async function(db){
        return await db.collection("locales").updateOne(
            { _id: mongodb.ObjectId(id)},
            { $set: { "deleted": true } }
        )
    })
}

export async function findMatafuegosByLocalId(localId) {
    return conexion(async function(db){
        return await db.collection("matafuegos").find({ local: localId }).toArray();
    })
}


export default {
    findAll,
    insert,
    findById,
    replaceById,
    updateById,
    deleteById,
    findMatafuegosByLocalId,
}


