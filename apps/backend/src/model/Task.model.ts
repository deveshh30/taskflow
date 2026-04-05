import mongoose, { mongo } from "mongoose";
import { todo } from "node:test";

const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type: String,
    },
    status : {
        type : String,
        enum : ["todo", "in-progress", "review", "done"],
        default : "todo",
    },
    priority : {
        type : String,
        enum : ["low" , "medium" , "highh" , "urgent"],
        default : "medium"
    },
    dueDate : {
        type : Date
    },
    project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  assignee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

},{timestamps : true});

export const Task = mongoose.model('Task' , taskSchema);