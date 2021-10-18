import express from 'express'
import controller from '../controller/login.controller.js'

const router = express.Router()

router.route('/')
.post(controller.findUser)


export default router