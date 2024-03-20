import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Cource from '../../models/Cource/Cource.js'
import Lesson from '../../models/Cource/Lessons.js'
import User from '../../models/User.js'
import Level from '../../models/Cource/Level.js' 


export const createCource = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const {title, image, description} = req.body

    try {
        const isHave = await Cource.findOne({title})
        if(isHave) {
            res.status(400).json({message: 'Cource is already exist'})
        }

        const cource = new Cource({title, image, description})

        await cource.save()
        res.status(200).json({message: 'Cource is created', cource})
    } catch(err) {
        console.log(err)
        res.status(200).json({message: 'Sorry, Error in Server'})
    }
})


export const getAllCources = asyncHandler(async(req, res) => {
    const cources = await Cource.find()
    .select('-levels -students')

    res.status(200).json({cources})
})


export const getCourceById = asyncHandler(async(req, res) => {
    const {id} = req.params

    try {
        const cource = await Cource.findById(id)
        .populate({
            path: 'levels',
            select: '-lessons -cource'
        })
        .select('id title levels')
        if(!cource) {
            res.status(404).json({message: 'Cource is not found'})
        }

        res.status(200).json({message: 'Please enter your level', cource})
    } catch(err) {
        console.log(err)
        res.status(200).json({message: 'Sorry, Error in Server'})
    }
})


export const deleteCource = asyncHandler(async(req, res) => {
    const {id} = req.params

    try {
        const cource = await Cource.findById(id)
        if(!cource) {
            res.status(404).json({message: 'Cource is not found'})
        }

        await Cource.findByIdAndDelete(id)
        res.status(200).json({message: 'Cource is deleted'})
    } catch(err) {
        console.log(err)
        res.status(200).json({message: 'Sorry, Error in Server'})
    }
})


export const enterToCource = asyncHandler(async(req, res) => {
    const { id } = req.params
    const userId = req.userId

    try {
        const cource = await Cource.findById(id)
    .populate({
        path: 'levels', 
        populate: {
            path: 'lessons'
        }
    })
    .populate({
        path: 'students',
        select: 'id'
    })

    if (!cource) {
        res.status(404).json({ message: 'Course not found' });
        return
    }
        const user = await User.findById(userId)
        .populate('cources')

        if(!user) {
            res.status(400).json({message: 'Please check your token'})
            return
        }

        const isStudent = cource.students.some(st => st.id === userId)
        if(isStudent) {
            res.status(400).json({message: 'User already entered to this course'})
            return
        }

        // console.log(user.cources)
        user.cources.push({ courseId: cource._id })
        user.courcesCount += 1

        cource.students.push(userId)
        cource.studentsCount += 1

        const lessonStatuses = cource.levels.flatMap(level =>
            level.lessons.map(lesson => ({
                lessonId: lesson._id,
                status: 'DontDone'
            }))
        )

        const levelStatuses = cource.levels.map(level => ({
            levelId: level._id,
            name: level.title,
            isCompleted: false
        }))

        user.cources[user.cources.length - 1].lessonStatus = lessonStatuses
        user.cources[user.cources.length - 1].levelStatus = levelStatuses
        await cource.save()
        await user.save()

        
        res.status(200).json({ message: 'You are entered into the course', cource });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sorry, there was an error on the server' });
    }
})


export const getMyCoursById = asyncHandler(async(req, res) => {
    const {id} = req.params
    const userId = req.user

    try {
        const user = await User.findById(userId)
        .populate('cources')

        const isCource = user.cources.some(cs => cs.id !== id)
        if(isCource) {
            res.status(404).json({message: 'NOT found'})
        }

        res.status(200).json({isCource})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sorry, there was an error in the server' });
    }
})



//    //     // // /   // // //   // // 
//    //    //         //         //   //
//    //     // //     // // //   // //
//    //         //    //         //   //
// // //    // // /    // // //   //    //








export const getMyALlCources = asyncHandler(async(req, res) => {
    const userId = req.userId

    try {
        const user = await User.findById(userId)
        .populate({
            path: 'cources.courseId',
            select: 'title image description'
        })
        .select('courcesCount cources')

        const cources = user.cources.map(cource => ({
            id: cource.courseId.id ,
            title: cource.courseId.title,
            image: cource.courseId.image,
            description: cource.courseId.description,
            progres: cource.progress
        }))

        res.status(200).json({cources})
    } catch(error) {
        res.status(500).json({message: 'Error in SErver'})
        console.log(error)
    }
})


export const getMyCourceById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.userId

    try {
        const user = await User.findById(userId)
        .populate('cources.courseId')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const course = user.cources.find(c => c.courseId.equals(id))        
        if (!course) {
            return res.status(404).json({ message: 'Course not found for this user' })
        }

        const levels = course.levelStatus
        res.status(200).json({ levels })
    } catch (error) {
        res.status(500).json({ message: 'Error in Server' })
        console.error(error)
    }
})


export const changeLevelStatus = asyncHandler(async(req, res) => {
    const { courseId, levelId } = req.params;
    const userId = req.userId;

    try {
        console.log(courseId)
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

        const userCourseIndex = user.cources.findIndex(course => course.courseId.equals(courseId));
        const userLevelIndex = user.cources[userCourseIndex].levelStatus.findIndex(levelStatus => levelStatus.levelId.equals(levelId));
        user.cources[userCourseIndex].levelStatus[userLevelIndex].isCompleted = !user.cources[userCourseIndex].levelStatus[userLevelIndex].isCompleted

        const totalLevelsCount = course.levels.length;

        const completedLevelsCount = course.levels.filter(level => {
        const userLevelStatus = user.cources[userCourseIndex].levelStatus.find(status => status.levelId.equals(level._id));
            return userLevelStatus && userLevelStatus.isCompleted;
        }).length

        user.cources[userCourseIndex].progress = Math.round((completedLevelsCount / totalLevelsCount) * 100)

        await user.save()
        res.status(200).json({ message: 'Level status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sorry, there was an error on the server' });
    }
})


export const changeLessonStatus = asyncHandler(async(req, res) => {
    const { courseId, levelId, lessonId } = req.params;
    const userId = req.userId;

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

        // Find the level in the course
        const level = course.levels.find(level => level._id.equals(levelId));
        console.log(level)
        if (!level) {
            return res.status(404).json({ message: 'Level not found in this course' });
        }

        // Find the lesson in the level
        const lesson = level.lessons.find(lesson => lesson._id.equals(lessonId));
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found in this level' });
        }

        // Update user's lesson status
        const userCourseIndex = user.cources.findIndex(course => course.courseId.equals(courseId));
        const userLessonIndex = user.cources[userCourseIndex].lessonStatus.findIndex(lessonStatus => lessonStatus.lessonId.equals(lessonId));
        if (userLessonIndex !== -1) {
            user.cources[userCourseIndex].lessonStatus[userLessonIndex].status = user.cources[userCourseIndex].lessonStatus[userLessonIndex].status === 'DontDone' ? 'Done' : 'DontDone'
        } else {
            user.cources[userCourseIndex].lessonStatus.push({ lessonId: lessonId, status: status });
        }

        user.cources[userCourseIndex].levelStatus.forEach(userLevelStatus => {
            const levelLessons = course.levels.find(level => level._id.equals(userLevelStatus.levelId)).lessons;
            const completedLessonsCount = user.cources[userCourseIndex].lessonStatus.filter(lessonStatus =>
                levelLessons.some(lesson => lesson._id.equals(lessonStatus.lessonId)) && lessonStatus.status === 'Done'
            ).length;
            const totalLessonsCount = levelLessons.length;
            userLevelStatus.progress = Math.round((completedLessonsCount / totalLessonsCount) * 100);
        })


        await user.save();
        res.status(200).json({ message: 'Lesson status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sorry, there was an error on the server' });
    }
})


export const getLevelById = asyncHandler(async (req, res) => {
    const { courceId, levelId } = req.params;
    const userId = req.userId;

    try {
        // Find the level by ID and populate its lessons
        const level = await Level.findById(levelId)
            .populate({
                path: 'lessons',
                select: 'id title', // Only select necessary fields from lessons
            })
            .select('id title lessonsCount lessons');

        if (!level) {
            return res.status(404).json({ message: 'Level not found' });
        }

        // Find the user
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const userCourse = user.cources.find(course => course.courseId.equals(courceId))

        if (!userCourse) {
            return res.status(404).json({ message: 'User is not enrolled in this course' })
        }

        const lessonStatuses = userCourse.lessonStatus.filter(lessonStatus =>
            level.lessons.some(lesson => lesson.equals(lessonStatus.lessonId))
        )

        const levelData = {
            lessons: level.lessons.map(lesson => {
                const lessonStatus = lessonStatuses.find(status => status.lessonId.equals(lesson._id));
                return {
                    _id: lesson._id,
                    title: lesson.title,
                    status: lessonStatus ? lessonStatus.status : 'Not Started'
                }
            })
        }

        res.status(200).json({ levelData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error in Server' })
    }
})


export const getLessonsById = asyncHandler(async(req, res) => {
    const { courceId, levelId, lessonId } = req.params
    const userId = req.userId

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const userCourse = user.cources.find(course => course.courseId.equals(courceId))
        if (!userCourse) {
            return res.status(404).json({ message: 'User is not enrolled in this course' })
        }
        
        const level = await Level.findById(levelId)
        const lesson = await Lesson.findById(lessonId)
        .populate({
            path: 'columns',
            select: '-lesson'
        }).select('id title columns')

        if(!level) {
            res.status(404).json({message: 'Level is not found'})
        }

        if(!lesson) {
            res.status(404).json({message: 'Lesson is not found'})
        }

        res.status(200).json({lesson})
    } catch(error) {
        res.status(500).json({message: 'Sorry Error in Server'})
        console.log(error)
    }
})
