import mongodb from 'mongodb'
import config from '../config.js'

const client = new mongodb.MongoClient(`mongodb://${config.db.host}:${config.db.port}`)

export async function conexion(callback){
    await client.connect()

    const result = await callback(client.db(config.db.dbName))

    // await client.close()

    return result
}

