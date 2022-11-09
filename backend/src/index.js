import express from 'express';
import prisma from './lib/prisma.js';
import bcrypt from 'bcrypt';
import { CommentStatus } from '@prisma/client';

const app = express();
const port = process.env.PORT ?? 8000;

const siteSettings = {
    requireApproval: true,
    countDownTo: 0
}

// Small hardcoded blacklist
const blacklist = [
    "neger",
    "pik",
    "diller",
    "lort",
    "nigger",
    "nigga",
    "faggot"
];

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
    const comments = await prisma.comment.findMany({
        where: {
            status: "ACCEPTED"
        },
        select: {
            id: true,
            name: true,
            content: true,
            color: true,
            createdAt: true
        },
        orderBy: {
            updatedAt: 'desc'
        },
        take: 10
    });

    res.json({ status: true, countdown: siteSettings.countDownTo, comments });
});

app.post('/submissions', async (req, res) => {
    const { name, content, color } = req.body;

    if (!name || !content || !color) {
        return res.status(400).json({ status: false, message: 'Mangler information' });
    }

    if (name.length > 50) {
        return res.status(400).json({ status: false, message: 'Navnet er for langt' });
    }

    if (content.length > 140) {
        return res.status(400).json({ status: false, message: 'Teksten er for lang (max 140 tegn)' });
    }

    if (color.length > 7 || !/^#[0-9A-F]{6}$/i.test(color)) {
        return res.status(400).json({ status: false, message: 'Forkert farve' });
    }

    if (blacklist.some(word => content.toLowerCase().includes(word))) {
        return res.status(400).json({ status: false, message: 'Din kommentar indeholder et ord der er på blacklisten' });
    }

    if (/https?:\/\//.test(content.toLowerCase())) {
        return res.status(400).json({ status: false, message: 'Din kommentar indeholder et link' });
    }

    try {
        await prisma.comment.create({
            data: {
                name,
                content,
                status: siteSettings.requireApproval ? CommentStatus.CREATED : CommentStatus.ACCEPTED,
                color
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }

    return res.json({ status: true, message: 'Success', moderation: true });
});

app.post("/getSubmissions", auth, async (req, res) => {
    const { status } = req.body;

    const submissions = await prisma.comment.findMany({
        where: {
            status: {
                in: status
            }
        },
        select: {
            id: true,
            name: true,
            content: true,
            status: true,
            createdAt: true,
            color: true,
            moderator: {
                select: {
                    username: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    res.json({ status: true, submissions });
});

app.post("/setSubmissionStatus", auth, async (req, res) => {
    const { id, status } = req.body;
    if (!id || typeof status !== "boolean") {
        return res.status(400).json({ status: false, message: 'Missing information' });
    }

    const target_status = status ? "ACCEPTED" : "DENIED";

    try {
        await prisma.comment.update({
            where: {
                id
            },
            data: {
                status: target_status,
                moderator: {
                    connect: {
                        id: req.user.id
                    }
                }
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }

    return res.json({ status: true, message: 'Success', newStatus: target_status });
});

app.get("/getSettings", auth, async (req, res) => {
    res.json({ status: true, settings: siteSettings });
});

app.post("/saveSettings", auth, async (req, res) => {
    const { requireApproval, countDownTo } = req.body;
    if (typeof requireApproval !== "boolean" || typeof countDownTo !== "number") {
        return res.status(400).json({ status: false, message: 'Missing information' });
    }

    siteSettings.requireApproval = requireApproval;
    siteSettings.countDownTo = countDownTo;

    return res.json({ status: true, message: 'Success', settings: siteSettings });
});

app.post("/changePassword", auth, async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ status: false, message: 'Missing information' });
    }

    if (password.length < 8) {
        return res.status(400).json({ status: false, message: 'Password is too short' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                password: hashedPassword
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }

    return res.json({ status: true, message: 'Success' });
});


app.get("/getUsers", auth, async (req, res) => {
    if (req.user.role !== "OWNER") {
        return res.status(401).json({ status: false, message: 'Unauthorized' });
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            role: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    res.json({ status: true, users });
});

app.post("/createUser", auth, async (req, res) => {
    if (req.user.role !== "OWNER") {
        return res.status(401).json({ status: false, message: 'Unauthorized' });
    }

    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ status: false, message: 'Missing information' });
    }

    if (username.length > 50) {
        return res.status(400).json({ status: false, message: 'Username is too long' });
    }
    if (password.length < 8) {
        return res.status(400).json({ status: false, message: 'Password is too short' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }

    return res.json({ status: true, message: 'Success' });
});

app.post("/deleteUser", auth, async (req, res) => {
    if (req.user.role !== "OWNER") {
        return res.status(401).json({ status: false, message: 'Unauthorized' });
    }

    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ status: false, message: 'Missing information' });
    }

    if (id === req.user.id) {
        return res.status(400).json({ status: false, message: 'You cannot delete yourself' });
    }

    try {
        await prisma.user.delete({
            where: {
                id
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }

    return res.json({ status: true, message: 'Success' });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});