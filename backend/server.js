const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
dotenv.config()

const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')


const app = express()
app.use(cors())
app.use(express.json())

connectDB()

// routes
app.use('/api/auth/',authRoute)
app.use('/api/user',userRoute)
const port = process.env.PORT || 8500


app.get('/',(req,res)=>{
    res.send('Backend is running')
})

app.listen(port,()=>{
    console.log(`Backend running on port: ${port}`)
})