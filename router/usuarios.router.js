import express from 'express'
import controller from '../controller/usuarios.controller.js'
import { validator } from '../middleware/tokenValidator.js'

const router = express.Router()

router.route('/')
.get(validator, controller.findAll)
.post(controller.create)

router.route('/:id')
.get(validator, controller.findById)
.put(validator, controller.putById)
.patch(validator, controller.patchById)
.delete(validator, controller.deleteById)

router.route('/:id/pedidos')
.get(validator, controller.findPedidosFromUser);

router.route('/:id/matafuegos')
.get(validator, controller.findMatafuegosFromUser);


export default router