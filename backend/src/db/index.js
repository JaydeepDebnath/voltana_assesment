import { Sequelize } from "sequelize";
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
    const client = new Sequelize({
        host:process.env.PG_HOST,
        port:process.env.PG_PORT,
        user:process.env.PG_USER,
        password:process.env.PG_PASSWORD,
        database:process.env.PG_DATABASE,
        dialect: 'postgres',
    });

    try {
        await client.authenticate();
        console.log(`PostgreSQL database connected successfully ${process.env.PG_HOST}/${DB_NAME}`);
        return client;
    }catch (err){
        console.log("PostgreSQL connection failed:",err);
        throw err;
    }
}

export default connectDB;