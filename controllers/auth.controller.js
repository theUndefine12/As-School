import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import Code from '../models/Code.js'
import { generateToken } from '../utils/generatorTokens.js'
import bcrypt from 'bcrypt'
import { sendOtp } from '../services/nodemailer.service.js'
import FakeUser from '../models/FakeUser.js'



export const signUp = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { username, avatar, region, district, age, email, password } = req.body

    try {
        const isHave = await User.findOne({
            $or: [
                {username: username},
                {email: email}
            ]
        })
        if (isHave) {
            res.status(400).json({ message: 'User is already exist' })
        }

        const hash = bcrypt.hashSync(password, 7)
        
        const user = new FakeUser({username, avatar, region, district, age, email, password: hash})

        await user.save()
        await sendOtp(email)
        
        res.status(200).json({ message: 'Go through otp' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const authVerify = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const {email,code} = req.body
    
    try {
        const user = await FakeUser.findOne({email})

        const otp = await Code.findOne({email})
        if(!otp) {
            res.status(400).json({message: 'The code time is end'})
            return
        }

        const otpCode = otp.code
        const isCode = code === otpCode
        if(!isCode) {
            res.status(400).json({message: 'Code is not correct'})
            return
        }

        const fake = await FakeUser.findOne({email})
        if(!fake) {
            res.status(400).json({message: 'User is not found in FakeUser'})
        }

        const newUser = new User({username: fake.username, avatar: fake.avatar,
            region: fake.region, district: fake.district, age: fake.age, email: email, password: fake.password
        })

        await newUser.save()
        await FakeUser.findByIdAndDelete(fake.id)

        const token = generateToken(user.id)
        res.status(200).json({message: 'User is authorized successfully', newUser, token})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Sorry Error in Server'})
    }
})


export const signIn = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { email, password } = req.body

    try {
        const user = await User.findOne({email})
        if (!user) {
            res.status(404).json({ message: 'user is not Found' })
        }

        const isPassword = bcrypt.compareSync(password, user.password)
        if (!isPassword) {
            res.status(400).json({ message: 'Password is not correct' })
        }

        const token = generateToken(user.id)
        res.status(200).json({ message: 'User is Signed', token })
    } catch (error) {
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


