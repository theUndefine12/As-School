import mongoose from 'mongoose'



const userModel = new mongoose.Schema({
    name: {type: String, required: true},
    region: {type: String, required: true},
    place: {type: Number, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

const Static = new mongoose.Schema({
    users : [userModel]
})


export default mongoose.model('Static', Static)