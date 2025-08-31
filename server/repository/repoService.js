// Save image details to database

import { createRequire } from 'module';
import mysql from 'mysql2/promise';
export async function saveImageDetails(imageName, createdAt, location){

    const require = createRequire(import.meta.url);
    //Connect to mariadb

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })

    try {
        await connection.beginTransaction();
        // check if image already exists
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM images WHERE name = ?', [imageName]); //imageName

        if (rows[0].count > 0) {
            console.log(`Image already exists: ${imageName}`);
            return { success: false, message: 'Image already exists' };
        } else {
            const query = 'INSERT INTO images (name, created_at, location) VALUES (?, ?, ?)';
            await connection.query(query, [imageName, createdAt, location]);

            await connection.commit();
            console.log(`Image details saved: ${imageName}`);
            return { success: true };
        }
        // insert image details
        //return { success: false, message: 'No conditions met' };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }

}
