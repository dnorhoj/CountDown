import prisma from "./lib/prisma.js";
import bcrypt from "bcrypt";

// Create a default user if none exists

const userAmount = await prisma.user.count();

if (userAmount === 0) {
    const password = await bcrypt.hash("password", 10);
    await prisma.user.create({
        data: {
            username: "admin",
            password,
            role: "OWNER"
        },
    });
}