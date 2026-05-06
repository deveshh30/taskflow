# TaskFlow

A modern **Project Management SaaS** (Linear + Notion hybrid) built with clean architecture.

## Overview

TaskFlow is a collaborative project management tool that helps teams organize work using **Workspaces → Projects → Tasks** with real-time comments and Kanban support.

**Core Hierarchy:**  
**User → Workspace → Project → Task → Comment**

---

## Tech Stack

### Backend
- **Node.js + Express + TypeScript**
- **MongoDB + Mongoose**
- **Zod** (API validation)
- **JWT + httpOnly cookies** (Authentication)
- **Socket.io** (Real-time comments)
- **Turborepo** (Monorepo)

### Frontend (In Progress)
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind + shadcn/ui
- TanStack Query + Zustand

---

## Current Progress (As of Now)

### ✅ Completed Features

**Authentication**
- User Registration & Login (supports email or username)
- JWT Authentication with secure httpOnly cookies
- Protected routes middleware (`protect`)

**Workspace Module**
- Create Workspace
- Get All Workspaces (owner + member)
- Get Single Workspace
- Update Workspace
- Add Member to Workspace

**Project Module**
- Create Project (nested under Workspace)
- Get All Projects in a Workspace
- Get Single Project
- Update & Delete Project (owner only)
- Add Member to Project

**Task Module**
- Create Task (nested under Project)
- Update & Delete Task
- Get All Tasks in a Project
- Kanban View (`GET /kanban`) — tasks grouped by status

**Comments**
- Add Comment on Task
- Get All Comments on Task
- **Real-time comments** using Socket.io (live updates)

**Architecture Highlights**
- Clean folder structure with separation of concerns
- Proper authorization (owner vs member checks)
- Clean API responses (`id`, `userId`, `projectId`, etc.)
- Comprehensive error handling

---

## Backend Folder Structure

```bash
apps/backend/src/
├── config/
├── controllers/
│   ├── auth.controller.ts
│   ├── workspace.controller.ts
│   ├── project.controller.ts
│   ├── task.controller.ts
│   └── comment.controller.ts
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── models/
│   ├── User.model.ts
│   ├── workspace.model.ts
│   ├── Project.model.ts
│   ├── Task.model.ts
│   └── Comment.model.ts
├── routes/
├── schemas/
├── server.ts
└── utils/
Key Routes (Backend)
Auth
POST /api/auth/register
POST /api/auth/login
Workspace
POST /api/workspaces
GET /api/workspaces
GET /api/workspaces/:workspaceId
PUT /api/workspaces/:workspaceId
POST /api/workspaces/:workspaceId/members
Project
POST /api/projects/workspace/:workspaceId
GET /api/projects/workspace/:workspaceId
PUT /api/projects/:projectId
DELETE /api/projects/:projectId
POST /api/projects/:projectId/addmembers
Task & Comments
POST /api/projects/:projectId/tasks
GET /api/projects/:projectId/getTasksByProject
PUT /api/projects/:projectId/tasks/:taskId/update
DELETE /api/projects/:projectId/tasks/:taskId/delete
GET /api/projects/:projectId/kanban
POST /api/projects/:projectId/tasks/:taskId/comments
GET /api/projects/:projectId/tasks/:taskId/comments
Next Steps (TODO)
Rich text editor for comments and descriptions
File attachments (Cloudinary)
Full Frontend with Next.js 15 + shadcn/ui
Advanced real-time features
Notifications & Activity feed
Search & Filtering
Testing & Deployment
How to Run
# Install dependencies
pnpm install

# Start backend
pnpm turbo dev --filter=backend

# Start frontend (when ready)
pnpm turbo dev --filter=frontend
Built with ❤️ using clean architecture & modern best practices.
Status: Backend Core Complete | Frontend Setup Started