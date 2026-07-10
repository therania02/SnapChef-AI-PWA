import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

// Import seluruh routes
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { DEFAULT_CHAT_AVATAR } from './controllers/messageController.js';
import messageController from './controllers/messageController.js';
import { setupSocket } from './sockets/socketHandler.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import weeklyDigestRoutes from "./routes/weeklyDigestRoutes.js";
import cookingRoutes from "./routes/cookingRoutes.js";

const app = express();
const httpServer = createServer(app);

const allowedFrontendOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim()).filter(Boolean)
    : [];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedFrontendOrigins.includes(origin)) {
            return callback(null, true);
        }
        if (process.env.NODE_ENV !== "production") {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-User-Premium"]
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);         // 1. Users
app.use('/api/recipes', recipeRoutes);    // 2. Recipes
app.use('/api/ingredients', ingredientRoutes); // 3. Ingredients
app.use('/api/posts', postRoutes);        // 4. Posts
app.use('/api/comments', commentRoutes);  // 5. Comments
app.use('/api', scanRoutes);              // 6. Scan and history
app.use('/api/messages', messageRoutes);  // 7. Messages
app.use('/api/payment', paymentRoutes);
app.use('/api/feedback', feedbackRoutes);   // 8. Feedback
app.use("/api/weekly-digest", weeklyDigestRoutes); // 9. Weekly Digest
app.use("/api/cooking", cookingRoutes); // 10. Cooking Count

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

app.set('io', io);

io.use((socket, next) => {
    console.log('[SOCKET AUTH] Socket auth middleware', {
        socketId: socket.id,
        hasAuth: !!socket.handshake.auth,
        hasToken: !!socket.handshake.auth?.token,
        userId: socket.handshake.auth?.userId
    });

    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log('[SOCKET AUTH] No token provided, rejecting');
            return next(new Error('Unauthorized'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_snapchef_2026');
        socket.data.user = decoded;
        console.log('[SOCKET AUTH] Token verified for user:', decoded.id);
        next();
    } catch (error) {
        console.error('[SOCKET AUTH] Auth error:', error.message);
        next(new Error('Unauthorized'));
    }
});

setupSocket(io);

io.on('connection', (socket) => {
    socket.on('chat:join', ({ chatId }) => {
        if (chatId) {
            socket.join(`chat:${chatId}`);
        }
    });

    socket.on('chat:leave', ({ chatId }) => {
        if (chatId) {
            socket.leave(`chat:${chatId}`);
        }
    });

    socket.on('message:send', async (payload, ack) => {
        try {
            const chatId = payload?.chatId;
            const text = payload?.text || '';
            const image = payload?.image || '';

            if (!chatId) {
                throw new Error('chatId wajib diisi');
            }

            const message = await messageController.sendMessage({
                chatId,
                senderId: socket.data.user.id,
                senderName: socket.data.user.name,
                senderAvatar: payload?.senderAvatar || DEFAULT_CHAT_AVATAR(socket.data.user.name),
                text,
                image,
                reactions: payload?.reactions || []
            });

            io.to(`chat:${chatId}`).emit('message:new', message);

            if (typeof ack === 'function') {
                ack({ success: true, data: message });
            }
        } catch (error) {
            if (typeof ack === 'function') {
                ack({ success: false, message: error.message });
            }
        }
    });
});

const startServer = (port) => {
    httpServer.removeAllListeners('error');

    httpServer.once('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            const nextPort = port + 1;
            console.warn(`Port ${port} sudah dipakai, mencoba port ${nextPort}...`);
            startServer(nextPort);
            return;
        }

        console.error('Server gagal berjalan:', error);
        process.exit(1);
    });

    httpServer.listen(port, () => {
        console.log(`Server SnapChef Backend berjalan di http://localhost:${port}`);
    });
};

startServer(Number(process.env.PORT || 3000));