import express from 'express';
import prisma from './lib/prisma.js';
import bcrypt from 'bcrypt';

const app = express();
const port = process.env.PORT ?? 8000;

const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.body.token;
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

    req.user = {
        id: session.user.id,
        username: session.user.username,
        role: session.user.role
    };

    next();
}

// Use JSON middleware
app.use(express.json());

app.all('/me', auth, async (req, res) => {
    res.json({ status: true, user: req.user });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: false, message: 'Missing username or password' });
    }

    const user = await prisma.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
            password: true,
            username: true,
            role: true
        },
    });

    if (!user) {
        return res.status(401).json({ status: false, message: 'Forkert brugernavn eller kodeord' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ status: false, message: 'Forkert brugernavn eller kodeord' });
    }

    const session = await prisma.session.create({
        data: {
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
    });

    res.json({
        status: true, token: session.token, user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

app.get('/ping', async (req, res) => {
    res.json({ status: true, message: 'Pong!' });
});

app.get('/countdown', async (req, res) => {
    // TODO!
    res.json({ status: true, countdown: Date.now() + 1000 * 3600 * 2 });
});

app.post('/submissions', async (req, res) => {
    const { name, content } = req.body;

    if (!name || !content) {
        return res.status(400).json({ status: false, message: 'Mangler information' });
    }

    if (name.length > 50) {
        return res.status(400).json({ status: false, message: 'Navnet er for langt' });
    }

    if (content.length > 140) {
        return res.status(400).json({ status: false, message: 'Teksten er for lang (max 140 tegn)' });
    }

    try {
        prisma.comment.create({
            data: {
                name,
                content,
                status: 'CREATED' //TODO - change status from admin panel
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }

    return res.json({ status: true, message: 'Success' });
});

app.post("/getSubmissions", auth, async (req, res) => {
    const submissions = await prisma.comment.findMany({
        where: {
            status: "CREATED"
        },
        select: {
            id: true,
            name: true,
            content: true,
            status: true
        }
    });

    res.json({ status: true, submissions });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});