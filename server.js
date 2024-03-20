import express from "express";
import "colors"
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import authRoutes from "./routes/auth.routes.js"
import adminRoutes from './routes/admin.routes.js'
import courceRoutes from './routes/cource/cource.routes.js'
import levelRoutes from './routes/cource/level.routes.js'
import lessonRoutes from './routes/cource/lesson.routes.js'
import columnRoutes from './routes/cource/column.routes.js'
import userRoutes from './routes/user.routes.js'
import staticRoutes from './routes/static.routes.js'

import { authSecurity } from "./Middlewares/auth.middleware.js"
import {getMyALlCources} from './controllers/cource/cource.controller.js'

dotenv.config()


const app = express()
const port = 3000
const url = process.env.URL

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

app.use('/api/cource', courceRoutes)
// app.use('/api/cource/my-cource', () => {
//   authSecurity, getMyALlCources
// })

app.use('/api/level', levelRoutes)
app.use('/api/lesson', lessonRoutes)
app.use('/api/column', columnRoutes)
app.use('/api/user', userRoutes)
app.use('/api/static', staticRoutes)

const connect = async () => {
  await mongoose.connect(url)
  .then(console.log('Db is connected'.bgGreen.italic))

  app.listen(port, () => {
    console.log(`Server run on port ${port}`.italic.bgBlue)
  })
}

connect()


// import { CronJob } from 'cron';

// const job = new CronJob(
// 	'*/10 * * * * *', // cronTime
// 	function () {
// 		console.log('You will see this message every second uguifgu gsdtfts y');
// 	}, // onTick
// 	null, // onComplete
// 	true, // start
// 	'America/Los_Angeles' // timeZone
// );