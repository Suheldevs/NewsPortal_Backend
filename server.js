import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
const app = express()
app.use(express.json());
app.use(cors())
const Port = process.env.PORT

import db_Connection from './config/db.connection.js'
import {sendError} from './utils/sendError.js'

import router from './routes/user.route.js'
app.use('/api/users',router)
app.get('/',(req,res)=>{
    res.status(200).json({
       success:true,
       message:"Server is Running "
    })
  })

app.use(sendError)

app.listen(Port,()=>{
    console.log(`Server is Running on port - ${Port}`)
})
db_Connection()




//routes

//user
import UserRoutes from './routes/user.route.js'
app.use('/v1/user', UserRoutes)

//Article
import ArticleRoutes from './routes/article.route.js'
app.use('/v1/article', ArticleRoutes)