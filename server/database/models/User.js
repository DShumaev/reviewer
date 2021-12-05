const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        typeAuth: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userFTS: {
            type: DataTypes.TSVECTOR,
            allowNull: true
        }
    }, {
        tableName: 'users',
        indexes: [
            {
                unique: true,
                fields: ['id']
            },
            {
                unique: true,
                fields: ['email']
            },
            {
                fields: ['userFTS'],
                using: 'gin'
            }
        ]
    })
}

