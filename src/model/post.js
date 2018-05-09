import Sequelize from 'sequelize';
import db from '../db';
import User from './user';

const Post = db.define('posts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
        notNull: true
    },
    description:{
        type: Sequelize.TEXT,
        notNull: true
    },
    image:{
        type: Sequelize.STRING,
        defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
    },
    user_id: {
        notNull: true,
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    }
}, {
    timestamps: true,
    updatedAt: false
});

export default Post;