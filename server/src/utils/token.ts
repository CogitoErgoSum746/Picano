import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config({ path: './.env' });

export function signToken ( username: string): string {
    const data = {
        user: {
            username
        },
    };

    try {
        const secret = process.env.JWT_SECRET || 'mysecret';
        const expiresIn = (process.env.JWT_EXPIRES_IN || '4h') as jwt.SignOptions['expiresIn'];

        const token = jwt.sign(data, secret, {
            expiresIn,
        });

        return token;
    } catch (error) {
        console.error('Error signing token:', error);
        throw new Error('Error signing token');
    }
};
