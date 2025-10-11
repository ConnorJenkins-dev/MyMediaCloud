// Save image details to database

import { createRequire } from 'module';
// import mysql from 'mysql2/promise';

import pool from "./dbPool.js";

// global variable

export async function saveImageDetails(imageName, createdAt, location){

    const require = createRequire(import.meta.url);

    const connection = await pool.getConnection();

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
        connection.release();
    }

}

export async function getAllImages(){
    // Get all images from database
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM images');
        return rows;
    } catch (error) {
        throw error;
    } finally {
        await connection.release();
    }
}
// app will display latest 16 images
export async function getLatestImages(){
    // Get latest 16 images from database
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM images ORDER BY created_at DESC LIMIT 16');
        return rows;
    } catch (error) {
        throw error;
    } finally {
        await connection.release();
    }
}

export async function getAllImagesFromMonth(month, year){
    // Get all images from a specific month and year
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM images WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?', [month, year]);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        await connection.release();
    }
}
