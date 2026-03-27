import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

 const userSchema = new mongoose.Schema(
    {
        userName : {
            type : String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        fullName: {
            type: String,
            trim: true,
            required : true,
        },

        password: {
            type: String,
            required: true,
            select : false,
        },
    } , {timestamps : true}
 );


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
});
 export const User = mongoose.model('User' , userSchema)