import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Cource from '../../models/Cource/Cource.js'
import Level from '../../models/Cource/Level.js'
import Lessons from '../../models/Cource/Lessons.js'

import User from '../../models/User.js'

export const addLesson = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const {id} = req.params
    const {title} = req.body

    try {
        const isLevel = await Level.findById(id)
        if(!isLevel) {
            res.status(404).json({message: 'Level is not found'})
        }

        const courceId = isLevel.cource._id
        const isCource = await Cource.findById(courceId)
        if(!isCource) {
            res.status(404).json({message: 'Cource is not found'})
        }

        const lesson = new Lessons({title, level: id})
        await lesson.save()

        isLevel.lessonsCount += 1
        isLevel.lessons.push(lesson.id)

        isCource.lessonsCount += 1

        await isLevel.save()
        await isCource.save()

        res.status(200).json({message: 'Lesson is added', lesson})
    } catch(err) {
        console.log(err)
        res.status(500).json({message: 'Sorry, Error in Server'})
    }
})


export const getAllessons = asyncHandler(async(req, res) => {
    const lessons = await Lessons.find()
    .select('id title status')
    
    res.status(200).json({lessons})
})


export const getLessonById = asyncHandler(async(req, res) => {
    const {id} = req.params

    try {
        const lesson = await Lessons.findById(id)
        .populate({
            path: 'columns',
            select: '-lesson'
        })
        .select('id title columns status')
        if(!lesson) {
            res.status(404).json({message: 'Lessaon is not found'})
        }

        res.status(200).json({lesson})
    } catch(err) {
        console.log(err)
        res.status(500).json({message: 'Sorry, Error in Server'})
    }
})


export const deleteLesson = asyncHandler(async(req, res) => {
     const {id} = req.params

    try {
        const lesson = await Lessons.findById(id)
        if(!lesson) {
            res.status(404).json({message: 'Lesson is not found'})
        }

        const deleted = await Lessons.findByIdAndDelete(id)

        const isLevel = await Level.findById(id)
        if(!isLevel) {
            res.status(404).json({message: 'Level is not found'})
        }

        const courceId = isLevel.cource.id
        const isCource = await Cource.findById(courceId)
        if(!isCource) {
            res.status(404).json({message: 'Cource is not found'})
        }

        const indexOfLesson = isLevel.lessons.indexOf(id)

        isLevel.lessonsCount -= 1
        isLevel.lessons.splice(indexOfLesson, 1)

        isCource.lessonsCount -= 1

        await isLevel.save()
        await isCource.save()

        res.status(200).json({message: 'Lesson is Deleted'})
    } catch(err) {
        console.log(err)
        res.status(500).json({message: 'Sorry, Error in Server'})
    }
})



// export const changeStatus = asyncHandler(async(req, res) => {
//     const {id} = req.params

//     try {
//         const lesson = await Lessons.findById(id)
//         .select('id title status')
//         if(!lesson) {
//             res.status(404).json({message: 'Lesson is not found'})
//         }

        
//         // if(lesson.status === "DontDone") {
//         //     lesson.status = "Done"
//         // } else if(lesson.status === "Done") {
//         //     lesson.status = "DontDone"
//         // }

//         // await lesson.save()
//         // res.status(200).json({message: 'Status is changed', lesson})
//     } catch(error) {
//         res.status(500).json({message: 'Sorry, Error in Server'})
//         console.log(error)
//     }
// })

export const changeStatus = asyncHandler(async(req, res) => {
    const { courseId, lessonId } = req.params;
    const userId = req.userId;
    const { status } = req.body;

    try {
        // Find the course
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

        // Find the lesson
        let lesson;
        for (const level of course.levels) {
            lesson = level.lessons.find(lesson => lesson._id.equals(lessonId));
            if (lesson) break;
        }

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Update user's lesson status
        const userCourseIndex = user.cources.findIndex(course => course.courseId.equals(courseId));
        const userLessonIndex = user.cources[userCourseIndex].lessonStatus.findIndex(lessonStatus => lessonStatus.lessonId.equals(lessonId));
        user.cources[userCourseIndex].lessonStatus[userLessonIndex].status = status;

        await user.save();

        res.status(200).json({ message: 'Lesson status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sorry, there was an error on the server' });
    }
});
