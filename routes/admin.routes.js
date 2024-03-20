import express from 'express'
import { check } from 'express-validator'
import { adminLogin, adminSignUp } from '../controllers/admin.controller.js'

const router = express.Router()

router.route('/signup').post(
    [
        check('username', 'Username is required').notEmpty(),
        check('password', 'Password is required and need be minimum 8').isLength({ min: 8 })
    ],
    adminSignUp
)

router.route('/signin').post(
    [
        check('username', 'Username is required').notEmpty(),
        check('password', 'Password is required and need be minimum 8').isLength({ min: 8 })
    ],
    adminLogin
)

export default router