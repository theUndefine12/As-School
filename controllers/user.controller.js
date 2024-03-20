import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import bcrypt from 'bcrypt'


export const getProfile = asyncHandler(async(req, res) => {
    const user = req.userId

    try {
        const profile = await User.findById(user)
        .select('-password -cources')
        if(!user) {
            res.status(400).json({message: 'Please check your request'})
        }

        res.status(200).json({profile})
    } catch(error) {
        res.status(500).json({message: 'Sorry, Error in Server'})
        console.log(error)
    }
})


export const changePassword = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const userId = req.userId
    const {oldPassword, newPassword} = req.body

    try {
        const user = await User.findById(userId)
        if(!user) {
            res.status(404).json({message: 'User is not found'})
        }

        const password = bcrypt.compareSync(oldPassword, user.password)
        if(!password) {
            res.status(400).json({message: 'Password is not correct'})
            return
        }

        const hash = bcrypt.hashSync(newPassword, 7)
        user.password = hash

        await user.save()
        res.status(200).json({message: 'Password is changed successfully'})
    } catch(error) {
        res.status(500).json({message: 'Sorry, Error in Server'})
        console.log(error)
    }
})


export const changeAvatar = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const userId = req.userId
    const {avatar} = req.body

    try {
        const user = await User.findById(userId)
        if(!user) {
            res.status(404).json({message: 'User is not found'})
        }

        user.avatar = avatar
        await user.save()

        res.status(200).json({message: 'Avatar updated successfully'})
    } catch(error) {
        res.status(500).json({message: 'Sorry, Error in Server'})
        console.log(error)
    }
})



// export const getCoyrces = asyncHandler(async(req, res)) 
