import mongoose from 'mongoose';

export interface IWorkspace {
     name: string
    owner: mongoose.Types.ObjectId
    members: mongoose.Types.ObjectId[]
    
}

const workspaceSchema = new mongoose.Schema<IWorkspace>({
  name: { 
    type: String, 
    required: true, 
    trim: true 
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

export const Workspace = mongoose.model('Workspace', workspaceSchema);