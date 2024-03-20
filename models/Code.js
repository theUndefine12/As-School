import mongoose from 'mongoose'



const Code = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    code: {type: String, required: true},
    experienceIn: {type: Date}
})


export default mongoose.model('Code', Code)