const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('yt_node_admin', 'root', '', {
    repositoryMode: true,
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;