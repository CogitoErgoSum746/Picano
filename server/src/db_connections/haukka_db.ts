import { config } from "dotenv";
config();

import mysql from "mysql2/promise";

// MySQL database credentials
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'your_database',
};

// Function to execute SQL queries
export async function executeQuery(query: string, values?: any[]): Promise<any> {
    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute(query, values || []);
        return rows;
    } catch (err) {
        console.log(err);
    } finally {
        connection.end();
    }
}

export async function executeMultipleQueries(queries: Array<{ query: string, values?: any[] }>): Promise<any> {
    const connection = await mysql.createConnection(dbConfig);

    try {
        const results = [];

        for (const { query, values } of queries) {
            const [rows] = await connection.execute(query, values || []);
            results.push(rows);
        }

        return results;
    } finally {
        connection.end();
    }
}

export async function executeQueries(queries: Array<{ query: string, values?: any[] }>): Promise<any> {
    const connection = await mysql.createConnection(dbConfig);

    try {
        const results = [];

        for (const { query, values } of queries) {
            const [rows] = await connection.execute(query, values || []);
            results.push(rows);
        }

        return results;
    } finally {
        connection.end();
    }
}