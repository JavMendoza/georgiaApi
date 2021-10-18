import { conexion } from './database.js'

export async function findUser(entity) {
    return conexion(async function(db){
        const userLogin = await db.collection("inicio_sesion").findOne({ email: entity.email, password: entity.password })
        const usuario = await db.collection("usuarios").findOne({ email: userLogin.email });
        return usuario;
    })
}


export default {
  findUser,
}


