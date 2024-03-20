import express from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { checkAdmin } from '../../Middlewares/admin.middleware.js'
import { addLevel, changeLevelStatus, deleteLevel, getAllLevels, getLevelById } from '../../controllers/cource/level.controller.js'
import { isComplected } from '../../Middlewares/isComplected.middleware.js'



const router = express.Router()

router.route('/:id/create').post(
    [
        check('title', 'Title is required').notEmpty(),
    ],
    authSecurity, checkAdmin, addLevel
)

router.route('/').get(authSecurity, getAllLevels)
router.route('/:id').get(authSecurity, getLevelById)
router.route('/:id').delete(authSecurity, checkAdmin, deleteLevel)

router.route('/:courseId/:levelId/change').post(authSecurity, isComplected,  changeLevelStatus)

export default router