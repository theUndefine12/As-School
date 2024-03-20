import express from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { checkAdmin } from '../../Middlewares/admin.middleware.js'
import { addColumn, deleteColumn, getAllColumns, getColumnById } from '../../controllers/cource/column.controller.js'



const router = express.Router()

router.route('/:id/create').post(
    [
        check('title', 'Title is required').notEmpty(),
        check('link', 'Link is need be url').isURL(),        
        check('description', 'Desc is required').isLength({min: 12}),
    ],
    authSecurity, checkAdmin, addColumn
)

router.route('/').get(authSecurity, getAllColumns)
router.route('/:id').get(authSecurity, getColumnById)
router.route('/:id').delete(authSecurity, checkAdmin, deleteColumn)



export default router