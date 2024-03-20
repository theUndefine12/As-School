import mongoose from "mongoose"


const Column = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    link: {type: String, required: true},
    lesson: {type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true}
})


export default mongoose.model('Column', Column)