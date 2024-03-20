import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Lesson from '../../models/Cource/Lessons.js'
import Column from '../../models/Cource/Column.js'



export const addColumn = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const {id} = req.params
    const {title, description, link} = req.body

    try {
        const lesson = await Lesson.findById(id)
        if(!lesson) {
            res.status(404).json({message: 'Lesson is not found'})
            return
        }
        
        const column = new Column({title, description, link, lesson: id})
        await column.save()

        lesson.columns.push(column.id)
        await lesson.save()
        
        res.status(200).json({message: 'Column is added  Successfully', column})
    } catch(err) {
        console.log(err)
        res.status(200).json({message: 'Sorry, Error in Server'})
    }
})


export const getAllColumns = asyncHandler(async(req, res) => {
    const columns = await Column.find()
    .select('-lesson -description -link')

    res.status(200).json({columns})
})


export const getColumnById = asyncHandler(async(req, res) => {
    const {id} = req.params

    try {
        const column = await Column.findById(id)
        .select('-lesson')
        if(!column) {
            res.status(404).json({message: 'Column is not found'})
            return 
        }

        res.status(200).json({column})
    } catch(err) {
        console.log(err)
        res.status(200).json({message: 'Sorry, Error in Server'})
    }
})


export const deleteColumn = asyncHandler(async(req, res) => {
    
})


