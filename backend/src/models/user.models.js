import { DataTypes } from 'sequelize';
import connectDB from '../db/index.js'; 

const defineUserModel = async () => {
    try {
        const sequelize = await connectDB();
    
        const User = sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(100),
                unique: true,
                allowNull: false,
            },
            contactNumber: {
                type: DataTypes.STRING(100),
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            invitationToken: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            }
        }, {
            timestamps: true,
            createdAt:'created_at',
            updatedAt:'updated_at',   
            tableName: 'users',   
        });
    
        User.beforeUpdate((user) => {
            user.updated_at = new Date();
        });
    
        return User;
    } catch (error) {
        console.error("Error defining the User model:", error);
        throw error;
    }  
};

export default defineUserModel; 