import mongodb from 'mongodb'
import bcrypt from 'bcrypt';
import { conexion } from './database.js';
import CustomError from '../utils/CustomError.js'; 

export async function findAll(filter) {
    return conexion(async function(db) {
        let result;
        const filterSplitted = filter ? filter.split(":") : '';
        if (filterSplitted) {
            result = await db.collection("usuarios").find({ "rol": filterSplitted[1] }).toArray();
        } else {
            result = await db.collection("usuarios").find({}).toArray()
        }
        return result;
    })
}

export async function insert(user) {
    return conexion(async function(db) {
        const { password, ...userDetails } = user; 

        const userOld = await db.collection("usuarios").findOne({ $or: [{ email: userDetails.email }, { cuit: userDetails.cuit }] });

        if (!userOld) {
          const salt = await bcrypt.genSalt(10);
          const passwordHashed = await bcrypt.hash(password, salt);

          const usuarioResult = await db.collection("usuarios").insertOne(userDetails);

          await db.collection("login").insertOne({ usuario_id: mongodb.ObjectId(usuarioResult.insertedId), email: userDetails.email, password: passwordHashed });
          
          return {
              ...userDetails,
              _id: usuarioResult.insertedId,
          } 		
        } else {
          return Promise.reject(new CustomError(409, 'El usuario ya existe'));
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


