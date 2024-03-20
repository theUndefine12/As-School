import express from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { checkAdmin } from '../../Middlewares/admin.middleware.js'
import { addLesson, changeStatus, deleteLesson, getAllessons, getLessonById } from '../../controllers/cource/lessons.controller.js'



const router = express.Router()

router.route('/:id/create').post(
    [
        check('title', 'Title is required').notEmpty(),
    ],
    authSecurity, checkAdmin, addLesson 
)

router.route('/:courseId/:lessonId/change-status').post(authSecurity, changeStatus)


router.route('/').get(authSecurity, getAllessons)
router.route('/:id').get(authSecurity, getLessonById)
router.route('/:id').delete(authSecurity, checkAdmin, deleteLesson)



export default router