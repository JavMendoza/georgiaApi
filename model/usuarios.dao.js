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
        await db.collection("inicio_sesion").insertOne({ usuario_id: usuarioResult.insertedId.toString(), email: userDetails.email, password });
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
        return await db.collection("usuarios").replaceOne(
            { _id: mongodb.ObjectId(id)},
            entity
        )
    })
}

export async function updateById(id, field) {
    return conexion(async function(db){
        return await db.collection("usuarios").updateOne(
            { _id: mongodb.ObjectId(id)},
            { $set: field }
        )
    })
}

export async function deleteById(id) {
    return conexion(async function(db){
        await db.collection("usuarios").updateOne(
            { _id: mongodb.ObjectId(id)},
            { $set: { "deleted": true } }
        )
        await db.collection("inicio_sesion").updateOne(
            { usuario_id: id},
            { $set: { "deleted": true } }
        )
        return { id };
    })
}

export async function findPedidosByUserId(userId) {
    return conexion(async function(db){
        return await db.collection("pedidos").find({ "usuario._id": mongodb.ObjectId(userId), "deleted": { $ne: true } }).toArray();
    })
}

export async function findMatafuegosByUserId(userId) {
    return conexion(async function(db){
        return await db.collection("matafuegos").find({ "usuario": userId }).toArray();
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


