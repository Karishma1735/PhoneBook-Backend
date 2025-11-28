import express from 'express'
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'

const app = express();
const port = 4000;

app.use(cors())
app.use(express.json())


const MONGODB_URI = "mongodb://localhost:27017/test"

mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/',userRoutes)

app.get('/',(req,res)=>{
    res.send("Hello world")
})

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)

})