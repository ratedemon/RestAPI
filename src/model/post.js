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
        notNull: true,
        allowNull: false,
        validate: {
            len:{
                args: [3,255],
                msg: "Title length must be between 3 and 255 characters"
            }
        }
    },
    description:{
        type: Sequelize.TEXT,
        notNull: true,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Description is required"
            }
        }
    },
    image:{
        type: Sequelize.STRING,
        defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
    },
    price: {
        type: Sequelize.DOUBLE(11),
        defaultValue: 0
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
}, {underscored: true});

// Post.hasOne(User, {foreignKey: 'id', as: 'user', onDelete: 'cascade'});
// Project.hasMany(Task, {foreignKey: 'project_id', onDelete: 'cascade', as: 'ProjectTasks'});
Post.belongsTo(User, {foreignKey: 'user_id', as: 'user', onDelete: 'cascade'});

export default Post;