import mongoose from 'mongoose'



const Cource = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    studentsCount: {type: Number, default: 0},
    lessonsCount: {type: Number, default: 0},
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    levels : [{type: mongoose.Schema.Types.ObjectId, ref: 'Level'}]
})


export default mongoose.model('Cource', Cource)