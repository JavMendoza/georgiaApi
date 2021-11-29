import bcrypt from 'bcrypt';
import { conexion } from './database.js';
import CustomError from '../utils/CustomError.js'; 

export async function findUser(entity) {
    return conexion(async function(db) {
        const userLogin = await db.collection("login").findOne({ email: entity.email })
        const usuario = await db.collection("usuarios").findOne({ email: entity.email });

        if (userLogin && usuario) {
          const isValidPassword = await bcrypt.compare(entity.password, userLogin.password);
          if (isValidPassword) {
            return usuario;
          } else {
            return Promise.reject(new CustomError(400, 'El usuario no existe.'));
          }
        } else {
          return Promise.reject(new CustomError(400, 'El usuario no existe.'));
        }
    })
}


export default {
  findUser,
}


