// Save image details to database

import { createRequire } from 'module';
import dotenv from 'dotenv';
export async function saveImageDetails(imageName, createdAt, location){

    const require = createRequire(import.meta.url);
    //Connect to mariadb
    const mysql = require('mysql');

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })
    try {
        await connection.beginTransaction();
        const query = 'INSERT INTO images (name, created_at, location) VALUES (?, ?, ?)';
        await connection.query(query, [imageName, createdAt, location]);

        await connection.commit();
        console.log(`Image details saved: ${imageName}`);
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }

}