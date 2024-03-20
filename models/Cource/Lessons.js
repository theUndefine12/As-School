import mongoose from "mongoose"


const Lesson = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    columns: [{type: mongoose.Schema.Types.ObjectId, ref: 'Column'}],
    level: {type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true}
})


export default mongoose.model('Lesson', Lesson)