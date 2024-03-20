import express from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { checkAdmin } from '../../Middlewares/admin.middleware.js'
import { createCource, deleteCource, getMyALlCources, getAllCources, getCourceById, enterToCource, getMyCourceById, getLevelById, getLessonsById, changeLevelStatus, changeLessonStatus, } from '../../controllers/cource/cource.controller.js'
import { checkLessonsStatus } from '../../Middlewares/lesson.middleware.js'



const router = express.Router()

router.route('/create').post(
    [
        check('title', 'Title is required').notEmpty(),
        check('image', 'Image need not be empty').notEmpty(),
        check('description').isLength({min: 12})
    ],
    authSecurity, checkAdmin, createCource
)


router.route('/').get(authSecurity, getAllCources)
router.route('/:id').get(authSecurity, getCourceById)
router.route('/:id').delete(authSecurity, checkAdmin, deleteCource)

router.route('/:id/enter').post(authSecurity, enterToCource)
router.route('/my/cources').get(authSecurity, getMyALlCources)


router.route('/my-cources/:id').get(authSecurity, getMyCourceById)
router.route('/my-cources/:courceId/level/:levelId').get(authSecurity, getLevelById)
router.route('/my-cources/:courceId/level/:levelId/lesson/:lessonId').get(authSecurity, getLessonsById)

router.route('/my-cources/:courseId/level/:levelId').post(authSecurity, checkLessonsStatus, changeLevelStatus)
router.route('/my-cources/:courseId/level/:levelId/lesson/:lessonId').post(authSecurity, changeLessonStatus)


export default router
