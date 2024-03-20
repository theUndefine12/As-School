import express from 'express'
import { authSecurity } from '../Middlewares/auth.middleware.js'
import { changeAvatar, changePassword, getProfile } from '../controllers/user.controller.js'
import { check } from 'express-validator'



const router = express.Router()

router.route('/profile').get(authSecurity, getProfile)
router.route('/change-password').post(
    [
        check('oldPassword', 'This line is required').isLength({min: 8}),
        check('newPassword', 'This line is required').isLength({min: 8}),
    ],
    authSecurity, changePassword
)

router.route('/change-avatar').post(
    [
        check('avatar', 'Image need be url').isURL(),
    ],
    authSecurity, changeAvatar
)


export default router