import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { config } from './config/index';
import AuthRoutes from './routes/Authh.route.js';
import { errorHandler } from './middleware/Error.middleware';
import workspaceRoute from './routes/Workspace.route';
import createproject from './routes/Project.routes';
import addcomment from './routes/comment.route';
import http from 'http';
import { Server } from 'socket.io';


const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  
  socket.on('join-task', (taskId) => {
    socket.join(`task:${taskId}`);
    console.log(`User joined task room: task:${taskId}`);
  });

  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


app.use(helmet());
app.use(cors({ 
  origin: 'http://localhost:4000', 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());



//ROUTES

app.use("/api/auth" , AuthRoutes);
app.use(errorHandler); //global error handler
app.use("/api/workspace" , workspaceRoute)
app.use('/api/projects', createproject);
app.use('/api/comment' , addcomment)


mongoose.connect(config.mongoUri)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

app.get('/health', (_req, res) => {
  res.json({ status: 'TaskFlow backend is alive 🚀' });
});

server.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});

