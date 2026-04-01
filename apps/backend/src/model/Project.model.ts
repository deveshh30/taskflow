import mongoose from "mongoose";

const projectSchema = new mongoose.({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ["planning", "active", "on-hold", "completed", "cancelled"], 
    default: "planning" 
  },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high", "urgent"], 
    default: "medium" 
  },
  deadline: { 
    type: Date 
  },
  workspace: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workspace', 
    required: true 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);