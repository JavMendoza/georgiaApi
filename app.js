import express from 'express';
import cors from 'cors';
import usuariosRouter from './router/usuarios.router.js';
import tipoPedidosRouter from './router/tipoPedidos.router.js';
import estadoPedidosRouter from './router/estadoPedidos.router.js';
import pedidosRouter from './router/pedidos.router.js';
import matafuegosRouter from './router/matafuegos.router.js';
import localesRouter from './router/locales.router.js';
import loginRouter from './router/login.router.js';

const whiteList = ['http://localhost:8080']; 

const corsOptions = {
    origin: function(origin, callback) {
        if (whiteList.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}


const app = express()
app.use(cors())

// Parse Body JSON
app.use(express.json())

// Parse Body URL ENCODED (FORMULARIOS)
app.use(express.urlencoded({extended: true}))

app.use('/api/usuarios', usuariosRouter)

app.use('/api/login', loginRouter)

app.use('/api/tipoPedidos', tipoPedidosRouter)
app.use('/api/estadoPedidos', estadoPedidosRouter)

app.use('/api/pedidos', pedidosRouter)

app.use('/api/matafuegos', matafuegosRouter)

app.use('/api/locales', localesRouter)

app.listen(80, function () {
    console.log("Server ON!")
})

