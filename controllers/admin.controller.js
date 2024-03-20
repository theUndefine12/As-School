import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Admin from '../models/Admin.js'
import { generateToken } from '../utils/generatorTokens.js'
import bcrypt from 'bcrypt'



export const adminSignUp = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const {username, password} = req.body
    
    try{
        const isHave = await Admin.findOne({username})
        if(isHave) {
            res.status(400).json({message: 'Admin is already exist'})
        }

        const hash = bcrypt.hashSync(password, 10)
        const admin = new Admin({username, password: hash})

        const token = generateToken(admin.id)
        await admin.save()

        res.status(200).json({message: 'Admin is Signed', token})
    } catch(err) {
        res.status(500).json({message: 'Sorry, Error in Server'})
        console.log(err)
    }
})


export const adminLogin = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const {username, password} = req.body

    try {
        const admin = await Admin.findOne({username})
        if(!admin) {
            res.status(404).json({message: 'Admin is not authorized'})
        }

        const isPassword = bcrypt.compareSync(password, admin.password)
        if(!isPassword) {
            res.status(400).json({message: 'Password is not correct'})
        }

        const token = generateToken(admin.id)
        res.status(200).json({message: 'Admin is Signed', token})
    } catch(err) {
        res.status(500).json({message: 'Sorry, Error in Server'})
        console.log(err)
    }
})
