import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"

const passwordController = {
    login: async(req, res) => {
        try {
            const { email, password } = req.body

            const user = await userModel.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    message: "User does not exists.",
                    accessToken: ''
                })
            }

            const isMatch = password === user.password
            if (!isMatch) {
                return res.status(500).json({
                    message: "Incorrect password.",
                    accessToken: ''
                })
            }

            //If Login success, create accessToken
            const accessToken = createAccessToken({ id: user._id })

            res.json({
                message: 'Success',
                accessToken
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                accessToken: ''
            })
        }
    },
    getUsers: async(req, res) => {
        try {
            const users = await userModel.find()
            res.json({
                message: 'Success',
                data: users
            })
        } catch (error) {
            return res
                .status(500)
                .json({
                    message: error.message,
                    data: []
                })
        }
    },
    changePassword: async(req, res) => {
        try {
            const accessToken = req.header('access-token')
            if (!accessToken) {
                return res.status(400).json({
                    message: 'Invalid Authentication',
                    data: {}
                })
            }

            let userTemp = {}
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({
                    message: 'Invalid Authentication',
                    data: {}
                })
                userTemp = user
            })

            if (!userTemp) {
                return res.json({
                    message: "User not found.",
                    data: {}
                })
            }

            const userTemp2 = await userModel.findOne({ _id: userTemp.id })

            const { password, newPassword } = req.body
            const email = userTemp2.email

            const user = await userModel.findOneAndUpdate({ email, password }, { password: newPassword }, { new: true })

            if (!user) {
                return res.json({
                    message: "User not found.",
                    data: {}
                })
            }

            res.json({
                message: "Updated password.",
                data: user
            })
        } catch (error) {
            return res
                .status(500)
                .json({
                    message: error.message,
                    data: {}
                })
        }
    },
    register: async(req, res) => {
        try {
            const { email, password } = req.body

            const user = await userModel.findOne({ email })
            if (user) {
                return res
                    .status(400)
                    .json({
                        message: "User already exists.",
                        data: {}
                    })
            }
            if (password.length < 0 || password.length > 64) {
                return res
                    .status(400)
                    .json({
                        message: "Password must be less than 64 characters long.",
                        data: {}
                    })
            }

            const newUser = new userModel({
                email,
                password
            })

            //Save User
            await newUser.save()

            res.json({
                message: "Success",
                data: newUser
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                data: {}
            })
        }

    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}

export default passwordController