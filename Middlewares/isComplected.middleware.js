import User from '../models/User.js'
// import Level from '../models/Cource/Level.js'

export const isComplected = async (req, res, next) => {
    const { levelId } = req.params;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the user's status for the given level
        const levelStatus = user.cources.find(course => course.levelStatus.some(status => status.levelId.equals(levelId)));

        if (!levelStatus) {
            return res.status(404).json({ message: 'User has no status for this level' });
        }

        // Check if all lessons in the level have a status of 'Done'
        const allLessonsCompleted = levelStatus.lessonStatus.every(lesson => lesson.status === 'Done');

        if (!allLessonsCompleted) {
            console.log('Not all lessons in this level are completed');
            return res.status(400).json({ message: 'Not all lessons in this level are completed' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
