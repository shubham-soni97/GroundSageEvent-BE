import dotenv from 'dotenv';
import mysql from 'mysql2';
import * as tables from './index.js';
dotenv.config();


const createTables = async (connection, tables) => {
    
	// Execute the table creation queries
	await Promise.all(
		tables.map(async (tableQuery) => {
			await connection.query(tableQuery);
		})
	);


};
export let rootConnection = mysql
.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    connectTimeout: 20000,
    port: process.env.MYSQL_PORT
})
 .promise();
// console.log(rootConnection);
let pool;
pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.MYSQL_PORT
}).promise();
export const setupDatabase = async() => {
    try{
        await rootConnection.connect();
        // console.log(testres);
        console.log('Connected to mysql!');
    
        const dbCreateQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`;
    
        await rootConnection.query(dbCreateQuery);
        console.log(`Db created ${process.env.DATABASE}`);
    
        await rootConnection.query(`USE ${process.env.DATABASE}`);
    
        await createTables(rootConnection, tables.default);
        console.log('all tables created');
    }
    catch(err){
        console.log(err);
    }
}

export default pool;
