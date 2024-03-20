import Cource from "../models/Cource/Cource.js"


export const checkEntered = async(req, res, next) => {
    const {id} = req.params
    const userId = req.userId

    try {
        const cource = await Cource.findById(id)
        .populate('students')
        if(!cource) {
            res.status(404).json({message: 'Cource is not found'})
        }

        const student = cource.students.some(st => st.id === userId)
        if(!student) {
            res.status(400).json({message: 'Please enter to cource'})
        }

        next()
    } catch(error) {
        console.log(error)
    }
}
