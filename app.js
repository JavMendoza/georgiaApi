import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usuariosRouter from './router/usuarios.router.js';
import tipoPedidosRouter from './router/tipoPedidos.router.js';
import estadoPedidosRouter from './router/estadoPedidos.router.js';
import pedidosRouter from './router/pedidos.router.js';
import matafuegosRouter from './router/matafuegos.router.js';
import localesRouter from './router/locales.router.js';
import loginRouter from './router/login.router.js';

import { validator } from './middleware/tokenValidator.js'

dotenv.config();

/* const whiteList = ['http://localhost:8080']; 

const corsOptions = {
    origin: function(origin, callback) {
        if (whiteList.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
} */


const app = express();
const API_PORT = process.env.API_PORT || 80;

app.use(cors())

// Parse Body JSON
app.use(express.json())

app.use('/api/usuarios', usuariosRouter)

app.use('/api/login', loginRouter)

app.use('/api/pedidos', [validator], pedidosRouter)
app.use('/api/tipoPedidos', [validator], tipoPedidosRouter)
app.use('/api/estadoPedidos', [validator], estadoPedidosRouter)

app.use('/api/matafuegos', [validator], matafuegosRouter)

app.use('/api/locales', [validator], localesRouter)

app.listen(API_PORT, function () {
    console.log("Server ON!");
    console.log("MongoDB HOST: ", process.env.MONGO_DB);
})

