import dotenv from "dotenv"
dotenv.config()
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
//import cookieParser from "cookie-parser"

const app = express()
app.use(express.json())
    //app.use(cookieParser())
app.use(cors())

// Routers
import userRouter from './routes/userRouter.js'
app.use('/password', userRouter)

//Connect to MongoDB
const URI = process.env.MONGO_URI
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err
    console.log('Connected to MongoDB');
})

const PORT = process.env.PORT || 6969
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})