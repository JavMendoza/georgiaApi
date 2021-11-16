import mongodb from 'mongodb'
import { conexion } from './database.js';
import CustomError from '../utils/CustomError.js'; 

export async function findAll() {
    return conexion(async function(db){
        return await db.collection("usuarios").find({}).toArray()
    })
}

export async function insert(user) {
    return conexion(async function(db) {
        const { password, ...userDetails } = user; 
        const usuarioAlreadyCreated = await db.collection("usuarios").findOne({ $or: [{ email: userDetails.email }, { cuit: userDetails.cuit }] });
        if (usuarioAlreadyCreated) {
            return Promise.reject(new CustomError(409, 'Usuario existente'));		
        }
        const usuarioResult = await db.collection("usuarios").insertOne(userDetails);
        await db.collection("login").insertOne({ usuario_id: mongodb.ObjectId(usuarioResult.insertedId), email: userDetails.email, password });
        return {
            ...userDetails,
            _id: usuarioResult.insertedId
        }
    })
}

export async function findById(id) {
    return conexion(async function(db){
        return await db.collection("usuarios").findOne({ _id: mongodb.ObjectId(id)})
    })
}

export async function replaceById(id, entity) {
    return conexion(async function(db){
        const { email, password } = field;
        await db.collection("usuarios").replaceOne(
            { _id: mongodb.ObjectId(id)},
            entity
        )

        if (email && password) {
            await db.collection("login").updateOne(
                { usuario_id: mongodb.ObjectId(id)},
                { $set: { email, password } }
            )
        }

        return { entity };
    })
}

export async function updateById(id, field) {
    return conexion(async function(db){
        const { email, password } = field;
        await db.collection("usuarios").updateOne(
            { _id: mongodb.ObjectId(id)},
            { $set: field }
        )

        if (email || password) {
            await db.collection("login").updateOne(
                { usuario_id: mongodb.ObjectId(id)},
                { 
                    $set: email ? { email } : { password }
                }
            )
        }
        return { id };
    })
}

export async function deleteById(id) {
    return conexion(async function(db){
        await db.collection("usuarios").updateOne(
            { _id: mongodb.ObjectId(id)},
            { $set: { "deleted": true } }
        )
        await db.collection("login").updateOne(
            { usuario_id: mongodb.ObjectId(id)},
            { $set: { "deleted": true } }
        )
        return { id };
    })
}

export async function findPedidosByUserId(usuario_id) {
    return conexion(async function(db){
        return await db.collection("pedidos").find({ $or: [{ "cliente._id": mongodb.ObjectId(usuario_id) }, { "repartidor._id": mongodb.ObjectId(usuario_id) }] , "deleted": { $ne: true } }).toArray();
    })
}

export async function findMatafuegosByUserId(usuario_id) {
    return conexion(async function(db){
        return await db.collection("matafuegos").find({ "usuario_id": mongodb.ObjectId(usuario_id) }).toArray();
    })
}


export default {
    findAll,
    insert,
    findById,
    replaceById,
    updateById,
    deleteById,
    findPedidosByUserId,
    findMatafuegosByUserId,
}


