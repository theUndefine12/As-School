import mongoose from "mongoose";



const Fake = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    avatar: {type: String, required: true},
    region: {type: String, required: true},
    district: {type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
})


export default mongoose.model('Fake', Fake)
