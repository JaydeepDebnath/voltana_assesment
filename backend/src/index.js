import dotenv from 'dotenv'
import connectDB from './db/index.js';
import { app } from './app.js';
dotenv.config({
    path:"./env"
})

connectDB()
.then(() => {
    app.listen(process.env.PG_PORT || 8000 , () => {
        console.log(`⚙️ Server is running at port : ${process.env.PG_PORT || 8000}`);
    });
})
.catch((err) => {
    console.log("PostgreSQL connection failed!!!", err);
});