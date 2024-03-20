import mongoose from "mongoose"


const Level = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    lessonsCount: {type: Number, default: 0},
    lessons: [{type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'}],
    cource: {type: mongoose.Schema.Types.ObjectId, ref: 'Cource', required: true},
    isClosed: {type: Boolean, default: false}
})


export default mongoose.model('Level', Level)