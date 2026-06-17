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
import { setupSocket } from './sockets/socketHandler.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import weeklyDigestRoutes from "./routes/weeklyDigestRoutes.js";

const app = express();
const httpServer = createServer(app);

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://localhost:5173"
    ],
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

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

app.set('io', io);

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(new Error('Unauthorized'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_snapchef_2026');
        socket.data.user = decoded;
        next();
    } catch (error) {
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

            const message = await createChatMessage({
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

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server SnapChef Backend berjalan di http://localhost:${PORT}`);
});