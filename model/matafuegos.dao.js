import mongodb from 'mongodb'
import { conexion } from './database.js'

export async function findAll() {
    return conexion(async function(db){
        return await db.collection("matafuegos").find({}).toArray()
    })
}

export async function insert(entity) {
    return conexion(async function(db){
        const { fecha_vencimiento, ...rest } = entity;
        const entityToSave = {
            fecha_vencimiento: new Date(fecha_vencimiento),
            ...rest
        }
        const result = await db.collection("matafuegos").insertOne(entityToSave);
        return {
            ...entityToSave,
            _id: result.insertedId
        }
    })
}

export async function findById(id) {
    return conexion(async function(db){
        return await db.collection("matafuegos").findOne({ _id: mongodb.ObjectId(id)})
    })
}

export async function replaceById(id, entity) {
    return conexion(async function(db){
        return await db.collection("matafuegos").replaceOne(
            { _id: mongodb.ObjectId(id)},
            entity
        )
    })
}

export async function updateById(id, field) {
    return conexion(async function(db){
        return await db.collection("matafuegos").updateOne(
            { _id: mongodb.ObjectId(id)},
            { $set: field }
        )
    })
}

export async function deleteById(id) {
    return conexion(async function(db){
        return await db.collection("matafuegos").updateOne(
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


