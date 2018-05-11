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
        notNull: true,
        validate: {
            len:{
                args: [3,50],
                msg: "Name length must be between 3 and 50 characters"
            }
        }
    },
    email: {
        type:Sequelize.STRING(70),
        notNull: true,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Looks like you already have an account with this email address. Please try to login.',
            fields: [db.fn('lower', db.col('email'))]
        },
        validate: {
            isEmail: {
                args: true,
                msg: 'Wrong email'
            },
            max: {
                args: 70,
                msg: 'The email you entered longer than 70 characters.'
            }
        }
    },
    phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: null,
        validate: {
            is:{
                args: /^((\+380)+([0-9]){9})$/,
                msg: 'The phone you entered is invalid'
            }

        }
    },
    password: {
        type: Sequelize.STRING(100),
        notNull: true
    }
}, {
    timestamps: false
});

export default User;