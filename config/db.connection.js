import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const app = express()

const db_url = process.env.DB_URL
const Port = process.env.PORT

 const db_Connection = async () => {
    await mongoose.connect(db_url).then(() => { console.log('Database Connected Successfull') }).catch((err) => { console.log('Db Connection Error', err) })
}

app.listen(Port,()=>{
    console.log(`Server is Running on port - ${Port}`)
})
export default db_Connection