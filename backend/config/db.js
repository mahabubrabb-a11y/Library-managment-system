import mongoose from "mongoose";

export const connectDB = async() =>{
    mongoose.connect("mongodb+srv://mahabubrabb_db_user:6gqIX2Zdm5Xv0Ni7@cluster0.fk5thy4.mongodb.net/LibraryManagement")
    .then(()=>{
        console.log('DB Connected')
    })
}