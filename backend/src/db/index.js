import { Sequelize } from "sequelize";
import {DB_NAME} from "../constants.js"


const connectDB = async () => {
    const client = new Sequelize("demodb","postgres","8421",{
        host:"localhost",
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