import {DataTypes} from 'sequelize';
import connectDB from '../db/index.js';


const User = connectDB.define('User',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    name:{
        type:DataTypes.STRING(100),
        allowNull : false,
    },
    email:{
        type:DataTypes.STRING(100),
        unique : true,
        allowNull : false,
    },
    contactNumber:{
        type:DataTypes.STRING(100),
        unique : true,
        allowNull : false,
    },
    password:{
        type: DataTypes.STRING(255),
        alowNull : false,
    },
    role:{
        type: DataTypes.STRING(50),
        allowNull : false,
    },
    created_at : {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
},{
    timestamps: false,
    tableName : 'users',
});

User.beforeUpdate((user) => {
    user.updated_at = new Date();
});


export default User;