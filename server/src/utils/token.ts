import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config({ path: './.env' });

export function signToken ( username: string, password: string): string {
    const data = {
        user: {
            username,
            password
        },
    };

    try {
        const token = jwt.sign(data, process.env.JWT_SECRET || 'mysecret', {
            expiresIn: process.env.JWT_EXPIRES_IN || '4h',
        });

        return token;
    } catch (error) {
        console.error('Error signing token:', error);
        throw new Error('Error signing token');
    }
};
