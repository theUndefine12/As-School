import Cource from '../models/Cource/Cource.js'


export const isEntered = async(req, res, next) => {
    const userId = req.userId
    const {id} = req.params

    try {
        const cource = await Cource.findById(id)
        .populate('students')
        if(!cource) {
            res.status(404).json({message: 'Cource is not found'})
        }

        const isStudent = cource.students.includes(userId)
        if(!isStudent) {
            res.status(400).json({message: 'Please Firstly enter to Cource'})
        }

        next()
    } catch(error) {
        res.status(500).json({message: 'Error in Middleware'})
        console.log(error)
    }
}
