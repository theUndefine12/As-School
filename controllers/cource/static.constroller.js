import Static from "../../models/Static.js"
import asyncHandler from 'express-async-handler'
import User from '../../models/User.js'
import { CronJob } from 'cron'



export const sortUsersByProgress = asyncHandler(async (req, res) => {
    const students = await Static.find()
    res.status(200).json({students})
})

export const updateStatus = async () => {
    try {
        const users = await User.find().populate('cources.courseId')

        users.sort((a, b) => {
            const aProgress = a.cources.reduce((total, course) => total + course.progress, 0);
            const bProgress = b.cources.reduce((total, course) => total + course.progress, 0);
            return bProgress - aProgress;
        })

        users.forEach((user, index) => {
            user.place = index + 1
        })

        const usersWithRequiredFields = users.map(user => ({
            user: user._id,
            name: user.username,
            region: user.region,
            place: user.place || 1
        }))

        const staticData = await Static.findOne()
        const existingUsers = staticData ? staticData.users.map(user => user.user.toString()) : []

        const newUsers = usersWithRequiredFields.filter(user => !existingUsers.includes(user.user.toString()))

        if (newUsers.length === 0) {
            console.log('No new users to add to Static model.')
            return
        }

        if (!staticData) {
            await Static.create({ users: newUsers })
        } else {
            staticData.users.push(...newUsers)
            await staticData.save()
        }

        console.log('Status Updated')
    } catch (error) {
        console.log(error)
    }
}


const job = new CronJob(
	'0 0 * * *', // cronTime
	function() {updateStatus()},// onTick
	null, // onComplete
	true, // start
	'America/Los_Angeles' // timeZone
)
