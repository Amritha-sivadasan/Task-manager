import express,{Express} from 'express'
import dotenv from 'dotenv'
import connectDB from './config/connectDB'
import cors from 'cors'
import userRoute from './routes/userRoute'
import morgan from 'morgan'
import http from 'http'
import { createServer } from './controller/socketController'

dotenv.config()
connectDB()
const app : Express= express()
app.use(cors({origin:process.env.FRONTEND_URL, credentials: true,methods: ['GET', 'POST',"PUT","DELETE"]}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))


app.use('/',userRoute)

const server=http.createServer(app)
createServer(server)
 
server.listen(5000,()=>{
    console.log('server is listen on port  5000')
})
