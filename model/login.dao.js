import { conexion } from './database.js'

export async function findUser(entity) {
    return conexion(async function(db){
        const user = await db.collection("inicio_sesion").findOne({ email: entity.email, password: entity.password })
        return { email: user.email };
    })
}


export default {
  findUser,
}


