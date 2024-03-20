import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Cource from '../../models/Cource/Cource.js'
import Level from '../../models/Cource/Level.js'

import User from '../../models/User.js'

export const addLevel = asyncHandler(async(req, res) => { 
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const {id} = req.params
    const {title} = req.body

    try {
        const cource = await Cource.findById(id)
        if(!cource) {
            res.status(404).json({message: 'Cource is not defind'})
        }

        const level = new Level({title, cource: id})
        await level.save()

        cource.levels.push(level.id)
        await cource.save()

        res.status(200).json({message: 'Level is added', level})
    } catch(err) {
        console.log(err)
        res.status(500).json({message: 'Sorry, Error in Server'})
    }
})


export const getAllLevels = asyncHandler(async(req, res) => {
    const levels = await Level.find()
    .select('id title columnCount')

    res.status(200).json({levels})
})


export const getLevelById = asyncHandler(async(req, res) => {
    const {id} = req.params

    try {
        const level = await Level.findById(id)
        .populate('lessons')
        .select('id title columnCount column')
        if(!level) {
            res.status(404).json({message: 'Level is not found'})
        }

        res.status(200).json({level})
    } catch(err) {
        console.log(err)
        res.status(500).json({message: 'Sorry, Error in Server'})
    }
})


export const deleteLevel = asyncHandler(async(req, res) => {
    const {id} = req.params

    try {
        const level = await Level.findById(id)
        if(!level) {
            res.status(404).json({message: 'Level is not found'})
        }

        const courceId = level.cource.id
        const cource = await Cource.findById(courceId)

        await Level.findByIdAndDelete(id)

        const indexOfPost = cource.levels.indexOf(id)
        cource.levels.splice(indexOfPost, 1)

        await cource.save()
        res.status(200).json({message: 'Level is deleted'})
    } catch(err) {
        console.log(err)
        res.status(200).json({message: 'Sorry, Error in Server'})
    }
})




//    //     // // /   // // //   // // 
//    //    //         //         //   //
//    //     // //     // // //   // //
//    //         //    //         //   //
// // //    // // /    // // //   //    //




export const changeLevelStatus = asyncHandler(async(req, res) => {
    const { courseId, levelId } = req.params;
    const userId = req.userId;
    const { isCompleted } = req.body;

    try {
        const course = await Cource.findById(courseId)
            .populate({
                path: 'levels',
                populate: {
                    path: 'lessons'
                }
            })
            .populate({
                path: 'students',
                select: 'id'
            });
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is enrolled in the course
        const isEnrolled = course.students.some(student => student._id.equals(userId));
        if (!isEnrolled) {
            return res.status(403).json({ message: 'You are not enrolled in this course' });
        }

        // Find the level
        const level = course.levels.find(level => level._id.equals(levelId));
        if (!level) {
            return res.status(404).json({ message: 'Level not found' });
        }

        // Update user's level status
        const userCourseIndex = user.cources.findIndex(course => course.courseId.equals(courseId));
        const userLevelIndex = user.cources[userCourseIndex].levelStatus.findIndex(levelStatus => levelStatus.levelId.equals(levelId));
        user.cources[userCourseIndex].levelStatus[userLevelIndex].isCompleted = isCompleted;

        await user.save();

        res.status(200).json({ message: 'Level status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sorry, there was an error on the server' });
    }
});
