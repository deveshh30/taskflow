import { IWorkspace } from '../model/workspace.model'
import { IProject } from '../model/Project.model'
import { Document } from 'mongoose'

declare global {
    namespace Express {
        interface Request {
            user?: { userId: string }
            workspace?: Document & IWorkspace
            project?: Document & IProject
        }
    }
}

export {}