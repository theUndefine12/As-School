import Level from '../models/Cource/Level.js'
import User from '../models/User.js'
import Course from '../models/Cource/Cource.js'




export const checkLessonsStatus = async (req, res, next) => {
    const { courseId, levelId } = req.params;
    const userId = req.userId;

    try {
        // Find the user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found');

        // Find the course
        const course = await Course.findById(courseId).populate({
            path: 'levels',
            populate: {
                path: 'lessons'
            }
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        console.log('Course found');

        // Find the level
        const level = course.levels.find(level => level._id.equals(levelId));

        if (!level) {
            return res.status(404).json({ message: 'Level not found' });
        }

        console.log('Level found');

        // Find the user's course status
        const userCourse = user.cources.find(course => course.courseId.equals(courseId));
        if (!userCourse) {
            return res.status(404).json({ message: 'User course status not found' });
        }

        console.log('User course status found');

        // Populate the `levelStatus` field within the `cources` array
        const userLevelStatus = await User.populate(userCourse, { path: 'levelStatus' });
        if (!userLevelStatus) {
            console.log('User level status not found for levelId:', levelId);
            return res.status(404).json({ message: 'User level status not found' });
        }

        console.log('User level status found:', userLevelStatus);

        // Check if all lessons in the level are marked as "Done"
        const allLessonsDone = level.lessons.every(lesson => {
            const lessonStatus = userLevelStatus.lessonStatus.find(ls => ls.lessonId.equals(lesson._id));
            return lessonStatus && lessonStatus.status === 'Done';
        });

        console.log('All lessons done:', allLessonsDone);

        if (!allLessonsDone) {
            return res.status(400).json({ message: 'Please complete all lessons before changing the level status' });
        }

        // If all lessons are marked as "Done", proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sorry, there was an error on the server' });
    }
};
