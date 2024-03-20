import mongoose from "mongoose"


const User = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    avatar: {type: String, required: true},
    region: {type: String, required: true},
    district: {type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    courcesCount: {type: Number, default: 0},
    cources: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cource' },
        progress: {type: Number, default: 0},
        lessonStatus: [{
            lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
            status: { type: String, enum: ['DontDone', 'Done'], default: 'DontDone' }
        }],
        levelStatus: [{
            levelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' },
            name: {type: String, required: true},
            isCompleted: { type: Boolean, default: false },
            progress: { type: Number, default: 0 }
        }]
    }],
})


export default mongoose.model('User', User)
