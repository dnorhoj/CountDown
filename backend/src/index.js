import express from 'express';
import prisma from './lib/prisma.js';

const app = express();
const port = process.env.PORT ?? 8000;

// Middleware that checks if a token is valid
const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: false, message: 'No token provided' });
    }
    const session = await prisma.session.findUnique({
        where: {
            token,
        },
        select: {
            user: true,
        },
    });

    if (!session) {
        return res.status(401).json({ status: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
}

// Use JSON middleware
app.use(express.json());

app.get('/ping', (req, res) => {
    res.json({ 'status': true, 'message': 'Pong!' });
});

app.get('/ping', (req, res) => {
    res.json({ 'status': true, 'message': 'Pong!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});