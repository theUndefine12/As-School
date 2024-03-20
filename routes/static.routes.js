import express from 'express'
import { sortUsersByProgress } from '../controllers/cource/static.constroller.js'



const router = express.Router()


router.route('/').get(sortUsersByProgress)

export default router