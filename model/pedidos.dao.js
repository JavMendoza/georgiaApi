import mongodb from 'mongodb'
import { conexion } from './database.js'

export async function findAll(filter) {
    return conexion(async function(db){
        let result;
        const filterSplitted = filter ? filter.split(":") : '';
        if (filterSplitted) {
            result = await db.collection("pedidos").find({ deleted: { $ne: true }, "estado.sub_estado": filterSplitted[1] }).toArray();
        } else {
            result = await db.collection("pedidos").find({ deleted: { $ne: true } }).toArray();
        }
        return result;
    })
}

async function getLocalRelatedWithMatafuegos(matafuegos, db) {
    const localesArrayIds = matafuegos.reduce((acc, matafuego) => {
        if (matafuego.local_id) {
            acc.push(mongodb.ObjectId(matafuego.local_id));
        }
        return acc;
    }, []);
        
    const locales = await db.collection("locales").find({ _id: { $in: localesArrayIds }}).toArray();

    return matafuegos.map(matafuego => {
        const { local_id, ...rest } = matafuego;
        const local = local_id && locales.find(local => local_id.equals(local._id));
        return {
            ...rest,
            local,
        }
    });
}

async function getMatafuegosDetails(matafuegos, db) {
    const matafuegosObjectIdsArr = matafuegos.map(matafuego => mongodb.ObjectId(matafuego));
    return await db.collection("matafuegos").find({ _id: { $in: matafuegosObjectIdsArr } }).toArray();
}

function mockFecha (fecha, daysInTheFuture) {
    let mockFecha;
    if (fecha) {
        mockFecha = new Date(fecha);
    } else {
        mockFecha = new Date();
        mockFecha.setDate(mockFecha.getDate() + daysInTheFuture);
    }
    return mockFecha;
}

export async function insert(entity) {
    return conexion(async function(db) {
        const { 
            cliente_id,
            repartidor_id, 
            matafuegos,
            tipo,
            estado,
            fecha_retiro, 
            fecha_entrega,
            ...rest 
        } = entity; 
        let repartidor = null;

        const tipo_pedido = await db.collection("tipo_pedidos").findOne({ nombre: tipo });
        const estado_pedido = await db.collection("estado_pedidos").findOne({ nombre: estado });
        
        const mockRetiro = mockFecha(fecha_retiro, 2);
        const mockEntrega = mockFecha(fecha_entrega, 4);

        const cliente = await db.collection("usuarios").findOne({ _id: mongodb.ObjectId(cliente_id) });
        if (repartidor_id) {
            repartidor = await db.collection("usuarios").findOne({ _id: mongodb.ObjectId(repartidor_id) });
        }
        const matafuegosDetails = await getMatafuegosDetails(matafuegos, db);
        const matafuegosFullDetails = await getLocalRelatedWithMatafuegos(matafuegosDetails, db);

        const pedidoFullDetails = {
            cliente,
            repartidor,
            tipo: tipo_pedido,
            estado: estado_pedido,
            fecha_pedido: new Date(),
            fecha_retiro: mockRetiro,
            fecha_entrega: mockEntrega,
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
        const estado = await db.collection("estado_pedidos").findOne({ nombre: field.estado });
        await db.collection("pedidos").updateOne(
            { _id: mongodb.ObjectId(id)},
            { $set: { 
                estado,
                fecha_retiro: new Date(field.fecha_retiro),
                fecha_entrega: new Date(field.fecha_entrega),
            } }
        )

        return await db.collection("pedidos").findOne({ _id: mongodb.ObjectId(id)})
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


