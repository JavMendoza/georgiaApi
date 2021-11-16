import { conexion } from './database.js'

// md5 para hashear los password: https://www.npmjs.com/package/md5
// https://github.com/TheRegext aplicaciones hibridas

export async function findUser(entity) {
    return conexion(async function(db){
        const userLogin = await db.collection("login").findOne({ email: entity.email, password: entity.password })
        const usuario = await db.collection("usuarios").findOne({ email: userLogin.email });
        return usuario;
    })
}


export default {
  findUser,
}


