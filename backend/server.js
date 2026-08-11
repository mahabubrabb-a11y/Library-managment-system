import express from 'express'
import cors from 'cors'

import 'dotenv/config'
import { connectDB } from './config/db.js';
import authRouter from './router/authRouter.js';
import studentRouter from './router/studentauthRouth.js';
import bookRouter from './router/bookRouter.js';

const PORT = 5004
const app = express();

//Middleware 
app.use(cors()); 
app.use(express.json());

//DB
connectDB();


//Router
app.use("/api/auth", authRouter)
app.use("/api/student", studentRouter)
app.use("/api/book", bookRouter)

app.get("/", (req, res)=>{
    res.send('API WORKING')
});

app.listen(PORT, ()=>{
    console.log(`server start on http//localhost:${PORT}`)
})


//export default connectDB