const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
});

const connectionDB = async() => {
    try {
        await sequelize.authenticate();
        console.log(`Connection Established successfully to database ${process.env.DB_NAME}`);
        
    } catch (error) {
        console.log('error while connecting to Database:', error);
    }
}

module.exports = {
    connectionDB,
    sequelize
};