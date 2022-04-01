import { Request } from "express";
import jwt from 'jsonwebtoken';

interface AuthToken {
    userId: number;
}

export default (req: Request) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new Error('Token not found.');
    }

    const token = authorization.replace('Bearer', '').trim();

    try {
        const data = jwt.verify(token, 'SECRET!');
        const { userId } = data as AuthToken;
        return userId;
    } catch (e) {
        throw new Error('Invalid token.');
    }
};