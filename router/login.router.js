import express from 'express'
import controller from '../controller/login.controller.js'

const router = express.Router()

router.route('/')
.get(controller.findUser)


export default router