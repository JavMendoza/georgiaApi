import express from 'express'
import controller from '../controller/estadoPedidos.controller.js'

const router = express.Router()

router.route('/')
.get(controller.findAll)
.post(controller.create)

router.route('/:id')
.get(controller.findById)
.put(controller.putById)
.patch(controller.patchById)
.delete(controller.deleteById)


export default router