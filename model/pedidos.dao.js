import mongodb from 'mongodb'
import { conexion } from './database.js'

export async function findAll() {
    return conexion(async function(db){
        return await db.collection("pedidos").find({}).toArray()
    })
}

async function getMatafuegosFullDetails(matafuegos, db) {
    const localesArrayIds = matafuegos.map(matafuego => mongodb.ObjectId(matafuego.local));
        
    const locales = await db.collection("locales").find({ _id: { $in: localesArrayIds }}).toArray();

    return matafuegos.map(matafuego => {
        const local = locales.find(local => local._id.toString() === matafuego.local);
        return {
            ...matafuego,
            local,
        }
    });
}

export async function insert(entity) {
    return conexion(async function(db) {
        /*
            const { userId, tipo_pedido, estado_pedido, fecha_retiro, fecha_entrega,  ...rest } = entity;
        
            const user = await db.collection("usuarios").findOne({ _id: mongodb.ObjectId(userId) });
            const tipo = await db.collection("tipo_pedidos").findOne({ nombre: tipo_pedido });
            const estado = await db.collection("estado_pedidos").findOne({ nombre: estado_pedido });

            await db.collection("matafuegos").find({ _id: { $in:  } }).toArray(); 
        

            const pedidoFullDetails = {
                usuario: user,
                tipo_pedido: tipo,
                estado_pedido: estado,
                fecha_pedido: new Date(),
                fecha_retiro: new Date(fecha_retiro),
                fecha_entrega: new Date(fecha_entrega),
                ...rest
            }
        */

        const { usuarioId, fecha_retiro, fecha_entrega, matafuegos, ...rest } = entity; 

        const user = await db.collection("usuarios").findOne({ _id: mongodb.ObjectId(usuarioId) });

        const matafuegosFullDetails = await getMatafuegosFullDetails(matafuegos, db);
        
        const pedidoFullDetails = {
            usuario: user,
            fecha_pedido: new Date(),
            fecha_retiro: new Date(fecha_retiro),
            fecha_entrega: new Date(fecha_entrega),
            matafuegos: matafuegosFullDetails,
            ...rest
        }

        await db.collection("pedidos").insertOne(pedidoFullDetails)
        return pedidoFullDetails;
    })
}

export async function findById(id) {
    return conexion(async function(db){
        return await db.collection("pedidos").findOne({ _id: mongodb.ObjectId(id)})
    })
}

export async function replaceById(id, entity) {
    return conexion(async function(db){
        return await db.collection("pedidos").replaceOne(
            { _id: mongodb.ObjectId(id)},
            entity
        )
    })
}

export async function updateById(id, field) {
    return conexion(async function(db){
        return await db.collection("pedidos").updateOne(
            { _id: mongodb.ObjectId(id)},
            { $set: field }
        )
    })
}

export async function deleteById(id) {
    return conexion(async function(db){
        return await db.collection("pedidos").updateOne(
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

