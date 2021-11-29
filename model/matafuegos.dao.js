import mongodb from 'mongodb'
import { conexion } from './database.js'

export async function findAll() {
    return conexion(async function(db){
        return await db.collection("matafuegos").find({}).toArray()
    })
}

function getFechaVencimiento(fecha_adquisicion, fecha_vencimiento) {
    let mockFecha;
    if (fecha_vencimiento) {
        mockFecha = new Date(fecha_vencimiento);
    } else {
        mockFecha = new Date(fecha_adquisicion);
        mockFecha.setFullYear(mockFecha.getFullYear() + 1); // Los matafuegos tienen una vigencia de un anio, pasado ese tiempoo es necesario hacer una RECARGA y mantenimiento obligatoria
    }
    return mockFecha;
}

function getFechaCaducidadTotal(fechaAdquisicion, fecha_caducidad_total) {
    let mockFecha;
    if (fecha_caducidad_total) {
        mockFecha = new Date(fecha_caducidad_total);
    } else {
        mockFecha = new Date(fechaAdquisicion);
        mockFecha.setFullYear(mockFecha.getFullYear() + 20);
    }
    return mockFecha;
}

export async function insert(entity) {
    return conexion(async function(db){
        const { fecha_adquisicion, fecha_vencimiento, fecha_caducidad_total, usuario_id, local_id, ...rest } = entity;

        // TODO: MAYBE VALID THAT THE USER EXISTS AND THAT THE LOCAL EXISTS JUST MAYBE
        const usuarioOwnerMatafuego = db.collection("usuarios").findOne({ _id: mongodb.ObjectId(usuario_id) });

        if (!usuarioOwnerMatafuego) {
            throw {
                code: 404,
                message: `No se encontro un usuario con el id ${usuario_id}`
            }
        }

        const fechaAdquisicion = fecha_adquisicion ? new Date(fecha_adquisicion) : new Date();
        const fechaVencimientoResult = getFechaVencimiento(fechaAdquisicion, fecha_vencimiento);
        const fechaCaducidadTotal = getFechaCaducidadTotal(fechaAdquisicion, fecha_caducidad_total);

        const entityToSave = {
            fecha_adquisicion: fechaAdquisicion,
            fecha_vencimiento_mantenimiento: fechaVencimientoResult,
            fecha_caducidad_total: fechaCaducidadTotal,
            usuario_id: mongodb.ObjectId(usuario_id),
            local_id: local_id ? mongodb.ObjectId(local_id) : null, 
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
    return conexion(async function(db) {
        const matafuego = await db.collection("matafuegos").findOne({ _id: mongodb.ObjectId(id)});
        const usuario = await db.collection("usuarios").findOne({ _id: mongodb.ObjectId(matafuego.usuario_id) });
        if (!matafuego) {
            throw {
                code: 404,
                message: `No se encontro un matafuego con el id ${id}`
            }
        }
        const { usuario_id, ...rest } = matafuego;
        return {
            ...rest,
            usuario
        };
    })
}

export async function replaceById(id, entity) {
    return conexion(async function(db){
        // TODO: Validation we need all the data in order to make a replace otherwise we might loose some data.
        
        const entityModified = {
            ...entity,
            fecha_adquisicion: new Date(entity.fecha_adquisicion),
            fecha_vencimiento_mantenimiento: new Date(entity.fecha_vencimiento_mantenimiento),
            fecha_caducidad_total: new Date(entity.fecha_caducidad_total),
            usuario_id: mongodb.ObjectId(entity.usuario_id),
            local_id: mongodb.ObjectId(entity.local_id)
        }
        return await db.collection("matafuegos").replaceOne(
            { _id: mongodb.ObjectId(id)},
            entityModified
        )
    })
}

export async function updateById(id, field) {
    return conexion(async function(db){
        if (field.usuario_id) {
            field.usuario_id = mongodb.ObjectId(field.usuario_id);
        } else if (field.local_id) {
            field.local_id = mongodb.ObjectId(field.local_id);
        }
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

async function findMatafuegosByLocalId(local_id) {
    return conexion(async function(db){
        return await db.collection("matafuegos").find({ local: local_id }).toArray();
    })
}


export default {
    findAll,
    insert,
    findById,
    replaceById,
    updateById,
    deleteById,
    findMatafuegosByLocalId
}


