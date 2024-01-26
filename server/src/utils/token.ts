import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import path from 'path';

config({ path: './.env' });

export function signToken ( username: string, email: string, org_code: string,): string {
    const data = {
        user: {
            username,
            email,
            org_code,
        },
    };

    return jwt.sign(data, process.env.JWT_SECRET || 'mysecret', { 
        expiresIn: process.env.JWT_EXPIRES_IN || '4h',
    });
};
