import Sequelize from 'sequelize';
import env from 'dotenv';

env.config();

const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});

// db.sync({force: true})
db.sync()
    .then(() => {
        console.log('DB synced');
    });

export default db;