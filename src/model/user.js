import Sequelize from 'sequelize';
import db from '../db';

const User = db.define('users',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        notNull: true
    },
    email: {
        type:Sequelize.STRING(50),
        notNull: true,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: null,
    },
    password: Sequelize.STRING(80)
});

export default User;